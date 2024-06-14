const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  allUsers,
  sendEmail,
  changePassword,
  validateOtp,
  forgetPassword,
  resetPassword,
} = require("../Controllers/userController");
const isAuth = require("../Middleware/auth");

router.post("/register", registerUser);
router.post("/login", authUser);
router.get("/", isAuth, allUsers);
// for forgot password functionality
router.post("/forgetpassword", forgetPassword);
router.put("/resetpassword/:token", resetPassword);

module.exports = router;