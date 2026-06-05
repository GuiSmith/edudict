import criarLogDTO from "../dtos/log-app/criar-log.dto.js";

const criarLog = async (dbClient, payload) => {
  const logDTO = criarLogDTO(payload);

  return dbClient.log_app.create({
    data: {
      ...logDTO,
      id_tabela: logDTO.id_tabela === null ? null : BigInt(logDTO.id_tabela),
    },
  });
};

export {
  criarLog,
};

export default {
  criarLog,
};
