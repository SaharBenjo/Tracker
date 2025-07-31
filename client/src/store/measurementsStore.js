import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = '/api/measurements';

const useMeasurementsStore = create((set, get) => ({
  // State
  measurements: [],
  goals: {},
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Get all measurements
  fetchMeasurements: async () => {
    try {
      set({ loading: true, error: null });
      
      // Ensure token is set
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.get(`${API_BASE_URL}`);
      const measurements = response.data.data;
      set({ measurements, loading: false });
      return measurements;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'שגיאה בטעינת ההיקפים', 
        loading: false 
      });
      throw error;
    }
  },

  // Add new measurement
  addMeasurement: async (measurementData) => {
    try {
      set({ loading: true, error: null });
      
      // Ensure token is set
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('Sending measurement to server:', measurementData);
      const response = await axios.post(`${API_BASE_URL}`, measurementData);
      console.log('Server response:', response.data);
      
      const newMeasurement = response.data.data;
      
      // Refresh measurements from server to ensure consistency
      const updatedMeasurements = await get().fetchMeasurements();
      
      set({ loading: false });
      
      return newMeasurement;
    } catch (error) {
      console.error('Error in addMeasurement:', error);
      console.error('Error response:', error.response?.data);
      set({ 
        error: error.response?.data?.message || 'שגיאה בהוספת מדידה', 
        loading: false 
      });
      throw error;
    }
  },

  // Get goals
  fetchGoals: async () => {
    try {
      set({ loading: true, error: null });
      
      // Ensure token is set
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('Fetching goals from server...');
      const response = await axios.get(`${API_BASE_URL}/goals`);
      const goals = response.data.data;
      console.log('Fetched goals:', goals);
      set({ goals, loading: false });
      return goals;
    } catch (error) {
      console.error('Error in fetchGoals:', error);
      set({ 
        error: error.response?.data?.message || 'שגיאה בטעינת המטרות', 
        loading: false 
      });
      throw error;
    }
  },

  // Update goals
  updateGoals: async (goalsData) => {
    try {
      set({ loading: true, error: null });
      
      // Ensure token is set
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('Sending goals to server:', goalsData);
      const response = await axios.put(`${API_BASE_URL}/goals`, goalsData);
      const updatedGoals = response.data.data;
      console.log('Server response:', updatedGoals);
      set({ goals: updatedGoals, loading: false });
      return updatedGoals;
    } catch (error) {
      console.error('Error in updateGoals:', error);
      set({ 
        error: error.response?.data?.message || 'שגיאה בעדכון המטרות', 
        loading: false 
      });
      throw error;
    }
  },

  // Calculate progress for a specific measurement type
  getProgress: (measurementType) => {
    const { measurements, goals } = get();
    
    console.log(`getProgress for ${measurementType}:`, { measurements, goals });
    
    if (!goals[measurementType] || measurements.length === 0) {
      console.log(`No goal or measurements for ${measurementType}`);
      return { current: 0, goal: 0, progress: 0, percentage: 0 };
    }

    const goal = goals[measurementType];
    const latestMeasurement = measurements
      .filter(m => m.type === measurementType)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    if (!latestMeasurement) {
      console.log(`No latest measurement for ${measurementType}`);
      return { current: 0, goal, progress: 0, percentage: 0 };
    }

    const current = latestMeasurement.value;
    const progress = goal - current; // חיובי = צריך להקטין, שלילי = צריך להגדיל
    
    // Calculate percentage based on whether we want to increase or decrease
    let percentage;
    if (goal > current) {
      // Goal is higher than current - we want to increase
      percentage = Math.max(0, Math.min(100, (current / goal) * 100));
    } else {
      // Goal is lower than current - we want to decrease
      percentage = Math.max(0, Math.min(100, ((goal / current) * 100)));
    }

    console.log(`Progress for ${measurementType}:`, { current, goal, progress, percentage });
    return { current, goal, progress, percentage };
  },

  // Get overall progress (average of all goals)
  getOverallProgress: () => {
    const { goals } = get();
    console.log('getOverallProgress - goals:', goals);
    
    const progressData = Object.keys(goals).map(type => get().getProgress(type));
    console.log('getOverallProgress - progressData:', progressData);
    
    if (progressData.length === 0) return 0;
    
    const averagePercentage = progressData.reduce((sum, p) => sum + p.percentage, 0) / progressData.length;
    console.log('getOverallProgress - averagePercentage:', averagePercentage);
    return Math.round(averagePercentage);
  }
}));

export default useMeasurementsStore; 