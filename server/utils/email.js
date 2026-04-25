const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Aapka Gmail
    pass: process.env.EMAIL_PASS, // 16-digit App Password
  },
});

/* ================= BOOKING CONFIRMATION EMAIL ================= */
const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    const mailOptions = {
      from: `"Eventify" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Booking Confirmed: ${eventTitle}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2>Hi ${userName}!</h2>
          <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
          <p>Thank you for choosing Eventify.</p>
          <br>
          <small>Team Eventify</small>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent to:", userEmail);
  } catch (error) {
    console.error("Error sending booking email:", error);
  }
};

/* ================= OTP EMAIL (Account & Booking) ================= */
const sendOTPEmail = async (userEmail, otp, type) => {
  try {
    const title =
      type === "account_verification"
        ? "Verify your Eventify Account"
        : "Eventify Booking Verification";

    const msg =
      type === "account_verification"
        ? "Please use the following OTP to verify your new Eventify account."
        : "Please use the following OTP to verify and confirm your event booking.";

    const mailOptions = {
      from: `"Eventify" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: title,
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2 style="color: #111;">${title}</h2>
          <p style="color: #555;">${msg}</p>
          <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
            ${otp}
          </div>
          <p style="color: #999; font-size: 12px;">This code expires in 5 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${userEmail} for ${type}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

module.exports = {
  sendBookingEmail,
  sendOTPEmail,
};