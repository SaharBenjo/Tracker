import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { Dumbbell, Layers, Users, ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const muscleNames = {
  chest: 'חזה',
  back: 'גב',
  shoulders: 'כתפיים',
  biceps: 'יד קדמית',
  triceps: 'יד אחורית',
  legs: 'רגליים',
  abs: 'בטן',
};

const workoutLabels = {
  a: 'A',
  b: 'B',
  c: 'C',
  fullbody: 'FULL BODY',
};

const workoutLabelNames = {
  a: 'אימון A',
  b: 'אימון B',
  c: 'אימון C',
  fullbody: 'Full Body',
};

const Exercises = () => {
  const { user, getExercises, updateExercises, loading, error, clearError } = useAuthStore();
  const workoutSettings = user?.workoutSettings;
  const navigate = useNavigate();

  // קביעת חלקי האימון לפי התוכנית
  let workoutParts = [];
  if (workoutSettings?.workoutPlan === 'abc') {
    workoutParts = ['a', 'b', 'c'];
  } else if (workoutSettings?.workoutPlan === 'ab') {
    workoutParts = ['a', 'b'];
  } else if (workoutSettings?.workoutPlan === 'fullbody') {
    workoutParts = ['fullbody']; // שימוש ב-fullbody במקום a
  }

  const [selectedPart, setSelectedPart] = useState(workoutParts[0] || null);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [userExercises, setUserExercises] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // קבוצות השרירים לחלק שנבחר
  const musclesForPart = selectedPart && workoutSettings?.muscleGroups[selectedPart] ? workoutSettings.muscleGroups[selectedPart] : [];

  // מאגר תרגילים נפוצים לכל שריר
  const commonExercises = {
    chest: ['לחיצת חזה', 'פרפר', 'לחיצת חזה בשיפוע', 'פלאיי', 'דחיקת חזה במכונה'],
    back: ['חתירה', 'פול אובר', 'פול דאון', 'חתירה עם מוט', 'פול אפ'],
    shoulders: ['לחיצת כתפיים', 'הרחקת כתפיים', 'חתירה פנים', 'פרפר הפוך'],
    biceps: ['כפיפת מרפקים', 'כפיפת מרפקים עם מוט', 'כפיפת מרפקים עם משקוליות'],
    triceps: ['פשיטת מרפקים', 'לחיצה צרפתית', 'פוש דאון', 'פשיטת מרפקים מאחורי הראש'],
    legs: ['סקוואט', 'לחיצת רגליים', 'פשיטת ברך', 'כפיפת ברך', 'מכרעים'],
    abs: ['כפיפות בטן', 'הרמות רגליים', 'פלאנק', 'גלגל בטן'],
  };

  // טעינת התרגילים מהשרת
  useEffect(() => {
    const loadExercises = async () => {
      try {
        const exercises = await getExercises();
        setUserExercises(exercises);
      } catch (error) {
        console.error('Error loading exercises:', error);
      }
    };

    if (user) {
      loadExercises();
    }
  }, [user, getExercises]);

  const exercisesForMuscle = userExercises[selectedMuscle] || [];

  // הוספת תרגיל אישי
  const handleAddExercise = (exercise) => {
    setUserExercises((prev) => ({
      ...prev,
      [selectedMuscle]: [...(prev[selectedMuscle] || []), exercise],
    }));
    setHasChanges(true);
  };

  // הסרת תרגיל אישי
  const handleRemoveExercise = (exercise) => {
    setUserExercises((prev) => ({
      ...prev,
      [selectedMuscle]: (prev[selectedMuscle] || []).filter((ex) => ex !== exercise),
    }));
    setHasChanges(true);
  };

  // שמירת התרגילים לשרת
  const handleSaveExercises = async () => {
    try {
      clearError();
      await updateExercises(userExercises);
      setHasChanges(false);
      alert('התרגילים נשמרו בהצלחה!');
    } catch (error) {
      console.error('Error saving exercises:', error);
    }
  };

  return (
    
    <div className="container mx-auto p-6">
      {/* Header: כותרת וכפתור חזרה */}
      <div className="flex justify-between items-center mb-8 w-full">
        <div className="flex items-center gap-2">
          <Dumbbell className="text-accent" size={32} />
          <h1 className="text-3xl font-bold text-primary mb-0">דף התרגילים</h1>
        </div>
        <button
          className="btn btn-secondary flex items-center gap-2 text-lg font-bold"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={20} />
          חזרה
        </button>
      </div>

      {/* Error Message */}
      {error && Object.keys(userExercises).length === 0 && (
        <div className="card bg-error text-white mb-6">
          <p className="text-center">{error}</p>
        </div>
      )}

      <p className="text-secondary text-center mb-8 text-lg">בחר חלק אימון וקבוצת שרירים כדי לראות תרגילים</p>
      <>
        {/* שלב 1: חלקי האימון */}
        <div className="card bg-white shadow-lg rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="text-primary" size={22} />
            <h2 className="text-xl font-bold text-primary">בחר חלק אימון</h2>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {workoutParts.map((part) => (
              <button
                key={part}
                type="button"
                className={`card px-6 py-4 text-xl font-bold border-2 transition rounded-xl flex flex-col items-center justify-center min-w-[90px] min-h-[90px] md:min-w-[110px] md:min-h-[110px] shadow-sm
                  ${selectedPart === part ? 'bg-primary/10' : 'bg-white'}
                `}
                style={{
                  borderColor: selectedPart === part ? '#dc2626' : '#D1D5DB',
                  color: '#fff',
                  boxShadow: 'none', // תמיד ללא זוהר
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setSelectedPart(part);
                  setSelectedMuscle(null);
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#fee2e2'; // red-100
                  e.currentTarget.style.borderColor = '#dc2626'; // red-600
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = selectedPart === part ? 'rgba(220,38,38,0.1)' : '#fff';
                  e.currentTarget.style.borderColor = selectedPart === part ? '#dc2626' : '#D1D5DB';
                  e.currentTarget.style.color = '#fff';
                }}
              >
                {workoutLabels[part] || part.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* שלב 2: קבוצות שרירים */}
        {selectedPart && (
          <div className="card bg-white shadow-lg rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-primary" size={22} />
              <h2 className="text-xl font-bold text-primary">בחר קבוצת שרירים</h2>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {musclesForPart.map((muscle) => (
                <button
                  key={muscle}
                  type="button"
                  className={`card px-6 py-4 text-lg font-bold border-2 transition rounded-xl flex flex-col items-center justify-center min-w-[90px] min-h-[90px] md:min-w-[110px] md:min-h-[110px] shadow-sm
                    ${selectedMuscle === muscle ? 'bg-primary/10' : 'bg-white'}
                  `}
                  style={{
                    borderColor: selectedMuscle === muscle ? '#dc2626' : '#D1D5DB',
                    color: '#fff',
                    boxShadow: 'none', // תמיד ללא זוהר
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedMuscle(muscle)}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#fee2e2'; // red-100
                    e.currentTarget.style.borderColor = '#dc2626'; // red-600
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = selectedMuscle === muscle ? 'rgba(220,38,38,0.1)' : '#fff';
                    e.currentTarget.style.borderColor = selectedMuscle === muscle ? '#dc2626' : '#D1D5DB';
                    e.currentTarget.style.color = '#fff';
                  }}
                >
                  {muscleNames[muscle] || muscle}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* שלב 3: הצגת תרגילים */}
        {selectedMuscle && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* כרטיס: התרגילים האישיים */}
            <div className="card text-center hover:shadow-lg transition-shadow w-full">
              <div className="flex flex-col items-center gap-2 mb-4">
                <Dumbbell className="text-accent mx-auto" size={22} />
                <h2 className="text-lg font-bold text-primary mt-2">התרגילים שלך ל{muscleNames[selectedMuscle] || selectedMuscle}</h2>
              </div>
              {exercisesForMuscle.length === 0 ? (
                <p className="text-secondary text-center">אין תרגילים אישיים לשריר זה</p>
              ) : (
                <ul>
                  {exercisesForMuscle.map((ex, idx) => (
                    <li key={idx} className="bg-gray-100 rounded px-3 py-2 text-primary font-semibold flex items-center justify-between mb-2">
                      <span className="text-primary font-semibold">{ex}</span>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.85rem', padding: '0.3rem 0.8rem' }}
                        onClick={() => handleRemoveExercise(ex)}
                      >
                        הסר
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* כרטיס: מאגר תרגילים */}
            <div className="card text-center hover:shadow-lg transition-shadow w-full">
              <div className="flex flex-col items-center gap-2 mb-4">
                <Dumbbell className="text-primary mx-auto" size={22} />
                <h2 className="text-lg font-bold text-primary mt-2">מאגר תרגילים ל{muscleNames[selectedMuscle] || selectedMuscle}</h2>
              </div>
              <ul>
                {(commonExercises[selectedMuscle] || [])
                  .filter((ex) => !exercisesForMuscle.includes(ex))
                  .map((ex, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 mb-2">
                      <span className="text-primary font-medium">{ex}</span>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.85rem', padding: '0.3rem 0.8rem' }}
                        onClick={() => handleAddExercise(ex)}
                      >
                        הוסף
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </>
      
      {/* Save Button - Bottom of page */}
      <div className="mt-8 flex justify-center">
        <Button
          variant={hasChanges ? "primary" : "secondary"}
          onClick={handleSaveExercises}
          loading={loading}
          disabled={!hasChanges}
          className="flex items-center gap-2 px-8 py-3 text-lg"
        >
          <Save size={20} />
          שמור תרגילים
        </Button>
      </div>
    </div>
  );
};

export default Exercises; 