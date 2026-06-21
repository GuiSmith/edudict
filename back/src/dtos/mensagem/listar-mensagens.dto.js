import BadRequestError from "../../errors/bad-request.error.js";

const listarMensagensDTO = (query = {}) => {
  const camposInesperados = Object.keys(query).filter((field) => {
    return field !== "id_chat";
  });

  if (camposInesperados.length > 0) {
    throw new BadRequestError("Campos não permitidos", {
      fields: camposInesperados,
    });
  }

  const idChat = Number(query.id_chat);

  if (!Number.isInteger(idChat) || idChat <= 0) {
    throw new BadRequestError("Dados inválidos para listagem de mensagens", {
      fields: ["id_chat"],
    });
  }

  return {
    idChat,
  };
};

export default listarMensagensDTO;
