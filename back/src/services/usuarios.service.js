import bcrypt from "bcrypt";

import db from "../config/database.js";
import ConflictError from "../errors/conflict.error.js";
import { criarLog } from "./log-app.service.js";

const SALT_ROUNDS = 10;

const sanitizeUsuario = (usuario) => {
  const { senha, ...safeUsuario } = usuario;
  return safeUsuario;
};

const cpfJaCadastrado = async (dbClient, cpf) => {
  const usuario = await dbClient.usuario.findUnique({
    where: {
      cpf,
    },
    select: {
      id: true,
    },
  });

  return Boolean(usuario);
};

const emailJaCadastrado = async (dbClient, email) => {
  const usuario = await dbClient.usuario.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return Boolean(usuario);
};

const criarUsuario = async (usuarioDTO, usuarioResponsavelId = null) => {
  return db.$transaction(async (tx) => {
    const [cpfCadastrado, emailCadastrado] = await Promise.all([
      cpfJaCadastrado(tx, usuarioDTO.cpf),
      emailJaCadastrado(tx, usuarioDTO.email),
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

    const senhaCriptografada = await bcrypt.hash(usuarioDTO.senha, SALT_ROUNDS);

    const usuario = await tx.usuario.create({
      data: {
        ...usuarioDTO,
        senha: senhaCriptografada,
      },
    });

    const usuarioSeguro = sanitizeUsuario(usuario);

    await criarLog(tx, {
      id_usuario: usuarioResponsavelId,
      tabela: "usuario",
      id_tabela: usuario.id,
      operacao: "INSERT",
      depois: usuarioSeguro,
    });

    return usuarioSeguro;
  });
};

export default {
  criarUsuario,
};
