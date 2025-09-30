import axios from "axios";
import { authService } from "./authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

console.log("API_BASE_URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorCode = error.response?.data?.code;
      const errorMessage = error.response?.data?.message;

      console.log("Token expired, attempting refresh...", {
        code: errorCode,
        message: errorMessage,
      });

      originalRequest._retry = true;

      try {
        const response = await authService.refresh();
        console.log("Token refreshed successfully");
        originalRequest.headers.Authorization = `Bearer ${response.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        authService.clearAuth();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
