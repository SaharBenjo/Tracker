import React, { useState } from 'react';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

const RegisterForm = ({ onSubmit, onSwitchToLogin, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'כתובת האימייל היא שדה חובה';
    } else if (!formData.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }

    if (!formData.password) {
      newErrors.password = 'הסיסמה היא שדה חובה';
    } else if (formData.password.length < 6) {
      newErrors.password = 'הסיסמה חייבת להיות לפחות 6 תווים';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'הסיסמאות אינן תואמות';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'שם פרטי הוא שדה חובה';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'שם משפחה הוא שדה חובה';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && !loading) {
      const { confirmPassword, ...submitData } = formData;
      onSubmit(submitData);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <UserPlus size={48} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">הרשמה למערכת</h2>
        <p className="text-secondary">צור חשבון חדש כדי להתחיל</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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

        <Input
          label="כתובת אימייל"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          error={errors.email}
          required
          icon={<Mail size={16} />}
        />

        <Input
          label="סיסמה"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          error={errors.password}
          required
          icon={<Lock size={16} />}
        />

        <Input
          label="אימות סיסמה"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          error={errors.confirmPassword}
          required
          icon={<Lock size={16} />}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={loading}
        >
          <UserPlus size={16} />
          הרשמה
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-secondary">
          כבר יש לך חשבון?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0',
              margin: '0',
              color: '#3b82f6',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: 'inherit',
              fontFamily: 'inherit'
            }}
            onMouseOver={(e) => e.target.style.color = '#60a5fa'}
            onMouseOut={(e) => e.target.style.color = '#3b82f6'}
          >
            התחבר כאן
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm; 