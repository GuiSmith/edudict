import AppError from "./app.error.js";

class BadGatewayError extends AppError {
  constructor(message = "Bad Gateway", details = null) {
    super(message, 502, details);
  }
}

export default BadGatewayError;
