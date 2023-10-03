require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const ConflictError = require("../errors/conflict-error");
const BadRequestError = require("../errors/bad-request-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const NotFoundError = require("../errors/not-found-error");

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return next(new ConflictError("Email already exists"));
    }
    return null;
  });
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      return res.send({ data: userData });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BadRequestError("Bad request, invalid data input"));
      } else {
        next(e);
      }
      if (e.code === 11000) {
        next(new ConflictError("A user with the current email already exists"));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        }),
      });
    })
    .catch(() => {
      next(new UnauthorizedError("Incorrect email or password"));
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError("User not found"));
      } else {
        res.send({ data: user });
      }
    })
    .catch((e) => {
      next(e);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
};
