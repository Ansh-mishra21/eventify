const express = require("express");
const router = express.Router();

// Import auth controller functions
const {
  register,
  login,
  verifyOTP,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// Register new user (OTP will be sent for verification)
router.post("/register", register);

// Login existing user
router.post("/login", login);

// Verify OTP after registration
router.post("/verify-otp", verifyOTP);

// Send OTP for forgot password
router.post("/forgot-password", forgotPassword);

// Reset password using OTP
router.post("/reset-password", resetPassword);

module.exports = router;
