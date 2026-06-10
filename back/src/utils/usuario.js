const normalizarNomeUsuario = (nome) => String(nome).trim();

const nomeUsuarioValido = (nome) => {
  return typeof nome === "string" && normalizarNomeUsuario(nome).length > 0;
};

const senhaUsuarioValida = (senha) => {
  return typeof senha === "string" && senha.trim().length > 0;
};

export {
  nomeUsuarioValido,
  normalizarNomeUsuario,
  senhaUsuarioValida,
};
