import BadRequestError from "../../errors/bad-request.error.js";

const requiredFields = ["login", "password"];

const loginDTO = (payload = {}) => {
  const missingFields = requiredFields.filter((field) => !payload[field]);

  if (missingFields.length > 0) {
    throw new BadRequestError("Campos obrigatórios ausentes", {
      fields: missingFields,
    });
  }

  return {
    login: payload.login,
    password: payload.password,
  };
};

export default loginDTO;
