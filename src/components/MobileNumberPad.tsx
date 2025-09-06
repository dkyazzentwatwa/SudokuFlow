import React from 'react';
import { useBoardStore } from '../state/boardState';
import { soundManager } from '../utils/sounds';
import './MobileNumberPad.css';

interface MobileNumberPadProps {
  isVisible: boolean;
}

export const MobileNumberPad: React.FC<MobileNumberPadProps> = ({ isVisible }) => {
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

  if (!isVisible) return null;

  return (
    <div className="mobile-number-pad">
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
      
      <div className="mobile-mode-indicator">
        {pencilMode ? '📝 Notes Mode' : '✍️ Answer Mode'}
      </div>
    </div>
  );
};