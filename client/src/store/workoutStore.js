import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = '/api/workouts';

const useWorkoutStore = create((set, get) => ({
  // State
  workouts: [],
  currentWorkout: null,
  loading: false,
  error: null,
  stats: null,
  totalWeightLifted: 0,
  weightByMuscleGroup: [],

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all workouts
  fetchWorkouts: async () => {
    try {
      set({ loading: true, error: null });
      
      // Ensure token is set
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.get(API_BASE_URL);
      set({ workouts: response.data.data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'שגיאה בטעינת האימונים', 
        loading: false 
      });
    }
  },

  // Fetch workout by ID
  fetchWorkoutById: async (id) => {
    try {
      set({ loading: true, error: null });
      
      // Ensure token is set
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      set({ currentWorkout: response.data.data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'שגיאה בטעינת האימון', 
        loading: false 
      });
    }
  },

  // Create new workout
  createWorkout: async (workoutData) => {
    try {
      set({ loading: true, error: null });
      
      // Ensure token is set
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.post(API_BASE_URL, workoutData);
      const newWorkout = response.data.data;
      set(state => ({
        workouts: [newWorkout, ...state.workouts],
        loading: false
      }));
      return newWorkout;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'שגיאה ביצירת האימון', 
        loading: false 
      });
      throw error;
    }
  },

  // Update workout
  updateWorkout: async (id, updateData) => {
    try {
      set({ loading: true, error: null });
      
      // Ensure token is set
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.put(`${API_BASE_URL}/${id}`, updateData);
      const updatedWorkout = response.data.data;
      set(state => ({
        workouts: state.workouts.map(workout => 
          workout._id === id ? updatedWorkout : workout
        ),
        currentWorkout: state.currentWorkout?._id === id ? updatedWorkout : state.currentWorkout,
        loading: false
      }));
      return updatedWorkout;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'שגיאה בעדכון האימון', 
        loading: false 
      });
      throw error;
    }
  },

  // Delete workout
  deleteWorkout: async (id) => {
    try {
      set({ loading: true, error: null });
      
      // Ensure token is set
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      await axios.delete(`${API_BASE_URL}/${id}`);
      set(state => ({
        workouts: state.workouts.filter(workout => workout._id !== id),
        currentWorkout: state.currentWorkout?._id === id ? null : state.currentWorkout,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'שגיאה במחיקת האימון', 
        loading: false 
      });
      throw error;
    }
  },

  // Fetch workout statistics
  fetchStats: async () => {
    try {
      set({ loading: true, error: null });
      
      // Ensure token is set
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.get(`${API_BASE_URL}/stats`);
      set({ stats: response.data.data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'שגיאה בטעינת הסטטיסטיקות', 
        loading: false 
      });
    }
  },

  // Fetch workouts by date range
  fetchWorkoutsByDateRange: async (startDate, endDate) => {
    try {
      set({ loading: true, error: null });
      
      // Ensure token is set
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.get(`${API_BASE_URL}/range`, {
        params: { startDate, endDate }
      });
      set({ workouts: response.data.data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'שגיאה בטעינת האימונים', 
        loading: false 
      });
    }
  },

  // Clear current workout
  clearCurrentWorkout: () => set({ currentWorkout: null }),

  // Get workout by ID from local state
  getWorkoutById: (id) => {
    const { workouts } = get();
    return workouts.find(workout => workout._id === id);
  },

  // Get last used weight for a given exercise name and muscleGroup
  getLastWeight: (exerciseName, muscleGroup) => {
    const { workouts } = get();
    // Go through workouts from newest to oldest
    for (const workout of workouts) {
      if (workout.exercises && Array.isArray(workout.exercises)) {
        for (const exercise of workout.exercises) {
          if (
            exercise.name === exerciseName &&
            exercise.muscleGroup === muscleGroup &&
            exercise.sets && exercise.sets.length > 0
          ) {
            // Return the weight of the last set in this exercise
            return exercise.sets[exercise.sets.length - 1].weight;
          }
        }
      }
    }
    return null;
  },

  // Fetch total weight lifted
  fetchTotalWeightLifted: async () => {
    try {
      set({ loading: true, error: null });
      
      // Ensure token is set
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.get(`${API_BASE_URL}/total-weight`);
      set({ totalWeightLifted: response.data.totalWeightLifted, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'שגיאה בטעינת המשקל הכולל',
        loading: false
      });
    }
  },

  // Fetch weight by muscle group
  fetchWeightByMuscleGroup: async () => {
    try {
      set({ loading: true, error: null });
      
      // Ensure token is set
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.get(`${API_BASE_URL}/breakdown-by-muscle`);
      set({ weightByMuscleGroup: response.data.breakdown, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'שגיאה בטעינת פירוט לפי שריר',
        loading: false
      });
    }
  }
}));

export default useWorkoutStore; 