import api from "./api";
import axios from "axios";

const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

let isRefreshing = false;

export interface SignupData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
  };
}

export const authService = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post("/signup", data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post("/login", data);
    return response.data;
  },

  refresh: async (): Promise<AuthResponse> => {
    if (isRefreshing) {
      throw new Error("Refresh already in progress");
    }

    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) {
      throw new Error("No refresh token available");
    }

    isRefreshing = true;
    try {
      const response = await refreshApi.post("/refresh", {
        "refresh-token": refresh_token,
      });
      const data = response.data;

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      if (data.user) {
        localStorage.setItem("user_data", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      authService.clearAuth();
      throw error;
    } finally {
      isRefreshing = false;
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
  },

  getTokens: () => {
    return {
      access_token: localStorage.getItem("access_token"),
      refresh_token: localStorage.getItem("refresh_token"),
    };
  },

  setTokens: (access_token: string, refresh_token: string) => {
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
  },

  setUser: (user: {
    id: string;
    name: string;
    username: string;
    email: string;
  }) => {
    localStorage.setItem("user_data", JSON.stringify(user));
  },

  getUser: () => {
    const userData = localStorage.getItem("user_data");
    if (!userData || userData === "undefined" || userData === "null") {
      return null;
    }
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  clearAuth: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
  },
};
