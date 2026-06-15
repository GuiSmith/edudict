const getApiErrorMessage = (error) => {
  const fields = error.response?.data?.details?.fields || [];

  if (error.response?.status === 409) {
    if (fields.includes("cpf") && fields.includes("email")) {
      return "CPF e e-mail já cadastrados.";
    }

    if (fields.includes("cpf")) {
      return "CPF já cadastrado.";
    }

    if (fields.includes("email")) {
      return "E-mail já cadastrado.";
    }
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  return "Ocorreu um erro ao realizar o cadastro. Tente novamente mais tarde.";
};

export default getApiErrorMessage;
