import criarMensagemDTO from "../dtos/mensagem/criar-mensagem.dto.js";
import chatService from "../services/chat.service.js";

const criarMensagem = async (req, res) => {
  const mensagemDTO = criarMensagemDTO(req.body);
  const resultado = await chatService.criarMensagem(mensagemDTO, {
    usuarioId: req.user?.id ?? null,
    guestSessionId: req.guest_session_id ?? null,
  });

  return res.status(201).json(resultado);
};

export default {
  criarMensagem,
};
