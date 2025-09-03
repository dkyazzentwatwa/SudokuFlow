import React, { useEffect } from 'react';
import { useCelebrationAnimation } from '../hooks/useAnimations';
import './VictoryModal.css';

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  time: number;
  difficulty: string;
  hintsUsed: number;
  mistakes: number;
  onNewGame: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  onClose,
  time,
  difficulty,
  hintsUsed,
  mistakes,
  onNewGame
}) => {
  const { celebrate } = useCelebrationAnimation();
  
  useEffect(() => {
    if (isOpen) {
      celebrate();
    }
  }, [isOpen, celebrate]);
  
  if (!isOpen) return null;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getGrade = () => {
    if (hintsUsed === 0 && mistakes === 0) return { grade: 'Perfect!', emoji: '🌟' };
    if (hintsUsed <= 2 && mistakes <= 2) return { grade: 'Excellent!', emoji: '⭐' };
    if (hintsUsed <= 5 && mistakes <= 5) return { grade: 'Great!', emoji: '✨' };
    return { grade: 'Good Job!', emoji: '👏' };
  };
  
  const { grade, emoji } = getGrade();
  
  return (
    <>
      <div className="victory-backdrop" onClick={onClose} />
      <div className="victory-modal">
        <div className="victory-header">
          <span className="victory-emoji">{emoji}</span>
          <h2>{grade}</h2>
          <p>You solved the {difficulty} puzzle!</p>
        </div>
        
        <div className="victory-stats">
          <div className="stat-item">
            <span className="stat-icon">⏱</span>
            <div className="stat-info">
              <span className="stat-value">{formatTime(time)}</span>
              <span className="stat-label">Time</span>
            </div>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">💡</span>
            <div className="stat-info">
              <span className="stat-value">{hintsUsed}</span>
              <span className="stat-label">Hints</span>
            </div>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">❌</span>
            <div className="stat-info">
              <span className="stat-value">{mistakes}</span>
              <span className="stat-label">Mistakes</span>
            </div>
          </div>
        </div>
        
        <div className="victory-actions">
          <button className="victory-button primary" onClick={onNewGame}>
            New Game
          </button>
          <button className="victory-button secondary" onClick={onClose}>
            View Board
          </button>
        </div>
      </div>
    </>
  );
};