import axios from "axios";
import { redirectToLogin } from "./navigationRef";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      const sent = error.config?.headers?.Authorization?.replace(/^Bearer\s+/i, "") || "";
      const current = localStorage.getItem("token") || "";
      if (sent && current && sent !== current) {
        return Promise.reject(error);
      }
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

export default api;
