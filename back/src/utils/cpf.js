const normalizarCpf = (cpf) => String(cpf).replace(/\D/g, "");

export {
  normalizarCpf,
};
