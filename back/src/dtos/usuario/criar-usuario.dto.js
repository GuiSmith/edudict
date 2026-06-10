import BadRequestError from "../../errors/bad-request.error.js";
import { cpfTemOnzeDigitos, normalizarCpf } from "../../utils/cpf.js";
import { emailValido, normalizarEmail } from "../../utils/email.js";
import {
  nomeUsuarioValido,
  normalizarNomeUsuario,
  senhaUsuarioValida,
} from "../../utils/usuario.js";

const requiredFields = ["nome", "cpf", "email", "senha"];

const validarCpf = (cpf) => {
  if (!cpfTemOnzeDigitos(cpf)) {
    throw new BadRequestError("CPF inválido", {
      fields: ["cpf"],
    });
  }
};

const validarEmail = (email) => {
  if (!emailValido(email)) {
    throw new BadRequestError("E-mail inválido", {
      fields: ["email"],
    });
  }
};

const validarNome = (nome) => {
  if (!nomeUsuarioValido(nome)) {
    throw new BadRequestError("Nome inválido", {
      fields: ["nome"],
    });
  }
};

const validarSenha = (senha) => {
  if (!senhaUsuarioValida(senha)) {
    throw new BadRequestError("Senha inválida", {
      fields: ["senha"],
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

  const nome = normalizarNomeUsuario(payload.nome);
  const cpf = normalizarCpf(payload.cpf);
  const email = normalizarEmail(payload.email);

  validarNome(payload.nome);
  validarCpf(cpf);
  validarEmail(email);
  validarSenha(payload.senha);

  return {
    nome,
    cpf,
    email,
    senha: payload.senha,
    ativo: payload.ativo ?? true,
  };
};

export default criarUsuarioDTO;
