import chatService from "../services/chat.service.js";

const listarChats = async (req, res) => {
  const chats = await chatService.listarChats({
    usuarioId: req.user?.id ?? null,
    guestSessionId: req.guest_session_id ?? null,
  });

  return res.status(200).json(chats);
};

export default {
  listarChats,
};
