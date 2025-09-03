interface GameStats {
  gamesPlayed: number;
  gamesCompleted: number;
  currentStreak: number;
  bestStreak: number;
  totalTime: number;
  bestTimes: {
    Easy: number | null;
    Medium: number | null;
    Hard: number | null;
    Expert: number | null;
  };
  averageTimes: {
    Easy: number;
    Medium: number;
    Hard: number;
    Expert: number;
  };
  hintsUsed: number;
  mistakesMade: number;
  lastPlayed: string | null;
}

const STORAGE_KEY = 'sudoku-statistics';

class StatisticsManager {
  private stats: GameStats;
  
  constructor() {
    this.stats = this.loadStats();
  }
  
  private loadStats(): GameStats {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    return {
      gamesPlayed: 0,
      gamesCompleted: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalTime: 0,
      bestTimes: {
        Easy: null,
        Medium: null,
        Hard: null,
        Expert: null
      },
      averageTimes: {
        Easy: 0,
        Medium: 0,
        Hard: 0,
        Expert: 0
      },
      hintsUsed: 0,
      mistakesMade: 0,
      lastPlayed: null
    };
  }
  
  private saveStats() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.stats));
  }
  
  startGame() {
    this.stats.gamesPlayed++;
    this.saveStats();
  }
  
  completeGame(
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert',
    time: number,
    hints: number,
    mistakes: number
  ) {
    this.stats.gamesCompleted++;
    this.stats.totalTime += time;
    this.stats.hintsUsed += hints;
    this.stats.mistakesMade += mistakes;
    
    // Update best time
    if (!this.stats.bestTimes[difficulty] || time < this.stats.bestTimes[difficulty]!) {
      this.stats.bestTimes[difficulty] = time;
    }
    
    // Update average time
    const gamesForDifficulty = this.getGamesForDifficulty(difficulty);
    this.stats.averageTimes[difficulty] = 
      (this.stats.averageTimes[difficulty] * (gamesForDifficulty - 1) + time) / gamesForDifficulty;
    
    // Update streak
    const today = new Date().toDateString();
    const lastPlayed = this.stats.lastPlayed ? new Date(this.stats.lastPlayed).toDateString() : null;
    
    if (lastPlayed === today || this.isYesterday(this.stats.lastPlayed)) {
      this.stats.currentStreak++;
    } else {
      this.stats.currentStreak = 1;
    }
    
    if (this.stats.currentStreak > this.stats.bestStreak) {
      this.stats.bestStreak = this.stats.currentStreak;
    }
    
    this.stats.lastPlayed = new Date().toISOString();
    this.saveStats();
  }
  
  private isYesterday(dateStr: string | null): boolean {
    if (!dateStr) return false;
    
    const date = new Date(dateStr);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return date.toDateString() === yesterday.toDateString();
  }
  
  private getGamesForDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert'): number {
    // This is a simplification - in a real app, we'd track games per difficulty
    return Math.max(1, Math.floor(this.stats.gamesCompleted / 4));
  }
  
  getStats(): GameStats {
    return { ...this.stats };
  }
  
  getCompletionRate(): number {
    if (this.stats.gamesPlayed === 0) return 0;
    return (this.stats.gamesCompleted / this.stats.gamesPlayed) * 100;
  }
  
  getAverageTime(): number {
    if (this.stats.gamesCompleted === 0) return 0;
    return Math.floor(this.stats.totalTime / this.stats.gamesCompleted);
  }
  
  reset() {
    this.stats = {
      gamesPlayed: 0,
      gamesCompleted: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalTime: 0,
      bestTimes: {
        Easy: null,
        Medium: null,
        Hard: null,
        Expert: null
      },
      averageTimes: {
        Easy: 0,
        Medium: 0,
        Hard: 0,
        Expert: 0
      },
      hintsUsed: 0,
      mistakesMade: 0,
      lastPlayed: null
    };
    this.saveStats();
  }
}

export const statisticsManager = new StatisticsManager();