import db from "../config/database.js";

const sanitizeUsuario = (usuario) => {
  const { senha, ...safeUsuario } = usuario;
  return safeUsuario;
};

const criarUsuario = async (usuarioDTO) => {
  const usuario = await db.usuario.create({
    data: usuarioDTO,
  });

  return sanitizeUsuario(usuario);
};

export default {
  criarUsuario,
};
