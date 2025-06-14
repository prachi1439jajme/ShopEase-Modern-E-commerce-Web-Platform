const express = require("express");
const router = express.Router();
const {
  sendOtp,
  signup,
  login,
  resetToken,
  resetPassword,
  logout,
  getUserInfo,
} = require("../controllers/Auth");
const { Verify, isUser } = require("../middlerwares/Verify");

router.post("/sendotp", sendOtp);
router.post("/signup", signup);
router.post("/login", login);
router.post("/reset-password-token", resetToken);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
router.get("/user-info", Verify, getUserInfo);

module.exports = router;
