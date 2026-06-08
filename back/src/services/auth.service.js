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

  return dbClient.token.create({
    data: {
      token,
      id_usuario: usuarioId,
    },
  });
};

const formatarTokenParaLog = (token) => {
  return {
    id: token.id,
    token: token.token,
    id_usuario: token.id_usuario,
    ativo: token.ativo,
    criado_em: token.criado_em.toISOString(),
  };
};

const login = async (loginDTO) => {
  const autenticacao = await db.$transaction(async (tx) => {
    const cpf = normalizarCpf(loginDTO.login);

    const [usuarioPorCpf, usuarioPorEmail] = await Promise.all([
      buscarUsuarioPorCpf(tx, cpf),
      buscarUsuarioPorEmail(tx, loginDTO.login),
    ]);

    if (usuarioPorCpf && usuarioPorEmail) {
      return null;
    }

    if (!usuarioPorCpf && !usuarioPorEmail) {
      return null;
    }

    const usuario = usuarioPorCpf ?? usuarioPorEmail;

    if (!usuario.ativo) {
      return null;
    }

    const senhaValida = await bcrypt.compare(loginDTO.password, usuario.senha);

    if (!senhaValida) {
      return null;
    }

    const token = await criarToken(tx, usuario.id);
    const usuarioSeguro = sanitizeUsuario(usuario);

    await criarLog(tx, {
      id_usuario: usuario.id,
      tabela: "token",
      id_tabela: token.id,
      operacao: "LOGIN",
      antes: null,
      depois: formatarTokenParaLog(token),
    });

    return {
      token: token.token,
      usuario: usuarioSeguro,
    };
  });

  if (!autenticacao) {
    throw new NotAuthorizedError();
  }

  return autenticacao;
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

    if (!tokenEncontrado || !tokenEncontrado.ativo) {
      return;
    }

    const tokenAntes = formatarTokenParaLog(tokenEncontrado);

    const tokenAtualizado = await tx.token.update({
      where: {
        id: tokenEncontrado.id,
      },
      data: {
        ativo: false,
      },
    });

    await criarLog(tx, {
      id_usuario: tokenEncontrado?.usuario?.id ?? null,
      tabela: "token",
      id_tabela: tokenEncontrado?.id ?? null,
      operacao: "LOGOUT",
      antes: tokenAntes,
      depois: formatarTokenParaLog(tokenAtualizado),
    });
  });
};

export default {
  login,
  logout,
};
