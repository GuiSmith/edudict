const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizarEmail = (email) => String(email).trim();

const emailValido = (email) => emailRegex.test(email);

export {
  emailValido,
  normalizarEmail,
};
