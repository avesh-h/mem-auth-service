const AppError = require("./error-handler");
const httpStatusCode = require("../httpStatusCode");

class ValidationError extends AppError {
  constructor(error) {
    // We need explanation from the original error object
    let explanation = error.explanation || error.message;
    let errorName = error.name;
    super();
    this.message = error.message;
    this.explanation = explanation;
    this.name = errorName;
    this.statusCode = error.statusCode;
  }
}

module.exports = ValidationError;
