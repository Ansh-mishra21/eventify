import axios from "axios";

// Create axios instance with backend base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Interceptor to automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
