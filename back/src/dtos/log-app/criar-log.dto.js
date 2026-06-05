import BadRequestError from "../../errors/bad-request.error.js";
import { sanitizeLogValue } from "../../utils/log-sanitizer.js";

const operacoesPermitidas = ["INSERT", "UPDATE", "DELETE", "LOGIN", "LOGOUT"];
const requiredFields = ["tabela", "operacao"];

const validarId = (field, value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const normalizedValue = Number(value);

  if (!Number.isInteger(normalizedValue) || normalizedValue <= 0) {
    throw new BadRequestError("Dados inválidos para criação de log", {
      fields: [field],
    });
  }

  return normalizedValue;
};

const criarLogDTO = (payload = {}) => {
  const missingFields = requiredFields.filter((field) => !payload[field]);

  if (missingFields.length > 0) {
    throw new BadRequestError("Campos obrigatórios ausentes", {
      fields: missingFields,
    });
  }

  const tabela = String(payload.tabela).trim();
  const operacao = String(payload.operacao).trim().toUpperCase();

  if (!tabela || tabela.length > 100) {
    throw new BadRequestError("Dados inválidos para criação de log", {
      fields: ["tabela"],
    });
  }

  if (!operacoesPermitidas.includes(operacao)) {
    throw new BadRequestError("Operação inválida para log", {
      fields: ["operacao"],
    });
  }

  return {
    id_usuario: validarId("id_usuario", payload.id_usuario),
    tabela,
    id_tabela: validarId("id_tabela", payload.id_tabela),
    operacao,
    antes: sanitizeLogValue(payload.antes ?? null),
    depois: sanitizeLogValue(payload.depois ?? null),
  };
};

export {
  operacoesPermitidas,
};

export default criarLogDTO;
