import React, { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

const LoginForm = ({ onSubmit, onSwitchToRegister, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'כתובת האימייל היא שדה חובה';
    }

    if (!formData.password) {
      newErrors.password = 'הסיסמה היא שדה חובה';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && !loading) {
      onSubmit(formData);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <LogIn size={48} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">התחברות למערכת</h2>
        <p className="text-secondary">התחבר לחשבון שלך</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={loading}
        >
          <LogIn size={16} />
          התחבר
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-secondary">
          אין לך חשבון?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
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
            הירשם כאן
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm; 