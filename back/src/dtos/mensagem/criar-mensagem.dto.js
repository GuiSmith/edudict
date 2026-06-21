import BadRequestError from "../../errors/bad-request.error.js";

const CAMPOS_PERMITIDOS = ["id_chat", "id_predicao", "content"];
const TAMANHO_MAXIMO_MENSAGEM_USUARIO = 500;

const isPlainObject = (value) => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

const normalizarId = (field, value) => {
  if (value === undefined || value === null) {
    return null;
  }

  const normalizedValue = Number(value);

  if (!Number.isInteger(normalizedValue) || normalizedValue <= 0) {
    throw new BadRequestError("Dados inválidos para envio da mensagem", {
      fields: [field],
    });
  }

  return normalizedValue;
};

const criarMensagemDTO = (payload = {}) => {
  if (!isPlainObject(payload)) {
    throw new BadRequestError("Payload inválido");
  }

  const camposInesperados = Object.keys(payload).filter((field) => {
    return !CAMPOS_PERMITIDOS.includes(field);
  });

  if (camposInesperados.length > 0) {
    throw new BadRequestError("Campos não permitidos", {
      fields: camposInesperados,
    });
  }

  if (typeof payload.content !== "string" || !payload.content.trim()) {
    throw new BadRequestError("Conteúdo da mensagem inválido", {
      fields: ["content"],
    });
  }

  const content = payload.content.trim();

  if (content.length > TAMANHO_MAXIMO_MENSAGEM_USUARIO) {
    throw new BadRequestError(
      `A mensagem do usuário deve ter no máximo ${TAMANHO_MAXIMO_MENSAGEM_USUARIO} caracteres`,
      {
        fields: ["content"],
        maximum: TAMANHO_MAXIMO_MENSAGEM_USUARIO,
      },
    );
  }

  return {
    idChat: normalizarId("id_chat", payload.id_chat),
    idPredicao: normalizarId("id_predicao", payload.id_predicao),
    content,
  };
};

export {
  TAMANHO_MAXIMO_MENSAGEM_USUARIO,
};

export default criarMensagemDTO;
