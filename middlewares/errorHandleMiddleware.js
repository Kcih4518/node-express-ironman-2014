const { AppError } = require("../utils/customErrors");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.map((e) => e.message);
    return res.status(422).json({
      status: "fail",
      message: "Validation error",
      errors: errors,
    });
  }

  // Handle other specific error types here

  // Generic error handler
  res.status(500).json({
    status: "error",
    message: "An unexpected error occurred",
  });
};

module.exports = errorHandler;
