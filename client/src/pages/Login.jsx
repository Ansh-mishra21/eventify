import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";

const Login = () => {
  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP login verification (account verification)
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  // Forgot password modal states
  const [showForgot, setShowForgot] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [fpStep, setFpStep] = useState(1);
  // step 1 = email
  // step 2 = otp + new password

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, verifyOTP } = useContext(AuthContext);
  const navigate = useNavigate();

  // ================= LOGIN HANDLER =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let data;

      // Normal login
      if (!showOTP) {
        data = await login(email, password);
      }
      // If account needs OTP verification
      else {
        data = await verifyOTP(email, otp);
      }

      console.log("Logged user:", data);

      // Redirect based on role
      if (data?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      // If account not verified -> show OTP input
      if (err.needsVerification) {
        setShowOTP(true);
        setError("Account not verified. OTP sent to your email.");
      } else {
        setError(err.message || err);
      }
    } finally {
      setLoading(false);
    }
  };

  // ================= FORGOT PASSWORD =================

  // Send OTP for password reset
  const sendResetOTP = async () => {
    try {
      const { data } = await api.post("/auth/forgot-password", {
        email: fpEmail,
      });

      alert(data.message); // show success message

      setFpStep(2); // move to OTP step
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Server error");
    }
  };

  // Reset password after OTP verification
  const resetPassword = async () => {
    try {
      await api.post("/auth/reset-password", {
        email: fpEmail,
        otp: fpOtp,
        newPassword: newPassword,
      });

      alert("Password reset successful");

      // Close modal
      setShowForgot(false);

      // Reset modal states
      setFpStep(1);
      setFpEmail("");
      setFpOtp("");
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* LEFT PANEL */}
        {/* Branding + platform description */}

        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600 text-white flex-col items-center justify-center p-12">
          <h1 className="text-5xl font-bold mb-6">Eventify</h1>

          <p className="text-lg text-center max-w-md opacity-90 mb-10">
            Create, manage, and elevate your events with powerful tools and
            seamless collaboration.
          </p>

          <div className="flex gap-4 text-sm">
            <span className="bg-white/20 px-4 py-2 rounded-full">
              10K+ Events
            </span>

            <span className="bg-white/20 px-4 py-2 rounded-full">
              500+ Organizers
            </span>

            <span className="bg-white/20 px-4 py-2 rounded-full">
              4.9★ Rating
            </span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        {/* Login form */}

        <div className="w-full md:w-1/2 p-10 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-2 eventify-gradient-text">Welcome back</h2>

            <p className="text-gray-500 mb-8">Sign in to manage your events</p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            {/* LOGIN FORM */}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!showOTP ? (
                <>
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                  />
                </>
              ) : (
                // OTP input if account verification required
                <input
                  type="text"
                  placeholder="Enter OTP"
                  required
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center font-bold tracking-widest focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                {loading
                  ? "Processing..."
                  : showOTP
                    ? "Verify OTP & Login"
                    : "Sign In"}
              </button>
            </form>

            {/* Forgot password button */}
            <p className="text-sm text-gray-500 mt-2 text-right">
              <button
                onClick={() => setShowForgot(true)}
                className="text-purple-600"
              >
                Forgot Password?
              </button>
            </p>

            <p className="text-sm text-gray-500 mt-6 text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-purple-600 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ================= FORGOT PASSWORD MODAL ================= */}

      {showForgot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 eventify-gradient-text">Reset Password</h2>

            {fpStep === 1 && (
              <>
                {/* Email input for reset OTP */}

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={fpEmail}
                  onChange={(e) => setFpEmail(e.target.value)}
                  className="w-full border p-3 rounded-lg mb-4 filter focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />

                <button
                  onClick={sendResetOTP}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-lg"
                >
                  Send OTP
                </button>
              </>
            )}

            {fpStep === 2 && (
              <>
                {/* OTP verification */}

                <input
                  placeholder="Enter OTP"
                  value={fpOtp}
                  onChange={(e) => setFpOtp(e.target.value)}
                  className="w-full border p-3 rounded-lg mb-3"
                />

                {/* New password */}

                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border p-3 rounded-lg mb-4"
                />

                <button
                  onClick={resetPassword}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-lg"
                >
                  Reset Password
                </button>
              </>
            )}

            <button
              onClick={() => setShowForgot(false)}
              className="mt-4 text-sm text-purple-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
