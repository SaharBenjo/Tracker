import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { ArrowLeft, Plus, Target, TrendingUp } from 'lucide-react';
import useMeasurementsStore from '../store/measurementsStore';
import useAuthStore from '../store/authStore';

const Measurements = () => {
  const navigate = useNavigate();
  const { 
    measurements, 
    goals, 
    loading, 
    error, 
    fetchMeasurements, 
    fetchGoals, 
    addMeasurement, 
    updateGoals, 
    getProgress 
  } = useMeasurementsStore();
  
  const { isAuthenticated } = useAuthStore();

  const [showAddMeasurement, setShowAddMeasurement] = useState(false);
  const [showGoalsForm, setShowGoalsForm] = useState(false);
  const [newMeasurement, setNewMeasurement] = useState({
    type: 'waist',
    value: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [newGoals, setNewGoals] = useState({
    waist: '',
    chest: '',
    arms: '',
    thighs: ''
  });

  const measurementTypes = {
    waist: 'היקף מותניים',
    chest: 'היקף חזה',
    arms: 'היקף זרועות',
    thighs: 'היקף ירכיים'
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMeasurements();
      fetchGoals();
    }
  }, [isAuthenticated, fetchMeasurements, fetchGoals]);

  const handleAddMeasurement = async (e) => {
    e.preventDefault();
    try {
      await addMeasurement({
        ...newMeasurement,
        value: parseFloat(newMeasurement.value)
      });
      setNewMeasurement({
        type: 'waist',
        value: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddMeasurement(false);
    } catch (error) {
      console.error('Error adding measurement:', error);
    }
  };

  const handleUpdateGoals = async (e) => {
    e.preventDefault();
    try {
      const goalsData = {};
      Object.keys(newGoals).forEach(key => {
        if (newGoals[key]) {
          goalsData[key] = parseFloat(newGoals[key]);
        }
      });
      
      console.log('Saving goals:', goalsData);
      await updateGoals(goalsData);
      
      // Refresh goals data after update
      console.log('Refreshing goals...');
      await fetchGoals();
      
      // Reset form
      setNewGoals({
        waist: '',
        chest: '',
        arms: '',
        thighs: ''
      });
      setShowGoalsForm(false);
    } catch (error) {
      console.error('Error updating goals:', error);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-error';
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

  return (
    <div className="container mx-auto p-6">
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
            היקפים ומטרות
          </h1>
          <p className="text-secondary">
            עקב אחרי היקפי הגוף שלך והתקדמות למטרות
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="card bg-error text-white mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Goals Section */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Target size={20} />
            מטרות היקפים
          </h2>
          <Button
            variant="primary"
            onClick={() => {
              if (!showGoalsForm) {
                // Load current goals into form when opening
                setNewGoals({
                  waist: goals.waist || '',
                  chest: goals.chest || '',
                  arms: goals.arms || '',
                  thighs: goals.thighs || ''
                });
              }
              setShowGoalsForm(!showGoalsForm);
            }}
          >
            <Plus size={16} />
            {showGoalsForm ? 'ביטול' : 'ערוך מטרות'}
          </Button>
        </div>

        {showGoalsForm ? (
          <form onSubmit={handleUpdateGoals} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(measurementTypes).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    {label} (ס"מ)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newGoals[key]}
                    onChange={(e) => setNewGoals(prev => ({
                      ...prev,
                      [key]: e.target.value
                    }))}
                    placeholder="הכנס מטרה"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="primary">
                שמור מטרות
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowGoalsForm(false)}
              >
                ביטול
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(measurementTypes).map(([key, label]) => {
              const progress = getProgress(key);
              return (
                <div key={key} className="text-center p-4 bg-secondary rounded-lg">
                  <div className="text-lg font-bold text-primary mb-1">
                    {label}
                  </div>
                  {progress.goal > 0 ? (
                    <>
                      <div className="text-2xl font-bold text-info mb-1">
                        {progress.current} / {progress.goal} ס"מ
                      </div>
                      <div className={`text-sm font-bold ${getProgressColor(progress.percentage)}`}>
                        {progress.percentage}% התקדמות
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                        <div
                          className="bg-info h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                        ></div>
                      </div>
                    </>
                  ) : (
                    <div className="text-secondary">לא הוגדרה מטרה</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Measurement Section */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <TrendingUp size={20} />
            מדידות חדשות
          </h2>
          <Button
            variant="primary"
            onClick={() => setShowAddMeasurement(!showAddMeasurement)}
          >
            <Plus size={16} />
            {showAddMeasurement ? 'ביטול' : 'הוסף מדידה'}
          </Button>
        </div>

        {showAddMeasurement && (
          <form onSubmit={handleAddMeasurement} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  סוג מדידה
                </label>
                <select
                  value={newMeasurement.type}
                  onChange={(e) => setNewMeasurement(prev => ({
                    ...prev,
                    type: e.target.value
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {Object.entries(measurementTypes).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  ערך (ס"מ)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={newMeasurement.value}
                  onChange={(e) => setNewMeasurement(prev => ({
                    ...prev,
                    value: e.target.value
                  }))}
                  placeholder="הכנס ערך"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  תאריך
                </label>
                <Input
                  type="date"
                  value={newMeasurement.date}
                  onChange={(e) => setNewMeasurement(prev => ({
                    ...prev,
                    date: e.target.value
                  }))}
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="primary">
                הוסף מדידה
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAddMeasurement(false)}
              >
                ביטול
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Measurements History */}
      <div className="card">
        <h2 className="text-xl font-bold text-primary mb-4">היסטוריית מדידות</h2>
        {measurements.length === 0 ? (
          <p className="text-secondary">אין מדידות עדיין. הוסף מדידה ראשונה!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-right p-2">תאריך</th>
                  <th className="text-right p-2">סוג</th>
                  <th className="text-right p-2">ערך (ס"מ)</th>
                </tr>
              </thead>
              <tbody>
                {measurements
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((measurement, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="p-2">{new Date(measurement.date).toLocaleDateString('he-IL')}</td>
                      <td className="p-2">{measurementTypes[measurement.type]}</td>
                      <td className="p-2 font-bold">{measurement.value}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Measurements; 