import db from "../config/database.js";
import BadRequestError from "../errors/bad-request.error.js";
import NotAuthorizedError from "../errors/not-authorized.error.js";
import NotFoundError from "../errors/not-found.error.js";
import agenteService from "./agente.service.js";
import { criarLog } from "./log-app.service.js";

const LIMITE_MENSAGENS_USUARIO = 10;
const TAMANHO_MAXIMO_MENSAGEM_ASSISTENTE = 1000;
const LIMITE_LINHAS_TITULO = 25;
const TAMANHO_MAXIMO_TITULO = 200;

const formatarRegistroParaLog = (registro) => {
  return Object.fromEntries(
    Object.entries(registro).map(([field, value]) => {
      return [field, value instanceof Date ? value.toISOString() : value];
    }),
  );
};

const formatarChatParaLog = (chat) => {
  return formatarRegistroParaLog({
    id: chat.id,
    id_usuario: chat.id_usuario,
    guest_session_id: chat.guest_session_id,
    id_predicao: chat.id_predicao,
    titulo: chat.titulo,
    data_hora_criacao: chat.data_hora_criacao,
    data_hora_atualizacao: chat.data_hora_atualizacao,
  });
};

const montarFiltroProprietario = ({ usuarioId, guestSessionId }) => {
  if (usuarioId) {
    return {
      id_usuario: usuarioId,
      guest_session_id: null,
    };
  }

  if (guestSessionId) {
    return {
      id_usuario: null,
      guest_session_id: guestSessionId,
    };
  }

  throw new NotAuthorizedError(
    "Autenticação ou sessão de convidado não realizada",
  );
};

const montarTitulo = (content) => {
  return content
    .split(/\r?\n/)
    .slice(0, LIMITE_LINHAS_TITULO)
    .join("\n")
    .slice(0, TAMANHO_MAXIMO_TITULO);
};

const montarContextoPredicao = (predicao) => {
  if (!predicao) {
    return {};
  }

  const {
    id,
    id_usuario,
    guest_session_id,
    aprovado,
    resultado_predicao,
    interpretacao_llm,
    data_hora_criacao,
    ...predictionInput
  } = predicao;

  return {
    predictionInput,
    predictionResult: resultado_predicao,
    predictionInterpretation: interpretacao_llm,
  };
};

const buscarPredicao = async (tx, idPredicao, proprietario) => {
  if (!idPredicao) {
    return null;
  }

  const predicao = await tx.predicao.findFirst({
    where: {
      id: idPredicao,
      ...proprietario,
    },
  });

  if (!predicao) {
    throw new NotFoundError("Predição não encontrada");
  }

  return predicao;
};

const buscarChat = async (tx, idChat, proprietario) => {
  const chat = await tx.chat.findFirst({
    where: {
      id: idChat,
      ...proprietario,
    },
    include: {
      chat_mensagem: {
        orderBy: {
          data_hora: "asc",
        },
      },
      predicao: true,
    },
  });

  if (!chat) {
    throw new NotFoundError("Chat não encontrado");
  }

  return chat;
};

const registrarInsercao = async (tx, tabela, registro, usuarioId) => {
  await criarLog(tx, {
    id_usuario: usuarioId,
    tabela,
    id_tabela: registro.id,
    operacao: "INSERT",
    depois: formatarRegistroParaLog(registro),
  });
};

const criarMensagem = async (
  mensagemDTO,
  { usuarioId = null, guestSessionId = null } = {},
) => {
  const proprietario = montarFiltroProprietario({
    usuarioId,
    guestSessionId,
  });

  return db.$transaction(async (tx) => {
    let chat;
    let historico = [];
    let predicao;

    if (mensagemDTO.idChat) {
      chat = await buscarChat(tx, mensagemDTO.idChat, proprietario);
      historico = chat.chat_mensagem;

      const quantidadeMensagensUsuario = historico.filter((mensagem) => {
        return mensagem.role === "user";
      }).length;

      if (quantidadeMensagensUsuario >= LIMITE_MENSAGENS_USUARIO) {
        throw new BadRequestError("O limite é de 10 mensagens por chat");
      }

      if (
        mensagemDTO.idPredicao &&
        chat.id_predicao !== mensagemDTO.idPredicao
      ) {
        throw new BadRequestError(
          "A predição informada não corresponde ao chat",
          {
            fields: ["id_predicao"],
          },
        );
      }

      predicao = mensagemDTO.idPredicao
        ? await buscarPredicao(tx, mensagemDTO.idPredicao, proprietario)
        : chat.predicao;
    } else {
      predicao = await buscarPredicao(
        tx,
        mensagemDTO.idPredicao,
        proprietario,
      );

      chat = await tx.chat.create({
        data: {
          ...proprietario,
          id_predicao: predicao?.id ?? null,
          titulo: montarTitulo(mensagemDTO.content),
        },
      });

      await registrarInsercao(tx, "chat", chat, usuarioId);
    }

    const mensagemUsuario = await tx.chat_mensagem.create({
      data: {
        id_chat: chat.id,
        role: "user",
        content: mensagemDTO.content,
      },
    });

    await registrarInsercao(
      tx,
      "chat_mensagem",
      mensagemUsuario,
      usuarioId,
    );

    const respostaAgente = await agenteService.criarResposta(
      mensagemDTO.content,
      montarContextoPredicao(predicao),
      historico,
    );
    const contentAssistente = respostaAgente.content
      .slice(0, TAMANHO_MAXIMO_MENSAGEM_ASSISTENTE);

    const mensagemAssistente = await tx.chat_mensagem.create({
      data: {
        id_chat: chat.id,
        role: "assistant",
        content: contentAssistente,
        tokens_prompt: respostaAgente.tokensPrompt,
        tokens_completion: respostaAgente.tokensCompletion,
      },
    });

    await registrarInsercao(
      tx,
      "chat_mensagem",
      mensagemAssistente,
      usuarioId,
    );

    const chatAtualizado = await tx.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        data_hora_atualizacao: new Date(),
      },
    });

    await criarLog(tx, {
      id_usuario: usuarioId,
      tabela: "chat",
      id_tabela: chat.id,
      operacao: "UPDATE",
      antes: formatarChatParaLog(chat),
      depois: formatarChatParaLog(chatAtualizado),
    });

    return {
      chat: chatAtualizado,
      mensagemUsuario,
      mensagemAssistente,
    };
  }, {
    isolationLevel: "Serializable",
    maxWait: 5000,
    timeout: 60000,
  });
};

export {
  LIMITE_MENSAGENS_USUARIO,
  TAMANHO_MAXIMO_MENSAGEM_ASSISTENTE,
};

export default {
  criarMensagem,
};
