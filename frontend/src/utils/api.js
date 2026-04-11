import axios from "axios";

// ✅ Set globally
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://leetgpt.onrender.com/api",
  withCredentials: true,
});

export default api;