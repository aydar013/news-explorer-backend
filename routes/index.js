const router = require("express").Router();
const article = require("./article");
const User = require("./user");
const { createUser, login } = require("../controllers/users");
const {
  createUserValidation,
  loginValidation,
} = require("../middlewares/validation");
const NotFoundError = require("../errors/not-found-error");

router.use("/articles", article);
router.use("/users", User);

router.post("/signup", createUserValidation, createUser);
router.post("/signin", loginValidation, login);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
