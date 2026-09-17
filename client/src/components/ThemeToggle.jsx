import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div 
      className={`inline-flex items-center gap-2 cursor-pointer select-none ${className}`} 
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      }}
    >
      <span className={`text-sm font-bold transition-colors duration-200 ${!isDark ? 'text-slate-900 dark:text-white font-extrabold' : 'text-gray-400'}`}>
        Light
      </span>

      <div className="w-16 h-8 rounded-full bg-slate-800 p-1 flex items-center shadow-inner relative transition-colors duration-300">
        <div 
          className={`w-6 h-6 rounded-full bg-amber-400 shadow-md transition-transform duration-300 ease-in-out transform ${
            isDark ? 'translate-x-8' : 'translate-x-0'
          }`} 
        />
      </div>

      <span className={`text-sm font-bold transition-colors duration-200 ${isDark ? 'text-slate-900 dark:text-white font-extrabold' : 'text-gray-400'}`}>
        Dark
      </span>
    </div>
  );
}
