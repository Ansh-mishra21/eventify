import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

const Login = () => {
  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Show/hide password
  const [showPassword, setShowPassword] = useState(false);

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

      alert(data.message);

      setFpStep(2);
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

      setShowForgot(false);

      setFpStep(1);
      setFpEmail("");
      setFpOtp("");
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    // ================= AUTH PAGE BACKGROUND =================

    <div className="relative z-10 min-h-screen w-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200">

      {/* BACK TO HOME BUTTON */}

      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:text-purple-600 hover:shadow-md transition"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>

      {/* ================= AUTH CARD ================= */}

      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-10 shadow-[0px_10px_30px_rgba(0,0,0,0.1)]">

        {/* LOGO */}

        <h1 className="text-4xl font-bold text-center mb-2 eventify-gradient-text">
          Eventify
        </h1>

        <p className="text-center text-gray-500 text-sm mb-6">
          Sign in to manage your events
        </p>

        {/* GOOGLE LOGIN BUTTON */}

        {!showOTP && (
          <>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 transition py-3 rounded-xl font-medium shadow-sm"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5"
                alt="google"
              />
              Continue with Google
            </button>

            {/* divider */}

            <div className="flex items-center my-5">
              <div className="flex-1 h-px bg-gray-200"></div>

              <span className="px-3 text-gray-400 text-sm">or</span>

              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
          </>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* ================= LOGIN FORM ================= */}

        <form onSubmit={handleSubmit} className="space-y-4">

          {!showOTP ? (
            <>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
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
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center font-bold tracking-widest focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          )}

          {/* SUBMIT BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 text-white font-semibold py-3 rounded-xl shadow-md hover:scale-[1.02] transition"
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

        {/* Signup redirect */}

        <p className="text-sm text-gray-500 mt-6 text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-purple-600 hover:underline"
          >
            Sign up
          </Link>
        </p>

      </div>

      {/* ================= FORGOT PASSWORD MODAL ================= */}

      {showForgot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">

            <h2 className="text-xl font-bold mb-4 eventify-gradient-text">
              Reset Password
            </h2>

            {fpStep === 1 && (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={fpEmail}
                  onChange={(e) => setFpEmail(e.target.value)}
                  className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 outline-none"
                />

                <button
                  onClick={sendResetOTP}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-lg hover:scale-[1.02] transition"
                >
                  Send OTP
                </button>
              </>
            )}

            {fpStep === 2 && (
              <>
                <input
                  placeholder="Enter OTP"
                  value={fpOtp}
                  onChange={(e) => setFpOtp(e.target.value)}
                  className="w-full border p-3 rounded-lg mb-3"
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border p-3 rounded-lg mb-4"
                />

                <button
                  onClick={resetPassword}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-lg hover:scale-[1.02] transition"
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