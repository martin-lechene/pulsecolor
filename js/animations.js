/**
 * PulseColor Animations - Enhanced Version
 * 10+ Audio-Reactive Visual Effects with Advanced Features
 * Refactored with modern JavaScript practices
 */

// Enhanced Base Animation Class with better practices
class BaseAnimation {
  constructor(svg, options = {}) {
    this.svg = svg;
    this.elements = [];
    this.options = {
      enableParticles: true,
      enableGlow: true,
      enable3D: true,
      colorMode: 'frequency', // 'frequency', 'beat', 'static'
      ...options
    };
    
    // Performance optimization
    this.frameCount = 0;
    this.lastUpdate = 0;
    this.fps = 60;
    
    // Audio data cache
    this.audioCache = {
      bass: 0,
      mid: 0,
      high: 0,
      beat: false,
      raw: new Uint8Array(128)
    };
    
    // Color utilities
    this.colorPalette = {
      bass: ['#ff006e', '#ff6b6b', '#ff8e53'],
      mid: ['#4ecdc4', '#45b7d1', '#96ceb4'],
      high: ['#feca57', '#ff9ff3', '#54a0ff'],
      beat: ['#ffffff', '#ffd700', '#ff6b6b']
    };
  }

  init() {
    this.setupFilters();
    this.setupGradients();
    this.createElements();
  }

  setupFilters() {
    // Create glow filter
    if (this.options.enableGlow) {
      const defs = this.createElement('defs');
      const filter = this.createElement('filter', { id: 'glow' });
      
      const feGaussianBlur = this.createElement('feGaussianBlur', {
        stdDeviation: '3',
        result: 'coloredBlur'
      });
      
      const feMerge = this.createElement('feMerge');
      feMerge.appendChild(this.createElement('feMergeNode', { in: 'coloredBlur' }));
      feMerge.appendChild(this.createElement('feMergeNode', { in: 'SourceGraphic' }));
      
      filter.appendChild(feGaussianBlur);
      filter.appendChild(feMerge);
      defs.appendChild(filter);
      this.svg.appendChild(defs);
    }
  }

  setupGradients() {
    // Create radial gradients for 3D effects
    if (this.options.enable3D) {
      const defs = this.svg.querySelector('defs') || this.createElement('defs');
      
      // Bass gradient
      const bassGradient = this.createElement('radialGradient', { id: 'bass-gradient' });
      bassGradient.appendChild(this.createElement('stop', { offset: '0%', 'stop-color': '#ff006e', 'stop-opacity': '1' }));
      bassGradient.appendChild(this.createElement('stop', { offset: '100%', 'stop-color': '#ff006e', 'stop-opacity': '0' }));
      defs.appendChild(bassGradient);
      
      // Mid gradient
      const midGradient = this.createElement('radialGradient', { id: 'mid-gradient' });
      midGradient.appendChild(this.createElement('stop', { offset: '0%', 'stop-color': '#4ecdc4', 'stop-opacity': '1' }));
      midGradient.appendChild(this.createElement('stop', { offset: '100%', 'stop-color': '#4ecdc4', 'stop-opacity': '0' }));
      defs.appendChild(midGradient);
      
      // High gradient
      const highGradient = this.createElement('radialGradient', { id: 'high-gradient' });
      highGradient.appendChild(this.createElement('stop', { offset: '0%', 'stop-color': '#feca57', 'stop-opacity': '1' }));
      highGradient.appendChild(this.createElement('stop', { offset: '100%', 'stop-color': '#feca57', 'stop-opacity': '0' }));
      defs.appendChild(highGradient);
      
      if (!this.svg.querySelector('defs')) {
        this.svg.appendChild(defs);
      }
    }
  }

  createElements() {
    // Override in subclasses
  }

  update(audioData) {
    // Performance optimization
    const now = performance.now();
    if (now - this.lastUpdate < 1000 / this.fps) return;
    this.lastUpdate = now;
    
    // Cache audio data
    this.audioCache = { ...audioData };
    this.frameCount++;
    
    // Override in subclasses
  }

  // Enhanced element creation with better error handling
  createElement(type, attributes = {}) {
    try {
      const element = document.createElementNS('http://www.w3.org/2000/svg', type);
      Object.entries(attributes).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          element.setAttribute(key, String(value));
        }
      });
      return element;
    } catch (error) {
      console.error(`Error creating SVG element ${type}:`, error);
      return null;
    }
  }

  addElement(element) {
    if (element) {
      this.svg.appendChild(element);
      this.elements.push(element);
    }
    return element;
  }

  // Enhanced color utilities
  getColorByFrequency(frequency, intensity = 1) {
    const colors = this.colorPalette[frequency] || this.colorPalette.mid;
    const index = Math.floor(intensity * (colors.length - 1));
    return colors[Math.min(index, colors.length - 1)];
  }

  getDynamicColor(audioData) {
    switch (this.options.colorMode) {
      case 'frequency':
        const maxFreq = Math.max(audioData.bass, audioData.mid, audioData.high);
        if (maxFreq === audioData.bass) return this.getColorByFrequency('bass', audioData.bass);
        if (maxFreq === audioData.mid) return this.getColorByFrequency('mid', audioData.mid);
        return this.getColorByFrequency('high', audioData.high);
      case 'beat':
        return audioData.beat ? this.getColorByFrequency('beat', 1) : this.getColorByFrequency('mid', 0.5);
      default:
        return this.getColorByFrequency('mid', 0.5);
    }
  }

  // Enhanced particle system
  createParticle(x, y, options = {}) {
    const particle = {
      x: x || Math.random() * 600,
      y: y || Math.random() * 600,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      size: Math.random() * 8 + 2,
      life: 1,
      maxLife: 1,
      color: options.color || 'white',
      element: null,
      ...options
    };

    particle.element = this.createElement('circle', {
      cx: particle.x,
      cy: particle.y,
      r: particle.size,
      fill: particle.color,
      'fill-opacity': '0.8',
      filter: this.options.enableGlow ? 'url(#glow)' : null
    });

    return particle;
  }

  updateParticle(particle, audioData) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life -= 0.02;

    if (particle.element) {
      particle.element.setAttribute('cx', particle.x);
      particle.element.setAttribute('cy', particle.y);
      particle.element.setAttribute('fill-opacity', particle.life);
    }

    return particle.life > 0;
  }

  // Enhanced 3D effects
  apply3DEffect(element, depth = 1) {
    if (!this.options.enable3D) return;
    
    const shadow = this.createElement('feDropShadow', {
      dx: depth * 2,
      dy: depth * 2,
      stdDeviation: depth * 3,
      'flood-color': 'rgba(0,0,0,0.3)'
    });
    
    const filter = this.createElement('filter', { id: `shadow-${Date.now()}` });
    filter.appendChild(shadow);
    element.setAttribute('filter', `url(#${filter.id})`);
  }

  // Enhanced cleanup
  clear() {
    this.elements.forEach(el => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    this.elements = [];
  }

  // Performance monitoring
  getPerformanceStats() {
    return {
      frameCount: this.frameCount,
      fps: this.fps,
      elementsCount: this.elements.length
    };
  }
}

// 1. Enhanced Blob Morphing Animation with Advanced Effects
class BlobAnimation extends BaseAnimation {
  constructor(svg, options = {}) {
    super(svg, { colorMode: 'frequency', ...options });
    this.blob = null;
    this.ring = null;
    this.innerWaves = [];
    this.orbitalParticles = [];
    this.liquidEffect = null;
  }

  createElements() {
    // Create enhanced ring with gradient
    this.ring = this.createElement('circle', {
      id: 'animation-ring',
      cx: '300',
      cy: '300',
      r: '120',
      fill: 'none',
      stroke: 'url(#bass-gradient)',
      'stroke-opacity': '0.85',
      'stroke-width': '8',
      'stroke-dasharray': '10,5',
      'stroke-dashoffset': '0'
    });
    this.addElement(this.ring);

    // Create liquid effect layer
    this.liquidEffect = this.createElement('path', {
      id: 'animation-liquid',
      fill: 'url(#mid-gradient)',
      'fill-opacity': '0.3',
      filter: 'url(#glow)'
    });
    this.addElement(this.liquidEffect);

    // Create enhanced blob with dynamic colors
    this.blob = this.createElement('path', {
      id: 'animation-blob',
      d: 'M120,0 C120,66 66,120 0,120 C-66,120 -120,66 -120,0 C-120,-66 -66,-120 0,-120 C66,-120 120,-66 120,0Z',
      fill: 'url(#bass-gradient)',
      'fill-opacity': '0.92',
      filter: 'url(#glow)',
      transform: 'translate(300,300)'
    });
    this.addElement(this.blob);

    // Create inner wave effects
    for (let i = 0; i < 3; i++) {
      const wave = this.createElement('path', {
        id: `animation-inner-wave-${i}`,
        fill: 'none',
        stroke: this.getColorByFrequency(['bass', 'mid', 'high'][i]),
        'stroke-width': '2',
        'stroke-opacity': '0.4',
        filter: 'url(#glow)'
      });
      this.addElement(wave);
      this.innerWaves.push(wave);
    }

    // Create orbital particles
    for (let i = 0; i < 8; i++) {
      const particle = this.createParticle(300, 300, {
        color: this.getColorByFrequency('high'),
        size: Math.random() * 4 + 2,
        orbital: true,
        angle: (i / 8) * Math.PI * 2,
        radius: 80 + Math.random() * 40
      });
      this.orbitalParticles.push(particle);
      this.addElement(particle.element);
    }

    // Apply 3D effects
    this.apply3DEffect(this.blob, 2);
    this.apply3DEffect(this.ring, 1);
  }

  update(audioData) {
    super.update(audioData);
    const { bass, mid, high, beat } = audioData;
    const time = Date.now() * 0.001;
    const ringBase = 120;
    const blobBase = 120;

    // Enhanced ring animation with rotation
    const r = ringBase + bass * 40 + (beat ? 16 : 0);
    this.ring.setAttribute('r', String(r));
    this.ring.setAttribute('stroke-width', String(6 + mid * 12));
    this.ring.setAttribute('stroke-dashoffset', String(time * 20));
    
    // Dynamic ring color
    const ringColor = this.getDynamicColor(audioData);
    this.ring.setAttribute('stroke', ringColor);

    // Enhanced blob morphing with liquid physics
    const points = 80; // More points for smoother morphing
    const kBass = 0.55 + bass * 0.45 + (beat ? 0.2 : 0);
    const kMid = 0.55 + mid * 0.35;
    const kHigh = 0.5 + high * 0.25;
    const radius = blobBase * (0.9 + bass * 0.15);
    
    const coords = [];
    for (let i = 0; i < points; i++) {
      const t = (i / points) * Math.PI * 2;
      
      // Complex wobble with multiple frequencies
      const wobble1 = Math.sin(t * 3 + time) * kMid;
      const wobble2 = Math.cos(t * 5 + time * 0.7) * kHigh;
      const wobble3 = Math.sin(t * 7 + time * 0.5) * kBass * 0.3;
      const wobble = wobble1 + wobble2 + wobble3;
      
      const rad = radius * (1 + wobble * 0.15);
      const x = Math.cos(t) * rad;
      const y = Math.sin(t) * rad;
      coords.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    
    // Smooth path with more control points
    let d = `M${coords[0]}`;
    for (let i = 1; i < coords.length; i += 3) {
      const p1 = coords[i] || coords[0];
      const p2 = coords[i + 1] || coords[1];
      const p3 = coords[i + 2] || coords[2];
      d += ` C${p1} ${p2} ${p3}`;
    }
    d += ' Z';
    
    this.blob.setAttribute('d', d);
    
    // Dynamic blob color
    const blobColor = this.getDynamicColor(audioData);
    this.blob.setAttribute('fill', blobColor);

    // Update liquid effect
    const liquidCoords = [];
    for (let i = 0; i < points; i++) {
      const t = (i / points) * Math.PI * 2;
      const liquidWobble = Math.sin(t * 2 + time * 0.5) * mid * 0.1;
      const rad = radius * (0.7 + liquidWobble);
      const x = Math.cos(t) * rad;
      const y = Math.sin(t) * rad;
      liquidCoords.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    
    let liquidD = `M${liquidCoords[0]}`;
    for (let i = 1; i < liquidCoords.length; i += 3) {
      const p1 = liquidCoords[i] || liquidCoords[0];
      const p2 = liquidCoords[i + 1] || liquidCoords[1];
      const p3 = liquidCoords[i + 2] || liquidCoords[2];
      liquidD += ` C${p1} ${p2} ${p3}`;
    }
    liquidD += ' Z';
    
    this.liquidEffect.setAttribute('d', liquidD);
    this.liquidEffect.setAttribute('transform', 'translate(300,300)');

    // Update inner waves
    this.innerWaves.forEach((wave, index) => {
      const waveCoords = [];
      const waveRadius = radius * (0.3 + index * 0.2);
      
      for (let i = 0; i < 50; i++) {
        const t = (i / 50) * Math.PI * 2;
        const waveWobble = Math.sin(t * (index + 2) + time * (index + 1)) * [bass, mid, high][index] * 0.1;
        const rad = waveRadius * (1 + waveWobble);
        const x = Math.cos(t) * rad;
        const y = Math.sin(t) * rad;
        waveCoords.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      
      let waveD = `M${waveCoords[0]}`;
      for (let i = 1; i < waveCoords.length; i++) {
        waveD += ` L${waveCoords[i]}`;
      }
      waveD += ' Z';
      
      wave.setAttribute('d', waveD);
      wave.setAttribute('transform', 'translate(300,300)');
      wave.setAttribute('stroke-opacity', 0.2 + [bass, mid, high][index] * 0.6);
    });

    // Update orbital particles
    this.orbitalParticles.forEach((particle, index) => {
      particle.angle += (0.02 + high * 0.01) * (1 + index * 0.1);
      particle.radius += Math.sin(time + index) * 2;
      
      particle.x = 300 + Math.cos(particle.angle) * particle.radius;
      particle.y = 300 + Math.sin(particle.angle) * particle.radius;
      
      if (particle.element) {
        particle.element.setAttribute('cx', particle.x);
        particle.element.setAttribute('cy', particle.y);
        particle.element.setAttribute('r', particle.size * (1 + beat * 0.5));
        particle.element.setAttribute('fill-opacity', 0.6 + (bass + mid + high) * 0.4);
      }
    });

    // Add beat pulse effect
    if (beat) {
      this.blob.style.transform = 'translate(300,300) scale(1.1)';
      setTimeout(() => {
        this.blob.style.transform = 'translate(300,300) scale(1)';
      }, 100);
    }
  }
}

// 2. Enhanced Particle System Animation with Advanced Effects
class ParticleAnimation extends BaseAnimation {
  constructor(svg, options = {}) {
    super(svg, { colorMode: 'frequency', ...options });
    this.particles = [];
    this.maxParticles = 80;
    this.gravityCenter = { x: 300, y: 300 };
    this.connectionLines = [];
    this.trailEffects = [];
  }

  createElements() {
    this.clear();
    this.particles = [];
    this.connectionLines = [];
    this.trailEffects = [];
    
    // Create particle container
    this.particleGroup = this.createElement('g', {
      id: 'animation-particles'
    });
    this.addElement(this.particleGroup);

    // Create connection lines container
    this.connectionGroup = this.createElement('g', {
      id: 'animation-connections'
    });
    this.addElement(this.connectionGroup);

    // Create trail effects container
    this.trailGroup = this.createElement('g', {
      id: 'animation-trails'
    });
    this.addElement(this.trailGroup);

    // Initialize particles with enhanced properties
    for (let i = 0; i < this.maxParticles; i++) {
      this.createEnhancedParticle();
    }

    // Create gravity center indicator
    this.gravityIndicator = this.createElement('circle', {
      cx: this.gravityCenter.x,
      cy: this.gravityCenter.y,
      r: '5',
      fill: 'url(#bass-gradient)',
      'fill-opacity': '0.6',
      filter: 'url(#glow)'
    });
    this.addElement(this.gravityIndicator);
  }

  createEnhancedParticle() {
    const particle = {
      x: Math.random() * 600,
      y: Math.random() * 600,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      size: Math.random() * 12 + 3,
      life: Math.random(),
      maxLife: 1,
      color: this.getColorByFrequency(['bass', 'mid', 'high'][Math.floor(Math.random() * 3)]),
      trail: [],
      maxTrailLength: 10,
      element: null,
      trailElement: null
    };

    // Create main particle
    particle.element = this.createElement('circle', {
      cx: particle.x,
      cy: particle.y,
      r: particle.size,
      fill: particle.color,
      'fill-opacity': '0.9',
      filter: 'url(#glow)'
    });

    // Create trail element
    particle.trailElement = this.createElement('path', {
      fill: 'none',
      stroke: particle.color,
      'stroke-width': '2',
      'stroke-opacity': '0.3',
      filter: 'url(#glow)'
    });

    this.particleGroup.appendChild(particle.element);
    this.trailGroup.appendChild(particle.trailElement);
    this.particles.push(particle);
  }

  update(audioData) {
    super.update(audioData);
    const { bass, mid, high, beat } = audioData;
    const time = Date.now() * 0.001;
    
    // Update gravity center based on audio
    this.gravityCenter.x = 300 + Math.sin(time * 0.5) * bass * 50;
    this.gravityCenter.y = 300 + Math.cos(time * 0.7) * mid * 50;
    
    if (this.gravityIndicator) {
      this.gravityIndicator.setAttribute('cx', this.gravityCenter.x);
      this.gravityIndicator.setAttribute('cy', this.gravityCenter.y);
      this.gravityIndicator.setAttribute('r', 5 + bass * 10);
    }

    // Clear previous connections
    this.connectionLines.forEach(line => line.remove());
    this.connectionLines = [];

    this.particles.forEach((particle, index) => {
      // Apply gravity towards center
      const dx = this.gravityCenter.x - particle.x;
      const dy = this.gravityCenter.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        const gravityForce = bass * 0.1;
        particle.vx += (dx / distance) * gravityForce;
        particle.vy += (dy / distance) * gravityForce;
      }

      // Update position with audio-reactive speed
      particle.x += particle.vx * (1 + bass * 0.3);
      particle.y += particle.vy * (1 + mid * 0.2);
      particle.life += 0.01;

      // Enhanced boundary handling with bounce
      if (particle.x < 0 || particle.x > 600) {
        particle.vx *= -0.8;
        particle.x = Math.max(0, Math.min(600, particle.x));
      }
      if (particle.y < 0 || particle.y > 600) {
        particle.vy *= -0.8;
        particle.y = Math.max(0, Math.min(600, particle.y));
      }

      // Update trail
      particle.trail.push({ x: particle.x, y: particle.y });
      if (particle.trail.length > particle.maxTrailLength) {
        particle.trail.shift();
      }

      // Update trail path
      if (particle.trail.length > 1) {
        let trailPath = `M${particle.trail[0].x},${particle.trail[0].y}`;
        for (let i = 1; i < particle.trail.length; i++) {
          trailPath += ` L${particle.trail[i].x},${particle.trail[i].y}`;
        }
        particle.trailElement.setAttribute('d', trailPath);
        particle.trailElement.setAttribute('stroke-opacity', 0.3 * (1 - particle.life * 0.5));
      }

      // Update size based on audio with pulsing effect
      const pulseSize = 1 + Math.sin(time * 5 + index) * 0.2;
      const newSize = particle.size * (1 + high * 0.5) * pulseSize;
      particle.element.setAttribute('r', newSize);

      // Update opacity with fade effect
      const opacity = 0.9 * (1 - particle.life * 0.3);
      particle.element.setAttribute('fill-opacity', opacity);

      // Update position
      particle.element.setAttribute('cx', particle.x);
      particle.element.setAttribute('cy', particle.y);

      // Dynamic color based on audio
      const dynamicColor = this.getDynamicColor(audioData);
      particle.element.setAttribute('fill', dynamicColor);
      particle.trailElement.setAttribute('stroke', dynamicColor);

      // Create connections between nearby particles
      this.particles.forEach((otherParticle, otherIndex) => {
        if (index !== otherIndex) {
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) + 
            Math.pow(particle.y - otherParticle.y, 2)
          );
          
          if (distance < 100 && distance > 0) {
            const connectionOpacity = (100 - distance) / 100 * 0.3;
            const connection = this.createElement('line', {
              x1: particle.x,
              y1: particle.y,
              x2: otherParticle.x,
              y2: otherParticle.y,
              stroke: this.getColorByFrequency('mid'),
              'stroke-width': '1',
              'stroke-opacity': connectionOpacity
            });
            this.connectionGroup.appendChild(connection);
            this.connectionLines.push(connection);
          }
        }
      });

      // Reset particle if it's too old
      if (particle.life > 1) {
        particle.x = Math.random() * 600;
        particle.y = Math.random() * 600;
        particle.life = 0;
        particle.vx = (Math.random() - 0.5) * 6;
        particle.vy = (Math.random() - 0.5) * 6;
        particle.trail = [];
        particle.color = this.getColorByFrequency(['bass', 'mid', 'high'][Math.floor(Math.random() * 3)]);
      }
    });

    // Add new particles on beat with enhanced spawning
    if (beat && this.particles.length < this.maxParticles) {
      for (let i = 0; i < 3; i++) {
        this.createEnhancedParticle();
      }
    }

    // Vortex effect on high frequencies
    if (high > 0.7) {
      this.particles.forEach(particle => {
        const dx = particle.x - 300;
        const dy = particle.y - 300;
        const angle = Math.atan2(dy, dx);
        const newAngle = angle + high * 0.1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        particle.x = 300 + Math.cos(newAngle) * distance;
        particle.y = 300 + Math.sin(newAngle) * distance;
      });
    }
  }
}

// 3. Enhanced Wave Forms Animation with 3D Effects and Multiple Layers
class WaveAnimation extends BaseAnimation {
  constructor(svg, options = {}) {
    super(svg, { colorMode: 'frequency', ...options });
    this.waves = [];
    this.waveCount = 8; // Increased from 3 to 8 for more complexity
    this.waveLayers = [];
    this.reflectionWaves = [];
  }

  createElements() {
    this.clear();
    this.waves = [];
    this.waveLayers = [];
    this.reflectionWaves = [];

    // Create multiple wave layers with different properties
    for (let i = 0; i < this.waveCount; i++) {
      const wave = this.createElement('path', {
        id: `animation-wave-${i}`,
        fill: 'none',
        stroke: this.getColorByFrequency(['bass', 'mid', 'high'][i % 3]),
        'stroke-width': String(2 + i * 0.5),
        'stroke-opacity': '0.6',
        filter: 'url(#glow)'
      });
      this.addElement(wave);
      this.waves.push(wave);
      this.waveLayers.push({
        frequency: ['bass', 'mid', 'high'][i % 3],
        phase: i * Math.PI / 4,
        speed: 0.01 + i * 0.002
      });
    }

    // Create reflection waves for 3D effect
    for (let i = 0; i < 4; i++) {
      const reflection = this.createElement('path', {
        id: `animation-reflection-${i}`,
        fill: 'none',
        stroke: this.getColorByFrequency(['bass', 'mid', 'high'][i % 3]),
        'stroke-width': '1',
        'stroke-opacity': '0.3',
        'stroke-dasharray': '5,5'
      });
      this.addElement(reflection);
      this.reflectionWaves.push(reflection);
    }

    // Create wave surface for 3D effect
    this.waveSurface = this.createElement('path', {
      fill: 'url(#mid-gradient)',
      'fill-opacity': '0.1',
      filter: 'url(#glow)'
    });
    this.addElement(this.waveSurface);
  }

  update(audioData) {
    super.update(audioData);
    const { bass, mid, high } = audioData;
    const time = Date.now() * 0.001;
    const frequencies = { bass, mid, high };

    // Update main waves with enhanced physics
    this.waves.forEach((wave, index) => {
      const layer = this.waveLayers[index];
      const frequency = frequencies[layer.frequency];
      const amplitude = 30 + frequency * 120;
      const wavelength = 40 + (1 - frequency) * 120;
      const phase = layer.phase + time * layer.speed;
      
      // Create complex wave path with multiple harmonics
      let path = 'M0,300 ';
      for (let x = 0; x <= 600; x += 3) { // Higher resolution
        const wave1 = Math.sin(x / wavelength + phase) * amplitude;
        const wave2 = Math.sin(x / (wavelength * 0.5) + phase * 1.5) * amplitude * 0.3;
        const wave3 = Math.sin(x / (wavelength * 0.25) + phase * 2) * amplitude * 0.1;
        const y = 300 + wave1 + wave2 + wave3;
        path += `L${x},${y} `;
      }
      
      wave.setAttribute('d', path);
      wave.setAttribute('stroke-opacity', 0.2 + frequency * 0.8);
      
      // Dynamic color based on frequency
      const color = this.getColorByFrequency(layer.frequency, frequency);
      wave.setAttribute('stroke', color);
      
      // Dynamic stroke width
      wave.setAttribute('stroke-width', String(2 + frequency * 4));
    });

    // Update reflection waves
    this.reflectionWaves.forEach((reflection, index) => {
      const frequency = frequencies[['bass', 'mid', 'high'][index % 3]];
      const amplitude = 20 + frequency * 60;
      const wavelength = 60 + (1 - frequency) * 80;
      const phase = time * (0.005 + index * 0.002);
      
      let path = 'M0,320 ';
      for (let x = 0; x <= 600; x += 5) {
        const y = 320 + Math.sin(x / wavelength + phase) * amplitude * 0.5;
        path += `L${x},${y} `;
      }
      
      reflection.setAttribute('d', path);
      reflection.setAttribute('stroke-opacity', 0.1 + frequency * 0.4);
      
      // Animate dash offset for moving effect
      reflection.setAttribute('stroke-dashoffset', String(time * 20 + index * 10));
    });

    // Update wave surface for 3D effect
    const surfacePath = this.createWaveSurface(audioData, time);
    this.waveSurface.setAttribute('d', surfacePath);
    this.waveSurface.setAttribute('fill-opacity', 0.05 + (bass + mid + high) * 0.1);

    // Add ripple effects on beat
    if (audioData.beat) {
      this.addRippleEffect(audioData, time);
    }
  }

  createWaveSurface(audioData, time) {
    const { bass, mid, high } = audioData;
    const amplitude = 50 + (bass + mid + high) * 100;
    const wavelength = 80;
    
    let path = 'M0,600 ';
    
    // Create surface from bottom to top wave
    for (let x = 0; x <= 600; x += 5) {
      const wave1 = Math.sin(x / wavelength + time * 0.01) * amplitude;
      const wave2 = Math.sin(x / (wavelength * 0.7) + time * 0.015) * amplitude * 0.5;
      const y = 300 + wave1 + wave2;
      path += `L${x},${y} `;
    }
    
    // Close the path to create a fillable area
    path += 'L600,600 L0,600 Z';
    
    return path;
  }

  addRippleEffect(audioData, time) {
    const ripple = this.createElement('circle', {
      cx: '300',
      cy: '300',
      r: '0',
      fill: 'none',
      stroke: this.getDynamicColor(audioData),
      'stroke-width': '3',
      'stroke-opacity': '0.8',
      filter: 'url(#glow)'
    });
    this.addElement(ripple);
    
    // Animate ripple expansion
    let radius = 0;
    const animateRipple = () => {
      radius += 5;
      ripple.setAttribute('r', radius);
      ripple.setAttribute('stroke-opacity', 0.8 * (1 - radius / 300));
      
      if (radius < 300) {
        requestAnimationFrame(animateRipple);
      } else {
        ripple.remove();
      }
    };
    animateRipple();
  }
}

// 4. Enhanced Geometric Shapes Animation with 3D Effects and Morphing
class GeometricAnimation extends BaseAnimation {
  constructor(svg, options = {}) {
    super(svg, { colorMode: 'frequency', ...options });
    this.shapes = [];
    this.shapeData = [];
    this.orbitalParticles = [];
    this.morphingShapes = [];
  }

  createElements() {
    this.clear();
    this.shapes = [];
    this.shapeData = [];
    this.orbitalParticles = [];
    this.morphingShapes = [];

    // Create enhanced geometric shapes with 3D properties
    const shapes = [
      { 
        type: 'circle', 
        cx: 200, 
        cy: 200, 
        r: 50,
        morphTarget: { type: 'ellipse', rx: 80, ry: 40 }
      },
      { 
        type: 'rect', 
        x: 350, 
        y: 150, 
        width: 100, 
        height: 100,
        morphTarget: { type: 'polygon', points: '400,200 450,150 500,200 450,250' }
      },
      { 
        type: 'polygon', 
        points: '450,200 500,150 550,200 500,250',
        morphTarget: { type: 'circle', cx: 500, cy: 200, r: 50 }
      },
      { 
        type: 'ellipse', 
        cx: 150, 
        cy: 400, 
        rx: 60, 
        ry: 40,
        morphTarget: { type: 'rect', x: 120, y: 380, width: 60, height: 40 }
      }
    ];

    shapes.forEach((shape, index) => {
      // Create main shape
      const element = this.createElement(shape.type, {
        id: `animation-shape-${index}`,
        fill: this.getColorByFrequency(['bass', 'mid', 'high'][index % 3]),
        'fill-opacity': '0.8',
        filter: 'url(#glow)',
        ...shape
      });
      this.addElement(element);
      this.shapes.push(element);

      // Store shape data for morphing
      this.shapeData.push({
        original: shape,
        target: shape.morphTarget,
        morphProgress: 0,
        rotation: 0,
        scale: 1,
        position: { x: shape.cx || shape.x, y: shape.cy || shape.y }
      });

      // Create orbital particles for each shape
      for (let i = 0; i < 4; i++) {
        const particle = this.createParticle(
          shape.cx || shape.x, 
          shape.cy || shape.y, 
          {
            color: this.getColorByFrequency('high'),
            size: Math.random() * 3 + 1,
            orbital: true,
            angle: (i / 4) * Math.PI * 2,
            radius: 30 + Math.random() * 20,
            parentShape: index
          }
        );
        this.orbitalParticles.push(particle);
        this.addElement(particle.element);
      }

      // Create morphing shape (invisible, used for calculations)
      const morphElement = this.createElement(shape.morphTarget.type, {
        id: `animation-morph-${index}`,
        fill: 'none',
        'fill-opacity': '0',
        ...shape.morphTarget
      });
      this.morphingShapes.push(morphElement);
    });

    // Apply 3D effects
    this.shapes.forEach(shape => {
      this.apply3DEffect(shape, 2);
    });
  }

  update(audioData) {
    super.update(audioData);
    const { bass, mid, high, beat } = audioData;
    const time = Date.now() * 0.001;
    
    this.shapes.forEach((shape, index) => {
      const shapeInfo = this.shapeData[index];
      
      // Update morphing progress
      shapeInfo.morphProgress += (beat ? 0.1 : 0.02);
      if (shapeInfo.morphProgress > 1) {
        shapeInfo.morphProgress = 0;
        // Swap original and target for continuous morphing
        const temp = shapeInfo.original;
        shapeInfo.original = shapeInfo.target;
        shapeInfo.target = temp;
      }

      // Calculate morphed properties
      const morphFactor = Math.sin(shapeInfo.morphProgress * Math.PI);
      const currentProps = this.interpolateShapeProperties(
        shapeInfo.original, 
        shapeInfo.target, 
        morphFactor
      );

      // Update shape properties
      Object.entries(currentProps).forEach(([key, value]) => {
        if (key !== 'type' && key !== 'morphTarget') {
          shape.setAttribute(key, value);
        }
      });

      // Enhanced transformations
      const scale = 1 + (bass + mid + high) * 0.4;
      const rotation = shapeInfo.rotation + (bass + mid + high) * 2;
      shapeInfo.rotation = rotation;

      // Dynamic position based on audio
      const centerX = 300;
      const centerY = 300;
      const offsetX = Math.sin(time * 0.5 + index) * bass * 30;
      const offsetY = Math.cos(time * 0.7 + index) * mid * 30;
      
      const transform = `translate(${centerX + offsetX},${centerY + offsetY}) scale(${scale}) rotate(${rotation})`;
      shape.setAttribute('transform', transform);

      // Dynamic color and opacity
      const color = this.getDynamicColor(audioData);
      shape.setAttribute('fill', color);
      shape.setAttribute('fill-opacity', 0.6 + (bass + mid + high) * 0.4);

      // Beat effects
      if (beat) {
        shape.setAttribute('stroke', this.getColorByFrequency('beat', 1));
        shape.setAttribute('stroke-width', '4');
        shape.setAttribute('stroke-opacity', '0.8');
        
        // Pulse effect
        shape.style.transform = transform + ' scale(1.2)';
        setTimeout(() => {
          shape.style.transform = transform;
        }, 100);
      } else {
        shape.setAttribute('stroke', color);
        shape.setAttribute('stroke-width', '2');
        shape.setAttribute('stroke-opacity', '0.4');
      }
    });

    // Update orbital particles
    this.orbitalParticles.forEach((particle, index) => {
      const parentIndex = Math.floor(index / 4);
      const shapeInfo = this.shapeData[parentIndex];
      
      particle.angle += (0.03 + high * 0.02) * (1 + index * 0.1);
      particle.radius += Math.sin(time + index) * 2;
      
      const centerX = 300 + Math.sin(time * 0.5 + parentIndex) * bass * 30;
      const centerY = 300 + Math.cos(time * 0.7 + parentIndex) * mid * 30;
      
      particle.x = centerX + Math.cos(particle.angle) * particle.radius;
      particle.y = centerY + Math.sin(particle.angle) * particle.radius;
      
      if (particle.element) {
        particle.element.setAttribute('cx', particle.x);
        particle.element.setAttribute('cy', particle.y);
        particle.element.setAttribute('r', particle.size * (1 + beat * 0.5));
        particle.element.setAttribute('fill-opacity', 0.7 + (bass + mid + high) * 0.3);
        
        // Dynamic particle color
        const particleColor = this.getColorByFrequency(['bass', 'mid', 'high'][index % 3]);
        particle.element.setAttribute('fill', particleColor);
      }
    });

    // Add fractal-like sub-shapes on high frequencies
    if (high > 0.8) {
      this.addFractalShapes(audioData, time);
    }
  }

  interpolateShapeProperties(original, target, factor) {
    const result = { ...original };
    
    // Interpolate numeric properties
    ['cx', 'cy', 'x', 'y', 'r', 'rx', 'ry', 'width', 'height'].forEach(prop => {
      if (original[prop] !== undefined && target[prop] !== undefined) {
        result[prop] = original[prop] + (target[prop] - original[prop]) * factor;
      }
    });

    // Interpolate points for polygons
    if (original.points && target.points) {
      const originalPoints = original.points.split(' ').map(Number);
      const targetPoints = target.points.split(' ').map(Number);
      const interpolatedPoints = [];
      
      for (let i = 0; i < Math.max(originalPoints.length, targetPoints.length); i += 2) {
        const x1 = originalPoints[i] || 0;
        const y1 = originalPoints[i + 1] || 0;
        const x2 = targetPoints[i] || 0;
        const y2 = targetPoints[i + 1] || 0;
        
        interpolatedPoints.push(
          x1 + (x2 - x1) * factor,
          y1 + (y2 - y1) * factor
        );
      }
      
      result.points = interpolatedPoints.join(' ');
    }

    return result;
  }

  addFractalShapes(audioData, time) {
    // Create smaller versions of shapes at different positions
    this.shapes.forEach((shape, index) => {
      if (Math.random() < 0.1) { // 10% chance per frame
        const fractalShape = this.createElement(shape.tagName.toLowerCase(), {
          fill: this.getDynamicColor(audioData),
          'fill-opacity': '0.3',
          filter: 'url(#glow)',
          transform: `translate(${Math.random() * 600},${Math.random() * 600}) scale(0.3) rotate(${Math.random() * 360})`
        });
        
        // Copy attributes from original shape
        Array.from(shape.attributes).forEach(attr => {
          if (!['id', 'transform', 'fill', 'fill-opacity'].includes(attr.name)) {
            fractalShape.setAttribute(attr.name, attr.value);
          }
        });
        
        this.addElement(fractalShape);
        
        // Remove after animation
        setTimeout(() => {
          if (fractalShape.parentNode) {
            fractalShape.parentNode.removeChild(fractalShape);
          }
        }, 1000);
      }
    });
  }
}

// 5. Enhanced Audio Spectrum 3D Animation with Advanced Effects
class BarsAnimation extends BaseAnimation {
  constructor(svg, options = {}) {
    super(svg, { colorMode: 'frequency', ...options });
    this.bars = [];
    this.barCount = 64; // Increased for more detail
    this.barLayers = [];
    this.reflectionBars = [];
    this.particleEffects = [];
    this.spectrumMode = 'linear'; // 'linear', 'circular', 'spiral'
  }

  createElements() {
    this.clear();
    this.bars = [];
    this.barLayers = [];
    this.reflectionBars = [];
    this.particleEffects = [];

    // Create main bar container
    this.barGroup = this.createElement('g', {
      id: 'animation-bars',
      transform: 'translate(60,520)'
    });
    this.addElement(this.barGroup);

    // Create reflection container
    this.reflectionGroup = this.createElement('g', {
      id: 'animation-reflections',
      transform: 'translate(60,580)'
    });
    this.addElement(this.reflectionGroup);

    // Create particle effects container
    this.particleGroup = this.createElement('g', {
      id: 'animation-spectrum-particles'
    });
    this.addElement(this.particleGroup);

    // Create enhanced bars with multiple layers
    for (let i = 0; i < this.barCount; i++) {
      // Main bar
      const bar = this.createElement('rect', {
        x: String(i * (480 / this.barCount)),
        y: '-8',
        width: String((480 / this.barCount) - 2),
        height: '6',
        rx: '3',
        fill: this.getColorByFrequency(['bass', 'mid', 'high'][i % 3]),
        'fill-opacity': '0.85',
        filter: 'url(#glow)'
      });
      this.barGroup.appendChild(bar);
      this.bars.push(bar);

      // Reflection bar
      const reflection = this.createElement('rect', {
        x: String(i * (480 / this.barCount)),
        y: '8',
        width: String((480 / this.barCount) - 2),
        height: '6',
        rx: '3',
        fill: this.getColorByFrequency(['bass', 'mid', 'high'][i % 3]),
        'fill-opacity': '0.3',
        filter: 'url(#glow)'
      });
      this.reflectionGroup.appendChild(reflection);
      this.reflectionBars.push(reflection);

      // Store bar data
      this.barLayers.push({
        index: i,
        frequency: ['bass', 'mid', 'high'][i % 3],
        phase: i * 0.1,
        amplitude: 1,
        resonance: 0
      });
    }

    // Apply 3D effects
    this.bars.forEach(bar => {
      this.apply3DEffect(bar, 1);
    });
  }

  update(audioData) {
    super.update(audioData);
    const { raw, bass, mid, high, beat } = audioData;
    const time = Date.now() * 0.001;
    
    this.bars.forEach((bar, index) => {
      const barInfo = this.barLayers[index];
      const reflection = this.reflectionBars[index];
      
      // Get frequency data with enhanced processing
      const frequencyIndex = Math.floor((index / this.barCount) * raw.length);
      const rawValue = raw[frequencyIndex] / 255;
      
      // Apply frequency-specific processing
      let processedValue = rawValue;
      if (barInfo.frequency === 'bass') {
        processedValue *= (1 + bass * 0.5);
      } else if (barInfo.frequency === 'mid') {
        processedValue *= (1 + mid * 0.3);
      } else {
        processedValue *= (1 + high * 0.2);
      }

      // Add resonance effect
      barInfo.resonance += processedValue * 0.1;
      barInfo.resonance *= 0.95; // Decay
      processedValue += barInfo.resonance;

      // Calculate height with enhanced dynamics
      const baseHeight = Math.max(6, processedValue * 260);
      const pulseHeight = baseHeight * (1 + Math.sin(time * 5 + barInfo.phase) * 0.1);
      const beatHeight = beat ? baseHeight * 1.2 : baseHeight;
      const finalHeight = Math.max(6, pulseHeight + beatHeight - baseHeight);

      // Update main bar
      bar.setAttribute('y', String(-finalHeight));
      bar.setAttribute('height', String(finalHeight));
      bar.setAttribute('fill-opacity', 0.4 + processedValue * 0.6);

      // Update reflection bar
      const reflectionHeight = finalHeight * 0.3;
      reflection.setAttribute('y', String(reflectionHeight));
      reflection.setAttribute('height', String(reflectionHeight));
      reflection.setAttribute('fill-opacity', 0.2 + processedValue * 0.3);

      // Dynamic colors based on frequency and intensity
      const color = this.getColorByFrequency(barInfo.frequency, processedValue);
      bar.setAttribute('fill', color);
      reflection.setAttribute('fill', color);

      // Dynamic stroke for beat detection
      if (beat && processedValue > 0.5) {
        bar.setAttribute('stroke', this.getColorByFrequency('beat', 1));
        bar.setAttribute('stroke-width', '2');
        bar.setAttribute('stroke-opacity', '0.8');
      } else {
        bar.setAttribute('stroke', color);
        bar.setAttribute('stroke-width', '1');
        bar.setAttribute('stroke-opacity', '0.4');
      }

      // Add particle effects for high-intensity bars
      if (processedValue > 0.8 && Math.random() < 0.1) {
        this.addSpectrumParticle(index, processedValue, color);
      }
    });

    // Update spectrum mode based on audio
    this.updateSpectrumMode(audioData);
  }

  addSpectrumParticle(barIndex, intensity, color) {
    const barX = barIndex * (480 / this.barCount) + 60;
    const barY = 520 - intensity * 260;
    
    const particle = this.createParticle(barX, barY, {
      color: color,
      size: Math.random() * 4 + 2,
      vx: (Math.random() - 0.5) * 8,
      vy: -Math.random() * 4 - 2,
      life: 1,
      maxLife: 1
    });

    this.particleGroup.appendChild(particle.element);
    this.particleEffects.push(particle);

    // Remove particle after animation
    setTimeout(() => {
      if (particle.element && particle.element.parentNode) {
        particle.element.parentNode.removeChild(particle.element);
      }
      const index = this.particleEffects.indexOf(particle);
      if (index > -1) {
        this.particleEffects.splice(index, 1);
      }
    }, 2000);
  }

  updateSpectrumMode(audioData) {
    const { bass, mid, high } = audioData;
    
    // Switch modes based on dominant frequency
    if (bass > 0.7 && this.spectrumMode !== 'circular') {
      this.spectrumMode = 'circular';
      this.transformToCircular();
    } else if (high > 0.7 && this.spectrumMode !== 'spiral') {
      this.spectrumMode = 'spiral';
      this.transformToSpiral();
    } else if (mid > 0.7 && this.spectrumMode !== 'linear') {
      this.spectrumMode = 'linear';
      this.transformToLinear();
    }
  }

  transformToCircular() {
    const centerX = 300;
    const centerY = 300;
    const radius = 150;
    
    this.bars.forEach((bar, index) => {
      const angle = (index / this.barCount) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      bar.setAttribute('transform', `translate(${x},${y}) rotate(${angle * 180 / Math.PI})`);
    });
  }

  transformToSpiral() {
    const centerX = 300;
    const centerY = 300;
    
    this.bars.forEach((bar, index) => {
      const angle = (index / this.barCount) * Math.PI * 8;
      const radius = 50 + index * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      bar.setAttribute('transform', `translate(${x},${y}) rotate(${angle * 180 / Math.PI})`);
    });
  }

  transformToLinear() {
    this.bars.forEach((bar, index) => {
      const x = index * (480 / this.barCount) + 60;
      bar.setAttribute('transform', `translate(${x},520)`);
    });
  }
}

// 6. Circular Waves Animation
class CircularAnimation extends BaseAnimation {
  constructor(svg) {
    super(svg);
    this.circles = [];
  }

  createElements() {
    this.clear();
    this.circles = [];

    // Create multiple expanding circles
    for (let i = 0; i < 5; i++) {
      const circle = this.createElement('circle', {
        id: `animation-circle-${i}`,
        cx: '300',
        cy: '300',
        r: '50',
        fill: 'none',
        stroke: 'white',
        'stroke-width': '2',
        'stroke-opacity': '0.6'
      });
      this.addElement(circle);
      this.circles.push({ element: circle, radius: 50, speed: 1 + i * 0.5 });
    }
  }

  update(audioData) {
    const { bass, mid, high, beat } = audioData;
    
    this.circles.forEach((circle, index) => {
      circle.radius += circle.speed * (1 + bass * 0.5);
      
      if (circle.radius > 300) {
        circle.radius = 50;
      }
      
      circle.element.setAttribute('r', circle.radius);
      circle.element.setAttribute('stroke-opacity', 0.3 + (bass + mid + high) * 0.4);
      circle.element.setAttribute('stroke-width', 2 + (beat ? 3 : 0));
    });
  }
}

// 7. Matrix Rain Animation
class MatrixAnimation extends BaseAnimation {
  constructor(svg) {
    super(svg);
    this.drops = [];
    this.characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  }

  createElements() {
    this.clear();
    this.drops = [];

    // Create text elements for matrix rain
    for (let i = 0; i < 20; i++) {
      const drop = {
        x: Math.random() * 600,
        y: Math.random() * 600,
        speed: Math.random() * 3 + 1,
        element: null
      };

      drop.element = this.createElement('text', {
        x: drop.x,
        y: drop.y,
        fill: 'white',
        'font-size': '16',
        'font-family': 'monospace'
      });
      drop.element.textContent = this.characters[Math.floor(Math.random() * this.characters.length)];
      
      this.addElement(drop.element);
      this.drops.push(drop);
    }
  }

  update(audioData) {
    const { bass, mid, high } = audioData;
    
    this.drops.forEach((drop) => {
      drop.y += drop.speed * (1 + bass * 0.5);
      
      if (drop.y > 600) {
        drop.y = -20;
        drop.x = Math.random() * 600;
      }
      
      drop.element.setAttribute('y', drop.y);
      drop.element.setAttribute('fill-opacity', 0.3 + (bass + mid + high) * 0.7);
      
      // Change character occasionally
      if (Math.random() < 0.1) {
        drop.element.textContent = this.characters[Math.floor(Math.random() * this.characters.length)];
      }
    });
  }
}

// 8. Fireworks Animation
class FireworksAnimation extends BaseAnimation {
  constructor(svg) {
    super(svg);
    this.fireworks = [];
    this.particles = [];
  }

  createElements() {
    this.clear();
    this.fireworks = [];
    this.particles = [];
  }

  createFirework(x, y) {
    const firework = {
      x: x,
      y: y,
      particles: []
    };

    // Create explosion particles
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      
      const particle = {
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        element: null
      };

      particle.element = this.createElement('circle', {
        cx: particle.x,
        cy: particle.y,
        r: '3',
        fill: 'white',
        'fill-opacity': '0.8'
      });
      
      this.addElement(particle.element);
      firework.particles.push(particle);
    }

    this.fireworks.push(firework);
  }

  update(audioData) {
    const { bass, mid, high, beat } = audioData;
    
    // Create new fireworks on beat
    if (beat && Math.random() < 0.3) {
      this.createFirework(Math.random() * 600, Math.random() * 600);
    }
    
    // Update fireworks
    this.fireworks.forEach((firework, fireworkIndex) => {
      firework.particles.forEach((particle, particleIndex) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1; // gravity
        particle.life -= 0.02;
        
        particle.element.setAttribute('cx', particle.x);
        particle.element.setAttribute('cy', particle.y);
        particle.element.setAttribute('fill-opacity', particle.life);
        
        // Remove dead particles
        if (particle.life <= 0) {
          particle.element.remove();
          firework.particles.splice(particleIndex, 1);
        }
      });
      
      // Remove empty fireworks
      if (firework.particles.length === 0) {
        this.fireworks.splice(fireworkIndex, 1);
      }
    });
  }
}

// 9. DNA Helix Animation
class DNAAnimation extends BaseAnimation {
  constructor(svg) {
    super(svg);
    this.strands = [];
  }

  createElements() {
    this.clear();
    this.strands = [];

    // Create DNA strands
    for (let i = 0; i < 2; i++) {
      const strand = this.createElement('path', {
        id: `animation-dna-${i}`,
        fill: 'none',
        stroke: 'white',
        'stroke-width': '2',
        'stroke-opacity': '0.8'
      });
      this.addElement(strand);
      this.strands.push(strand);
    }

    // Create connecting bars
    for (let i = 0; i < 10; i++) {
      const bar = this.createElement('line', {
        id: `animation-dna-bar-${i}`,
        stroke: 'white',
        'stroke-width': '1',
        'stroke-opacity': '0.6'
      });
      this.addElement(bar);
      this.strands.push(bar);
    }
  }

  update(audioData) {
    const { bass, mid, high } = audioData;
    const time = Date.now() * 0.001;
    
    // Update DNA strands
    for (let strandIndex = 0; strandIndex < 2; strandIndex++) {
      let path = 'M';
      const offset = strandIndex * Math.PI;
      
      for (let i = 0; i <= 600; i += 10) {
        const x = i;
        const y = 300 + Math.sin(i * 0.02 + time + offset) * 100 * (1 + bass * 0.5);
        path += `${x},${y} `;
      }
      
      this.strands[strandIndex].setAttribute('d', path);
      this.strands[strandIndex].setAttribute('stroke-opacity', 0.5 + (bass + mid + high) * 0.5);
    }
    
    // Update connecting bars
    for (let i = 0; i < 10; i++) {
      const x = (i / 9) * 600;
      const y1 = 300 + Math.sin(x * 0.02 + time) * 100 * (1 + bass * 0.5);
      const y2 = 300 + Math.sin(x * 0.02 + time + Math.PI) * 100 * (1 + bass * 0.5);
      
      const bar = this.strands[i + 2];
      bar.setAttribute('x1', x);
      bar.setAttribute('y1', y1);
      bar.setAttribute('x2', x);
      bar.setAttribute('y2', y2);
      bar.setAttribute('stroke-opacity', 0.3 + (bass + mid + high) * 0.4);
    }
  }
}

// 10. Fractal Trees Animation
class FractalAnimation extends BaseAnimation {
  constructor(svg) {
    super(svg);
    this.trees = [];
  }

  createElements() {
    this.clear();
    this.trees = [];

    // Create fractal trees
    for (let i = 0; i < 3; i++) {
      const tree = this.createElement('g', {
        id: `animation-tree-${i}`,
        transform: `translate(${200 + i * 100}, 500)`
      });
      this.addElement(tree);
      this.trees.push(tree);
    }
  }

  drawBranch(parent, x, y, length, angle, depth, audioData) {
    if (depth <= 0) return;

    const { bass, mid, high } = audioData;
    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;

    const branch = this.createElement('line', {
      x1: x,
      y1: y,
      x2: endX,
      y2: endY,
      stroke: 'white',
      'stroke-width': String(Math.max(1, depth * 2)),
      'stroke-opacity': String(0.3 + (bass + mid + high) * 0.4)
    });

    parent.appendChild(branch);

    // Recursive branches
    const newLength = length * 0.7;
    const angleVariation = 0.5 + (bass + mid + high) * 0.5;
    
    this.drawBranch(parent, endX, endY, newLength, angle - angleVariation, depth - 1, audioData);
    this.drawBranch(parent, endX, endY, newLength, angle + angleVariation, depth - 1, audioData);
  }

  update(audioData) {
    this.trees.forEach((tree, index) => {
      // Clear previous branches
      tree.innerHTML = '';
      
      // Draw new tree
      const baseAngle = -Math.PI / 2 + (index - 1) * 0.3;
      this.drawBranch(tree, 0, 0, 80, baseAngle, 6, audioData);
    });
  }
}

// 11. NEW: Neural Network Animation with AI-inspired Visuals
class NeuralNetworkAnimation extends BaseAnimation {
  constructor(svg, options = {}) {
    super(svg, { colorMode: 'frequency', ...options });
    this.nodes = [];
    this.connections = [];
    this.nodeCount = 25;
    this.activationLevels = [];
    this.learningRate = 0.01;
  }

  createElements() {
    this.clear();
    this.nodes = [];
    this.connections = [];
    this.activationLevels = [];

    // Create nodes container
    this.nodeGroup = this.createElement('g', {
      id: 'animation-nodes'
    });
    this.addElement(this.nodeGroup);

    // Create connections container
    this.connectionGroup = this.createElement('g', {
      id: 'animation-neural-connections'
    });
    this.addElement(this.connectionGroup);

    // Create input layer
    for (let i = 0; i < 8; i++) {
      this.createNode(100, 100 + i * 60, 'input');
    }

    // Create hidden layer
    for (let i = 0; i < 9; i++) {
      this.createNode(300, 80 + i * 50, 'hidden');
    }

    // Create output layer
    for (let i = 0; i < 8; i++) {
      this.createNode(500, 100 + i * 60, 'output');
    }

    // Create connections between layers
    this.createConnections();
  }

  createNode(x, y, type) {
    const node = {
      x: x,
      y: y,
      type: type,
      activation: 0,
      bias: Math.random() - 0.5,
      element: null,
      glowElement: null
    };

    // Create main node
    node.element = this.createElement('circle', {
      cx: x,
      cy: y,
      r: '8',
      fill: this.getColorByFrequency(['bass', 'mid', 'high'][Math.floor(Math.random() * 3)]),
      'fill-opacity': '0.8',
      filter: 'url(#glow)'
    });

    // Create glow effect
    node.glowElement = this.createElement('circle', {
      cx: x,
      cy: y,
      r: '12',
      fill: 'none',
      stroke: node.element.getAttribute('fill'),
      'stroke-width': '2',
      'stroke-opacity': '0.3',
      filter: 'url(#glow)'
    });

    this.nodeGroup.appendChild(node.element);
    this.nodeGroup.appendChild(node.glowElement);
    this.nodes.push(node);
    this.activationLevels.push(0);
  }

  createConnections() {
    // Connect input to hidden
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 9; j++) {
        this.createConnection(this.nodes[i], this.nodes[8 + j]);
      }
    }

    // Connect hidden to output
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 8; j++) {
        this.createConnection(this.nodes[8 + i], this.nodes[17 + j]);
      }
    }
  }

  createConnection(fromNode, toNode) {
    const connection = {
      from: fromNode,
      to: toNode,
      weight: Math.random() - 0.5,
      element: null
    };

    connection.element = this.createElement('line', {
      x1: fromNode.x,
      y1: fromNode.y,
      x2: toNode.x,
      y2: toNode.y,
      stroke: this.getColorByFrequency('mid'),
      'stroke-width': '1',
      'stroke-opacity': '0.3'
    });

    this.connectionGroup.appendChild(connection.element);
    this.connections.push(connection);
  }

  update(audioData) {
    super.update(audioData);
    const { bass, mid, high, beat } = audioData;
    const time = Date.now() * 0.001;

    // Update input layer based on audio
    for (let i = 0; i < 8; i++) {
      const inputNode = this.nodes[i];
      const frequency = [bass, mid, high][i % 3];
      inputNode.activation = frequency;
      this.activationLevels[i] = frequency;
    }

    // Propagate through network
    this.propagateNetwork(audioData);

    // Update visual elements
    this.nodes.forEach((node, index) => {
      const activation = this.activationLevels[index];
      const color = this.getColorByFrequency(['bass', 'mid', 'high'][index % 3], activation);
      
      // Update node size and color
      const size = 6 + activation * 8;
      node.element.setAttribute('r', size);
      node.element.setAttribute('fill', color);
      node.element.setAttribute('fill-opacity', 0.6 + activation * 0.4);

      // Update glow effect
      node.glowElement.setAttribute('r', size + 4);
      node.glowElement.setAttribute('stroke', color);
      node.glowElement.setAttribute('stroke-opacity', 0.3 + activation * 0.4);

      // Add pulse effect on beat
      if (beat && activation > 0.5) {
        node.element.style.transform = 'scale(1.3)';
        setTimeout(() => {
          node.element.style.transform = 'scale(1)';
        }, 100);
      }
    });

    // Update connections
    this.connections.forEach(connection => {
      const fromActivation = this.activationLevels[this.nodes.indexOf(connection.from)];
      const toActivation = this.activationLevels[this.nodes.indexOf(connection.to)];
      const connectionStrength = fromActivation * toActivation * connection.weight;

      connection.element.setAttribute('stroke-opacity', 0.1 + Math.abs(connectionStrength) * 0.6);
      connection.element.setAttribute('stroke-width', 1 + Math.abs(connectionStrength) * 3);

      // Dynamic connection color
      if (connectionStrength > 0) {
        connection.element.setAttribute('stroke', this.getColorByFrequency('high', connectionStrength));
      } else {
        connection.element.setAttribute('stroke', this.getColorByFrequency('bass', Math.abs(connectionStrength)));
      }
    });

    // Add learning effect
    if (beat) {
      this.adaptWeights(audioData);
    }
  }

  propagateNetwork(audioData) {
    // Simple forward propagation
    for (let i = 8; i < 17; i++) { // Hidden layer
      let sum = this.nodes[i].bias;
      for (let j = 0; j < 8; j++) { // Input connections
        const connection = this.connections.find(c => 
          c.from === this.nodes[j] && c.to === this.nodes[i]
        );
        if (connection) {
          sum += this.activationLevels[j] * connection.weight;
        }
      }
      this.activationLevels[i] = this.activationFunction(sum);
    }

    for (let i = 17; i < 25; i++) { // Output layer
      let sum = this.nodes[i].bias;
      for (let j = 8; j < 17; j++) { // Hidden connections
        const connection = this.connections.find(c => 
          c.from === this.nodes[j] && c.to === this.nodes[i]
        );
        if (connection) {
          sum += this.activationLevels[j] * connection.weight;
        }
      }
      this.activationLevels[i] = this.activationFunction(sum);
    }
  }

  activationFunction(x) {
    return 1 / (1 + Math.exp(-x)); // Sigmoid
  }

  adaptWeights(audioData) {
    // Simple weight adaptation based on audio
    this.connections.forEach(connection => {
      const fromActivation = this.activationLevels[this.nodes.indexOf(connection.from)];
      const toActivation = this.activationLevels[this.nodes.indexOf(connection.to)];
      
      // Hebbian learning rule
      connection.weight += this.learningRate * fromActivation * toActivation;
      connection.weight = Math.max(-1, Math.min(1, connection.weight)); // Clamp weights
    });
  }
}

// Export all animation classes
window.BlobAnimation = BlobAnimation;
window.ParticleAnimation = ParticleAnimation;
window.WaveAnimation = WaveAnimation;
window.GeometricAnimation = GeometricAnimation;
window.BarsAnimation = BarsAnimation;
window.CircularAnimation = CircularAnimation;
window.MatrixAnimation = MatrixAnimation;
window.FireworksAnimation = FireworksAnimation;
window.DNAAnimation = DNAAnimation;
window.FractalAnimation = FractalAnimation;
// 12. NEW: Quantum Particles Animation with Wave-Particle Duality
class QuantumParticlesAnimation extends BaseAnimation {
  constructor(svg, options = {}) {
    super(svg, { colorMode: 'frequency', ...options });
    this.particles = [];
    this.waveFunctions = [];
    this.quantumStates = [];
    this.measurementPoints = [];
    this.uncertaintyPrinciple = true;
  }

  createElements() {
    this.clear();
    this.particles = [];
    this.waveFunctions = [];
    this.quantumStates = [];
    this.measurementPoints = [];

    // Create quantum particles container
    this.quantumGroup = this.createElement('g', {
      id: 'animation-quantum'
    });
    this.addElement(this.quantumGroup);

    // Create wave function container
    this.waveGroup = this.createElement('g', {
      id: 'animation-wave-functions'
    });
    this.addElement(this.waveGroup);

    // Create measurement points
    this.measurementGroup = this.createElement('g', {
      id: 'animation-measurements'
    });
    this.addElement(this.measurementGroup);

    // Create quantum particles
    for (let i = 0; i < 15; i++) {
      this.createQuantumParticle();
    }

    // Create wave functions
    for (let i = 0; i < 5; i++) {
      this.createWaveFunction();
    }

    // Create measurement points
    for (let i = 0; i < 8; i++) {
      this.createMeasurementPoint();
    }
  }

  createQuantumParticle() {
    const particle = {
      x: Math.random() * 600,
      y: Math.random() * 600,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      size: Math.random() * 6 + 3,
      phase: Math.random() * Math.PI * 2,
      frequency: Math.random() * 0.02 + 0.01,
      amplitude: Math.random() * 0.5 + 0.5,
      element: null,
      waveElement: null,
      isCollapsed: false
    };

    // Create particle element
    particle.element = this.createElement('circle', {
      cx: particle.x,
      cy: particle.y,
      r: particle.size,
      fill: this.getColorByFrequency(['bass', 'mid', 'high'][Math.floor(Math.random() * 3)]),
      'fill-opacity': '0.8',
      filter: 'url(#glow)'
    });

    // Create wave function element
    particle.waveElement = this.createElement('path', {
      fill: 'none',
      stroke: particle.element.getAttribute('fill'),
      'stroke-width': '2',
      'stroke-opacity': '0.4',
      filter: 'url(#glow)'
    });

    this.quantumGroup.appendChild(particle.element);
    this.waveGroup.appendChild(particle.waveElement);
    this.particles.push(particle);
  }

  createWaveFunction() {
    const wave = {
      x: Math.random() * 600,
      y: Math.random() * 600,
      frequency: Math.random() * 0.01 + 0.005,
      amplitude: Math.random() * 50 + 30,
      phase: Math.random() * Math.PI * 2,
      element: null
    };

    wave.element = this.createElement('path', {
      fill: 'none',
      stroke: this.getColorByFrequency('high'),
      'stroke-width': '1',
      'stroke-opacity': '0.3',
      'stroke-dasharray': '5,5'
    });

    this.waveGroup.appendChild(wave.element);
    this.waveFunctions.push(wave);
  }

  createMeasurementPoint() {
    const point = {
      x: Math.random() * 600,
      y: Math.random() * 600,
      radius: Math.random() * 20 + 10,
      strength: Math.random() * 0.5 + 0.5,
      element: null
    };

    point.element = this.createElement('circle', {
      cx: point.x,
      cy: point.y,
      r: point.radius,
      fill: 'none',
      stroke: this.getColorByFrequency('mid'),
      'stroke-width': '1',
      'stroke-opacity': '0.2',
      'stroke-dasharray': '3,3'
    });

    this.measurementGroup.appendChild(point.element);
    this.measurementPoints.push(point);
  }

  update(audioData) {
    super.update(audioData);
    const { bass, mid, high, beat } = audioData;
    const time = Date.now() * 0.001;

    // Update quantum particles
    this.particles.forEach((particle, index) => {
      if (!particle.isCollapsed) {
        // Wave-like behavior
        particle.phase += particle.frequency * (1 + high * 0.5);
        
        // Update position with quantum uncertainty
        const uncertainty = this.uncertaintyPrinciple ? (1 - high) * 20 : 0;
        particle.x += particle.vx * (1 + bass * 0.3) + Math.sin(particle.phase) * uncertainty;
        particle.y += particle.vy * (1 + mid * 0.2) + Math.cos(particle.phase) * uncertainty;

        // Boundary handling with quantum tunneling
        if (particle.x < 0 || particle.x > 600) {
          if (Math.random() < 0.1) { // Quantum tunneling
            particle.x = particle.x < 0 ? 600 : 0;
          } else {
            particle.vx *= -0.8;
            particle.x = Math.max(0, Math.min(600, particle.x));
          }
        }
        if (particle.y < 0 || particle.y > 600) {
          if (Math.random() < 0.1) { // Quantum tunneling
            particle.y = particle.y < 0 ? 600 : 0;
          } else {
            particle.vy *= -0.8;
            particle.y = Math.max(0, Math.min(600, particle.y));
          }
        }

        // Update wave function visualization
        this.updateWaveFunction(particle, time);

        // Check for measurement collapse
        this.measurementPoints.forEach(point => {
          const distance = Math.sqrt(
            Math.pow(particle.x - point.x, 2) + Math.pow(particle.y - point.y, 2)
          );
          if (distance < point.radius && Math.random() < point.strength * 0.01) {
            this.collapseWaveFunction(particle);
          }
        });
      } else {
        // Particle-like behavior (collapsed state)
        particle.x += particle.vx * (1 + bass * 0.5);
        particle.y += particle.vy * (1 + mid * 0.3);
        
        // Reset to wave state after some time
        if (Math.random() < 0.001) {
          particle.isCollapsed = false;
        }
      }

      // Update visual elements
      particle.element.setAttribute('cx', particle.x);
      particle.element.setAttribute('cy', particle.y);
      
      const color = this.getDynamicColor(audioData);
      particle.element.setAttribute('fill', color);
      particle.element.setAttribute('r', particle.size * (1 + (bass + mid + high) * 0.3));
      particle.element.setAttribute('fill-opacity', particle.isCollapsed ? 0.9 : 0.6);

      // Beat effects
      if (beat && !particle.isCollapsed) {
        particle.element.style.transform = 'scale(1.5)';
        setTimeout(() => {
          particle.element.style.transform = 'scale(1)';
        }, 100);
      }
    });

    // Update wave functions
    this.waveFunctions.forEach((wave, index) => {
      let path = 'M';
      for (let x = 0; x <= 600; x += 10) {
        const y = wave.y + Math.sin(x * wave.frequency + time + wave.phase) * wave.amplitude * (1 + high * 0.5);
        path += `${x},${y} `;
      }
      
      wave.element.setAttribute('d', path);
      wave.element.setAttribute('stroke-opacity', 0.2 + high * 0.4);
      wave.element.setAttribute('stroke-dashoffset', time * 10 + index * 5);
    });

    // Update measurement points
    this.measurementPoints.forEach((point, index) => {
      point.element.setAttribute('stroke-opacity', 0.1 + mid * 0.3);
      point.element.setAttribute('r', point.radius * (1 + Math.sin(time + index) * 0.2));
    });

    // Add quantum entanglement effects
    if (high > 0.8) {
      this.createEntanglement();
    }
  }

  updateWaveFunction(particle, time) {
    const points = 20;
    let path = 'M';
    
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const radius = particle.size * (1 + Math.sin(particle.phase + angle * 3) * 0.3);
      const x = particle.x + Math.cos(angle) * radius;
      const y = particle.y + Math.sin(angle) * radius;
      path += `${x},${y} `;
    }
    path += 'Z';
    
    particle.waveElement.setAttribute('d', path);
    particle.waveElement.setAttribute('stroke-opacity', 0.3 + Math.sin(particle.phase) * 0.2);
  }

  collapseWaveFunction(particle) {
    particle.isCollapsed = true;
    particle.waveElement.setAttribute('stroke-opacity', '0');
    
    // Add collapse effect
    const collapseEffect = this.createElement('circle', {
      cx: particle.x,
      cy: particle.y,
      r: '0',
      fill: 'none',
      stroke: this.getColorByFrequency('beat', 1),
      'stroke-width': '3',
      'stroke-opacity': '0.8',
      filter: 'url(#glow)'
    });
    
    this.quantumGroup.appendChild(collapseEffect);
    
    // Animate collapse
    let radius = 0;
    const animateCollapse = () => {
      radius += 5;
      collapseEffect.setAttribute('r', radius);
      collapseEffect.setAttribute('stroke-opacity', 0.8 * (1 - radius / 100));
      
      if (radius < 100) {
        requestAnimationFrame(animateCollapse);
      } else {
        collapseEffect.remove();
      }
    };
    animateCollapse();
  }

  createEntanglement() {
    // Create entangled particle pairs
    if (this.particles.length >= 2 && Math.random() < 0.1) {
      const particle1 = this.particles[Math.floor(Math.random() * this.particles.length)];
      const particle2 = this.particles[Math.floor(Math.random() * this.particles.length)];
      
      if (particle1 !== particle2) {
        const entanglement = this.createElement('line', {
          x1: particle1.x,
          y1: particle1.y,
          x2: particle2.x,
          y2: particle2.y,
          stroke: this.getColorByFrequency('high'),
          'stroke-width': '2',
          'stroke-opacity': '0.6',
          'stroke-dasharray': '5,5',
          filter: 'url(#glow)'
        });
        
        this.quantumGroup.appendChild(entanglement);
        
        // Remove after animation
        setTimeout(() => {
          if (entanglement.parentNode) {
            entanglement.parentNode.removeChild(entanglement);
          }
        }, 1000);
      }
    }
  }
}

window.NeuralNetworkAnimation = NeuralNetworkAnimation;
window.QuantumParticlesAnimation = QuantumParticlesAnimation;
