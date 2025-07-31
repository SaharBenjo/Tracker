import React from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Calendar, Clock, CheckCircle, Circle, Edit, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import { Link, useNavigate } from 'react-router-dom';

const WorkoutCard = ({ workout, onEdit, onDelete, onToggleComplete }) => {
  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: he });
  };

  const formatTime = (date) => {
    return format(new Date(date), 'HH:mm', { locale: he });
  };

  const getTotalSets = () => {
    return workout.exercises.reduce((total, exercise) => {
      return total + exercise.sets.length;
    }, 0);
  };

  const getTotalVolume = () => {
    return workout.exercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((exerciseTotal, set) => {
        return exerciseTotal + (set.weight * set.reps);
      }, 0);
    }, 0);
  };

  const navigate = useNavigate();

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-primary mb-2">
            {workout.name}
          </h3>
          <div className="flex items-center gap-4 text-secondary text-sm">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              {formatDate(workout.date)}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              {formatTime(workout.date)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div
          className="text-center p-3 bg-secondary rounded cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/exercises')}
          style={{ userSelect: 'none' }}
        >
          <div className="text-2xl font-bold text-primary">{workout.exercises.length}</div>
          <div className="text-sm text-secondary">תרגילים</div>
          <div className="text-xs text-primary mt-1">לחץ לצפייה בתרגילים</div>
        </div>
        <div className="text-center p-3 bg-secondary rounded">
          <div className="text-2xl font-bold text-primary">{getTotalSets()}</div>
          <div className="text-sm text-secondary">סטים</div>
        </div>
      </div>

      {workout.exercises.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">תרגילים:</h4>
          <Link to="/workout-stats" className="block hover:bg-primary/10 rounded transition p-2">
            <div className="space-y-2">
              {workout.exercises.slice(0, 3).map((exercise, index) => (
                <div key={index} className="text-sm text-secondary cursor-pointer">
                  • {exercise.name} - {exercise.sets.length} סטים
                </div>
              ))}
              {workout.exercises.length > 3 && (
                <div className="text-sm text-secondary">
                  +{workout.exercises.length - 3} תרגילים נוספים
                </div>
              )}
            </div>
          </Link>
        </div>
      )}

      {workout.duration && (
        <div className="mb-4">
          <div className="text-sm text-secondary">
            משך האימון: {workout.duration} דקות
          </div>
        </div>
      )}

      {workout.notes && (
        <div className="mb-4">
          <div className="text-sm text-secondary bg-secondary p-2 rounded">
            {workout.notes}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-sm text-secondary">
          נפח כולל: {getTotalVolume().toLocaleString()} ק"ג
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="small"
            onClick={() => onEdit(workout)}
          >
            <Edit size={16} />
            ערוך
          </Button>
          <Button
            variant="error"
            size="small"
            onClick={() => onDelete(workout._id)}
          >
            <Trash2 size={16} />
            מחק
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard; 