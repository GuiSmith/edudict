const normalizarCpf = (cpf) => String(cpf).replace(/\D/g, "");

const cpfTemOnzeDigitos = (cpf) => /^\d{11}$/.test(cpf);

export {
  cpfTemOnzeDigitos,
  normalizarCpf,
};
