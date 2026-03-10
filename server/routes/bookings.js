const express = require("express");
const router = express.Router();

const {
  bookEvent,
  confirmBooking,
  getMyBookings,
  cancelBooking,
  sendBookingOTP,
  getBookingById,
  createBookingAfterPayment,
  validateTicket,
} = require("../controllers/bookingController");

const { protect, admin } = require("../middleware/auth");

// Send OTP before booking (user must be logged in)
router.post("/send-otp", protect, sendBookingOTP);

// Create booking request (logged-in users only)
router.post("/", protect, bookEvent);

// Admin confirms booking
router.put("/:id/confirm", protect, admin, confirmBooking);

// Get logged-in user's bookings
router.get("/my", protect, getMyBookings);

// Cancel booking
router.delete("/:id", protect, cancelBooking);

// Get booking by ID (for ticket page)
router.get("/:id", protect, getBookingById);

// Create booking after successful payment (used by payment controller)
router.post("/payment-booking", protect, createBookingAfterPayment);

// Validate ticket at event entry (admin only)
router.put("/validate/:id", protect, admin, validateTicket);

module.exports = router;
