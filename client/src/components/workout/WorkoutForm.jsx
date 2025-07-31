import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import useWorkoutStore from '../../store/workoutStore';

const WorkoutForm = ({ workout, onSubmit, onCancel }) => {
  const getLastWeight = useWorkoutStore(state => state.getLastWeight);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: '',
    notes: '',
    exercises: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (workout) {
      setFormData({
        date: workout.date ? new Date(workout.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        duration: workout.duration || '',
        notes: workout.notes || '',
        exercises: workout.exercises || []
      });
    }
  }, [workout]);

  const validateForm = () => {
    const newErrors = {};

    if (formData.exercises.length > 0) {
      formData.exercises.forEach((exercise, exerciseIndex) => {
        if (!exercise.name.trim()) {
          newErrors[`exercise_${exerciseIndex}_name`] = 'שם התרגיל הוא שדה חובה';
        }

        if (!exercise.muscleGroup) {
          newErrors[`exercise_${exerciseIndex}_muscleGroup`] = 'קבוצת שרירים היא שדה חובה';
        }

        if (exercise.sets.length === 0) {
          newErrors[`exercise_${exerciseIndex}_sets`] = 'חובה להוסיף לפחות סט אחד';
        }

        exercise.sets.forEach((set, setIndex) => {
          if (set.weight < 0) {
            newErrors[`exercise_${exerciseIndex}_set_${setIndex}_weight`] = 'משקל לא יכול להיות שלילי';
          }
          if (set.reps < 1) {
            newErrors[`exercise_${exerciseIndex}_set_${setIndex}_reps`] = 'חובה לפחות חזרה אחת';
          }
        });
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const addExercise = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, {
        name: '',
        muscleGroup: '',
        sets: [{ weight: 0, reps: 1 }],
        notes: ''
      }]
    }));
  };

  const removeExercise = (exerciseIndex) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, index) => index !== exerciseIndex)
    }));
  };

  const updateExercise = (exerciseIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, index) => 
        index === exerciseIndex ? { ...exercise, [field]: value } : exercise
      )
    }));
  };

  const addSet = (exerciseIndex) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, index) => {
        if (index === exerciseIndex) {
          let defaultWeight = 0;
          if (exercise.name && exercise.muscleGroup) {
            const lastWeight = getLastWeight(exercise.name, exercise.muscleGroup);
            if (lastWeight !== null && lastWeight !== undefined) {
              defaultWeight = lastWeight;
            }
          }
          return {
            ...exercise,
            sets: [...exercise.sets, { weight: defaultWeight, reps: 1 }]
          };
        }
        return exercise;
      })
    }));
  };

  const removeSet = (exerciseIndex, setIndex) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, index) => 
        index === exerciseIndex 
          ? { ...exercise, sets: exercise.sets.filter((_, setIdx) => setIdx !== setIndex) }
          : exercise
      )
    }));
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, index) => 
        index === exerciseIndex 
          ? {
              ...exercise,
              sets: exercise.sets.map((set, setIdx) => 
                setIdx === setIndex ? { ...set, [field]: value } : set
              )
            }
          : exercise
      )
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="תאריך"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="משך האימון (דקות)"
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
          placeholder="60"
          min="0"
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="completed"
            checked={formData.completed}
            onChange={(e) => setFormData(prev => ({ ...prev, completed: e.target.checked }))}
            className="w-4 h-4"
          />
          <label htmlFor="completed" className="form-label mb-0">
            האימון הושלם
          </label>
        </div>
      </div>

      <Input
        label="הערות"
        value={formData.notes}
        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
        placeholder="הערות על האימון..."
      />

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">תרגילים</h3>
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={addExercise}
          >
            <Plus size={16} />
            הוסף תרגיל
          </Button>
        </div>

        {formData.exercises.map((exercise, exerciseIndex) => (
          <div key={exerciseIndex} className="card mb-4">
            <div className="flex justify-between items-center mb-4">
              <Input
                label="שם התרגיל"
                value={exercise.name}
                onChange={(e) => updateExercise(exerciseIndex, 'name', e.target.value)}
                placeholder="למשל: לחיצת חזה"
                error={errors[`exercise_${exerciseIndex}_name`]}
                className="flex-1 mr-4"
              />
              <select
                className="input ml-4"
                value={exercise.muscleGroup || ''}
                onChange={e => updateExercise(exerciseIndex, 'muscleGroup', e.target.value)}
                required
              >
                <option value="">בחר קבוצת שרירים</option>
                <option value="chest">חזה</option>
                <option value="back">גב</option>
                <option value="shoulders">כתפיים</option>
                <option value="biceps">יד קידמית</option>
                <option value="triceps">יד אחורית</option>
                <option value="legs">רגליים</option>
                <option value="abs">בטן</option>
              </select>
              <Button
                type="button"
                variant="error"
                size="small"
                onClick={() => removeExercise(exerciseIndex)}
              >
                <Trash2 size={16} />
              </Button>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">סטים</h4>
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={() => addSet(exerciseIndex)}
                >
                  <Plus size={16} />
                  הוסף סט
                </Button>
              </div>

              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="grid grid-cols-4 gap-2 mb-2">
                  <Input
                    label={'משקל (ק"ג)'}
                    type="number"
                    value={set.weight}
                    onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                    error={errors[`exercise_${exerciseIndex}_set_${setIndex}_weight`]}
                    min="0"
                    step="0.5"
                  />
                  <Input
                    label="חזרות"
                    type="number"
                    value={set.reps}
                    onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 1)}
                    error={errors[`exercise_${exerciseIndex}_set_${setIndex}_reps`]}
                    min="1"
                  />
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="error"
                      size="small"
                      onClick={() => removeSet(exerciseIndex, setIndex)}
                      disabled={exercise.sets.length === 1}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Input
              label="הערות לתרגיל"
              value={exercise.notes}
              onChange={(e) => updateExercise(exerciseIndex, 'notes', e.target.value)}
              placeholder="הערות על התרגיל..."
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          ביטול
        </Button>
        <Button
          type="submit"
          variant="primary"
        >
          {workout ? 'עדכן אימון' : 'צור אימון'}
        </Button>
      </div>
    </form>
  );
};

export default WorkoutForm; 