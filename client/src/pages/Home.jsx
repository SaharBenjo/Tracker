import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, Calendar, Target, Award, LogOut, BarChart3, Settings, Dumbbell, Ruler, List } from 'lucide-react';
import useWorkoutStore from '../store/workoutStore';
import useAuthStore from '../store/authStore';
import useMeasurementsStore from '../store/measurementsStore';
import WorkoutCard from '../components/workout/WorkoutCard';
import Button from '../components/common/Button';

const Home = () => {
  const { 
    workouts, 
    stats, 
    loading, 
    error, 
    fetchWorkouts, 
    fetchStats, 
    fetchTotalWeightLifted, // חדש
    totalWeightLifted, // חדש
    deleteWorkout, 
    markWorkoutCompleted 
  } = useWorkoutStore();
  
  const { user, logout, getExercises, isAuthenticated } = useAuthStore();
  const { fetchGoals, fetchMeasurements, getOverallProgress, measurements, goals } = useMeasurementsStore();
  const navigate = useNavigate();

  const [showCompleted, setShowCompleted] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkouts();
      fetchStats();
      fetchTotalWeightLifted();
      fetchExercises();
      fetchMeasurementsData();
    }
  }, [isAuthenticated, fetchWorkouts, fetchStats, fetchTotalWeightLifted, fetchGoals, fetchMeasurements, getOverallProgress]);

  // עדכון ההתקדמות כאשר הנתונים משתנים
  useEffect(() => {
    if (measurements.length > 0 || Object.keys(goals).length > 0) {
      const progress = getOverallProgress();
      setOverallProgress(progress);
    }
  }, [measurements, goals, getOverallProgress]);

  const fetchMeasurementsData = async () => {
    try {
      await fetchMeasurements(); // טוען את המדידות
      await fetchGoals(); // טוען את המטרות
      const progress = getOverallProgress();
      setOverallProgress(progress);
    } catch (error) {
      console.error('Error fetching measurements data:', error);
      setOverallProgress(0);
    }
  };

  // Function to refresh measurements data (can be called from other components)
  const refreshMeasurementsData = async () => {
    await fetchMeasurementsData();
  };



  const fetchExercises = async () => {
    try {
      const exercisesData = await getExercises();
      setExercises(exercisesData || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setExercises([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את האימון הזה?')) {
      try {
        await deleteWorkout(id);
      } catch (error) {
        console.error('Error deleting workout:', error);
      }
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      await markWorkoutCompleted(id);
    } catch (error) {
      console.error('Error toggling workout completion:', error);
    }
  };

  const filteredWorkouts = showCompleted 
    ? workouts.filter(workout => workout.completed)
    : workouts.filter(workout => !workout.completed);

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

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            מעקב אימוני כושר
          </h1>
          <p className="text-secondary">
            עקב אחרי ההתקדמות שלך וצפה בסטטיסטיקות
          </p>
          {user && (
            <p className="text-sm text-secondary mt-1">
              שלום, {user.firstName} {user.lastName}!
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <Link to="/workout/new">
            <Button variant="primary">
              <Plus size={20} />
              אימון חדש
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="secondary">
              <Settings size={20} />
              הגדרות
            </Button>
          </Link>
          <Button variant="secondary" onClick={logout}>
            <LogOut size={20} />
            התנתק
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
        {/* כרטיס ראשון: סה"כ אימונים */}
        {stats && (
          <div 
            className="card text-center cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/workout-stats')}
            style={{ cursor: 'pointer' }}
          >
            <div className="flex justify-center mb-2">
              <BarChart3 className="text-primary" size={24} />
            </div>
            <div className="text-2xl font-bold text-primary">{stats.totalWorkouts}</div>
            <div className="text-sm text-secondary">סה"כ אימונים</div>
            <div className="text-xs text-primary mt-1">לחץ לצפייה בסטטיסטיקות</div>
          </div>
        )}
        {/* כרטיס שני: סה"כ משקל שהורם */}
        <div 
          className="card text-center cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/breakdown')}
          style={{ cursor: 'pointer' }}
        >
          <div className="flex justify-center mb-2">
            <Dumbbell className="text-accent" size={24} />
          </div>
          <div className="text-2xl font-bold text-accent">{totalWeightLifted.toLocaleString()}</div>
          <div className="text-sm text-secondary">סה"כ משקל שהורם (ק"ג)</div>
          <div className="text-xs text-primary mt-1">לחץ לפירוט לפי שריר</div>
        </div>
        {/* שאר הכרטיסים */}
        {stats && (
          <>
            {/* כרטיס שלישי: היקפים */}
            <div 
              className="card text-center cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/measurements')}
              style={{ cursor: 'pointer' }}
            >
              <div className="flex justify-center mb-2">
                <Ruler className="text-info" size={24} />
              </div>
              <div className="text-2xl font-bold text-info">{overallProgress}%</div>
              <div className="text-sm text-secondary">התקדמות מטרות</div>
              <div className="text-xs text-primary mt-1">לחץ לצפייה בהיקפים</div>
            </div>
            {/* כרטיס רביעי: תרגילים */}
            <div 
              className="card text-center cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/exercises')}
              style={{ cursor: 'pointer' }}
            >
              <div className="flex justify-center mb-2">
                <List className="text-primary" size={24} />
              </div>
              <div className="text-2xl font-bold text-primary">{exercises.length}</div>
              <div className="text-sm text-secondary">תרגילים</div>
              <div className="text-xs text-primary mt-1">לחץ לצפייה בתרגילים</div>
            </div>
            {/* שאר הכרטיסים */}
            <div className="card text-center">
              <div className="flex justify-center mb-2">
                <TrendingUp className="text-accent" size={24} />
              </div>
              <div className="text-2xl font-bold text-accent">
                {stats.avgDuration ? Math.round(stats.avgDuration) : 0}
              </div>
              <div className="text-sm text-secondary">ממוצע דקות לאימון</div>
            </div>
          </>
        )}
      </div>

      {/* אין צורך בלשוניות סינון */}

      {/* Error Message */}
      {error && (
        <div className="card bg-error text-white mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Workouts List */}
    </div>
  );
};

export default Home; 