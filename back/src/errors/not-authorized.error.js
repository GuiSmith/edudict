import AppError from "./app.error.js";

class NotAuthorizedError extends AppError {
  constructor(message = "Não autorizado", details = null) {
    super(message, 401, details);
  }
}

export default NotAuthorizedError;
