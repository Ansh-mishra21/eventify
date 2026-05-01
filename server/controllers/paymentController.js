const Razorpay = require("razorpay");

// ✅ Import models
const Event = require("../models/Event");
const Payment = require("../models/Payment");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

exports.createOrder = async (req, res) => {

  try {

    // ✅ Get eventId
    const { amount, eventId } = req.body;

    // 🔍 DEBUG (optional but useful)
    console.log("BODY:", req.body);

    // ✅ 1. Fetch event
    const event = await Event.findById(eventId);

    console.log("EVENT:", event);
    console.log("PRICE:", event?.ticketPrice);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // ❌ 2. Expired event check
    if (new Date() > new Date(event.date)) {
      return res.status(400).json({
        message: "Event has already ended"
      });
    }

    // 🔥 FIXED: correct capacity check
    if (event.availableSeats <= 0) {
      return res.status(400).json({
        message: "Event is full"
      });
    }

    // ❌ 4. Duplicate payment check
    const existingPayment = await Payment.findOne({
      user: req.user?.id,
      event: eventId,
      status: "SUCCESS"
    });

    if (existingPayment) {
      return res.status(400).json({
        message: "You already registered for this event"
      });
    }

    // 🔥 FIXED: correct price field + safety
    const finalAmount = event.ticketPrice;

    if (!finalAmount || finalAmount <= 0) {
      return res.status(400).json({
        message: "Invalid ticket price"
      });
    }

    // ✅ Razorpay order create
    const options = {
      amount: finalAmount * 100, // 🔥 must be in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    // ✅ Save payment in DB
    const payment = await Payment.create({
      user: req.user?.id,
      event: eventId,
      amount: finalAmount,
      razorpayOrderId: order.id,
      status: "PENDING"
    });

    res.json({
      ...order,
      paymentId: payment._id
    });

  } catch (error) {

    console.log("CREATE ORDER ERROR:", error);

    res.status(500).json({ message: "Payment order failed" });

  }

};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      paymentId,
      eventId,
    } = req.body;

    const crypto = require("crypto");

    // ✅ Signature verify
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // ✅ Find payment
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // 🔥 Idempotency
    if (payment.status === "SUCCESS") {
      return res.json({ message: "Already verified" });
    }

    // ✅ Mark success
    payment.status = "SUCCESS";
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save();

    // 🔥 FIXED: correct seat logic
    const event = await Event.findById(eventId);

    if (!event || event.availableSeats <= 0) {
      return res.status(400).json({ message: "Event full" });
    }

    event.availableSeats -= 1;
    await event.save();

    res.json({ message: "Payment verified successfully" });

  } catch (error) {
    console.log("VERIFY ERROR:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};