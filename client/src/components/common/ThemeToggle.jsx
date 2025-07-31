import React, { useEffect, useState } from 'react';
import Button from './Button';

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={() => setDark(d => !d)}
      style={{ margin: '1rem 0' }}
    >
      {dark ? 'מצב בהיר' : 'מצב כהה'}
    </Button>
  );
};

export default ThemeToggle;