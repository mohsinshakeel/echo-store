import api from './api';
import axios from 'axios';

// Create a separate axios instance for refresh calls to avoid circular dependency
const refreshApi = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple simultaneous refresh calls
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
    const response = await api.post('/signup', data);
    return response.data;
  },


  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/login', data);
    return response.data;
  },


  refresh: async (): Promise<AuthResponse> => {
    if (isRefreshing) {
      throw new Error('Refresh already in progress');
    }

    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
      throw new Error('No refresh token available');
    }

    isRefreshing = true;
    try {
      const response = await refreshApi.post('/refresh', { 'refresh-token': refresh_token });
      const data = response.data;
      
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      if (data.user) {
        localStorage.setItem('user_data', JSON.stringify(data.user));
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  },


  getTokens: () => {
    return {
      access_token: localStorage.getItem('access_token'),
      refresh_token: localStorage.getItem('refresh_token'),
    };
  },

  
  setTokens: (access_token: string, refresh_token: string) => {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
  },


  setUser: (user: any) => {
    localStorage.setItem('user_data', JSON.stringify(user));
  },


  getUser: () => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },


  clearAuth: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  },
};
