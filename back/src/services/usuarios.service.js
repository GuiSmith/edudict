import db from "../config/database.js";
import ConflictError from "../errors/conflict.error.js";

const sanitizeUsuario = (usuario) => {
  const { senha, ...safeUsuario } = usuario;
  return safeUsuario;
};

const cpfJaCadastrado = async (cpf) => {
  const usuario = await db.usuario.findUnique({
    where: {
      cpf,
    },
    select: {
      id: true,
    },
  });

  return Boolean(usuario);
};

const emailJaCadastrado = async (email) => {
  const usuario = await db.usuario.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return Boolean(usuario);
};

const criarUsuario = async (usuarioDTO) => {
  const [cpfCadastrado, emailCadastrado] = await Promise.all([
    cpfJaCadastrado(usuarioDTO.cpf),
    emailJaCadastrado(usuarioDTO.email),
  ]);

  const fields = [];

  if (cpfCadastrado) {
    fields.push("cpf");
  }

  if (emailCadastrado) {
    fields.push("email");
  }

  if (fields.length > 0) {
    throw new ConflictError("Usuário já cadastrado", {
      fields,
    });
  }

  const usuario = await db.usuario.create({
    data: usuarioDTO,
  });

  return sanitizeUsuario(usuario);
};

export default {
  criarUsuario,
};
