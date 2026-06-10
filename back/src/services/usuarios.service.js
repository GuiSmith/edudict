import bcrypt from "bcrypt";

import db from "../config/database.js";
import ConflictError from "../errors/conflict.error.js";
import NotFoundError from "../errors/not-found.error.js";
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

const cpfCadastradoEmOutroUsuario = async (dbClient, cpf, usuarioId) => {
  const usuario = await dbClient.usuario.findFirst({
    where: {
      cpf,
      NOT: {
        id: usuarioId,
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(usuario);
};

const emailCadastradoEmOutroUsuario = async (dbClient, email, usuarioId) => {
  const usuario = await dbClient.usuario.findFirst({
    where: {
      email,
      NOT: {
        id: usuarioId,
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(usuario);
};

const montarPayloadAtualizacao = async (usuarioDTO) => {
  const data = {};

  if (Object.prototype.hasOwnProperty.call(usuarioDTO, "nome")) {
    data.nome = usuarioDTO.nome;
  }

  if (Object.prototype.hasOwnProperty.call(usuarioDTO, "cpf")) {
    data.cpf = usuarioDTO.cpf;
  }

  if (Object.prototype.hasOwnProperty.call(usuarioDTO, "email")) {
    data.email = usuarioDTO.email;
  }

  if (Object.prototype.hasOwnProperty.call(usuarioDTO, "senha")) {
    data.senha = await bcrypt.hash(usuarioDTO.senha, SALT_ROUNDS);
  }

  if (Object.prototype.hasOwnProperty.call(usuarioDTO, "ativo")) {
    data.ativo = usuarioDTO.ativo;
  }

  return data;
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

const editarUsuario = async (usuarioDTO, usuarioResponsavelId = null) => {
  return db.$transaction(async (tx) => {
    const usuarioAtual = await tx.usuario.findUnique({
      where: {
        id: usuarioDTO.id,
      },
    });

    if (!usuarioAtual) {
      throw new NotFoundError("Usuário não encontrado", {
        fields: ["id"],
      });
    }

    const fields = [];

    if (
      Object.prototype.hasOwnProperty.call(usuarioDTO, "cpf") &&
      await cpfCadastradoEmOutroUsuario(tx, usuarioDTO.cpf, usuarioDTO.id)
    ) {
      fields.push("cpf");
    }

    if (
      Object.prototype.hasOwnProperty.call(usuarioDTO, "email") &&
      await emailCadastradoEmOutroUsuario(tx, usuarioDTO.email, usuarioDTO.id)
    ) {
      fields.push("email");
    }

    if (fields.length > 0) {
      throw new ConflictError("Usuário já cadastrado", {
        fields,
      });
    }

    const data = await montarPayloadAtualizacao(usuarioDTO);

    const usuarioAtualizado = await tx.usuario.update({
      where: {
        id: usuarioDTO.id,
      },
      data,
    });

    const usuarioAtualSeguro = sanitizeUsuario(usuarioAtual);
    const usuarioAtualizadoSeguro = sanitizeUsuario(usuarioAtualizado);

    await criarLog(tx, {
      id_usuario: usuarioResponsavelId,
      tabela: "usuario",
      id_tabela: usuarioDTO.id,
      operacao: "UPDATE",
      antes: usuarioAtualSeguro,
      depois: usuarioAtualizadoSeguro,
    });

    return usuarioAtualizadoSeguro;
  });
};

export default {
  criarUsuario,
  editarUsuario,
};
