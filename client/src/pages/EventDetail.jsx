import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChair,
  FaMoneyBillWave,
} from "react-icons/fa";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setBookingLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (!showOTP) {
        await api.post("/bookings/send-otp");
        setShowOTP(true);
        setSuccessMsg("OTP sent to your email. Verify to confirm booking.");
      } else {
        await api.post("/bookings", { eventId: event._id, otp });

        setSuccessMsg("Booking requested! Awaiting admin confirmation.");
        setShowOTP(false);

        setEvent({
          ...event,
          availableSeats: event.availableSeats - 1,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading event...
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="text-center py-20 text-xl text-red-500">{error}</div>
    );
  }

  const isSoldOut = event.availableSeats <= 0;
  const seatPercentage = (event.availableSeats / event.totalSeats) * 100;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      {/* Event Banner */}

      <div className="relative rounded-2xl overflow-hidden shadow-xl mb-10">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-96 object-cover hover:scale-105 transition duration-700"
          />
        ) : (
          <div className="w-full h-80 bg-gray-900 flex items-center justify-center text-white text-5xl font-bold">
            {event.category}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

        <div className="absolute bottom-8 left-8 text-white">
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase">
            {event.category}
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold mt-3">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Event Description */}

        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">About this event</h2>

          <p className="text-gray-600 leading-relaxed mb-8">
            {event.description}
          </p>

          {/* Event Info */}

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-gray-500" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-gray-500" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Booking Card */}

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-fit">
          <h3 className="text-xl font-bold mb-6">Booking Details</h3>

          {/* Price */}

          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-500">Ticket Price</span>

            <span className="text-xl font-bold">
              {event.ticketPrice === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                `₹${event.ticketPrice}`
              )}
            </span>
          </div>

          {/* Seat Info */}

          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-500">
              <FaChair />
              Seats Left
            </span>

            <span className="font-semibold">
              {event.availableSeats} / {event.totalSeats}
            </span>
          </div>

          {/* Seat Progress */}

          <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
            <div
              className="bg-gray-900 h-2 rounded-full"
              style={{ width: `${seatPercentage}%` }}
            ></div>
          </div>

          {/* OTP Input */}

          {showOTP && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              maxLength="6"
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl mb-4 text-center font-bold tracking-widest"
            />
          )}

          {/* Booking Button */}

          <button
            onClick={handleBooking}
            disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
            className={`w-full py-4 rounded-xl font-bold text-lg transition 
                        
                        ${
                          isSoldOut
                            ? "bg-gray-300 text-gray-500"
                            : "bg-gray-900 text-white hover:bg-black hover:-translate-y-1"
                        }
                        `}
          >
            {bookingLoading
              ? "Processing..."
              : showOTP
                ? "Verify OTP & Confirm"
                : isSoldOut
                  ? "Sold Out"
                  : "Book Ticket"}
          </button>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          {successMsg && (
            <p className="text-green-600 text-center mt-4">{successMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
