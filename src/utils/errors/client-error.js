const AppError = require("../errors/error-handler");
const httpStatusCode = require("../httpStatusCode");

class ClientError extends AppError {
  constructor(name, message, explanation, statusCode) {
    // We need explanation from the original error object
    super(name, message, explanation, statusCode);
  }
}

module.exports = ClientError;
