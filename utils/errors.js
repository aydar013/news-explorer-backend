const ERRORS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  ALREADY_EXIST: 409,
  INTERNAL_SERVER_ERROR: 500,
  DUPLICATED_KEY_ERROR: 11000,
};

const handleErrors = (req, res, e) => {
  if (e.name === "ValidationError" || e.name === "CastError") {
    return res.status(ERRORS.BAD_REQUEST).send({
      message: "Invalid Data Input",
    });
  }
  if (e.name === "DocumentNotFoundError" || e.statusCode === 404) {
    return res.status(ERRORS.NOT_FOUND).send({
      message: "Error: Not Found",
    });
  }
  if (e.message === "Incorrect email or password") {
    res
      .status(ERRORS.UNAUTHORIZED)
      .send({ message: "You are not authorized to do this" });
    return res
      .status(ERRORS.INTERNAL_SERVER_ERROR)
      .send({ message: "Something went wrong" });
  }
};

module.exports = {
  ERRORS,
  handleErrors,
};
