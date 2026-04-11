import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://leetgpt.onrender.com/api",
    withCredentials: true,
});

// ✅ Attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ✅ REMOVED auto-redirect on 401 — AuthContext handles that now
api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default api;