import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, verifyOTP } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!showOTP) {
        await register(name, email, password);
        setShowOTP(true);
      } else {
        await verifyOTP(email, otp);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200">
      {/* Pink glow background */}
      <div className="absolute w-[700px] h-[700px] bg-pink-400 opacity-30 blur-[200px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute w-[600px] h-[600px] bg-purple-400 opacity-30 blur-[180px] rounded-full top-[40%] left-[40%]"></div>
      {/* BACK HOME */}

      <Link
        to="/"
        className="absolute top-8 left-8 text-gray-700 hover:text-purple-600 font-medium"
      >
        ← Back to Home
      </Link>

      {/* AUTH CARD */}

      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg rounded-3xl p-10">
        {/* LOGO */}

        <h1 className="text-4xl font-bold text-center mb-2 eventify-gradient-text">
          Eventify
        </h1>

        <p className="text-center text-gray-500 text-sm mb-6">
          Create your account to start exploring events
        </p>

        {/* GOOGLE BUTTON */}

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

            <div className="flex items-center my-5">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-3 text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
          </>
        )}

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!showOTP ? (
            <>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />

              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />

              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />

              {/* ROLE SELECT */}

              <div>
                <p className="text-sm text-gray-500 mb-2">I want to join as</p>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setRole("user")}
                    className={`cursor-pointer rounded-xl p-4 border text-center transition ${
                      role === "user"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-400"
                    }`}
                  >
                    <h3 className="font-semibold">Attendee</h3>
                    <p className="text-xs text-gray-500">Browse events</p>
                  </div>

                  <div
                    onClick={() => setRole("admin")}
                    className={`cursor-pointer rounded-xl p-4 border text-center transition ${
                      role === "admin"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-400"
                    }`}
                  >
                    <h3 className="font-semibold">Organizer</h3>
                    <p className="text-xs text-gray-500">Create events</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // OTP INPUT

            <input
              type="text"
              placeholder="Enter OTP"
              required
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center tracking-widest font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="gradient-btn w-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:scale-[1.03] transition shadow-lg"
          >
            {loading
              ? "Processing..."
              : showOTP
                ? "Verify OTP"
                : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-purple-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
