import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useWorkoutStore from '../store/workoutStore';
import WorkoutWizard from '../components/workout/WorkoutWizard';
import Button from '../components/common/Button';

const WorkoutFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentWorkout, 
    loading, 
    error, 
    fetchWorkoutById, 
    createWorkout, 
    updateWorkout,
    clearCurrentWorkout 
  } = useWorkoutStore();

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      fetchWorkoutById(id);
    }
    
    return () => {
      clearCurrentWorkout();
    };
  }, [id, isEditing, fetchWorkoutById, clearCurrentWorkout]);

  const handleSubmit = async (formData) => {
    try {
      if (isEditing) {
        await updateWorkout(id, formData);
      } else {
        await createWorkout(formData);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-secondary">טוען...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="card bg-error text-white">
          <p>{error}</p>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/')}
            className="mt-4"
          >
            חזור לדף הבית
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <WorkoutWizard />
    </div>
  );
};

export default WorkoutFormPage; 