import BadRequestError from "../../errors/bad-request.error.js";
import { cpfTemOnzeDigitos, normalizarCpf } from "../../utils/cpf.js";
import { emailValido, normalizarEmail } from "../../utils/email.js";
import {
  nomeUsuarioValido,
  normalizarNomeUsuario,
  senhaUsuarioValida,
} from "../../utils/usuario.js";

const editableFields = ["nome", "cpf", "email", "senha", "ativo"];

const hasOwn = (payload, field) => Object.prototype.hasOwnProperty.call(payload, field);

const validarId = (id) => {
  const normalizedId = Number(id);

  if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
    throw new BadRequestError("ID de usuário inválido", {
      fields: ["id"],
    });
  }

  return normalizedId;
};

const validarNome = (nome) => {
  if (!nomeUsuarioValido(nome)) {
    throw new BadRequestError("Nome inválido", {
      fields: ["nome"],
    });
  }

  return normalizarNomeUsuario(nome);
};

const validarCpf = (cpf) => {
  const normalizedCpf = normalizarCpf(cpf);

  if (!cpfTemOnzeDigitos(normalizedCpf)) {
    throw new BadRequestError("CPF inválido", {
      fields: ["cpf"],
    });
  }

  return normalizedCpf;
};

const validarEmail = (email) => {
  if (typeof email !== "string") {
    throw new BadRequestError("E-mail inválido", {
      fields: ["email"],
    });
  }

  const normalizedEmail = normalizarEmail(email);

  if (!emailValido(normalizedEmail)) {
    throw new BadRequestError("E-mail inválido", {
      fields: ["email"],
    });
  }

  return normalizedEmail;
};

const validarSenha = (senha) => {
  if (!senhaUsuarioValida(senha)) {
    throw new BadRequestError("Senha inválida", {
      fields: ["senha"],
    });
  }

  return senha;
};

const validarAtivo = (ativo) => {
  if (typeof ativo !== "boolean") {
    throw new BadRequestError("Ativo inválido", {
      fields: ["ativo"],
    });
  }

  return ativo;
};

const editarUsuarioDTO = (payload = {}) => {
  if (!hasOwn(payload, "id")) {
    throw new BadRequestError("Campos obrigatórios ausentes", {
      fields: ["id"],
    });
  }

  const usuarioDTO = {
    id: validarId(payload.id),
  };

  if (hasOwn(payload, "nome")) {
    usuarioDTO.nome = validarNome(payload.nome);
  }

  if (hasOwn(payload, "cpf")) {
    usuarioDTO.cpf = validarCpf(payload.cpf);
  }

  if (hasOwn(payload, "email")) {
    usuarioDTO.email = validarEmail(payload.email);
  }

  if (hasOwn(payload, "senha")) {
    usuarioDTO.senha = validarSenha(payload.senha);
  }

  if (hasOwn(payload, "ativo")) {
    usuarioDTO.ativo = validarAtivo(payload.ativo);
  }

  const fieldsToUpdate = editableFields.filter((field) => hasOwn(usuarioDTO, field));

  if (fieldsToUpdate.length === 0) {
    throw new BadRequestError("Informe ao menos um campo para atualização", {
      fields: editableFields,
    });
  }

  return usuarioDTO;
};

export default editarUsuarioDTO;
