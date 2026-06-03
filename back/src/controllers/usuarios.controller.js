import criarUsuarioDTO from "../dtos/criar-usuario.dto.js";
import usuariosService from "../services/usuarios.service.js";

const criarUsuario = async (req, res) => {
  const usuarioDTO = criarUsuarioDTO(req.body);
  const usuario = await usuariosService.criarUsuario(usuarioDTO);

  return res.status(201).json(usuario);
};

export default {
  criarUsuario,
};
