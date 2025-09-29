import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, signup, logout, checkAuth, clearError } from '@/store/slices/authSlice';

export const useAuthRedux = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, isAuthenticated, error } = useAppSelector((state) => state.auth);

  const loginUser = async (email: string, password: string) => {
    const result = await dispatch(login({ email, password }));
    return result.type.endsWith('fulfilled');
  };

  const signupUser = async (data: { name: string; username: string; email: string; password: string }) => {
    const result = await dispatch(signup(data));
    return result.type.endsWith('fulfilled');
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const checkAuthStatus = () => {
    dispatch(checkAuth());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    login: loginUser,
    signup: signupUser,
    logout: logoutUser,
    checkAuth: checkAuthStatus,
    clearError: clearAuthError,
  };
};
