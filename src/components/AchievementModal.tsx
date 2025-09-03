import React from 'react';
import { achievementManager } from '../utils/achievements';
import './AchievementModal.css';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementModal({ isOpen, onClose }: AchievementModalProps) {
  if (!isOpen) return null;
  
  const achievements = achievementManager.getAchievements();
  const unlockedCount = achievementManager.getUnlockedCount();
  const totalCount = achievements.length;
  const progressPercent = (unlockedCount / totalCount) * 100;
  
  return (
    <>
      <div className="achievement-backdrop" onClick={onClose} />
      <div className="achievement-modal">
        <div className="achievement-header">
          <h2>Achievements</h2>
          <button className="achievement-close" onClick={onClose}>×</button>
        </div>
        
        <div className="achievement-progress">
          <div className="progress-text">
            <span className="progress-count">{unlockedCount} / {totalCount}</span>
            <span className="progress-label">Unlocked</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        
        <div className="achievement-grid">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">
                {achievement.icon}
              </div>
              <div className="achievement-info">
                <h3 className="achievement-name">{achievement.name}</h3>
                <p className="achievement-description">{achievement.description}</p>
                {achievement.maxProgress && (
                  <div className="achievement-mini-progress">
                    <div className="mini-progress-bar">
                      <div 
                        className="mini-progress-fill"
                        style={{ 
                          width: `${Math.min(100, (achievement.progress || 0) / achievement.maxProgress * 100)}%` 
                        }}
                      />
                    </div>
                    <span className="mini-progress-text">
                      {achievement.progress} / {achievement.maxProgress}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}