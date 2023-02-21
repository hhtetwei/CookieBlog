const router = require("express").Router();

// controllers
const {
  register,
  activateEmail,
  login,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/authController");

// middlewares
const { resetAuth } = require("../middlewares/resetAuth");
const { userAuth } = require("../middlewares/userAuth");

// validation middlewares
const loginValidator = require("../validators/auth/loginValidator");
const registerValidator = require("../validators/auth/registerValidator");
const resetPwValidator = require("../validators/auth/resetPasswordValidator");
const forgetPwValidator = require("../validators/auth/forgetPasswordValidator");

// routes
router.post("/register", registerValidator, register);
router.post("/activate", activateEmail);

router.post("/login", loginValidator, login);

router.post("/forgot", forgetPwValidator, forgotPassword);
router.post("/reset", resetAuth, resetPwValidator, resetPassword);
router.get("/logout", userAuth, logout);

module.exports = router;
