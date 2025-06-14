const express = require("express");
const router = express.Router();
const {
  capturePayment,
  verifySignature,
  sendPaymentSuccessEmail,
} = require("../controllers/Payments");

const { Verify, isUser } = require("../middlerwares/Verify");
router.post("/capturePayment", Verify, isUser, capturePayment);
router.post("/verifySignature", Verify, isUser, verifySignature);
router.post(
  "/sendPaymentSuccessEmail",
  Verify,
  isUser,
  sendPaymentSuccessEmail
);

module.exports = router;
