import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authService, SignupData, LoginData } from "../../services/authService";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  access_token: string | null;
  refresh_token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isRefreshing: boolean;
}

// Initialize state from localStorage
const getInitialState = (): AuthState => {
  if (typeof window !== "undefined") {
    const { access_token, refresh_token } = authService.getTokens();
    const user = authService.getUser();

    return {
      user: user,
      access_token: access_token,
      refresh_token: refresh_token,
      isLoading: false,
      error: null,
      isAuthenticated: !!(access_token && refresh_token && user),
      isRefreshing: false,
    };
  }

  return {
    user: null,
    access_token: null,
    refresh_token: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isRefreshing: false,
  };
};

const initialState: AuthState = getInitialState();

// Async thunks
export const signup = createAsyncThunk(
  "auth/signup",
  async (data: SignupData, { rejectWithValue }) => {
    try {
      const response = await authService.signup(data);
      authService.setTokens(response.access_token, response.refresh_token);
      authService.setUser(response.user);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Signup failed",
      );
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      authService.setTokens(response.access_token, response.refresh_token);
      authService.setUser(response.user);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Login failed",
      );
    }
  },
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refresh();
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Token refresh failed",
      );
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      authService.clearAuth();
      return null;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { message?: string }).message || "Logout failed",
      );
    }
  },
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      if (state.auth.isLoading || state.auth.isRefreshing) {
        throw new Error("Auth check already in progress");
      }

      const { access_token, refresh_token } = authService.getTokens();
      if (!access_token || !refresh_token) {
        throw new Error("No tokens available");
      }

      try {
        const tokenPayload = JSON.parse(atob(access_token.split(".")[1]));
        const currentTime = Date.now() / 1000;

        if (tokenPayload.exp > currentTime) {
          return {
            access_token,
            refresh_token,
            user: {
              id: tokenPayload.id || "",
              name: tokenPayload.name || "",
              username: tokenPayload.username || "",
              email: tokenPayload.email || "",
            },
          };
        }
      } catch {}

      const response = await authService.refresh();
      return response;
    } catch {
      authService.clearAuth();
      return rejectWithValue("Authentication failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isRefreshing = false;
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isRefreshing = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.access_token = null;
        state.refresh_token = null;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.access_token = null;
        state.refresh_token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.isLoading = false;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.access_token = null;
        state.refresh_token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
