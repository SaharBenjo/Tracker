import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, Calendar, TrendingUp } from 'lucide-react';
import useWorkoutStore from '../store/workoutStore';
import Button from '../components/common/Button';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const WorkoutStats = () => {
  const { workouts, loading, fetchWorkouts } = useWorkoutStore();
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState('week'); // week, month, halfYear, year
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  useEffect(() => {
    if (workouts.length > 0) {
      generateChartData();
    }
  }, [workouts, timePeriod]);

  const generateChartData = () => {
    const now = new Date();
    const data = [];
    let periods = 0;
    let periodLabel = '';
    let dateFormat = '';

    switch (timePeriod) {
      case 'week':
        periods = 7;
        periodLabel = 'יום';
        dateFormat = 'DD/MM';
        break;
      case 'month':
        periods = 4; // 4 שבועות
        periodLabel = 'שבוע';
        dateFormat = 'DD/MM';
        break;
      case 'halfYear':
        periods = 6;
        periodLabel = 'חודש';
        dateFormat = 'MM/YYYY';
        break;
      case 'year':
        periods = 12;
        periodLabel = 'חודש';
        dateFormat = 'MM/YYYY';
        break;
      default:
        periods = 7;
        periodLabel = 'יום';
        dateFormat = 'DD/MM';
    }

    for (let i = periods - 1; i >= 0; i--) {
      let startDate, endDate;

      if (timePeriod === 'month') {
        // Weekly periods for month
        endDate = new Date(now);
        endDate.setDate(now.getDate() - (i * 7));
        endDate.setHours(23, 59, 59, 999);

        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
      } else if (timePeriod === 'week') {
        // Daily periods
        endDate = new Date(now);
        endDate.setDate(now.getDate() - i);
        startDate = new Date(endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      } else if (timePeriod === 'halfYear' || timePeriod === 'year') {
        // Monthly periods for halfYear/year - כולל החודש הנוכחי
        // i=periods-1 -> הכי ישן, i=0 -> החודש הנוכחי
        endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0); // סוף החודש
        startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);   // תחילת החודש
        endDate.setHours(23, 59, 59, 999);
        startDate.setHours(0, 0, 0, 0);
      } else {
        // Monthly periods fallback
        endDate = new Date(now.getFullYear(), now.getMonth() - i, 0);
        startDate = new Date(now.getFullYear(), now.getMonth() - i - 1, 1);
        endDate.setHours(23, 59, 59, 999);
        startDate.setHours(0, 0, 0, 0);
      }

      const workoutsInPeriod = workouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= startDate && workoutDate <= endDate;
      });

      let label;
      if (timePeriod === 'month') {
        label = `${startDate.getDate()}/${startDate.getMonth() + 1}–${endDate.getDate()}/${endDate.getMonth() + 1}`;
      } else if (timePeriod === 'week' || timePeriod === 'month') {
        label = `${endDate.getDate()}/${endDate.getMonth() + 1}`;
      } else {
        label = `${endDate.getMonth() + 1}/${endDate.getFullYear()}`;
      }

      data.push({
        label,
        count: workoutsInPeriod.length,
        date: endDate
      });
    }

    setChartData(data);
  };

  const getTimePeriodLabel = () => {
    switch (timePeriod) {
      case 'week': return 'שבוע';
      case 'month': return 'חודש';
      case 'halfYear': return 'חצי שנה';
      case 'year': return 'שנה';
      default: return 'שבוע';
    }
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
            סטטיסטיקות אימונים
          </h1>
          <p className="text-secondary">
            צפה בהתקדמות שלך לאורך זמן
          </p>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="card mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            variant={timePeriod === 'week' ? 'primary' : 'secondary'}
            onClick={() => setTimePeriod('week')}
          >
            <Calendar size={16} />
            שבוע
          </Button>
          <Button
            variant={timePeriod === 'month' ? 'primary' : 'secondary'}
            onClick={() => setTimePeriod('month')}
          >
            <Calendar size={16} />
            חודש
          </Button>
          <Button
            variant={timePeriod === 'halfYear' ? 'primary' : 'secondary'}
            onClick={() => setTimePeriod('halfYear')}
          >
            <TrendingUp size={16} />
            חצי שנה
          </Button>
          <Button
            variant={timePeriod === 'year' ? 'primary' : 'secondary'}
            onClick={() => setTimePeriod('year')}
          >
            <BarChart3 size={16} />
            שנה
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-primary mb-2">
            כמות אימונים - {getTimePeriodLabel()} אחרון
          </h2>
          <p className="text-secondary">
            סה"כ {chartData.reduce((sum, d) => sum + d.count, 0)} אימונים בתקופה זו
          </p>
        </div>

        {/* Recharts Bar Chart */}
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="אימונים" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 bg-secondary rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {chartData.reduce((sum, d) => sum + d.count, 0)}
            </div>
            <div className="text-sm text-secondary">סה"כ אימונים</div>
          </div>
          <div className="text-center p-4 bg-secondary rounded-lg">
            <div className="text-2xl font-bold text-success">
              {
                timePeriod === 'month'
                  ? (chartData.length > 0 ? Math.round(chartData.reduce((sum, d) => sum + d.count, 0) / chartData.length) : 0)
                  : (chartData.length > 0 ? Math.round(chartData.reduce((sum, d) => sum + d.count, 0) / chartData.length) : 0)
              }
            </div>
            <div className="text-sm text-secondary">
              {
                timePeriod === 'month'
                  ? 'ממוצע לשבוע'
                  : `ממוצע ל${timePeriod === 'week' ? 'יום' : 'חודש'}`
              }
            </div>
          </div>
          {/* הכרטיס של מקסימום אימונים הוסר */}
        </div>
      </div>
    </div>
  );
};

export default WorkoutStats; 