import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = '/api/users';

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Register user
  register: async (userData) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      const { user, token } = response.data.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        loading: false 
      });
      
      return { user, token };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'שגיאה בהרשמה', 
        loading: false 
      });
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      const { user, token } = response.data.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        loading: false 
      });
      
      return { user, token };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'שגיאה בהתחברות', 
        loading: false 
      });
      throw error;
    }
  },

  // Logout user
  logout: () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
    
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false, 
      error: null 
    });
  },

  // Get user profile
  getProfile: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${API_BASE_URL}/profile`);
      const user = response.data.data;
      
      set({ user, loading: false });
      return user;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'שגיאה בטעינת הפרופיל', 
        loading: false 
      });
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (updateData) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.put(`${API_BASE_URL}/profile`, updateData);
      const user = response.data.data;
      
      set({ user, loading: false });
      return user;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'שגיאה בעדכון הפרופיל', 
        loading: false 
      });
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post(`${API_BASE_URL}/change-password`, passwordData);
      
      set({ loading: false });
      return response.data.message;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'שגיאה בשינוי הסיסמה', 
        loading: false 
      });
      throw error;
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ isAuthenticated: false });
        return false;
      }

      const response = await axios.get(`${API_BASE_URL}/verify`);
      set({ isAuthenticated: true });
      return true;
    } catch (error) {
      // Token is invalid, logout user
      get().logout();
      return false;
    }
  },

  // Initialize auth state
  initializeAuth: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verify token and get user profile
      try {
        await get().verifyToken();
        await get().getProfile();
      } catch (error) {
        get().logout();
      }
    }
  },

  // Get user exercises
  getExercises: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${API_BASE_URL}/exercises`);
      const exercises = response.data.data;
      
      set({ loading: false });
      return exercises;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'שגיאה בטעינת התרגילים', 
        loading: false 
      });
      throw error;
    }
  },

  // Update user exercises
  updateExercises: async (exercises) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.put(`${API_BASE_URL}/exercises`, { exercises });
      const updatedExercises = response.data.data;
      
      // Update user exercises in the store
      set(state => ({
        user: state.user ? { ...state.user, exercises: updatedExercises } : null,
        loading: false
      }));
      
      return updatedExercises;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'שגיאה בעדכון התרגילים', 
        loading: false 
      });
      throw error;
    }
  }
}));

export default useAuthStore; 