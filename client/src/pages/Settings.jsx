import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, Save, Eye, EyeOff, Dumbbell } from 'lucide-react';
import useAuthStore from '../store/authStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ThemeToggle from '../components/common/ThemeToggle';

const Settings = () => {
  const { user, updateProfile, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [workoutSettings, setWorkoutSettings] = useState({
    workoutType: 'home',
    workoutPlan: 'abc',
    muscleGroups: {
      a: ['chest', 'triceps', 'shoulders'],
      b: ['back', 'biceps'],
      c: ['legs', 'abs']
    }
  });
  
  const [originalData, setOriginalData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  
  const [originalWorkoutSettings, setOriginalWorkoutSettings] = useState({
    workoutType: 'home',
    workoutPlan: 'abc',
    muscleGroups: {
      a: ['chest', 'triceps', 'shoulders'],
      b: ['back', 'biceps'],
      c: ['legs', 'abs']
    }
  });
  
  const [errors, setErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWorkoutsOpen, setIsWorkoutsOpen] = useState(false);
  const [isEditingMuscles, setIsEditingMuscles] = useState(false);

  useEffect(() => {
    if (user) {
      const userData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      };
      
      setFormData(prev => ({
        ...prev,
        ...userData
      }));
      
      setOriginalData(userData);
      
      if (user.workoutSettings) {
        setWorkoutSettings(user.workoutSettings);
        setOriginalWorkoutSettings(user.workoutSettings);
      }
    }
  }, [user]);

  const hasChanges = () => {
    const profileChanged = 
      formData.firstName !== originalData.firstName ||
      formData.lastName !== originalData.lastName ||
      formData.email !== originalData.email;
    
    const passwordChanged = 
      isEditingPassword && 
      (formData.currentPassword || formData.newPassword || formData.confirmPassword);
    
    const workoutSettingsChanged = 
      workoutSettings.workoutType !== originalWorkoutSettings.workoutType ||
      workoutSettings.workoutPlan !== originalWorkoutSettings.workoutPlan ||
      JSON.stringify(workoutSettings.muscleGroups) !== JSON.stringify(originalWorkoutSettings.muscleGroups);
    
    return profileChanged || passwordChanged || workoutSettingsChanged;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'שם פרטי הוא שדה חובה';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'שם משפחה הוא שדה חובה';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'כתובת האימייל היא שדה חובה';
    } else if (!formData.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }

    if (isEditingPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'הסיסמה הנוכחית היא שדה חובה';
      }

      if (!formData.newPassword) {
        newErrors.newPassword = 'הסיסמה החדשה היא שדה חובה';
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'הסיסמה החדשה חייבת להיות לפחות 6 תווים';
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'הסיסמאות החדשות אינן תואמות';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (validateForm()) {
      try {
        const updatedWorkoutSettings = {
          ...workoutSettings,
          muscleGroups: {
            ...workoutSettings.muscleGroups
          }
        };

        if (workoutSettings.workoutPlan === 'abc') {
          updatedWorkoutSettings.muscleGroups = {
            a: workoutSettings.muscleGroups.a || [],
            b: workoutSettings.muscleGroups.b || [],
            c: workoutSettings.muscleGroups.c || [],
            fullbody: []
          };
        } else if (workoutSettings.workoutPlan === 'ab') {
          updatedWorkoutSettings.muscleGroups = {
            a: workoutSettings.muscleGroups.a || [],
            b: workoutSettings.muscleGroups.b || [],
            c: [],
            fullbody: []
          };
        } else if (workoutSettings.workoutPlan === 'fullbody') {
          updatedWorkoutSettings.muscleGroups = {
            a: [],
            b: [],
            c: [],
            fullbody: workoutSettings.muscleGroups.fullbody || []
          };
        }

        const updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          workoutSettings: updatedWorkoutSettings
        };

        if (isEditingPassword) {
          updateData.currentPassword = formData.currentPassword;
          updateData.newPassword = formData.newPassword;
        }

        await updateProfile(updateData);
        
        setOriginalData({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        });
        
        setOriginalWorkoutSettings(updatedWorkoutSettings);
        setWorkoutSettings(updatedWorkoutSettings);
        
        if (isEditingPassword) {
          setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }));
          setIsEditingPassword(false);
        }
        
        alert('הפרופיל עודכן בהצלחה!');
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const handleCancelPasswordEdit = () => {
    setIsEditingPassword(false);
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    setErrors(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const handleWorkoutPlanChange = (newPlan) => {
    setWorkoutSettings(prev => {
      const updatedSettings = { ...prev, workoutPlan: newPlan };
      
      if (newPlan === 'abc') {
        updatedSettings.muscleGroups = {
          a: prev.muscleGroups.a || [],
          b: prev.muscleGroups.b || [],
          c: prev.muscleGroups.c || [],
          fullbody: []
        };
      } else if (newPlan === 'ab') {
        updatedSettings.muscleGroups = {
          a: prev.muscleGroups.a || [],
          b: prev.muscleGroups.b || [],
          c: [],
          fullbody: []
        };
      } else if (newPlan === 'fullbody') {
        updatedSettings.muscleGroups = {
          a: [],
          b: [],
          c: [],
          fullbody: prev.muscleGroups.fullbody || []
        };
      }
      
      return updatedSettings;
    });
  };

  const handleDragStart = (e, muscle, sourceWorkout) => {
    e.dataTransfer.setData('muscle', muscle);
    e.dataTransfer.setData('sourceWorkout', sourceWorkout);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetWorkout) => {
    e.preventDefault();
    const muscle = e.dataTransfer.getData('muscle');
    const sourceWorkout = e.dataTransfer.getData('sourceWorkout');
    
    if (sourceWorkout === targetWorkout) return;
    
    setWorkoutSettings(prev => {
      const newMuscleGroups = { ...prev.muscleGroups };
      
      if (newMuscleGroups[sourceWorkout]) {
        newMuscleGroups[sourceWorkout] = newMuscleGroups[sourceWorkout].filter(m => m !== muscle);
      }
      
      if (!newMuscleGroups[targetWorkout]) {
        newMuscleGroups[targetWorkout] = [];
      }
      
      if (!newMuscleGroups[targetWorkout].includes(muscle)) {
        newMuscleGroups[targetWorkout].push(muscle);
      }
      
      return {
        ...prev,
        muscleGroups: newMuscleGroups
      };
    });
  };

  const addMuscleToWorkout = (workoutKey, muscle) => {
    setWorkoutSettings(prev => {
      const newMuscleGroups = { ...prev.muscleGroups };
      
      if (!newMuscleGroups[workoutKey]) {
        newMuscleGroups[workoutKey] = [];
      }
      
      if (!newMuscleGroups[workoutKey].includes(muscle)) {
        newMuscleGroups[workoutKey] = [...newMuscleGroups[workoutKey], muscle];
      }
      
      return {
        ...prev,
        muscleGroups: newMuscleGroups
      };
    });
  };

  const removeMuscleFromWorkout = (workoutKey, muscle) => {
    setWorkoutSettings(prev => {
      const newMuscleGroups = { ...prev.muscleGroups };
      
      if (newMuscleGroups[workoutKey]) {
        newMuscleGroups[workoutKey] = newMuscleGroups[workoutKey].filter(m => m !== muscle);
      }
      
      return {
        ...prev,
        muscleGroups: newMuscleGroups
      };
    });
  };

  const getAllAvailableMuscles = () => {
    return ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'abs'];
  };

  const getAvailableMusclesForWorkout = (workoutKey) => {
    const allMuscles = getAllAvailableMuscles();
    const currentMuscles = workoutSettings.muscleGroups[workoutKey] || [];
    return allMuscles.filter(muscle => !currentMuscles.includes(muscle));
  };

  const getMuscleDisplayName = (muscle) => {
    const muscleNames = {
      'chest': 'חזה',
      'back': 'גב',
      'shoulders': 'כתפיים',
      'biceps': 'יד קידמית',
      'triceps': 'יד אחורית',
      'legs': 'רגליים',
      'abs': 'בטן'
    };
    return muscleNames[muscle] || muscle;
  };

  return (
    <div className="container mx-auto p-6">
      <ThemeToggle />
      {/* Header */}
      <div className="page-header">
        <button
          onClick={() => navigate('/')}
          className="back-button"
        >
          <ArrowLeft size={20} />
          חזרה
        </button>
        <div className="page-title">
          <h1 className="text-3xl font-bold text-primary mb-2">
            הגדרות
          </h1>
          <p className="text-secondary">
            ערוך את פרטי הפרופיל שלך
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="card bg-error text-white mb-6">
          <p className="text-center">{error}</p>
        </div>
      )}

      {/* Workouts Settings Card */}
      <div className="card">
        {/* Workouts Accordion Header */}
        <div
          className="flex items-center justify-between cursor-pointer select-none mb-4"
          onClick={() => setIsWorkoutsOpen((prev) => !prev)}
          style={{ userSelect: 'none' }}
        >
          <div className="flex items-center">
            <Dumbbell size={20} className="ml-2" />
            <span className="text-xl font-bold text-primary">אימונים</span>
          </div>
          <svg
            className={"transition-transform duration-200" + (isWorkoutsOpen ? " rotate-180" : "")}
            width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 8L10 12L14 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {/* Workouts Accordion Content */}
        {isWorkoutsOpen && (
          <div className="space-y-6">
            {/* Workout Type Selection */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">סוג אימון</h3>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setWorkoutSettings(prev => ({ ...prev, workoutType: 'home' }))}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '12px',
                    backgroundColor: workoutSettings.workoutType === 'home' ? '#dc2626' : '#374151',
                    color: workoutSettings.workoutType === 'home' ? 'white' : '#d1d5db',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ביתי
                </button>
                
                <button
                  type="button"
                  onClick={() => setWorkoutSettings(prev => ({ ...prev, workoutType: 'gym' }))}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '12px',
                    backgroundColor: workoutSettings.workoutType === 'gym' ? '#dc2626' : '#374151',
                    color: workoutSettings.workoutType === 'gym' ? 'white' : '#d1d5db',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  מכון
                </button>
                
                <button
                  type="button"
                  onClick={() => setWorkoutSettings(prev => ({ ...prev, workoutType: 'other' }))}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '12px',
                    backgroundColor: workoutSettings.workoutType === 'other' ? '#dc2626' : '#374151',
                    color: workoutSettings.workoutType === 'other' ? 'white' : '#d1d5db',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  אחר
                </button>
              </div>
            </div>

            {/* Workout Plan Selection */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">תוכנית אימונים</h3>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleWorkoutPlanChange('abc')}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '12px',
                    backgroundColor: workoutSettings.workoutPlan === 'abc' ? '#dc2626' : '#374151',
                    color: workoutSettings.workoutPlan === 'abc' ? 'white' : '#d1d5db',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <div>ABC</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>3 ימים</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleWorkoutPlanChange('ab')}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '12px',
                    backgroundColor: workoutSettings.workoutPlan === 'ab' ? '#dc2626' : '#374151',
                    color: workoutSettings.workoutPlan === 'ab' ? 'white' : '#d1d5db',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <div>AB</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>2 ימים</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleWorkoutPlanChange('fullbody')}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '12px',
                    backgroundColor: workoutSettings.workoutPlan === 'fullbody' ? '#dc2626' : '#374151',
                    color: workoutSettings.workoutPlan === 'fullbody' ? 'white' : '#d1d5db',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <div>FULL BODY</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>כל הגוף</div>
                </button>
              </div>
            </div>

            {/* Muscle Groups Display */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-primary">קבוצות שרירים לפי אימון</h3>
                <button
                  type="button"
                  onClick={() => setIsEditingMuscles(!isEditingMuscles)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: isEditingMuscles ? '#dc2626' : '#374151',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isEditingMuscles ? 'סיים עריכה' : 'ערוך שרירים'}
                </button>
              </div>
              <div className="space-y-4 mt-4">
                {workoutSettings.workoutPlan === 'abc' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                      className="card bg-card-secondary"
                      onDragOver={isEditingMuscles ? handleDragOver : undefined}
                      onDrop={isEditingMuscles ? (e) => handleDrop(e, 'a') : undefined}
                      style={{
                        minHeight: '150px',
                        border: isEditingMuscles ? '2px dashed #dc2626' : '1px solid #374151'
                      }}
                    >
                      <h4 className="font-semibold text-primary mb-2">אימון A</h4>
                      <div className="space-y-1">
                        {workoutSettings.muscleGroups.a.map((muscle, index) => (
                          <div 
                            key={index} 
                            className="text-secondary text-sm p-2 rounded cursor-pointer flex justify-between items-center"
                            draggable={isEditingMuscles}
                            onDragStart={isEditingMuscles ? (e) => handleDragStart(e, muscle, 'a') : undefined}
                            style={{
                              backgroundColor: isEditingMuscles ? '#1f2937' : 'transparent',
                              border: isEditingMuscles ? '1px solid #4b5563' : 'none',
                              cursor: isEditingMuscles ? 'grab' : 'default'
                            }}
                          >
                            <span>• {getMuscleDisplayName(muscle)}</span>
                            {isEditingMuscles && (
                              <button
                                onClick={() => removeMuscleFromWorkout('a', muscle)}
                                className="text-red-500 hover:text-red-300 text-xs"
                                style={{ marginLeft: '8px' }}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        {isEditingMuscles && getAvailableMusclesForWorkout('a').length > 0 && (
                          <div className="mt-2">
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  addMuscleToWorkout('a', e.target.value);
                                  e.target.value = '';
                                }
                              }}
                              className="w-full p-2 rounded bg-gray-700 text-white text-sm"
                              defaultValue=""
                            >
                              <option value="">הוסף שריר...</option>
                              {getAvailableMusclesForWorkout('a').map(muscle => (
                                <option key={muscle} value={muscle}>
                                  {getMuscleDisplayName(muscle)}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div 
                      className="card bg-card-secondary"
                      onDragOver={isEditingMuscles ? handleDragOver : undefined}
                      onDrop={isEditingMuscles ? (e) => handleDrop(e, 'b') : undefined}
                      style={{
                        minHeight: '150px',
                        border: isEditingMuscles ? '2px dashed #dc2626' : '1px solid #374151'
                      }}
                    >
                      <h4 className="font-semibold text-primary mb-2">אימון B</h4>
                      <div className="space-y-1">
                        {workoutSettings.muscleGroups.b.map((muscle, index) => (
                          <div 
                            key={index} 
                            className="text-secondary text-sm p-2 rounded cursor-pointer flex justify-between items-center"
                            draggable={isEditingMuscles}
                            onDragStart={isEditingMuscles ? (e) => handleDragStart(e, muscle, 'b') : undefined}
                            style={{
                              backgroundColor: isEditingMuscles ? '#1f2937' : 'transparent',
                              border: isEditingMuscles ? '1px solid #4b5563' : 'none',
                              cursor: isEditingMuscles ? 'grab' : 'default'
                            }}
                          >
                            <span>• {getMuscleDisplayName(muscle)}</span>
                            {isEditingMuscles && (
                              <button
                                onClick={() => removeMuscleFromWorkout('b', muscle)}
                                className="text-red-500 hover:text-red-300 text-xs"
                                style={{ marginLeft: '8px' }}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        {isEditingMuscles && getAvailableMusclesForWorkout('b').length > 0 && (
                          <div className="mt-2">
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  addMuscleToWorkout('b', e.target.value);
                                  e.target.value = '';
                                }
                              }}
                              className="w-full p-2 rounded bg-gray-700 text-white text-sm"
                              defaultValue=""
                            >
                              <option value="">הוסף שריר...</option>
                              {getAvailableMusclesForWorkout('b').map(muscle => (
                                <option key={muscle} value={muscle}>
                                  {getMuscleDisplayName(muscle)}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div 
                      className="card bg-card-secondary"
                      onDragOver={isEditingMuscles ? handleDragOver : undefined}
                      onDrop={isEditingMuscles ? (e) => handleDrop(e, 'c') : undefined}
                      style={{
                        minHeight: '150px',
                        border: isEditingMuscles ? '2px dashed #dc2626' : '1px solid #374151'
                      }}
                    >
                      <h4 className="font-semibold text-primary mb-2">אימון C</h4>
                      <div className="space-y-1">
                        {workoutSettings.muscleGroups.c.map((muscle, index) => (
                          <div 
                            key={index} 
                            className="text-secondary text-sm p-2 rounded cursor-pointer flex justify-between items-center"
                            draggable={isEditingMuscles}
                            onDragStart={isEditingMuscles ? (e) => handleDragStart(e, muscle, 'c') : undefined}
                            style={{
                              backgroundColor: isEditingMuscles ? '#1f2937' : 'transparent',
                              border: isEditingMuscles ? '1px solid #4b5563' : 'none',
                              cursor: isEditingMuscles ? 'grab' : 'default'
                            }}
                          >
                            <span>• {getMuscleDisplayName(muscle)}</span>
                            {isEditingMuscles && (
                              <button
                                onClick={() => removeMuscleFromWorkout('c', muscle)}
                                className="text-red-500 hover:text-red-300 text-xs"
                                style={{ marginLeft: '8px' }}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        {isEditingMuscles && getAvailableMusclesForWorkout('c').length > 0 && (
                          <div className="mt-2">
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  addMuscleToWorkout('c', e.target.value);
                                  e.target.value = '';
                                }
                              }}
                              className="w-full p-2 rounded bg-gray-700 text-white text-sm"
                              defaultValue=""
                            >
                              <option value="">הוסף שריר...</option>
                              {getAvailableMusclesForWorkout('c').map(muscle => (
                                <option key={muscle} value={muscle}>
                                  {getMuscleDisplayName(muscle)}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {workoutSettings.workoutPlan === 'ab' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      className="card bg-card-secondary"
                      onDragOver={isEditingMuscles ? handleDragOver : undefined}
                      onDrop={isEditingMuscles ? (e) => handleDrop(e, 'a') : undefined}
                      style={{
                        minHeight: '150px',
                        border: isEditingMuscles ? '2px dashed #dc2626' : '1px solid #374151'
                      }}
                    >
                      <h4 className="font-semibold text-primary mb-2">אימון A</h4>
                      <div className="space-y-1">
                        {workoutSettings.muscleGroups.a.map((muscle, index) => (
                          <div 
                            key={index} 
                            className="text-secondary text-sm p-2 rounded cursor-pointer flex justify-between items-center"
                            draggable={isEditingMuscles}
                            onDragStart={isEditingMuscles ? (e) => handleDragStart(e, muscle, 'a') : undefined}
                            style={{
                              backgroundColor: isEditingMuscles ? '#1f2937' : 'transparent',
                              border: isEditingMuscles ? '1px solid #4b5563' : 'none',
                              cursor: isEditingMuscles ? 'grab' : 'default'
                            }}
                          >
                            <span>• {getMuscleDisplayName(muscle)}</span>
                            {isEditingMuscles && (
                              <button
                                onClick={() => removeMuscleFromWorkout('a', muscle)}
                                className="text-red-500 hover:text-red-300 text-xs"
                                style={{ marginLeft: '8px' }}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        {isEditingMuscles && getAvailableMusclesForWorkout('a').length > 0 && (
                          <div className="mt-2">
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  addMuscleToWorkout('a', e.target.value);
                                  e.target.value = '';
                                }
                              }}
                              className="w-full p-2 rounded bg-gray-700 text-white text-sm"
                              defaultValue=""
                            >
                              <option value="">הוסף שריר...</option>
                              {getAvailableMusclesForWorkout('a').map(muscle => (
                                <option key={muscle} value={muscle}>
                                  {getMuscleDisplayName(muscle)}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div 
                      className="card bg-card-secondary"
                      onDragOver={isEditingMuscles ? handleDragOver : undefined}
                      onDrop={isEditingMuscles ? (e) => handleDrop(e, 'b') : undefined}
                      style={{
                        minHeight: '150px',
                        border: isEditingMuscles ? '2px dashed #dc2626' : '1px solid #374151'
                      }}
                    >
                      <h4 className="font-semibold text-primary mb-2">אימון B</h4>
                      <div className="space-y-1">
                        {workoutSettings.muscleGroups.b.map((muscle, index) => (
                          <div 
                            key={index} 
                            className="text-secondary text-sm p-2 rounded cursor-pointer flex justify-between items-center"
                            draggable={isEditingMuscles}
                            onDragStart={isEditingMuscles ? (e) => handleDragStart(e, muscle, 'b') : undefined}
                            style={{
                              backgroundColor: isEditingMuscles ? '#1f2937' : 'transparent',
                              border: isEditingMuscles ? '1px solid #4b5563' : 'none',
                              cursor: isEditingMuscles ? 'grab' : 'default'
                            }}
                          >
                            <span>• {getMuscleDisplayName(muscle)}</span>
                            {isEditingMuscles && (
                              <button
                                onClick={() => removeMuscleFromWorkout('b', muscle)}
                                className="text-red-500 hover:text-red-300 text-xs"
                                style={{ marginLeft: '8px' }}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        {isEditingMuscles && getAvailableMusclesForWorkout('b').length > 0 && (
                          <div className="mt-2">
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  addMuscleToWorkout('b', e.target.value);
                                  e.target.value = '';
                                }
                              }}
                              className="w-full p-2 rounded bg-gray-700 text-white text-sm"
                              defaultValue=""
                            >
                              <option value="">הוסף שריר...</option>
                              {getAvailableMusclesForWorkout('b').map(muscle => (
                                <option key={muscle} value={muscle}>
                                  {getMuscleDisplayName(muscle)}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {workoutSettings.workoutPlan === 'fullbody' && (
                  <div 
                    className="card bg-card-secondary"
                    onDragOver={isEditingMuscles ? handleDragOver : undefined}
                    onDrop={isEditingMuscles ? (e) => handleDrop(e, 'fullbody') : undefined}
                    style={{
                      minHeight: '150px',
                      border: isEditingMuscles ? '2px dashed #dc2626' : '1px solid #374151'
                    }}
                  >
                    <h4 className="font-semibold text-primary mb-2">כל הגוף</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {workoutSettings.muscleGroups.fullbody.map((muscle, index) => (
                        <div 
                          key={index} 
                          className="text-secondary text-sm p-2 rounded cursor-pointer flex justify-between items-center"
                          draggable={isEditingMuscles}
                          onDragStart={isEditingMuscles ? (e) => handleDragStart(e, muscle, 'fullbody') : undefined}
                          style={{
                            backgroundColor: isEditingMuscles ? '#1f2937' : 'transparent',
                            border: isEditingMuscles ? '1px solid #4b5563' : 'none',
                            cursor: isEditingMuscles ? 'grab' : 'default'
                          }}
                        >
                          <span>• {getMuscleDisplayName(muscle)}</span>
                          {isEditingMuscles && (
                            <button
                              onClick={() => removeMuscleFromWorkout('fullbody', muscle)}
                              className="text-red-500 hover:text-red-300 text-xs"
                              style={{ marginLeft: '8px' }}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {isEditingMuscles && getAvailableMusclesForWorkout('fullbody').length > 0 && (
                      <div className="mt-4">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              addMuscleToWorkout('fullbody', e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="w-full p-2 rounded bg-gray-700 text-white text-sm"
                          defaultValue=""
                        >
                          <option value="">הוסף שריר...</option>
                          {getAvailableMusclesForWorkout('fullbody').map(muscle => (
                            <option key={muscle} value={muscle}>
                              {getMuscleDisplayName(muscle)}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Settings Form */}
      <div className="mt-6">
        <div className="card">
          {/* Accordion Header */}
          <div
            className="flex items-center justify-between cursor-pointer select-none mb-4"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            style={{ userSelect: 'none' }}
          >
            <div className="flex items-center">
              <User size={20} className="ml-2" />
              <span className="text-xl font-bold text-primary">פרטי פרופיל</span>
            </div>
            <svg
              className={"transition-transform duration-200" + (isProfileOpen ? " rotate-180" : "")}
              width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 8L10 12L14 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {/* Accordion Content */}
          {isProfileOpen && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="שם פרטי"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  error={errors.firstName}
                  required
                  icon={<User size={16} />}
                />
                <Input
                  label="שם משפחה"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  error={errors.lastName}
                  required
                  icon={<User size={16} />}
                />
              </div>
              <div className="mt-4">
                <Input
                  label="כתובת אימייל"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  error={errors.email}
                  required
                  icon={<Mail size={16} />}
                />
              </div>
              
              {/* Password Section */}
              <div className="border-t border-border-color pt-6">
                <div className="flex justify-end mb-4">
                  {!isEditingPassword && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsEditingPassword(true)}
                    >
                      <Lock size={16} />
                      שנה סיסמה
                    </Button>
                  )}
                </div>
                {isEditingPassword && (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="relative">
                        <Input
                          label="סיסמה נוכחית"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={formData.currentPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          error={errors.currentPassword}
                          required
                          icon={<Lock size={16} />}
                          style={{ paddingRight: '2.5rem' }}
                        />
                        <button
                          type="button"
                          style={{
                            position: 'absolute',
                            left: '0.75rem',
                            top: '0.75rem',
                            background: 'transparent',
                            border: 'none',
                            padding: '0',
                            color: '#d1d5db',
                            cursor: 'pointer',
                            zIndex: 10,
                            pointerEvents: 'auto',
                            height: 'auto',
                            lineHeight: '1'
                          }}
                          onMouseOver={(e) => e.target.style.color = '#dc2626'}
                          onMouseOut={(e) => e.target.style.color = '#d1d5db'}
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="relative">
                        <Input
                          label="סיסמה חדשה"
                          type={showNewPassword ? 'text' : 'password'}
                          value={formData.newPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                          error={errors.newPassword}
                          required
                          icon={<Lock size={16} />}
                          style={{ paddingRight: '2.5rem' }}
                        />
                        <button
                          type="button"
                          style={{
                            position: 'absolute',
                            left: '0.75rem',
                            top: '0.75rem',
                            background: 'transparent',
                            border: 'none',
                            padding: '0',
                            color: '#d1d5db',
                            cursor: 'pointer',
                            zIndex: 10,
                            pointerEvents: 'auto',
                            height: 'auto',
                            lineHeight: '1'
                          }}
                          onMouseOver={(e) => e.target.style.color = '#dc2626'}
                          onMouseOut={(e) => e.target.style.color = '#d1d5db'}
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="relative">
                        <Input
                          label="אימות סיסמה חדשה"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          error={errors.confirmPassword}
                          required
                          icon={<Lock size={16} />}
                          style={{ paddingRight: '2.5rem' }}
                        />
                        <button
                          type="button"
                          style={{
                            position: 'absolute',
                            left: '0.75rem',
                            top: '0.75rem',
                            background: 'transparent',
                            border: 'none',
                            padding: '0',
                            color: '#d1d5db',
                            cursor: 'pointer',
                            zIndex: 10,
                            pointerEvents: 'auto',
                            height: 'auto',
                            lineHeight: '1'
                          }}
                          onMouseOver={(e) => e.target.style.color = '#dc2626'}
                          onMouseOut={(e) => e.target.style.color = '#d1d5db'}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCancelPasswordEdit}
                      >
                        ביטול
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
      
      {/* Submit Button - Separate Card */}
      <div className="mt-6">
        <div className="flex justify-end">
          <Button
            type="submit"
            variant={hasChanges() ? "primary" : "secondary"}
            loading={loading}
            onClick={handleSubmit}
            disabled={!hasChanges()}
            className={!hasChanges() ? 'cursor-not-allowed' : ''}
          >
            <Save size={16} />
            שמור שינויים
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 