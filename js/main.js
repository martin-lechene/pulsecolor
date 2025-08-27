/**
 * PulseColor - Audio-Reactive Visuals
 * Version: 3.0.0 | Enhanced Edition
 * 
 * 12+ Different Animations with Advanced Effects:
 * 1. Enhanced Blob Morphing (3D, Liquid Effects, Orbital Particles)
 * 2. Enhanced Particle System (Gravity, Trails, Connections)
 * 3. Enhanced Wave Forms (3D, Multiple Layers, Reflections)
 * 4. Enhanced Geometric Shapes (Morphing, 3D, Fractals)
 * 5. Enhanced Audio Spectrum (3D, Dynamic Modes, Particles)
 * 6. Circular Waves
 * 7. Matrix Rain
 * 8. Fireworks
 * 9. DNA Helix
 * 10. Fractal Trees
 * 11. NEW: Neural Network (AI-inspired, Learning)
 * 12. NEW: Quantum Particles (Wave-Particle Duality)
 */

class PulseColor {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.sourceNode = null;
    this.dataArray = null;
    this.audio = null;
    this.rafId = null;
    this.started = false;
    this.currentAnimation = 'blob';
    this.animations = {};
    
    // Performance tracking
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
    
    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.setupAnimations();
    this.updateYear();
    this.startPerformanceTracking();
  }

  setupElements() {
    // Audio controls
    this.micBtn = document.getElementById('micBtn');
    this.fileInput = document.getElementById('fileInput');
    this.playPause = document.getElementById('playPause');
    
    // Visual elements
    this.svg = document.getElementById('reactiveSVG');
    this.canvas = document.querySelector('.canvas');
    
    // Meters
    this.mBass = document.getElementById('m-bass');
    this.mMid = document.getElementById('m-mid');
    this.mHigh = document.getElementById('m-high');
    
    // Animation selector
    this.animationSelector = document.querySelector('.animation-selector');
    
    // Performance display
    this.msAvg = document.getElementById('msAvg');
  }

  setupEventListeners() {
    // Audio controls
    this.micBtn?.addEventListener('click', () => this.startMic());
    this.fileInput?.addEventListener('change', (e) => this.handleFileSelect(e));
    this.playPause?.addEventListener('click', () => this.togglePlayPause());
    
    // Animation selector
    this.setupAnimationSelector();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  setupAnimationSelector() {
    const animations = [
      { id: 'blob', name: 'Enhanced Blob', icon: '🫧' },
      { id: 'particles', name: 'Enhanced Particles', icon: '✨' },
      { id: 'waves', name: 'Enhanced Waves', icon: '🌊' },
      { id: 'geometric', name: 'Enhanced Geometric', icon: '🔷' },
      { id: 'bars', name: 'Enhanced Spectrum', icon: '📊' },
      { id: 'circular', name: 'Circular', icon: '⭕' },
      { id: 'matrix', name: 'Matrix', icon: '💻' },
      { id: 'fireworks', name: 'Fireworks', icon: '🎆' },
      { id: 'dna', name: 'DNA Helix', icon: '🧬' },
      { id: 'fractal', name: 'Fractal', icon: '🌳' },
      { id: 'neural', name: 'Neural Network', icon: '🧠' },
      { id: 'quantum', name: 'Quantum Particles', icon: '⚛️' }
    ];

    this.animationSelector.innerHTML = animations.map(anim => `
      <button class="animation-btn ${anim.id === 'blob' ? 'active' : ''}" 
              data-animation="${anim.id}" 
              aria-label="Switch to ${anim.name} animation">
        ${anim.icon} ${anim.name}
      </button>
    `).join('');

    this.animationSelector.addEventListener('click', (e) => {
      if (e.target.classList.contains('animation-btn')) {
        this.switchAnimation(e.target.dataset.animation);
      }
    });
  }

  setupAnimations() {
    // Initialize all animation systems with enhanced options
    this.animations = {
      blob: new BlobAnimation(this.svg, { enable3D: true, enableGlow: true }),
      particles: new ParticleAnimation(this.svg, { enable3D: true, enableGlow: true }),
      waves: new WaveAnimation(this.svg, { enable3D: true, enableGlow: true }),
      geometric: new GeometricAnimation(this.svg, { enable3D: true, enableGlow: true }),
      bars: new BarsAnimation(this.svg, { enable3D: true, enableGlow: true }),
      circular: new CircularAnimation(this.svg),
      matrix: new MatrixAnimation(this.svg),
      fireworks: new FireworksAnimation(this.svg),
      dna: new DNAAnimation(this.svg),
      fractal: new FractalAnimation(this.svg),
      neural: new NeuralNetworkAnimation(this.svg, { enable3D: true, enableGlow: true }),
      quantum: new QuantumParticlesAnimation(this.svg, { enable3D: true, enableGlow: true })
    };
  }

  switchAnimation(animationId) {
    // Update UI
    document.querySelectorAll('.animation-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.animation === animationId);
    });

    // Switch animation
    this.currentAnimation = animationId;
    
    // Clear current animation
    this.clearCanvas();
    
    // Initialize new animation
    this.animations[animationId].init();
    
    // Announce to screen readers
    this.announceToScreenReader(`Switched to ${animationId} animation`);
  }

  clearCanvas() {
    // Clear all animation elements except background
    const elementsToRemove = this.svg.querySelectorAll('g[id*="animation"], circle[id*="animation"], path[id*="animation"], rect[id*="animation"]');
    elementsToRemove.forEach(el => el.remove());
  }

  async startMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      this.setupAudioNodes(stream);
      this.started = true;
      this.playPause.disabled = true;
      this.micBtn.textContent = '🎤 Micro — ON';
      this.micBtn.classList.add('active');
      
      this.announceToScreenReader('Microphone activated');
    } catch (error) {
      console.error('Microphone access error:', error);
      this.showNotification('Accès micro refusé. Essayez un fichier audio.', 'error');
    }
  }

  handleFileSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      this.showNotification('Veuillez sélectionner un fichier audio.', 'error');
      return;
    }

    this.loadFile(file);
  }

  loadFile(file) {
    const url = URL.createObjectURL(file);
    this.audio = new Audio();
    this.audio.src = url;
    this.audio.crossOrigin = 'anonymous';
    
    this.audio.addEventListener('canplay', async () => {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = this.audioContext || new AudioCtx();
      const track = this.audioContext.createMediaElementSource(this.audio);
      this.setupAudioNodes(track);
      this.playPause.disabled = false;
      this.playPause.textContent = '▶︎ Lecture';
      
      this.showNotification(`Fichier chargé: ${file.name}`, 'success');
    }, { once: true });

    this.audio.addEventListener('error', () => {
      this.showNotification('Erreur lors du chargement du fichier audio.', 'error');
    });
  }

  setupAudioNodes(streamOrBufferSource) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.audioContext = this.audioContext || new AudioCtx();
    
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;
    
    const gain = this.audioContext.createGain();
    gain.gain.value = 1.0;

    if (streamOrBufferSource instanceof MediaStream) {
      this.sourceNode = this.audioContext.createMediaStreamSource(streamOrBufferSource);
    } else {
      this.sourceNode = streamOrBufferSource;
    }
    
    this.sourceNode.connect(gain);
    gain.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.startVisualization();
  }

  startVisualization() {
    this.stopVisualization();
    this.visualize();
  }

  stopVisualization() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  visualize() {
    this.rafId = requestAnimationFrame(() => this.visualize());
    
    if (!this.analyser || !this.dataArray) return;

    this.analyser.getByteFrequencyData(this.dataArray);
    const audioData = this.processAudioData();
    
    // Update meters
    this.updateMeters(audioData);
    
    // Update current animation
    this.animations[this.currentAnimation].update(audioData);
    
    // Update background
    this.updateBackground(audioData);
  }

  processAudioData() {
    const N = this.dataArray.length;
    const bassEnd = Math.floor(N * 0.08);
    const midEnd = Math.floor(N * 0.4);

    let bassSum = 0, midSum = 0, highSum = 0;
    
    for (let i = 0; i < N; i++) {
      const v = this.dataArray[i] / 255;
      if (i < bassEnd) bassSum += v;
      else if (i < midEnd) midSum += v;
      else highSum += v;
    }

    return {
      bass: bassSum / bassEnd,
      mid: midSum / (midEnd - bassEnd),
      high: highSum / (N - midEnd),
      raw: Array.from(this.dataArray),
      beat: this.detectBeat(bassSum / bassEnd)
    };
  }

  detectBeat(bassLevel) {
    const threshold = 0.35;
    const rising = bassLevel > (this.lastBassLevel || 0) && bassLevel > threshold;
    this.lastBassLevel = bassLevel;
    return rising;
  }

  updateMeters(audioData) {
    if (this.mBass) this.mBass.style.height = `${Math.max(4, audioData.bass * 100)}%`;
    if (this.mMid) this.mMid.style.height = `${Math.max(4, audioData.mid * 100)}%`;
    if (this.mHigh) this.mHigh.style.height = `${Math.max(4, audioData.high * 100)}%`;
  }

  updateBackground(audioData) {
    const hueA = Math.floor(this.lerp(200, 320, audioData.mid + (audioData.beat ? 0.2 : 0)));
    const hueB = Math.floor(this.lerp(160, 260, audioData.high));
    
    document.documentElement.style.setProperty('--bg-a', `${hueA} 95% ${60 + Math.floor((audioData.beat ? 20 : 0))}%`);
    document.documentElement.style.setProperty('--bg-b', `${hueB} 95% 60%`);
    document.documentElement.style.setProperty('--glow', String(0.2 + audioData.mid * 0.6));
  }

  togglePlayPause() {
    if (!this.audio) return;
    
    if (this.audio.paused) {
      this.audio.play().then(() => {
        this.playPause.textContent = '⏸︎ Pause';
        this.announceToScreenReader('Audio started');
      }).catch(error => {
        console.error('Playback error:', error);
        this.showNotification('Erreur lors de la lecture audio.', 'error');
      });
    } else {
      this.audio.pause();
      this.playPause.textContent = '▶︎ Lecture';
      this.announceToScreenReader('Audio paused');
    }
  }

  handleKeyboard(event) {
    switch(event.key) {
      case ' ':
        event.preventDefault();
        this.togglePlayPause();
        break;
      case 'm':
        if (!this.started) this.startMic();
        break;
      case '1': case '2': case '3': case '4': case '5':
      case '6': case '7': case '8': case '9': case '0':
      case '-': case '=':
        const animations = Object.keys(this.animations);
        let index;
        if (event.key === '0') index = 9;
        else if (event.key === '-') index = 10;
        else if (event.key === '=') index = 11;
        else index = parseInt(event.key) - 1;
        
        if (animations[index]) {
          this.switchAnimation(animations[index]);
        }
        break;
    }
  }

  startPerformanceTracking() {
    const trackPerformance = () => {
      this.frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - this.lastTime >= 1000) {
        this.fps = this.frameCount / ((currentTime - this.lastTime) / 1000);
        const ms = (1000 / this.fps).toFixed(1);
        
        if (this.msAvg) this.msAvg.textContent = ms;
        
        this.lastTime = currentTime;
        this.frameCount = 0;
      }
      
      requestAnimationFrame(trackPerformance);
    };
    
    requestAnimationFrame(trackPerformance);
  }

  updateYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // Utility functions
  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  // Accessibility
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PulseColor();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PulseColor;
}
