import React, { useState } from 'react';
import { useBoardStore } from '../state/boardState';
import { soundManager } from '../utils/sounds';
import { THEMES, applyTheme, getStoredTheme } from '../utils/themes';
import './MobileNumberPad.css';

interface MobileNumberPadProps {
  isVisible: boolean;
  onClose: () => void;
  focusMode: boolean;
  setFocusMode: (focus: boolean) => void;
}

export const MobileNumberPad: React.FC<MobileNumberPadProps> = ({ isVisible, onClose, focusMode, setFocusMode }) => {
  const {
    selectedCell,
    pencilMode,
    placeDigit,
    toggleCandidate,
    clearCell,
    setPencilMode,
    undo,
    redo
  } = useBoardStore();
  
  const [currentTheme, setCurrentTheme] = useState(getStoredTheme());
  const [showExtras, setShowExtras] = useState(false);

  const handleNumberClick = (digit: number) => {
    if (selectedCell === null) return;
    
    soundManager.play('click');
    if (pencilMode) {
      toggleCandidate(selectedCell, digit);
    } else {
      placeDigit(selectedCell, digit);
    }
  };

  const handleClear = () => {
    if (selectedCell === null) return;
    soundManager.play('click');
    clearCell(selectedCell);
  };

  const handleToggleMode = () => {
    soundManager.play('click');
    setPencilMode(!pencilMode);
  };

  const handleClose = () => {
    soundManager.play('click');
    onClose();
  };

  const handleThemeChange = (themeName: string) => {
    setCurrentTheme(themeName);
    applyTheme(themeName);
    soundManager.play('click');
  };

  const handleFocusToggle = () => {
    setFocusMode(!focusMode);
    soundManager.play('click');
  };

  if (!isVisible) return null;

  return (
    <div className="mobile-number-pad">
      <div className="mobile-number-pad-header">
        <div className="mobile-mode-indicator">
          {pencilMode ? '📝 Notes Mode' : '✍️ Answer Mode'}
        </div>
        <div className="mobile-header-controls">
          <button
            className="mobile-extras-btn"
            onClick={() => setShowExtras(!showExtras)}
            aria-label="Show more options"
          >
            {showExtras ? '⏷' : '⏵'}
          </button>
          <button
            className="mobile-close-btn"
            onClick={handleClose}
            aria-label="Close number pad"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="mobile-top-controls">
        <button
          className={`mobile-control-btn ${pencilMode ? 'active' : ''}`}
          onClick={handleToggleMode}
          aria-label="Toggle pencil mode"
        >
          ✏️
        </button>
        <button
          className="mobile-control-btn"
          onClick={() => { undo(); soundManager.play('click'); }}
          aria-label="Undo"
        >
          ↶
        </button>
        <button
          className="mobile-control-btn"
          onClick={() => { redo(); soundManager.play('click'); }}
          aria-label="Redo"
        >
          ↷
        </button>
        <button
          className="mobile-control-btn"
          onClick={handleClear}
          aria-label="Clear cell"
        >
          ⌫
        </button>
      </div>
      
      <div className="mobile-number-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
          <button
            key={digit}
            className={`mobile-number-btn ${selectedCell === null ? 'disabled' : ''}`}
            onClick={() => handleNumberClick(digit)}
            disabled={selectedCell === null}
          >
            {digit}
          </button>
        ))}
      </div>
      
      {showExtras && (
        <div className="mobile-extras">
          <div className="mobile-extras-section">
            <h4>Themes</h4>
            <div className="mobile-theme-grid">
              {Object.entries(THEMES).map(([key, theme]) => (
                <button
                  key={key}
                  className={`mobile-theme-btn ${currentTheme === key ? 'active' : ''}`}
                  onClick={() => handleThemeChange(key)}
                  title={theme.name}
                >
                  {theme.icon}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mobile-extras-section">
            <h4>Focus</h4>
            <button
              className={`mobile-control-btn ${focusMode ? 'active' : ''}`}
              onClick={handleFocusToggle}
            >
              <span>🎯 Focus Mode</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};