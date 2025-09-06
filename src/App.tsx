import { useState, useEffect } from 'react';
import { GridCanvas } from './components/GridCanvas';
import { MobileNumberPad } from './components/MobileNumberPad';
import { ThemePicker } from './components/ThemePicker';
import { VictoryModal } from './components/VictoryModal';
import { StatsModal } from './components/StatsModal';
import { AchievementModal } from './components/AchievementModal';
import { AchievementToast } from './components/AchievementToast';
import { useBoardStore } from './state/boardState';
import { parseBoard, isSolved } from './engine/board';
import { initializeTheme } from './utils/themes';
import { calculateAutoNotes } from './utils/autoNotes';
import { soundManager } from './utils/sounds';
import { statisticsManager } from './utils/statistics';
import { achievementManager, Achievement } from './utils/achievements';
import './App.css';
import './styles/animations.css';

const engineWorker = new Worker(
  new URL('./workers/engine.worker.ts', import.meta.url),
  { type: 'module' }
);

function App() {
  const {
    board,
    selectedCell,
    pencilMode,
    showConflicts,
    setPencilMode,
    setShowConflicts,
    undo,
    redo,
    setBoard,
    reset,
    applyStep,
    currentStep,
    setCurrentStep
  } = useBoardStore();
  
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Expert'>('Medium');
  const [loading, setLoading] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showVictory, setShowVictory] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [autoNotes, setAutoNotes] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundManager.getEnabled());
  const [showStats, setShowStats] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [autoNotesUsed, setAutoNotesUsed] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isTouchDevice || isSmallScreen);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Load initial puzzle and theme on mount
  useEffect(() => {
    initializeTheme();
    generatePuzzle();
  }, []);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showMenu && 
          !target.closest('.sidebar') && 
          !target.closest('.menu-button')) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);
  
  // Timer
  useEffect(() => {
    if (isTimerRunning) {
      const interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerRunning]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const generatePuzzle = () => {
    setLoading(true);
    setTimer(0);
    setIsTimerRunning(true);
    setShowVictory(false);
    setHintsUsed(0);
    setMistakes(0);
    statisticsManager.startGame();
    engineWorker.postMessage({ 
      type: 'generate', 
      options: { difficulty, symmetry: true } 
    });
    
    engineWorker.onmessage = (e) => {
      if (e.data.type === 'generate') {
        if (e.data.result) {
          setBoard(e.data.result);
        }
        setLoading(false);
      }
    };
  };
  
  const getHint = () => {
    engineWorker.postMessage({ type: 'hint', board });
    
    engineWorker.onmessage = (e) => {
      if (e.data.type === 'hint' && e.data.result) {
        setCurrentStep(e.data.result);
        setHintsUsed(prev => prev + 1);
        soundManager.play('click');
      }
    };
  };
  
  // Check for victory
  useEffect(() => {
    if (isSolved(board) && !showVictory) {
      setIsTimerRunning(false);
      setShowVictory(true);
      soundManager.play('victory');
      
      // Update statistics
      statisticsManager.completeGame(difficulty, timer, hintsUsed, mistakes);
      
      // Check achievements
      const stats = statisticsManager.getStats();
      const newAchievements = achievementManager.checkAchievements(
        difficulty,
        timer,
        hintsUsed,
        mistakes,
        stats.currentStreak,
        autoNotesUsed
      );
      
      // Show achievement notifications
      if (newAchievements.length > 0) {
        let delay = 0;
        newAchievements.forEach(achievement => {
          setTimeout(() => {
            setNewAchievement(achievement);
          }, delay);
          delay += 4500;
        });
      }
    }
  }, [board, showVictory, difficulty, timer, hintsUsed, mistakes, autoNotesUsed]);
  
  // Handle auto-notes
  const toggleAutoNotes = () => {
    if (!autoNotes) {
      const updatedBoard = calculateAutoNotes(board);
      setBoard(updatedBoard);
      soundManager.play('success');
      setAutoNotesUsed(true);
    }
    setAutoNotes(!autoNotes);
  };
  
  // Handle sound toggle
  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundManager.setEnabled(newState);
    if (newState) soundManager.play('click');
  };
  
  const importPuzzle = () => {
    const parsed = parseBoard(importText);
    if (parsed) {
      setBoard(parsed);
      setShowImport(false);
      setImportText('');
      setTimer(0);
      setIsTimerRunning(true);
    }
  };
  
  const solvePuzzle = () => {
    engineWorker.postMessage({ type: 'solveHuman', board });
    
    engineWorker.onmessage = (e) => {
      if (e.data.type === 'solveHuman' && e.data.result.solved) {
        setBoard(e.data.result.finalBoard);
        setIsTimerRunning(false);
      }
    };
  };
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          undo();
        } else if (e.key === 'y') {
          e.preventDefault();
          redo();
        }
      } else if (e.key === 'h' || e.key === 'H') {
        getHint();
      } else if (e.key === 'p' || e.key === 'P') {
        setPencilMode(!pencilMode);
      } else if (e.key === 'f' || e.key === 'F') {
        setFocusMode(!focusMode);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [pencilMode, setPencilMode, undo, redo, focusMode]);
  
  return (
    <div className={`app ${focusMode ? 'focus-mode' : ''}`}>
      <div className="game-wrapper">
        <header className="header">
          <div className="logo">
            <div className="logo-icon">数</div>
            <div className="logo-text">
              <h1>SudokuFlow</h1>
              <p className="tagline">Pure Logic</p>
            </div>
          </div>
          
          <div className="header-controls">
            <div className="timer">
              <span className="timer-icon">⏱</span>
              <span className="timer-text">{formatTime(timer)}</span>
            </div>
            
            {!isMobile && <ThemePicker />}
            
            {isMobile && (
              <button 
                className="hint-button-mobile"
                onClick={getHint}
                title="Get Hint"
              >
                <span className="hint-icon">💡</span>
              </button>
            )}
            
            <button 
              className="stats-button"
              onClick={() => setShowStats(true)}
              title="View Statistics"
            >
              <span className="stats-icon">📊</span>
            </button>
            
            {!isMobile && (
              <button 
                className="achievement-button"
                onClick={() => setShowAchievements(true)}
                title="View Achievements"
              >
                <span className="achievement-icon">🏆</span>
              </button>
            )}
            
            <button 
              className="menu-button"
              onClick={() => setShowMenu(!showMenu)}
            >
              <span className="menu-icon">☰</span>
            </button>
          </div>
        </header>
        
        <main className="main">
          <div className="game-area">
            <GridCanvas />
            
            {!isMobile && <div className="quick-controls">
              <button 
                className={`control-button ${pencilMode ? 'active' : ''}`}
                onClick={() => {
                  setPencilMode(!pencilMode);
                  soundManager.play('click');
                }}
                title="Pencil Mode (P)"
              >
                <span className="icon">✏️</span>
                <span className="label">Notes</span>
              </button>
              
              <button 
                className={`control-button ${autoNotes ? 'active' : ''}`}
                onClick={toggleAutoNotes}
                title="Auto Notes"
              >
                <span className="icon">🤖</span>
                <span className="label">Auto</span>
              </button>
              
              <button 
                className="control-button"
                onClick={() => {
                  undo();
                  soundManager.play('click');
                }}
                title="Undo (Ctrl+Z)"
              >
                <span className="icon">↶</span>
                <span className="label">Undo</span>
              </button>
              
              <button 
                className="control-button"
                onClick={redo}
                title="Redo (Ctrl+Y)"
              >
                <span className="icon">↷</span>
                <span className="label">Redo</span>
              </button>
              
              <button 
                className="control-button hint"
                onClick={getHint}
                title="Get Hint (H)"
              >
                <span className="icon">💡</span>
                <span className="label">Hint</span>
              </button>
              
              <button 
                className={`control-button ${showConflicts ? 'active' : ''}`}
                onClick={() => {
                  setShowConflicts(!showConflicts);
                  soundManager.play('click');
                }}
                title="Show Conflicts"
              >
                <span className="icon">⚠️</span>
                <span className="label">Check</span>
              </button>
              
              <button 
                className={`control-button ${soundEnabled ? 'active' : ''}`}
                onClick={toggleSound}
                title="Toggle Sound"
              >
                <span className="icon">{soundEnabled ? '🔊' : '🔇'}</span>
                <span className="label">Sound</span>
              </button>
              
              <button 
                className={`control-button ${focusMode ? 'active' : ''}`}
                onClick={() => setFocusMode(!focusMode)}
                title="Focus Mode (F)"
              >
                <span className="icon">🎯</span>
                <span className="label">Focus</span>
              </button>
            </div>}
            
            {currentStep && (
              <div className="hint-card">
                <div className="hint-header">
                  <h3>{currentStep.label}</h3>
                  <button 
                    className="hint-close"
                    onClick={() => setCurrentStep(null)}
                  >
                    ×
                  </button>
                </div>
                <p className="hint-text">{currentStep.rationale}</p>
                <div className="hint-actions">
                  <button 
                    className="hint-apply"
                    onClick={() => applyStep(currentStep)}
                  >
                    Apply Step
                  </button>
                  <button 
                    className="hint-dismiss"
                    onClick={() => setCurrentStep(null)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {showMenu && (
            <aside className="sidebar open">
            <div className="sidebar-section">
              <h3>New Game</h3>
              <div className="difficulty-selector">
                {(['Easy', 'Medium', 'Hard', 'Expert'] as const).map(level => (
                  <button
                    key={level}
                    className={`difficulty-button ${difficulty === level ? 'active' : ''}`}
                    onClick={() => setDifficulty(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <button 
                className="primary-button"
                onClick={generatePuzzle}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'New Puzzle'}
              </button>
            </div>
            
            <div className="sidebar-section">
              <h3>Actions</h3>
              <div className="action-buttons">
                <button onClick={reset} className="secondary-button">
                  Clear Board
                </button>
                <button onClick={solvePuzzle} className="secondary-button">
                  Auto Solve
                </button>
                <button 
                  onClick={() => setShowImport(!showImport)}
                  className="secondary-button"
                >
                  Import Puzzle
                </button>
              </div>
            </div>
            
            {showImport && (
              <div className="sidebar-section import-section">
                <h3>Import Puzzle</h3>
                <textarea
                  className="import-textarea"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste 81-character string..."
                  rows={3}
                />
                <div className="import-actions">
                  <button onClick={importPuzzle} className="primary-button small">
                    Import
                  </button>
                  <button 
                    onClick={() => {
                      setShowImport(false);
                      setImportText('');
                    }}
                    className="secondary-button small"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            <div className="sidebar-section">
              <h3>Keyboard Shortcuts</h3>
              <ul className="shortcuts">
                <li><kbd>1-9</kbd> Place digit</li>
                <li><kbd>Shift+1-9</kbd> Add note</li>
                <li><kbd>0/Del</kbd> Clear cell</li>
                <li><kbd>H</kbd> Get hint</li>
                <li><kbd>P</kbd> Toggle notes</li>
                <li><kbd>F</kbd> Focus mode</li>
                <li><kbd>Ctrl+Z/Y</kbd> Undo/Redo</li>
              </ul>
            </div>
          </aside>
          )}
        </main>
      </div>
      
      <VictoryModal
        isOpen={showVictory}
        onClose={() => setShowVictory(false)}
        time={timer}
        difficulty={difficulty}
        hintsUsed={hintsUsed}
        mistakes={mistakes}
        onNewGame={() => {
          setShowVictory(false);
          generatePuzzle();
        }}
      />
      
      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />
      
      <AchievementModal
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
      />
      
      <AchievementToast
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />
      
      <MobileNumberPad isVisible={isMobile && selectedCell !== null} />
    </div>
  );
}

export default App;