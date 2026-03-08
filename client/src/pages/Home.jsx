import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaRegClock,
  FaTicketAlt,
  FaShieldAlt,
} from "react-icons/fa";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get(`/events?search=${search}`);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-black text-white rounded-3xl overflow-hidden mb-16 shadow-2xl">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center"></div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

        <div className="relative p-10 md:p-20 text-center flex flex-col items-center z-10">
          <span className="bg-white/20 text-white backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
            Welcome to Eventora
          </span>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg">
            Find Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
              Unforgettable
            </span>{" "}
            Experience
          </h1>

          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Discover the best tech conferences, music festivals and workshops
            happening near you.
          </p>

          {/* Search */}
          <div className="w-full max-w-2xl mx-auto relative flex items-center shadow-2xl group">
            <FaSearch className="absolute left-6 text-gray-500 text-xl group-focus-within:text-black transition-colors" />

            <input
              type="text"
              placeholder="Search events by title..."
              className="w-full pl-16 pr-6 py-5 rounded-full text-lg text-black bg-white/95 backdrop-blur-sm border-2 border-transparent focus:border-gray-500 focus:outline-none transition-all placeholder-gray-400 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 mt-8">
            <Link
              to="/events"
              className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition"
            >
              Explore Events
            </Link>

            <Link
              to="/dashboard"
              className="px-6 py-3 border border-white text-white rounded-full hover:bg-white hover:text-black transition"
            >
              My Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-10 text-center">
            <div>
              <h3 className="text-3xl font-bold">500+</h3>
              <p className="text-gray-400 text-sm">Events Hosted</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">10K+</h3>
              <p className="text-gray-400 text-sm">Tickets Sold</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">200+</h3>
              <p className="text-gray-400 text-sm">Organizers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-xl transition duration-300">
          <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-6">
            <FaRegClock />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Booking</h3>

          <p className="text-gray-500 text-sm">
            Secure your tickets instantly with our fast booking infrastructure.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-xl transition duration-300">
          <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-6">
            <FaTicketAlt />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Seamless Access
          </h3>

          <p className="text-gray-500 text-sm">
            Download tickets instantly or manage them from your dashboard.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-xl transition duration-300">
          <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-6">
            <FaShieldAlt />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Secure Platform
          </h3>

          <p className="text-gray-500 text-sm">
            All payments and registrations are protected with advanced security.
          </p>
        </div>
      </div>

      {/* Events Heading */}
      <div className="flex items-center justify-between mb-10 px-2">
        <h2 className="text-4xl font-extrabold text-gray-900">
          🔥 Upcoming Events
        </h2>

        <div className="text-gray-500 font-medium">
          {events.length} results found
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-20 text-xl font-semibold text-gray-600">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-xl text-gray-500">
          No events found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300 flex flex-col"
            >
              <div className="h-48 bg-gray-200 overflow-hidden relative">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-110 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-2xl">
                    {event.category || "Event"}
                  </div>
                )}

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                  {event.ticketPrice === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    <span className="text-gray-900">₹{event.ticketPrice}</span>
                  )}
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  {event.category}
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  {event.title}
                </h2>

                <div className="flex flex-col gap-2 mb-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-gray-700 h-2 rounded-full"
                      style={{
                        width: `${(event.availableSeats / event.totalSeats) * 100}%`,
                      }}
                    ></div>
                  </div>

                  <p className="text-xs text-gray-500 mb-4">
                    {event.availableSeats} of {event.totalSeats} seats remaining
                  </p>

                  <Link
                    to={`/events/${event._id}`}
                    className="block w-full text-center bg-gray-900 hover:bg-black text-white font-semibold py-2 rounded-lg transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 pt-16 pb-8 border-t border-gray-200 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <FaTicketAlt className="text-gray-800 text-2xl" />
          <span className="text-xl font-bold text-gray-900">Eventora</span>
        </div>

        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          Discover and book amazing events near you with Eventora.
        </p>

        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
          © {new Date().getFullYear()} Eventora Platform
        </div>
      </footer>
    </div>
  );
};

export default Home;
