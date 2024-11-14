import { useState, useEffect, FC } from 'react';


const ChangeThemeToggleButton: FC = () => {
// function ChangeThemeToggleButton() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
      <button 
        className="screenControlButton themeToggle tile" 
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      >
        <span>{theme === 'light' ? '🌙' : '☀️'}</span>
      </button>
  );
}

export default ChangeThemeToggleButton;