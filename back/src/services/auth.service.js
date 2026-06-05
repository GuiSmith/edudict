import { randomBytes } from "node:crypto";

import bcrypt from "bcrypt";

import db from "../config/database.js";
import NotAuthorizedError from "../errors/not-authorized.error.js";
import { normalizarCpf } from "../utils/cpf.js";

const sanitizeUsuario = (usuario) => {
  const { senha, ...safeUsuario } = usuario;
  return safeUsuario;
};

const buscarUsuarioPorCpf = (cpf) => {
  return db.usuario.findUnique({
    where: {
      cpf,
    },
  });
};

const buscarUsuarioPorEmail = (email) => {
  return db.usuario.findUnique({
    where: {
      email,
    },
  });
};

const gerarToken = () => randomBytes(48).toString("hex");

const criarToken = async (usuarioId) => {
  const token = gerarToken();

  await db.token.create({
    data: {
      token,
      id_usuario: usuarioId,
    },
  });

  return token;
};

const login = async (loginDTO) => {
  const cpf = normalizarCpf(loginDTO.login);

  const [usuarioPorCpf, usuarioPorEmail] = await Promise.all([
    buscarUsuarioPorCpf(cpf),
    buscarUsuarioPorEmail(loginDTO.login),
  ]);

  if (usuarioPorCpf && usuarioPorEmail) {
    throw new NotAuthorizedError();
  }

  if (!usuarioPorCpf && !usuarioPorEmail) {
    throw new NotAuthorizedError();
  }

  const usuario = usuarioPorCpf ?? usuarioPorEmail;

  if (!usuario.ativo) {
    throw new NotAuthorizedError();
  }

  const senhaValida = await bcrypt.compare(loginDTO.password, usuario.senha);

  if (!senhaValida) {
    throw new NotAuthorizedError();
  }

  const token = await criarToken(usuario.id);

  return {
    token,
    usuario: sanitizeUsuario(usuario),
  };
};

export default {
  login,
};
