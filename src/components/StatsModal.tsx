import React from 'react';
import { statisticsManager } from '../utils/statistics';
import './StatsModal.css';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StatsModal({ isOpen, onClose }: StatsModalProps) {
  if (!isOpen) return null;
  
  const stats = statisticsManager.getStats();
  const completionRate = statisticsManager.getCompletionRate();
  const avgTime = statisticsManager.getAverageTime();
  
  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <>
      <div className="stats-backdrop" onClick={onClose} />
      <div className="stats-modal">
        <div className="stats-header">
          <h2>Your Statistics</h2>
          <button className="stats-close" onClick={onClose}>×</button>
        </div>
        
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-number">{stats.gamesPlayed}</div>
            <div className="stat-label">Games Played</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">{Math.round(completionRate)}%</div>
            <div className="stat-label">Win Rate</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">{stats.currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">{stats.bestStreak}</div>
            <div className="stat-label">Best Streak</div>
          </div>
        </div>
        
        <div className="stats-section">
          <h3>Best Times</h3>
          <div className="best-times">
            <div className="time-row">
              <span className="difficulty-label easy">Easy</span>
              <span className="time-value">{formatTime(stats.bestTimes.Easy)}</span>
            </div>
            <div className="time-row">
              <span className="difficulty-label medium">Medium</span>
              <span className="time-value">{formatTime(stats.bestTimes.Medium)}</span>
            </div>
            <div className="time-row">
              <span className="difficulty-label hard">Hard</span>
              <span className="time-value">{formatTime(stats.bestTimes.Hard)}</span>
            </div>
            <div className="time-row">
              <span className="difficulty-label expert">Expert</span>
              <span className="time-value">{formatTime(stats.bestTimes.Expert)}</span>
            </div>
          </div>
        </div>
        
        <div className="stats-section">
          <h3>Overall Performance</h3>
          <div className="performance-stats">
            <div className="perf-item">
              <span className="perf-icon">⏱</span>
              <div>
                <div className="perf-value">{formatTime(avgTime)}</div>
                <div className="perf-label">Average Time</div>
              </div>
            </div>
            
            <div className="perf-item">
              <span className="perf-icon">💡</span>
              <div>
                <div className="perf-value">{stats.hintsUsed}</div>
                <div className="perf-label">Total Hints</div>
              </div>
            </div>
          </div>
        </div>
        
        <button className="reset-stats" onClick={() => {
          if (confirm('Are you sure you want to reset all statistics?')) {
            statisticsManager.reset();
            onClose();
          }
        }}>
          Reset Statistics
        </button>
      </div>
    </>
  );
}