import React, { useState, useEffect } from 'react';
import useWorkoutStore from '../../store/workoutStore';
import useAuthStore from '../../store/authStore';
import Button from '../common/Button';
import Input from '../common/Input';
import { Plus, ArrowLeft, ArrowRight, X, Trash2, LogOut } from 'lucide-react';
import { Minus } from 'lucide-react';

const workoutTypes = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'fullbody', label: 'FULL BODY' },
];

const muscleGroupsByType = {
  A: [
    { value: 'chest', label: 'חזה' },
    { value: 'shoulders', label: 'כתפיים' },
    { value: 'triceps', label: 'יד אחורית' },
  ],
  B: [
    { value: 'back', label: 'גב' },
    { value: 'biceps', label: 'יד קדמית' },
  ],
  C: [
    { value: 'legs', label: 'רגליים' },
    { value: 'abs', label: 'בטן' },
  ],
  fullbody: [
    { value: 'chest', label: 'חזה' },
    { value: 'shoulders', label: 'כתפיים' },
    { value: 'triceps', label: 'יד אחורית' },
    { value: 'back', label: 'גב' },
    { value: 'biceps', label: 'יד קדמית' },
    { value: 'legs', label: 'רגליים' },
    { value: 'abs', label: 'בטן' },
  ],
};

const initialForm = {
  date: new Date().toISOString().split('T')[0],
  duration: '',
  notes: '',
  exercises: [],
  completed: false
};

// קומפוננטת Modal בסיסית
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
      {/* overlay כהה על כל המסך */}
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-md rtl z-10">
        <button
          className="absolute top-2 left-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
        >
          <span aria-label="סגור">×</span>
        </button>
        {children}
      </div>
    </div>
  );
}

const WorkoutWizard = () => {
  const { createWorkout } = useWorkoutStore();
  const { getExercises, updateExercises } = useAuthStore();
  const [step, setStep] = useState(1);
  const [workoutType, setWorkoutType] = useState('');
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [activeMuscleGroup, setActiveMuscleGroup] = useState(null);
  const [myExercises, setMyExercises] = useState({});
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [saveStatus, setSaveStatus] = useState(null); // הודעת שמירה

  useEffect(() => {
    const fetchMyExercises = async () => {
      setLoadingExercises(true);
      try {
        const exercises = await getExercises();
        setMyExercises(exercises);
      } catch (e) {
        setMyExercises({});
      }
      setLoadingExercises(false);
    };
    fetchMyExercises();
  }, [getExercises]);

  useEffect(() => {
    if (activeMuscleGroup && myExercises[activeMuscleGroup]) {
      setFormData(prev => {
        const existingNames = prev.exercises
          .filter(ex => ex.muscleGroup === activeMuscleGroup)
          .map(ex => ex.name);
        const newExercises = myExercises[activeMuscleGroup]
          .filter(name => !existingNames.includes(name))
          .map(name => ({
            name,
            muscleGroup: activeMuscleGroup,
            sets: [{ weight: 0, reps: 1 }],
            notes: ''
          }));
        return {
          ...prev,
          exercises: [...prev.exercises, ...newExercises]
        };
      });
    }
    // eslint-disable-next-line
  }, [activeMuscleGroup, myExercises]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // --- Validation ---
  const validateStep1 = () => {
    if (!workoutType) {
      setErrors({ workoutType: 'יש לבחור סוג אימון' });
      return false;
    }
    setErrors({});
    return true;
  };
  const validateStep2 = () => {
    setErrors({});
    return true;
  };
  const validateStep3 = () => {
    setErrors({});
    return true;
  };
  const validateStep4 = () => {
    const newErrors = {};
    if (formData.exercises.length === 0) newErrors.exercises = 'יש להוסיף לפחות תרגיל אחד';
    formData.exercises.forEach((ex, i) => {
      if (!ex.name.trim()) newErrors[`ex_${i}_name`] = 'שם התרגיל חובה';
      if (!ex.muscleGroup) newErrors[`ex_${i}_muscle`] = 'קבוצת שרירים חובה';
      if (!ex.sets || ex.sets.length === 0) newErrors[`ex_${i}_sets`] = 'יש להוסיף לפחות סט אחד';
      ex.sets.forEach((set, j) => {
        if (set.weight < 0) newErrors[`ex_${i}_set_${j}_weight`] = 'משקל לא יכול להיות שלילי';
        if (set.reps < 1) newErrors[`ex_${i}_set_${j}_reps`] = 'לפחות חזרה אחת';
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Step Navigation ---
  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };
  const prevStep = () => setStep(step - 1);

  // --- Handlers ---
  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  // --- Muscle Group Selection ---
  const toggleMuscleGroup = (value) => {
    setSelectedMuscleGroups(prev =>
      prev.includes(value)
        ? prev.filter(m => m !== value)
        : [...prev, value]
    );
  };

  const handleMuscleGroupClick = (value) => {
    setActiveMuscleGroup(value);
  };

  // --- Exercise Management ---
  const addExercise = () => setFormData(prev => ({
    ...prev,
    exercises: [...prev.exercises, { name: '', muscleGroup: selectedMuscleGroups[0] || '', sets: [{ weight: 0, reps: 1 }], notes: '' }]
  }));
  const removeExercise = (idx) => setFormData(prev => ({
    ...prev,
    exercises: prev.exercises.filter((_, i) => i !== idx)
  }));
  const updateExercise = (idx, field, value) => setFormData(prev => ({
    ...prev,
    exercises: prev.exercises.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex)
  }));
  const addSet = (exIdx) => setFormData(prev => ({
    ...prev,
    exercises: prev.exercises.map((ex, i) => i === exIdx ? { ...ex, sets: [...ex.sets, { weight: 0, reps: 1 }] } : ex)
  }));
  const removeSet = (exIdx, setIdx) => setFormData(prev => ({
    ...prev,
    exercises: prev.exercises.map((ex, i) => i === exIdx ? { ...ex, sets: ex.sets.filter((_, j) => j !== setIdx) } : ex)
  }));
  const updateSet = (exIdx, setIdx, field, value) => setFormData(prev => ({
    ...prev,
    exercises: prev.exercises.map((ex, i) => i === exIdx ? {
      ...ex,
      sets: ex.sets.map((set, j) => j === setIdx ? { ...set, [field]: value } : set)
    } : ex)
  }));

  // --- Submit ---
  const handleSubmit = async () => {
    setLoading(true);
    setApiError('');
    try {
      await createWorkout({ ...formData, workoutType, muscleGroups: selectedMuscleGroups });
      setSuccess(true);
    } catch (err) {
      setApiError('שגיאה ביצירת האימון');
    } finally {
      setLoading(false);
    }
  };

  // תרגילים נפוצים לכל muscleGroup
  const commonExercises = {
    chest: ['לחיצת חזה', 'פרפר', 'לחיצת חזה בשיפוע', 'פלאיי', 'דחיקת חזה במכונה'],
    back: ['חתירה', 'פול אובר', 'פול דאון', 'חתירה עם מוט', 'פול אפ'],
    shoulders: ['לחיצת כתפיים', 'הרחקת כתפיים', 'חתירה פנים', 'פרפר הפוך'],
    biceps: ['כפיפת מרפקים', 'כפיפת מרפקים עם מוט', 'כפיפת מרפקים עם משקוליות'],
    triceps: ['פשיטת מרפקים', 'לחיצה צרפתית', 'פוש דאון', 'פשיטת מרפקים מאחורי הראש'],
    legs: ['סקוואט', 'לחיצת רגליים', 'פשיטת ברך', 'כפיפת ברך', 'מכרעים'],
    abs: ['כפיפות בטן', 'הרמות רגליים', 'פלאנק', 'גלגל בטן'],
  };

  function handleAddNewExercise() {
    const name = newExerciseName.trim();
    if (!name) return;
    // לא להוסיף אם כבר קיים ברשימת האישיים
    if ((myExercises[activeMuscleGroup] || []).includes(name)) return;
    // עדכון התרגילים האישיים בסטייט
    setMyExercises(prev => ({
      ...prev,
      [activeMuscleGroup]: [...(prev[activeMuscleGroup] || []), name]
    }));
    // הוספה לאימון הנוכחי
    setFormData(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { name, muscleGroup: activeMuscleGroup, sets: [{ weight: 0, reps: 1 }], notes: '' }
      ]
    }));
    setNewExerciseName("");
  }

  // --- Render Steps ---
  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          className="flex items-center text-error hover:underline"
          onClick={() => window.location.href = '/'}
          type="button"
        >
          <LogOut size={20} className="ml-2" />
          יציאה
        </button>
      </div>
      <div className="max-w-2xl mx-auto relative min-h-[60vh]">
        <div className="card p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <div className="text-6xl animate-bounce mb-4">✔️</div>
              <h2 className="text-2xl font-bold mb-2 text-success">האימון נוסף בהצלחה!</h2>
              <div className="text-secondary text-sm">מעבירים אותך לדשבורד...</div>
            </div>
          ) : (
            <>
              <div className="flex items-center mb-6">
                {/* {step > 1 && (
                  <Button variant="secondary" onClick={prevStep} className="ml-4 flex items-center">
                    <ArrowRight size={18} className="ml-2" />
                    חזור
                  </Button>
                )} */}
                <div>
                  <h1 className="text-2xl font-bold text-primary">אימון חדש</h1>
                  <div className="text-secondary text-sm mt-1">שלב {step} מתוך 4</div>
                </div>
              </div>

              {/* Step 1: Workout Type */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-2">בחר סוג אימון</h3>
                  <div className="flex flex-wrap gap-4">
                    {workoutTypes.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        className={`card px-6 py-4 text-xl font-bold border-2 transition ${workoutType === type.value ? 'bg-primary/10' : ''}`}
                        style={{ borderColor: workoutType === type.value ? '#dc2626' : '#D1D5DB' }}
                        onClick={() => {
                          setWorkoutType(type.value);
                          setSelectedMuscleGroups(muscleGroupsByType[type.value]?.map(mg => mg.value) || []);
                          setStep(2);
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = '#fee2e2'; // red-100
                          e.currentTarget.style.borderColor = '#dc2626'; // red-600
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = workoutType === type.value ? 'rgba(220,38,38,0.1)' : '#fff';
                          e.currentTarget.style.borderColor = workoutType === type.value ? '#dc2626' : '#D1D5DB';
                          e.currentTarget.style.color = '';
                        }}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                  {errors.workoutType && <div className="text-error">{errors.workoutType}</div>}
                  <div className="flex justify-end">
                    <Button variant="primary" onClick={nextStep} disabled={!workoutType}>
                      המשך <ArrowLeft size={18} className="inline ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Muscle Groups */}
              {step === 2 && (
                <div className="space-y-6">
                  {!activeMuscleGroup ? (
                    <>
                      <h3 className="text-lg font-semibold mb-2">בחר קבוצות שרירים לאימון</h3>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        {muscleGroupsByType[workoutType]?.map(mg => (
                          <div
                            key={mg.value}
                            className={`card cursor-pointer p-4 flex items-center justify-center text-lg font-bold border-2 ${selectedMuscleGroups.includes(mg.value) ? 'border-primary bg-primary/10' : 'border-gray-300 bg-white'} transition`}
                            onClick={() => {
                              toggleMuscleGroup(mg.value);
                              handleMuscleGroupClick(mg.value);
                            }}
                          >
                            {mg.label}
                          </div>
                        ))}
                      </div>
                      {errors.muscleGroups && <div className="text-error">{errors.muscleGroups}</div>}
                      <div className="flex justify-end gap-4 mt-6">
                        <Button variant="secondary" onClick={prevStep} className="flex items-center">
                          <ArrowRight size={18} className="ml-2" /> חזור
                        </Button>
                        <Button variant="primary" onClick={nextStep}>
                          המשך <ArrowLeft size={18} className="inline ml-2" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="card mt-4 p-4">
                      <div className="text-center text-lg font-bold mb-4">
                        בחר תרגילים ל-{muscleGroupsByType[workoutType]?.find(m => m.value === activeMuscleGroup)?.label}
                      </div>
                      {/* הוספת תרגיל חדש ידני */}
                      <div className="flex gap-2 mb-4">
                        <input
                          type="text"
                          className="input flex-1"
                          placeholder="הוסף תרגיל חדש..."
                          value={newExerciseName}
                          onChange={e => setNewExerciseName(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddNewExercise();
                            }
                          }}
                        />
                        <Button
                          variant="primary"
                          size="small"
                          onClick={handleAddNewExercise}
                          disabled={!newExerciseName.trim()}
                        >
                          הוסף
                        </Button>
                      </div>
                      {/* הצגת התרגילים האישיים */}
                      <div className="mb-2 font-semibold">התרגילים שלי:</div>
                      {loadingExercises ? (
                        <div>טוען תרגילים...</div>
                      ) : (
                        <ul className="mb-4">
                          {(myExercises[activeMuscleGroup] || []).length === 0 ? (
                            <li className="text-secondary">אין תרגילים אישיים לשריר זה</li>
                          ) : (
                            myExercises[activeMuscleGroup].map((ex, i) => {
                              const isSelected = formData.exercises.some(
                                e => e.muscleGroup === activeMuscleGroup && e.name === ex
                              );
                              const exerciseInstances = formData.exercises.filter(e => e.muscleGroup === activeMuscleGroup && e.name === ex);
                              // נניח שיש מופע אחד בלבד לכל תרגיל/קבוצה (אם לא, ניקח את הראשון)
                              const exerciseObj = exerciseInstances[0];
                              // ערכי ברירת מחדל
                              const setsCount = exerciseObj?.sets?.length || 1;
                              const repsCount = exerciseObj?.sets?.[0]?.reps || 1;
                              const weight = exerciseObj?.sets?.[0]?.weight || 0;
                              return (
                                <li key={i} className="flex items-center justify-between mb-2">
                                  <span className="flex-1 font-semibold">{ex}</span>
                                  {isSelected && (
                                    <span className="flex items-center gap-2 ml-2 justify-end">
                                      {/* סטים */}
                                      <select
                                        className="input w-14 text-xs"
                                        value={setsCount}
                                        onChange={e => {
                                          const newSets = Array.from({ length: Number(e.target.value) }, (_, idx) => ({
                                            weight: weight,
                                            reps: repsCount,
                                          }));
                                          setFormData(prev => ({
                                            ...prev,
                                            exercises: prev.exercises.map(exItem =>
                                              exItem === exerciseObj ? { ...exItem, sets: newSets } : exItem
                                            )
                                          }));
                                        }}
                                      >
                                        {[...Array(10)].map((_, idx) => (
                                          <option key={idx + 1} value={idx + 1}>{idx + 1}</option>
                                        ))}
                                      </select>
                                      <span className="mx-1">X</span>
                                      {/* חזרות */}
                                      <select
                                        className="input w-14 text-xs"
                                        value={repsCount}
                                        onChange={e => {
                                          setFormData(prev => ({
                                            ...prev,
                                            exercises: prev.exercises.map(exItem =>
                                              exItem === exerciseObj
                                                ? {
                                                    ...exItem,
                                                    sets: exItem.sets.map(set => ({ ...set, reps: Number(e.target.value) }))
                                                  }
                                                : exItem
                                            )
                                          }));
                                        }}
                                      >
                                        {[...Array(30)].map((_, idx) => (
                                          <option key={idx + 1} value={idx + 1}>{idx + 1}</option>
                                        ))}
                                      </select>
                                      {/* משקל */}
                                      <select
                                        className="input text-xs"
                                        style={{ minWidth: 60, paddingRight: 2, paddingLeft: 2 }}
                                        value={weight}
                                        onChange={e => {
                                          setFormData(prev => ({
                                            ...prev,
                                            exercises: prev.exercises.map(exItem =>
                                              exItem === exerciseObj
                                                ? {
                                                    ...exItem,
                                                    sets: exItem.sets.map(set => ({ ...set, weight: Number(e.target.value) }))
                                                  }
                                                : exItem
                                            )
                                          }));
                                        }}
                                      >
                                        {[...Array(41)].map((_, idx) => (
                                          <option key={idx * 2} value={idx * 2}>{idx * 2}K</option>
                                        ))}
                                      </select>
                                    </span>
                                  )}
                                  {isSelected ? (
                                    <button
                                      className="ml-2 flex items-center justify-center rounded-full text-white transition w-6 h-6"
                                      style={{ minWidth: 24, minHeight: 24, background: '#ef4444' }}
                                      title="הסר"
                                      onMouseOver={e => e.currentTarget.style.background = '#dc2626'}
                                      onMouseOut={e => e.currentTarget.style.background = '#ef4444'}
                                      onClick={() => {
                                        setFormData(prev => ({
                                          ...prev,
                                          exercises: prev.exercises.filter(
                                            e => !(e.muscleGroup === activeMuscleGroup && e.name === ex)
                                          )
                                        }));
                                        setMyExercises(prev => ({
                                          ...prev,
                                          [activeMuscleGroup]: (prev[activeMuscleGroup] || []).filter(name => name !== ex)
                                        }));
                                      }}
                                    >
                                      <Minus size={16} />
                                    </button>
                                  ) : null}
                                </li>
                              );
                            })
                          )}
                        </ul>
                      )}
                      {/* הוספת תרגיל חדש */}
                      <div className="flex gap-2 mt-4">
                        <button
                          className="btn btn-secondary flex-1 order-2"
                          onClick={async () => {
                            setSaveStatus(null);
                            try {
                              await updateExercises(myExercises);
                              setSaveStatus('success');
                            } catch (e) {
                              setSaveStatus('error');
                            }
                            setActiveMuscleGroup(null); // סגור את בחירת התרגילים
                          }}
                        >
                          שמור
                        </button>
                        <button className="btn btn-primary flex-1 order-1" onClick={() => setActiveMuscleGroup(null)}>סגור</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Workout Details */}
              {step === 3 && (
                <div className="space-y-4">
                  <Input
                    label="תאריך"
                    type="date"
                    value={formData.date}
                    onChange={e => handleChange('date', e.target.value)}
                  />
                  <Input
                    label="משך האימון (דקות)"
                    type="number"
                    value={formData.duration}
                    onChange={e => handleChange('duration', e.target.value)}
                    min="0"
                  />
                  <div className="flex justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={prevStep} className="flex items-center">
                      <ArrowRight size={18} className="ml-2" /> חזור
                    </Button>
                    <Button variant="primary" onClick={nextStep}>
                      המשך <ArrowLeft size={18} className="inline ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Summary */}
              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-2">סיכום אימון</h3>
                  <div className="bg-gray-50 rounded p-4">
                    <div><b>סוג אימון:</b> {workoutTypes.find(t => t.value === workoutType)?.label}</div>
                    <div><b>קבוצות שרירים:</b> {selectedMuscleGroups.map(m => muscleGroupsByType[workoutType].find(g => g.value === m)?.label).join(', ')}</div>
                    <div><b>תאריך:</b> {formData.date}</div>
                    <div><b>משך:</b> {formData.duration} דקות</div>
                    <div className="mt-4">
                      <b>תרגילים:</b>
                      <ul className="list-disc pr-6">
                        {(() => {
                          // קיבוץ תרגילים לפי muscleGroup
                          const grouped = {};
                          formData.exercises.forEach(ex => {
                            if (!grouped[ex.muscleGroup]) grouped[ex.muscleGroup] = [];
                            grouped[ex.muscleGroup].push(ex);
                          });
                          // סדר השרירים לפי סדר muscleGroupsByType
                          const muscleOrder = muscleGroupsByType[workoutType].map(m => m.value);
                          return muscleOrder.filter(mg => grouped[mg]).map(mg => (
                            <li key={mg} className="mb-4">
                              <div className="font-bold text-primary mb-2 text-lg">
                                {muscleGroupsByType[workoutType].find(m => m.value === mg)?.label || mg}
                              </div>
                              <ul className="list-disc pr-4">
                                {grouped[mg].map((ex, i) => {
                                  // בדוק אם כל הסטים זהים
                                  const allSetsEqual = ex.sets.every(
                                    set => set.weight === ex.sets[0].weight && set.reps === ex.sets[0].reps
                                  );
                                  return (
                                    <li key={i} className="mb-1">
                                      <b>{ex.name}</b>{' '}
                                      {allSetsEqual ? (
                                        <span className="text-sm">
                                          {ex.sets.length} סטים: {ex.sets[0].reps} חזרות, {ex.sets[0].weight} ק"ג
                                        </span>
                                      ) : (
                                        <ul className="list-decimal pr-4 text-sm">
                                          {ex.sets.map((set, j) => (
                                            <li key={j}>
                                              {set.weight} ק"ג × {set.reps} חזרות
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                      {ex.notes && <div className="text-xs text-secondary mt-1">הערות: {ex.notes}</div>}
                                    </li>
                                  );
                                })}
                              </ul>
                            </li>
                          ));
                        })()}
                      </ul>
                    </div>
                  </div>
                  {apiError && <div className="text-error text-center">{apiError}</div>}
                  <div className="flex justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={prevStep} disabled={loading} className="flex items-center">
                      <ArrowRight size={18} className="inline ml-2" /> חזור
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} loading={loading}>
                      צור אימון
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <style>
{`
  .wizard-type-btn {
    @apply card px-6 py-4 text-xl font-bold border-2 transition border-gray-300 bg-white;
  }
  .wizard-type-btn.selected {
    @apply border-primary bg-primary/10;
  }
  .wizard-type-btn:hover, .wizard-type-btn.selected:hover {
    border-color: #dc2626 !important; /* primary */
    background-color: rgba(220,38,38,0.12) !important; /* primary/10 */
    color: #dc2626 !important;
    cursor: pointer;
  }
`}
</style>
    </>
  );
};

export default WorkoutWizard; 