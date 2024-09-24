const AppError = require("./error-handler");
const httpStatusCode = require("../httpStatusCode");

class ServiceError extends AppError {
  constructor(
    // Here we set default property of the service error instance
    name = "ServiceError",
    message = "Something went wrong!",
    explanation = "Service layer error",
    statusCode = httpStatusCode.INTERNAL_SERVER_ERROR
  ) {
    // What will super do is that give access to all props and methods of the parent class and then after super we rechanged or oveerride those properties for the child class
    super();
    this.name = name;
    this.message = message;
    this.explanation = explanation;
    this.statusCode = statusCode;
  }
}

module.exports = ServiceError;
