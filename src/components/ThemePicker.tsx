import React, { useState, useEffect } from 'react';
import { THEMES, applyTheme, getStoredTheme } from '../utils/themes';
import './ThemePicker.css';

export const ThemePicker: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState(getStoredTheme());
  const [isOpen, setIsOpen] = useState(false);
  
  const handleThemeChange = (themeName: string) => {
    setCurrentTheme(themeName);
    applyTheme(themeName);
    setIsOpen(false);
  };
  
  useEffect(() => {
    // Apply theme on mount
    applyTheme(currentTheme);
  }, []);
  
  return (
    <div className="theme-picker">
      <button 
        className="theme-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Choose Theme"
      >
        <span className="theme-icon">{THEMES[currentTheme].icon}</span>
        <span className="theme-label">Theme</span>
      </button>
      
      {isOpen && (
        <div className="theme-dropdown">
          <div className="theme-dropdown-header">
            <h3>Choose Your Vibe</h3>
            <button 
              className="theme-close"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          
          <div className="theme-grid">
            {Object.entries(THEMES).map(([key, theme]) => (
              <button
                key={key}
                className={`theme-option ${currentTheme === key ? 'active' : ''}`}
                onClick={() => handleThemeChange(key)}
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.pastelAccent1}, ${theme.colors.pastelAccent2})`
                }}
              >
                <span className="theme-option-icon">{theme.icon}</span>
                <span className="theme-option-name">{theme.name}</span>
                {currentTheme === key && (
                  <span className="theme-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {isOpen && (
        <div 
          className="theme-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};