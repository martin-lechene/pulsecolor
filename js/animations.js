/**
 * PulseColor Animations
 * 10 Different Audio-Reactive Visual Effects
 */

// Base Animation Class
class BaseAnimation {
  constructor(svg) {
    this.svg = svg;
    this.elements = [];
  }

  init() {
    // Override in subclasses
  }

  update(audioData) {
    // Override in subclasses
  }

  createElement(type, attributes) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', type);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return element;
  }

  addElement(element) {
    this.svg.appendChild(element);
    this.elements.push(element);
    return element;
  }

  clear() {
    this.elements.forEach(el => el.remove());
    this.elements = [];
  }
}

// 1. Blob Morphing Animation
class BlobAnimation extends BaseAnimation {
  constructor(svg) {
    super(svg);
    this.blob = null;
    this.ring = null;
  }

  init() {
    // Create ring
    this.ring = this.createElement('circle', {
      id: 'animation-ring',
      cx: '300',
      cy: '300',
      r: '120',
      fill: 'none',
      stroke: 'white',
      'stroke-opacity': '0.85',
      'stroke-width': '8'
    });
    this.addElement(this.ring);

    // Create blob
    this.blob = this.createElement('path', {
      id: 'animation-blob',
      d: 'M120,0 C120,66 66,120 0,120 C-66,120 -120,66 -120,0 C-120,-66 -66,-120 0,-120 C66,-120 120,-66 120,0Z',
      fill: 'white',
      'fill-opacity': '0.92',
      filter: 'url(#glow)',
      transform: 'translate(300,300)'
    });
    this.addElement(this.blob);
  }

  update(audioData) {
    const { bass, mid, high, beat } = audioData;
    const ringBase = 120;
    const blobBase = 120;

    // Ring animation
    const r = ringBase + bass * 40 + (beat ? 16 : 0);
    this.ring.setAttribute('r', String(r));
    this.ring.setAttribute('stroke-width', String(6 + mid * 12));

    // Blob morphing
    const points = 60;
    const kBass = 0.55 + bass * 0.45 + (beat ? 0.2 : 0);
    const kMid = 0.55 + mid * 0.35;
    const kHigh = 0.5 + high * 0.25;
    const radius = blobBase * (0.9 + bass * 0.15);
    
    const coords = [];
    for (let i = 0; i < points; i++) {
      const t = (i / points) * Math.PI * 2;
      const wobble = Math.sin(t * 3) * kMid + Math.cos(t * 5) * kHigh;
      const rad = radius * (1 + wobble * 0.15);
      const x = Math.cos(t) * rad;
      const y = Math.sin(t) * rad;
      coords.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    
    const d = `M${coords[0]} C${coords[10]} ${coords[20]} ${coords[30]} ${coords[30]} C${coords[40]} ${coords[50]} ${coords[0]} ${coords[10]} ${coords[0]} Z`;
    this.blob.setAttribute('d', d);
  }
}

// 2. Particle System Animation
class ParticleAnimation extends BaseAnimation {
  constructor(svg) {
    super(svg);
    this.particles = [];
    this.maxParticles = 50;
  }

  init() {
    this.clear();
    this.particles = [];
    
    // Create particle container
    this.particleGroup = this.createElement('g', {
      id: 'animation-particles'
    });
    this.addElement(this.particleGroup);

    // Initialize particles
    for (let i = 0; i < this.maxParticles; i++) {
      this.createParticle();
    }
  }

  createParticle() {
    const particle = {
      x: Math.random() * 600,
      y: Math.random() * 600,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      size: Math.random() * 8 + 2,
      life: Math.random(),
      element: null
    };

    particle.element = this.createElement('circle', {
      cx: particle.x,
      cy: particle.y,
      r: particle.size,
      fill: 'white',
      'fill-opacity': '0.8'
    });

    this.particleGroup.appendChild(particle.element);
    this.particles.push(particle);
  }

  update(audioData) {
    const { bass, mid, high, beat } = audioData;
    
    this.particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx * (1 + bass * 0.5);
      particle.y += particle.vy * (1 + mid * 0.3);
      particle.life += 0.01;

      // Bounce off edges
      if (particle.x < 0 || particle.x > 600) particle.vx *= -1;
      if (particle.y < 0 || particle.y > 600) particle.vy *= -1;

      // Update size based on audio
      const newSize = particle.size * (1 + high * 0.5);
      particle.element.setAttribute('r', newSize);

      // Update opacity
      const opacity = 0.8 * (1 - particle.life * 0.5);
      particle.element.setAttribute('fill-opacity', opacity);

      // Update position
      particle.element.setAttribute('cx', particle.x);
      particle.element.setAttribute('cy', particle.y);

      // Reset particle if it's too old
      if (particle.life > 1) {
        particle.x = Math.random() * 600;
        particle.y = Math.random() * 600;
        particle.life = 0;
        particle.vx = (Math.random() - 0.5) * 4;
        particle.vy = (Math.random() - 0.5) * 4;
      }
    });

    // Add new particles on beat
    if (beat && this.particles.length < this.maxParticles) {
      this.createParticle();
    }
  }
}

// 3. Wave Forms Animation
class WaveAnimation extends BaseAnimation {
  constructor(svg) {
    super(svg);
    this.waves = [];
  }

  init() {
    this.clear();
    this.waves = [];

    // Create multiple wave layers
    for (let i = 0; i < 3; i++) {
      const wave = this.createElement('path', {
        id: `animation-wave-${i}`,
        fill: 'none',
        stroke: 'white',
        'stroke-width': '3',
        'stroke-opacity': '0.6'
      });
      this.addElement(wave);
      this.waves.push(wave);
    }
  }

  update(audioData) {
    const { bass, mid, high } = audioData;
    const frequencies = [bass, mid, high];

    this.waves.forEach((wave, index) => {
      const frequency = frequencies[index];
      const amplitude = 50 + frequency * 100;
      const wavelength = 50 + (1 - frequency) * 100;
      
      let path = 'M0,300 ';
      for (let x = 0; x <= 600; x += 5) {
        const y = 300 + Math.sin(x / wavelength + Date.now() * 0.01) * amplitude;
        path += `L${x},${y} `;
      }
      
      wave.setAttribute('d', path);
      wave.setAttribute('stroke-opacity', 0.3 + frequency * 0.7);
    });
  }
}

// 4. Geometric Shapes Animation
class GeometricAnimation extends BaseAnimation {
  constructor(svg) {
    super(svg);
    this.shapes = [];
  }

  init() {
    this.clear();
    this.shapes = [];

    // Create geometric shapes
    const shapes = [
      { type: 'circle', cx: 200, cy: 200, r: 50 },
      { type: 'rect', x: 350, y: 150, width: 100, height: 100 },
      { type: 'polygon', points: '450,200 500,150 550,200 500,250' },
      { type: 'ellipse', cx: 150, cy: 400, rx: 60, ry: 40 }
    ];

    shapes.forEach((shape, index) => {
      const element = this.createElement(shape.type, {
        id: `animation-shape-${index}`,
        fill: 'white',
        'fill-opacity': '0.8',
        ...shape
      });
      this.addElement(element);
      this.shapes.push(element);
    });
  }

  update(audioData) {
    const { bass, mid, high, beat } = audioData;
    
    this.shapes.forEach((shape, index) => {
      const scale = 1 + (bass + mid + high) * 0.3;
      const rotation = (bass + mid + high) * 360;
      
      shape.setAttribute('transform', `scale(${scale}) rotate(${rotation} 300 300)`);
      shape.setAttribute('fill-opacity', 0.5 + (bass + mid + high) * 0.5);
      
      if (beat) {
        shape.setAttribute('stroke', 'white');
        shape.setAttribute('stroke-width', '3');
      } else {
        shape.removeAttribute('stroke');
      }
    });
  }
}

// 5. Audio Bars Animation
class BarsAnimation extends BaseAnimation {
  constructor(svg) {
    super(svg);
    this.bars = [];
    this.barCount = 32;
  }

  init() {
    this.clear();
    this.bars = [];

    // Create bar container
    this.barGroup = this.createElement('g', {
      id: 'animation-bars',
      transform: 'translate(60,520)'
    });
    this.addElement(this.barGroup);

    // Create bars
    for (let i = 0; i < this.barCount; i++) {
      const bar = this.createElement('rect', {
        x: String(i * (480 / this.barCount)),
        y: '-8',
        width: String((480 / this.barCount) - 4),
        height: '6',
        rx: '3',
        fill: 'white',
        'fill-opacity': '0.85'
      });
      this.barGroup.appendChild(bar);
      this.bars.push(bar);
    }
  }

  update(audioData) {
    const { raw } = audioData;
    
    this.bars.forEach((bar, index) => {
      const frequencyIndex = Math.floor((index / this.barCount) * raw.length);
      const value = raw[frequencyIndex] / 255;
      const height = Math.max(6, value * 260);
      
      bar.setAttribute('y', String(-height));
      bar.setAttribute('height', String(height));
      bar.setAttribute('fill-opacity', 0.3 + value * 0.7);
    });
  }
}

// 6. Circular Waves Animation
class CircularAnimation extends BaseAnimation {
  constructor(svg) {
    super(svg);
    this.circles = [];
  }

  init() {
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

  init() {
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

  init() {
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

  init() {
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

  init() {
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
