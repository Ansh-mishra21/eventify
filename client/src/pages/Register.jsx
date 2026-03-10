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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* LEFT SIDE */}

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

        {/* RIGHT SIDE */}

        <div className="w-full md:w-1/2 p-10 flex items-center">
          <div className="w-full max-w-md mx-auto">
            {/* TOGGLE */}

            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-gray-200 p-1.5 rounded-full shadow-md">
                {/* Sign In */}

                <Link
                  to="/login"
                  className="px-6 py-2 rounded-full font-medium text-gray-600 hover:text-white hover:bg-gradient-to-r from-purple-600 to-pink-500 transition"
                >
                  Sign In
                </Link>

                {/* Sign Up */}

                <Link
                  to="/register"
                  className="px-6 py-2 rounded-full font-medium text-gray-600 hover:text-white hover:bg-gradient-to-r from-purple-600 to-pink-500 transition"
                >
                  Sign Up
                </Link>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-2 eventify-gradient-text">
              Create your account
            </h2>

            <p className="text-gray-500 mb-6">
              Join Eventify to start creating events
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                  />

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

                  {/* ROLE SELECTOR */}

                  <div>
                    <p className="text-sm text-gray-500 mb-3">
                      I want to join as
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div
                        onClick={() => setRole("user")}
                        className={`border rounded-xl p-5 cursor-pointer text-center transition ${
                          role === "user"
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200 hover:border-purple-400"
                        }`}
                      >
                        <h3 className="font-semibold">Attendee</h3>

                        <p className="text-sm text-gray-500">
                          Browse & join events
                        </p>
                      </div>

                      <div
                        onClick={() => setRole("admin")}
                        className={`border rounded-xl p-5 cursor-pointer text-center transition ${
                          role === "admin"
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200 hover:border-purple-400"
                        }`}
                      >
                        <h3 className="font-semibold">Organizer</h3>

                        <p className="text-sm text-gray-500">
                          Create & manage events
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
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
                    ? "Verify OTP"
                    : "Create Account"}
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-6 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-600 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
