const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  amount: Number,

  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING",
  },

  razorpayOrderId: String,
  razorpayPaymentId: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔥 THIS LINE IS IMPORTANT
module.exports = mongoose.model("Payment", paymentSchema);