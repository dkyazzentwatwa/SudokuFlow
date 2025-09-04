import { useEffect, useState } from 'react';
import { Achievement } from '../utils/achievements';
import './AchievementToast.css';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);
  
  if (!achievement) return null;
  
  return (
    <div className={`achievement-toast ${isVisible ? 'visible' : ''}`}>
      <div className="toast-icon">{achievement.icon}</div>
      <div className="toast-content">
        <div className="toast-label">Achievement Unlocked!</div>
        <div className="toast-title">{achievement.name}</div>
        <div className="toast-description">{achievement.description}</div>
      </div>
    </div>
  );
}