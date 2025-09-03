export interface Theme {
  name: string;
  icon: string;
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    
    pastelAccent1: string;
    pastelAccent2: string;
    pastelAccent3: string;
    pastelAccent4: string;
    
    background: string;
    surface: string;
    cardBg: string;
    
    textPrimary: string;
    textSecondary: string;
    
    gridLines: string;
    gridThick: string;
    selectedCell: string;
    relatedCells: string;
    highlightDigit: string;
    candidateHighlight: string;
    
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export const THEMES: Record<string, Theme> = {
  lavender: {
    name: 'Lavender Dreams',
    icon: '💜',
    colors: {
      primary: '#B8A9E5',
      primaryLight: '#D4C9F0',
      primaryDark: '#9B89D6',
      
      pastelAccent1: '#E8E3F5',
      pastelAccent2: '#FADADD',
      pastelAccent3: '#FFE5CC',
      pastelAccent4: '#FFF9E6',
      
      background: 'linear-gradient(135deg, #F5F3FF 0%, #FFEEF8 50%, #E8F3FF 100%)',
      surface: '#FAFBFD',
      cardBg: 'rgba(255, 255, 255, 0.7)',
      
      textPrimary: '#4A4A5C',
      textSecondary: '#8E8EA0',
      
      gridLines: '#E0E0E8',
      gridThick: '#B8A9E5',
      selectedCell: '#E8E3F5',
      relatedCells: '#F8F6FC',
      highlightDigit: '#D6E5FA',
      candidateHighlight: '#FFE5CC',
      
      success: '#A8D8C8',
      warning: '#FFD4A3',
      error: '#FFB8B8',
      info: '#B8D4F1'
    }
  },
  
  mint: {
    name: 'Mint Breeze',
    icon: '🌿',
    colors: {
      primary: '#95D5B2',
      primaryLight: '#B7E4C7',
      primaryDark: '#74C69D',
      
      pastelAccent1: '#D5F2E3',
      pastelAccent2: '#E0F5FF',
      pastelAccent3: '#FFF4E6',
      pastelAccent4: '#FFE8F3',
      
      background: 'linear-gradient(135deg, #E8F5E9 0%, #E0F2F1 50%, #E8F8F5 100%)',
      surface: '#F8FDFA',
      cardBg: 'rgba(255, 255, 255, 0.7)',
      
      textPrimary: '#2D5F3F',
      textSecondary: '#5A8F6A',
      
      gridLines: '#D4E9DC',
      gridThick: '#95D5B2',
      selectedCell: '#D5F2E3',
      relatedCells: '#EDFAF3',
      highlightDigit: '#D0F0FF',
      candidateHighlight: '#FFF4E6',
      
      success: '#95D5B2',
      warning: '#FFD093',
      error: '#FFB4B4',
      info: '#A8D5FF'
    }
  },
  
  sakura: {
    name: 'Sakura Bloom',
    icon: '🌸',
    colors: {
      primary: '#FFB7D1',
      primaryLight: '#FFCCE0',
      primaryDark: '#FF9EC7',
      
      pastelAccent1: '#FFE1EC',
      pastelAccent2: '#FFF0E6',
      pastelAccent3: '#E6F3FF',
      pastelAccent4: '#F0E6FF',
      
      background: 'linear-gradient(135deg, #FFE8F1 0%, #FFF5E6 50%, #FFE8E8 100%)',
      surface: '#FFFBFD',
      cardBg: 'rgba(255, 255, 255, 0.7)',
      
      textPrimary: '#5C3A4A',
      textSecondary: '#A07585',
      
      gridLines: '#F5DDE7',
      gridThick: '#FFB7D1',
      selectedCell: '#FFE1EC',
      relatedCells: '#FFF5F8',
      highlightDigit: '#E6F3FF',
      candidateHighlight: '#FFF0E6',
      
      success: '#B8DFC8',
      warning: '#FFCE93',
      error: '#FFB7B7',
      info: '#B7D1FF'
    }
  },
  
  ocean: {
    name: 'Ocean Mist',
    icon: '🌊',
    colors: {
      primary: '#96CEB4',
      primaryLight: '#B4DFC9',
      primaryDark: '#7AB89F',
      
      pastelAccent1: '#D6E5FA',
      pastelAccent2: '#E0F4FF',
      pastelAccent3: '#FFF9E6',
      pastelAccent4: '#F0E8FF',
      
      background: 'linear-gradient(135deg, #E3F2FD 0%, #E0F7FA 50%, #E8F5FF 100%)',
      surface: '#F8FCFF',
      cardBg: 'rgba(255, 255, 255, 0.7)',
      
      textPrimary: '#3A4F5C',
      textSecondary: '#6B8A9F',
      
      gridLines: '#D8E9F0',
      gridThick: '#96CEB4',
      selectedCell: '#D6E5FA',
      relatedCells: '#F0F7FC',
      highlightDigit: '#FFE8CC',
      candidateHighlight: '#FFF9E6',
      
      success: '#96CEB4',
      warning: '#FFD993',
      error: '#FFB8B8',
      info: '#96C3EB'
    }
  },
  
  sunset: {
    name: 'Sunset Glow',
    icon: '🌅',
    colors: {
      primary: '#FFAB91',
      primaryLight: '#FFCCBC',
      primaryDark: '#FF8A65',
      
      pastelAccent1: '#FFE5CC',
      pastelAccent2: '#FFD6E0',
      pastelAccent3: '#FFF4B8',
      pastelAccent4: '#E8D5FF',
      
      background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE8E0 50%, #FFF8E1 100%)',
      surface: '#FFFBF7',
      cardBg: 'rgba(255, 255, 255, 0.7)',
      
      textPrimary: '#5C4033',
      textSecondary: '#9A6B5C',
      
      gridLines: '#F5E1D3',
      gridThick: '#FFAB91',
      selectedCell: '#FFE5CC',
      relatedCells: '#FFF7F0',
      highlightDigit: '#FFD6E0',
      candidateHighlight: '#FFF4B8',
      
      success: '#B8D4A8',
      warning: '#FFAB91',
      error: '#FFB8B8',
      info: '#B8C8FF'
    }
  },
  
  cosmic: {
    name: 'Cosmic Dust',
    icon: '✨',
    colors: {
      primary: '#C8B6E2',
      primaryLight: '#DDD0F0',
      primaryDark: '#B299D8',
      
      pastelAccent1: '#E8E3F5',
      pastelAccent2: '#FFE3F1',
      pastelAccent3: '#E3F0FF',
      pastelAccent4: '#FFF3E3',
      
      background: 'linear-gradient(135deg, #F3E7F7 0%, #E7E3FF 50%, #F0E7FF 100%)',
      surface: '#FAF9FD',
      cardBg: 'rgba(255, 255, 255, 0.7)',
      
      textPrimary: '#4A3C5C',
      textSecondary: '#8B7AA0',
      
      gridLines: '#E5DDF0',
      gridThick: '#C8B6E2',
      selectedCell: '#E8E3F5',
      relatedCells: '#F8F5FC',
      highlightDigit: '#E3F0FF',
      candidateHighlight: '#FFE3F1',
      
      success: '#B6E2D3',
      warning: '#FAE1C8',
      error: '#F7C8CC',
      info: '#C8D6E2'
    }
  }
};

export function applyTheme(themeName: string): void {
  const theme = THEMES[themeName];
  if (!theme) return;
  
  const root = document.documentElement;
  const { colors } = theme;
  
  root.style.setProperty('--primary', colors.primary);
  root.style.setProperty('--primary-light', colors.primaryLight);
  root.style.setProperty('--primary-dark', colors.primaryDark);
  
  root.style.setProperty('--pastel-lavender', colors.pastelAccent1);
  root.style.setProperty('--pastel-pink', colors.pastelAccent2);
  root.style.setProperty('--pastel-peach', colors.pastelAccent3);
  root.style.setProperty('--pastel-yellow', colors.pastelAccent4);
  
  root.style.setProperty('--background', colors.background);
  root.style.setProperty('--surface', colors.surface);
  root.style.setProperty('--card-bg', colors.cardBg);
  
  root.style.setProperty('--text-primary', colors.textPrimary);
  root.style.setProperty('--text-secondary', colors.textSecondary);
  
  root.style.setProperty('--success', colors.success);
  root.style.setProperty('--warning', colors.warning);
  root.style.setProperty('--error', colors.error);
  root.style.setProperty('--info', colors.info);
  
  // Save to localStorage
  localStorage.setItem('sudoku-theme', themeName);
}

export function getStoredTheme(): string {
  return localStorage.getItem('sudoku-theme') || 'lavender';
}

export function initializeTheme(): void {
  const stored = getStoredTheme();
  applyTheme(stored);
}