import { randomBytes } from "node:crypto";

import bcrypt from "bcrypt";

import db from "../config/database.js";
import NotAuthorizedError from "../errors/not-authorized.error.js";
import { normalizarCpf } from "../utils/cpf.js";
import { criarLog } from "./log-app.service.js";

const sanitizeUsuario = (usuario) => {
  const { senha, ...safeUsuario } = usuario;
  return safeUsuario;
};

const buscarUsuarioPorCpf = (dbClient, cpf) => {
  return dbClient.usuario.findUnique({
    where: {
      cpf,
    },
  });
};

const buscarUsuarioPorEmail = (dbClient, email) => {
  return dbClient.usuario.findUnique({
    where: {
      email,
    },
  });
};

const gerarToken = () => randomBytes(48).toString("hex");

const criarToken = async (dbClient, usuarioId) => {
  const token = gerarToken();

  await dbClient.token.create({
    data: {
      token,
      id_usuario: usuarioId,
    },
  });

  return token;
};

const login = async (loginDTO) => {
  const autenticacao = await db.$transaction(async (tx) => {
    const cpf = normalizarCpf(loginDTO.login);

    const [usuarioPorCpf, usuarioPorEmail] = await Promise.all([
      buscarUsuarioPorCpf(tx, cpf),
      buscarUsuarioPorEmail(tx, loginDTO.login),
    ]);

    if (usuarioPorCpf && usuarioPorEmail) {
      await registrarLoginNegado(tx, null, "login_ambiguo");
      return null;
    }

    if (!usuarioPorCpf && !usuarioPorEmail) {
      await registrarLoginNegado(tx, null, "usuario_nao_encontrado");
      return null;
    }

    const usuario = usuarioPorCpf ?? usuarioPorEmail;

    if (!usuario.ativo) {
      await registrarLoginNegado(tx, usuario, "usuario_inativo");
      return null;
    }

    const senhaValida = await bcrypt.compare(loginDTO.password, usuario.senha);

    if (!senhaValida) {
      await registrarLoginNegado(tx, usuario, "senha_invalida");
      return null;
    }

    const token = await criarToken(tx, usuario.id);
    const usuarioSeguro = sanitizeUsuario(usuario);

    await criarLog(tx, {
      id_usuario: usuario.id,
      tabela: "usuario",
      id_tabela: usuario.id,
      operacao: "LOGIN",
      depois: {
        sucesso: true,
        usuario: usuarioSeguro,
      },
    });

    return {
      token,
      usuario: usuarioSeguro,
    };
  });

  if (!autenticacao) {
    throw new NotAuthorizedError();
  }

  return autenticacao;
};

const registrarLoginNegado = (dbClient, usuario, motivo) => {
  return criarLog(dbClient, {
    id_usuario: null,
    tabela: "usuario",
    id_tabela: usuario?.id ?? null,
    operacao: "LOGIN",
    depois: {
      sucesso: false,
      motivo,
      usuario: usuario ? sanitizeUsuario(usuario) : null,
    },
  });
};

const logout = async (token) => {
  return db.$transaction(async (tx) => {
    const tokenEncontrado = token
      ? await tx.token.findUnique({
          where: {
            token,
          },
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                cpf: true,
                email: true,
                ativo: true,
              },
            },
          },
        })
      : null;

    await criarLog(tx, {
      id_usuario: tokenEncontrado?.usuario?.id ?? null,
      tabela: "token",
      id_tabela: tokenEncontrado?.id ?? null,
      operacao: "LOGOUT",
      antes: tokenEncontrado
        ? {
            id: tokenEncontrado.id,
            id_usuario: tokenEncontrado.id_usuario,
            ativo: tokenEncontrado.ativo,
          }
        : null,
      depois: {
        sucesso: Boolean(tokenEncontrado),
        usuario: tokenEncontrado?.usuario ?? null,
      },
    });
  });
};

export default {
  login,
  logout,
};
