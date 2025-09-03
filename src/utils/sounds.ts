class SoundManager {
  private enabled: boolean = true;
  private volume: number = 0.5;
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  
  constructor() {
    this.enabled = localStorage.getItem('sudoku-sounds') !== 'false';
    this.volume = parseFloat(localStorage.getItem('sudoku-volume') || '0.5');
    this.initAudioContext();
  }
  
  private initAudioContext() {
    if (typeof window !== 'undefined' && window.AudioContext) {
      this.audioContext = new AudioContext();
      this.createSounds();
    }
  }
  
  private createSounds() {
    if (!this.audioContext) return;
    
    // Create simple synthesized sounds
    this.createClickSound();
    this.createSuccessSound();
    this.createErrorSound();
    this.createVictorySound();
  }
  
  private createClickSound() {
    if (!this.audioContext) return;
    
    const buffer = this.audioContext.createBuffer(1, 4410, 44100);
    const channel = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
      channel[i] = Math.sin(2 * Math.PI * 600 * i / 44100) * Math.exp(-i / 1000);
    }
    
    this.sounds.set('click', buffer);
  }
  
  private createSuccessSound() {
    if (!this.audioContext) return;
    
    const buffer = this.audioContext.createBuffer(1, 8820, 44100);
    const channel = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
      const freq = 523.25 + (659.25 - 523.25) * (i / buffer.length); // C5 to E5
      channel[i] = Math.sin(2 * Math.PI * freq * i / 44100) * Math.exp(-i / 4000) * 0.3;
    }
    
    this.sounds.set('success', buffer);
  }
  
  private createErrorSound() {
    if (!this.audioContext) return;
    
    const buffer = this.audioContext.createBuffer(1, 4410, 44100);
    const channel = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
      channel[i] = (Math.random() * 2 - 1) * Math.exp(-i / 500) * 0.2;
    }
    
    this.sounds.set('error', buffer);
  }
  
  private createVictorySound() {
    if (!this.audioContext) return;
    
    const buffer = this.audioContext.createBuffer(1, 22050, 44100);
    const channel = buffer.getChannelData(0);
    
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    for (let i = 0; i < buffer.length; i++) {
      const noteIndex = Math.floor(i / (buffer.length / notes.length));
      const freq = notes[Math.min(noteIndex, notes.length - 1)];
      channel[i] = Math.sin(2 * Math.PI * freq * i / 44100) * Math.exp(-i / 8000) * 0.4;
    }
    
    this.sounds.set('victory', buffer);
  }
  
  play(soundName: 'click' | 'success' | 'error' | 'victory') {
    if (!this.enabled || !this.audioContext) return;
    
    const buffer = this.sounds.get(soundName);
    if (!buffer) return;
    
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    gainNode.gain.value = this.volume;
    
    source.start(0);
  }
  
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('sudoku-sounds', enabled.toString());
  }
  
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('sudoku-volume', this.volume.toString());
  }
  
  getEnabled() {
    return this.enabled;
  }
  
  getVolume() {
    return this.volume;
  }
}

export const soundManager = new SoundManager();