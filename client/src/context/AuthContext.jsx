import React, { createContext, useState, useEffect } from "react";
import api from "../utils/axios";

// Create authentication context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage when app starts
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");

    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }

    setLoading(false);
  }, []);

  // ================= LOGIN =================

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });

      // Save user info and token
      setUser(data);

      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      return data;
    } catch (error) {
      if (error.response?.data?.needsVerification) {
        throw error.response.data;
      }

      throw error.response?.data?.message || "Login failed";
    }
  };

  // ================= REGISTER =================

  const register = async (name, email, password, role) => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      return data;
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    }
  };

  // ================= VERIFY OTP =================

  const verifyOTP = async (email, otp) => {
    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp });

      // Save verified user
      setUser(data);

      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      return data;
    } catch (error) {
      throw error.response?.data?.message || "OTP verification failed";
    }
  };

  // ================= LOGOUT =================

  const logout = () => {
    setUser(null);

    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        verifyOTP,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
