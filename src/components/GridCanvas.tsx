import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useBoardStore } from '../state/boardState';
import { cellCoords } from '../engine/types';
import styles from './GridCanvas.module.css';

export const GridCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    board,
    selectedCell,
    highlightedDigit,
    conflicts,
    showConflicts,
    selectCell,
    placeDigit,
    toggleCandidate,
    clearCell,
    pencilMode
  } = useBoardStore();
  
  // Calculate cell size based on viewport
  const calculateCellSize = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const maxGridWidth = Math.min(viewportWidth - 32, 544); // Max 544px with padding
    const maxGridHeight = viewportHeight * 0.5; // Use max 50% of viewport height on mobile
    const maxSize = Math.min(maxGridWidth, maxGridHeight);
    return Math.floor(maxSize / 9);
  };
  
  const [cellSize, setCellSize] = useState(calculateCellSize);
  const GRID_SIZE = cellSize * 9;
  const CANVAS_SIZE = GRID_SIZE + 4;
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setCellSize(calculateCellSize());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear and set background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Draw cell backgrounds
    for (let cell = 0; cell < 81; cell++) {
      const [row, col] = cellCoords(cell);
      const x = col * cellSize + 2;
      const y = row * cellSize + 2;
      
      // Cell background colors
      if (selectedCell === cell) {
        // Selected cell - use CSS variable color
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--pastel-lavender');
        ctx.fillRect(x, y, cellSize, cellSize);
      } else if (selectedCell !== null) {
        const [selRow, selCol] = cellCoords(selectedCell);
        if (row === selRow || col === selCol || 
            (Math.floor(row / 3) === Math.floor(selRow / 3) && 
             Math.floor(col / 3) === Math.floor(selCol / 3))) {
          // Related cells - very light version
          const primary = getComputedStyle(document.documentElement).getPropertyValue('--pastel-lavender');
          ctx.fillStyle = primary + '33'; // Add transparency
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }
      
      // Highlight cells with same digit
      const cellData = board[cell];
      if (highlightedDigit && cellData.value === highlightedDigit) {
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--pastel-sky') || '#D6E5FA';
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }
    
    // Draw grid lines - thin lines
    ctx.strokeStyle = '#E0E0E8';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 9; i++) {
      if (i % 3 !== 0) {
        const pos = i * cellSize + 2;
        ctx.beginPath();
        ctx.moveTo(pos, 2);
        ctx.lineTo(pos, GRID_SIZE + 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(2, pos);
        ctx.lineTo(GRID_SIZE + 2, pos);
        ctx.stroke();
      }
    }
    
    // Draw box borders - thick lines with primary color
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary');
    ctx.lineWidth = 2;
    for (let i = 0; i <= 3; i++) {
      const pos = i * cellSize * 3 + 2;
      ctx.beginPath();
      ctx.moveTo(pos, 2);
      ctx.lineTo(pos, GRID_SIZE + 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(2, pos);
      ctx.lineTo(GRID_SIZE + 2, pos);
      ctx.stroke();
    }
    
    // Draw numbers and candidates
    for (let cell = 0; cell < 81; cell++) {
      const [row, col] = cellCoords(cell);
      const x = col * cellSize + 2;
      const y = row * cellSize + 2;
      const cellData = board[cell];
      
      if (cellData.value !== 0) {
        // Draw value - scale font with cell size
        const fontSize = Math.floor(cellSize * 0.45);
        ctx.font = cellData.given ? `bold ${fontSize}px Inter, sans-serif` : `${fontSize}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Color based on state
        if (showConflicts && conflicts.has(cell)) {
          ctx.fillStyle = '#FF8B8B'; // Pastel red for conflicts
        } else if (cellData.given) {
          ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
        } else {
          ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-dark');
        }
        
        ctx.fillText(cellData.value.toString(), x + cellSize / 2, y + cellSize / 2);
      } else if (cellData.candidates !== 0) {
        // Draw candidates with pastel colors - scale font
        const candidateFontSize = Math.floor(cellSize * 0.2);
        ctx.font = `${candidateFontSize}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let digit = 1; digit <= 9; digit++) {
          if (cellData.candidates & (1 << (digit - 1))) {
            const candidateSpacing = cellSize * 0.3;
            const candidateOffset = cellSize * 0.2;
            const dx = ((digit - 1) % 3) * candidateSpacing + candidateOffset;
            const dy = Math.floor((digit - 1) / 3) * candidateSpacing + candidateOffset;
            
            if (highlightedDigit === digit) {
              // Highlight background for this candidate
              ctx.fillStyle = '#FFE5CC'; // Pastel peach
              const boxSize = cellSize * 0.22;
              ctx.fillRect(x + dx - boxSize/2, y + dy - boxSize/2, boxSize, boxSize);
              ctx.fillStyle = '#4A4A5C';
            } else {
              ctx.fillStyle = '#B8B8C8'; // Light gray for candidates
            }
            
            ctx.fillText(digit.toString(), x + dx, y + dy);
          }
        }
      }
    }
    
    // Draw selection border
    if (selectedCell !== null) {
      const [row, col] = cellCoords(selectedCell);
      const x = col * cellSize + 2;
      const y = row * cellSize + 2;
      
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary');
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
    }
  }, [board, selectedCell, highlightedDigit, conflicts, showConflicts, cellSize, GRID_SIZE, CANVAS_SIZE]);
  
  useEffect(() => {
    draw();
  }, [draw]);
  
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 2;
    const y = e.clientY - rect.top - 2;
    
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    if (row >= 0 && row < 9 && col >= 0 && col < 9) {
      const cell = row * 9 + col;
      selectCell(cell);
    }
  }, [cellSize, selectCell]);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedCell === null) return;
    
    const key = e.key;
    
    if (key >= '1' && key <= '9') {
      const digit = parseInt(key);
      if (pencilMode || e.shiftKey) {
        toggleCandidate(selectedCell, digit);
      } else {
        placeDigit(selectedCell, digit);
      }
    } else if (key === '0' || key === 'Backspace' || key === 'Delete') {
      clearCell(selectedCell);
    } else if (key === 'ArrowUp' && selectedCell >= 9) {
      selectCell(selectedCell - 9);
    } else if (key === 'ArrowDown' && selectedCell < 72) {
      selectCell(selectedCell + 9);
    } else if (key === 'ArrowLeft' && selectedCell % 9 > 0) {
      selectCell(selectedCell - 1);
    } else if (key === 'ArrowRight' && selectedCell % 9 < 8) {
      selectCell(selectedCell + 1);
    }
  }, [selectedCell, pencilMode, placeDigit, toggleCandidate, clearCell, selectCell]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  const handleTouch = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    const x = touch.clientX - rect.left - 2;
    const y = touch.clientY - rect.top - 2;
    
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    if (row >= 0 && row < 9 && col >= 0 && col < 9) {
      const cell = row * 9 + col;
      selectCell(cell);
    }
  }, [cellSize, selectCell]);

  return (
    <div ref={containerRef} className="canvas-container">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className={styles.canvas}
        onClick={handleClick}
        onTouchEnd={handleTouch}
      />
    </div>
  );
};