import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import RegisterForm from '../components/auth/RegisterForm';
import LoginForm from '../components/auth/LoginForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, loading, error, register, login, clearError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (userData) => {
    try {
      await register(userData);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
    clearError();
  };

  const handleSwitchToRegister = () => {
    setIsLogin(false);
    clearError();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Error Message */}
        {error && (
          <div className="card bg-error text-white mb-6">
            <p className="text-center">{error}</p>
          </div>
        )}

        {/* Auth Form */}
        {isLogin ? (
          <LoginForm
            onSubmit={handleLogin}
            onSwitchToRegister={handleSwitchToRegister}
            loading={loading}
          />
        ) : (
          <RegisterForm
            onSubmit={handleRegister}
            onSwitchToLogin={handleSwitchToLogin}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default Auth; 