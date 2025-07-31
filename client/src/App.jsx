import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Home from './pages/Home';
import WorkoutFormPage from './pages/WorkoutForm';
import WorkoutStats from './pages/WorkoutStats';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import Breakdown from './pages/Breakdown';
import Exercises from './pages/Exercises';
import Measurements from './pages/Measurements';

function App() {
  const { isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 App">
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/" 
          element={isAuthenticated ? <Home /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/workout/new" 
          element={isAuthenticated ? <WorkoutFormPage /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/workout/edit/:id" 
          element={isAuthenticated ? <WorkoutFormPage /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/workout-stats" 
          element={isAuthenticated ? <WorkoutStats /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/settings" 
          element={isAuthenticated ? <Settings /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/breakdown" 
          element={isAuthenticated ? <Breakdown /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/exercises" 
          element={isAuthenticated ? <Exercises /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/measurements" 
          element={isAuthenticated ? <Measurements /> : <Navigate to="/auth" replace />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App; 