import criarUsuarioDTO from "../dtos/usuario/criar-usuario.dto.js";
import editarUsuarioDTO from "../dtos/usuario/editar-usuario.dto.js";
import usuariosService from "../services/usuarios.service.js";

const criarUsuario = async (req, res) => {
  const usuarioDTO = criarUsuarioDTO(req.body);
  const usuario = await usuariosService.criarUsuario(usuarioDTO, req.user?.id ?? null);

  return res.status(201).json(usuario);
};

const editarUsuario = async (req, res) => {
  const usuarioDTO = editarUsuarioDTO(req.body);
  const usuario = await usuariosService.editarUsuario(usuarioDTO, req.user?.id ?? null);

  return res.status(200).json({
    mensagem: "Usuário atualizado com sucesso",
    usuario,
  });
};

export default {
  criarUsuario,
  editarUsuario,
};
