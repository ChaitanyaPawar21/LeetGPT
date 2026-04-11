import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://leetgpt.vercel.app//api",
  withCredentials: true, // Crucial for sending/receiving cookies
});

// Add interceptors if needed for global error handling
// We are using HTTP-only cookies, so manual token handling in localStorage is not strictly necessary
// unless you want to support both. However, the current interceptor was causing infinite loops on /login.

export default api;
