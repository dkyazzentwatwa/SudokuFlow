import { useEffect, useRef } from 'react';

export interface AnimationConfig {
  duration?: number;
  easing?: string;
  scale?: number;
  opacity?: number;
}

export function useNumberPlacement() {
  const animationsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  
  const animateCell = (
    cellIndex: number, 
    canvas: HTMLCanvasElement,
    callback?: () => void
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const CELL_SIZE = 60;
    const row = Math.floor(cellIndex / 9);
    const col = cellIndex % 9;
    const x = col * CELL_SIZE + 2 + CELL_SIZE / 2;
    const y = row * CELL_SIZE + 2 + CELL_SIZE / 2;
    
    // Clear any existing animation for this cell
    if (animationsRef.current.has(cellIndex)) {
      clearTimeout(animationsRef.current.get(cellIndex)!);
    }
    
    // Create ripple effect
    let rippleRadius = 0;
    let rippleOpacity = 0.5;
    const maxRadius = CELL_SIZE / 2;
    
    const animate = () => {
      if (rippleRadius < maxRadius) {
        // Draw ripple
        ctx.save();
        ctx.globalAlpha = rippleOpacity;
        ctx.strokeStyle = getComputedStyle(document.documentElement)
          .getPropertyValue('--primary');
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, rippleRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        
        rippleRadius += 3;
        rippleOpacity -= 0.02;
        
        requestAnimationFrame(animate);
      } else {
        animationsRef.current.delete(cellIndex);
        if (callback) callback();
      }
    };
    
    animate();
  };
  
  const animatePlacement = (cellIndex: number, isCorrect: boolean = true) => {
    const element = document.querySelector(`[data-cell="${cellIndex}"]`);
    if (!element) return;
    
    // Add animation class
    element.classList.add(isCorrect ? 'place-success' : 'place-error');
    
    // Remove class after animation
    setTimeout(() => {
      element.classList.remove('place-success', 'place-error');
    }, 300);
  };
  
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      animationsRef.current.forEach(timeout => clearTimeout(timeout));
      animationsRef.current.clear();
    };
  }, []);
  
  return { animateCell, animatePlacement };
}

export function useRippleEffect() {
  const createRipple = (event: MouseEvent, container: HTMLElement) => {
    const ripple = document.createElement('span');
    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    container.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };
  
  return { createRipple };
}

export function useCelebrationAnimation() {
  const celebrate = () => {
    // Create confetti elements
    const colors = [
      'var(--primary)',
      'var(--pastel-lavender)',
      'var(--pastel-pink)',
      'var(--pastel-peach)',
      'var(--pastel-mint)',
      'var(--pastel-sky)'
    ];
    
    const confettiCount = 50;
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
      confetti.style.setProperty('--delay', `${Math.random() * 0.5}s`);
      confetti.style.setProperty('--duration', `${2 + Math.random() * 2}s`);
      confetti.style.setProperty('--x', `${Math.random() * 200 - 100}vw`);
      confetti.style.left = `${Math.random() * 100}%`;
      container.appendChild(confetti);
    }
    
    setTimeout(() => {
      container.remove();
    }, 4000);
  };
  
  return { celebrate };
}