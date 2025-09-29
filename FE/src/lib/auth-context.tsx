'use client';

import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuth, login as loginAction, signup as signupAction, logout as logoutAction } from '@/store/slices/authSlice';
import { authService } from '@/services/authService';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id' | 'createdAt' | 'isVerified'> & { password: string; username: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, isLoading, isAuthenticated, error } = useAppSelector((state) => state.auth);
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      
      const { access_token, refresh_token } = authService.getTokens();
      const user = authService.getUser();
      if (access_token && refresh_token && !user) {
        dispatch(checkAuth());
      }
    }
  }, [dispatch]); 

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await dispatch(loginAction({ email, password }));
      return result.type.endsWith('fulfilled');
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (userData: Omit<User, 'id' | 'createdAt' | 'isVerified'> & { password: string; username: string }): Promise<boolean> => {
    try {
      const signupData = {
        name: `${userData.firstName} ${userData.lastName}`,
        username: userData.username,
        email: userData.email,
        password: userData.password,
      };
      
      const result = await dispatch(signupAction(signupData));
      return result.type.endsWith('fulfilled');
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const clearError = () => {
    dispatch({ type: 'auth/clearError' });
  };

  const value: AuthContextType = {
    user: user ? {
      id: user.id,
      firstName: user.name.split(' ')[0] || '',
      lastName: user.name.split(' ').slice(1).join(' ') || '',
      email: user.email,
      username: user.username,
      createdAt: new Date(),
      isVerified: true,
    } : null,
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
