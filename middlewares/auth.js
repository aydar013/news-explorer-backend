require("dotenv").config();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorized-error");
const handleErrors = require("./error-handler");

module.exports = (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      next(new UnauthorizedError("Authorization required"));
      return;
    }

    const token = auth.replace("Bearer ", "");
    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      next(new UnauthorizedError("Authorization required"));
      return;
    }
    req.user = payload;

    next();
  } catch (e) {
    handleErrors(e, res);
  }
};
