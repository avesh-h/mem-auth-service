const { INTERNAL_SERVER_ERROR } = require("../httpStatusCode");

//Generic app error file.

class AppError extends Error {
  constructor(
    // Here we set default property of the service error instance
    name = "App error",
    message = "Something went wrong!",
    explanation = "Something went wrong!",
    statusCode = INTERNAL_SERVER_ERROR
  ) {
    // What will super do is that give access to all props and methods of the parent class and then after super we rechanged or oveerride those properties for the child class

    //Second way we can also do withint he super method with our provided value from the beginning so we don't need to override later like this :
    //Like we did in client error
    // super(
    //   errorName,
    //   "No able to validate the data sent in the request",
    //   explanation,
    //   httpStatusCode.BAD_REQUEST
    // );

    super();
    this.message = message;
    this.explanation = explanation;
    this.name = name;
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
