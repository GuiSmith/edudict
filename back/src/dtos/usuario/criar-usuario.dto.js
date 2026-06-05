import BadRequestError from "../../errors/bad-request.error.js";
import { normalizarCpf } from "../../utils/cpf.js";

const requiredFields = ["nome", "cpf", "email", "senha"];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validarCpf = (cpf) => {
  if (cpf.length !== 11) {
    throw new BadRequestError("CPF inválido", {
      fields: ["cpf"],
    });
  }
};

const validarEmail = (email) => {
  if (!emailRegex.test(email)) {
    throw new BadRequestError("E-mail inválido", {
      fields: ["email"],
    });
  }
};

const criarUsuarioDTO = (payload = {}) => {
  const missingFields = requiredFields.filter((field) => !payload[field]);

  if (missingFields.length > 0) {
    throw new BadRequestError("Campos obrigatórios ausentes", {
      fields: missingFields,
    });
  }

  const cpf = normalizarCpf(payload.cpf);
  const email = String(payload.email).trim();

  validarCpf(cpf);
  validarEmail(email);

  return {
    nome: payload.nome,
    cpf,
    email,
    senha: payload.senha,
    ativo: payload.ativo ?? true,
  };
};

export default criarUsuarioDTO;
