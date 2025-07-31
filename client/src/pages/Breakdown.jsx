import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useWorkoutStore from '../store/workoutStore';
import Button from '../components/common/Button';
import { ArrowLeft, Dumbbell } from 'lucide-react';

const muscleNames = {
  chest: 'חזה',
  back: 'גב',
  shoulders: 'כתפיים',
  biceps: 'יד קדמית',
  triceps: 'יד אחורית',
  legs: 'רגליים',
  abs: 'בטן',
};

const Breakdown = () => {
  const navigate = useNavigate();
  const { weightByMuscleGroup, fetchWeightByMuscleGroup, loading } = useWorkoutStore();

  useEffect(() => {
    fetchWeightByMuscleGroup();
  }, [fetchWeightByMuscleGroup]);

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="page-header flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-primary">פירוט משקל לפי קבוצת שרירים</h1>
        <Button variant="secondary" onClick={() => navigate('/')} className="flex items-center">
          <ArrowLeft size={20} className="ml-2" />
          חזרה
        </Button>
      </div>

      <div className="card p-6">
        <div className="flex items-center mb-4">
          <Dumbbell className="text-accent mr-2" size={28} />
          <h2 className="text-xl font-bold text-primary">סה"כ משקל שהורם לפי שריר</h2>
        </div>
        {loading ? (
          <div className="text-center text-secondary">טוען...</div>
        ) : weightByMuscleGroup.length === 0 ? (
          <div className="text-center text-secondary">אין נתונים להצגה</div>
        ) : (
          <table className="w-full text-right rtl text-lg">
            <thead>
              <tr className="border-b">
                <th className="py-2">קבוצת שרירים</th>
                <th className="py-2">סה"כ משקל (ק"ג)</th>
              </tr>
            </thead>
            <tbody>
              {weightByMuscleGroup.map((row) => (
                <tr key={row.muscleGroup} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-semibold">{muscleNames[row.muscleGroup] || row.muscleGroup}</td>
                  <td className="py-2">{row.totalWeight.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Breakdown; 