import { soundManager } from './sounds';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface AchievementProgress {
  firstWin: boolean;
  speedDemon: boolean;
  perfectGame: boolean;
  streakMaster: boolean;
  puzzleMaster: boolean;
  noHints: boolean;
  noteExpert: boolean;
  allDifficulties: Set<string>;
  gamesWon: number;
}

const STORAGE_KEY = 'sudoku-achievements';

class AchievementManager {
  private achievements: Map<string, Achievement>;
  private progress: AchievementProgress;
  private newUnlocks: Achievement[] = [];
  
  constructor() {
    this.achievements = new Map();
    this.progress = this.loadProgress();
    this.initAchievements();
  }
  
  private loadProgress(): AchievementProgress {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        allDifficulties: new Set(parsed.allDifficulties || [])
      };
    }
    
    return {
      firstWin: false,
      speedDemon: false,
      perfectGame: false,
      streakMaster: false,
      puzzleMaster: false,
      noHints: false,
      noteExpert: false,
      allDifficulties: new Set(),
      gamesWon: 0
    };
  }
  
  private saveProgress() {
    const toStore = {
      ...this.progress,
      allDifficulties: Array.from(this.progress.allDifficulties)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }
  
  private initAchievements() {
    const achievementList: Achievement[] = [
      {
        id: 'first-win',
        name: 'First Victory',
        description: 'Complete your first puzzle',
        icon: '🎯',
        unlocked: this.progress.firstWin
      },
      {
        id: 'speed-demon',
        name: 'Speed Demon',
        description: 'Complete any puzzle in under 5 minutes',
        icon: '⚡',
        unlocked: this.progress.speedDemon
      },
      {
        id: 'perfect-game',
        name: 'Perfect Game',
        description: 'Complete a puzzle without mistakes or hints',
        icon: '✨',
        unlocked: this.progress.perfectGame
      },
      {
        id: 'streak-master',
        name: 'Streak Master',
        description: 'Achieve a 7-day winning streak',
        icon: '🔥',
        unlocked: this.progress.streakMaster
      },
      {
        id: 'puzzle-master',
        name: 'Puzzle Master',
        description: 'Complete 50 puzzles',
        icon: '👑',
        unlocked: this.progress.puzzleMaster,
        progress: this.progress.gamesWon,
        maxProgress: 50
      },
      {
        id: 'no-hints',
        name: 'Independent Thinker',
        description: 'Complete 10 puzzles without using hints',
        icon: '🧠',
        unlocked: this.progress.noHints
      },
      {
        id: 'note-expert',
        name: 'Note Expert',
        description: 'Use auto-notes feature effectively',
        icon: '📝',
        unlocked: this.progress.noteExpert
      },
      {
        id: 'variety-player',
        name: 'Variety Player',
        description: 'Complete puzzles in all difficulty levels',
        icon: '🌈',
        unlocked: this.progress.allDifficulties.size === 4,
        progress: this.progress.allDifficulties.size,
        maxProgress: 4
      }
    ];
    
    achievementList.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
  }
  
  checkAchievements(
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert',
    time: number,
    hintsUsed: number,
    mistakes: number,
    currentStreak: number,
    autoNotesUsed: boolean
  ): Achievement[] {
    this.newUnlocks = [];
    
    // First Win
    if (!this.progress.firstWin) {
      this.unlock('first-win');
      this.progress.firstWin = true;
    }
    
    // Speed Demon (under 5 minutes)
    if (time < 300 && !this.progress.speedDemon) {
      this.unlock('speed-demon');
      this.progress.speedDemon = true;
    }
    
    // Perfect Game
    if (hintsUsed === 0 && mistakes === 0 && !this.progress.perfectGame) {
      this.unlock('perfect-game');
      this.progress.perfectGame = true;
    }
    
    // Streak Master
    if (currentStreak >= 7 && !this.progress.streakMaster) {
      this.unlock('streak-master');
      this.progress.streakMaster = true;
    }
    
    // Puzzle Master progress
    this.progress.gamesWon++;
    const puzzleMaster = this.achievements.get('puzzle-master')!;
    puzzleMaster.progress = this.progress.gamesWon;
    if (this.progress.gamesWon >= 50 && !this.progress.puzzleMaster) {
      this.unlock('puzzle-master');
      this.progress.puzzleMaster = true;
    }
    
    // No Hints (track separately in a real implementation)
    if (hintsUsed === 0 && this.progress.gamesWon % 10 === 0 && !this.progress.noHints) {
      this.unlock('no-hints');
      this.progress.noHints = true;
    }
    
    // Note Expert
    if (autoNotesUsed && !this.progress.noteExpert) {
      this.unlock('note-expert');
      this.progress.noteExpert = true;
    }
    
    // Variety Player
    this.progress.allDifficulties.add(difficulty);
    const varietyPlayer = this.achievements.get('variety-player')!;
    varietyPlayer.progress = this.progress.allDifficulties.size;
    if (this.progress.allDifficulties.size === 4 && !varietyPlayer.unlocked) {
      this.unlock('variety-player');
    }
    
    this.saveProgress();
    return this.newUnlocks;
  }
  
  private unlock(id: string) {
    const achievement = this.achievements.get(id);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      this.newUnlocks.push(achievement);
      soundManager.play('success');
    }
  }
  
  getAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }
  
  getUnlockedCount(): number {
    return Array.from(this.achievements.values()).filter(a => a.unlocked).length;
  }
  
  reset() {
    this.progress = {
      firstWin: false,
      speedDemon: false,
      perfectGame: false,
      streakMaster: false,
      puzzleMaster: false,
      noHints: false,
      noteExpert: false,
      allDifficulties: new Set(),
      gamesWon: 0
    };
    this.initAchievements();
    this.saveProgress();
  }
}

export const achievementManager = new AchievementManager();