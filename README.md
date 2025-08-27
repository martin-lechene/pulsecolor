# PulseColor 3.0 - Enhanced Audio-Reactive Visuals

<div align="center">
  <img src="assets/logo.png" alt="PulseColor Logo" width="200">
  <h3>🎵 Audio-Reactive Visuals with Advanced Effects</h3>
  <p><strong>12+ Enhanced Animations • Real-time Audio Analysis • Modern Web Technologies</strong></p>
  
  [![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/your-repo/pulsecolor)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
  [![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![Web Audio API](https://img.shields.io/badge/Web%20Audio%20API-Supported-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
</div>

## 🚀 What's New in 3.0

### ✨ Enhanced Animations
- **5 animations complètement refactorisées** avec effets 3D, particules avancées et morphing complexe
- **2 nouvelles animations** : Neural Network et Quantum Particles
- **Système de couleurs intelligent** basé sur les fréquences audio
- **Performance optimisée** avec gestion intelligente des frames

### 🎨 Visual Improvements
- **Effets 3D intégrés** : Ombres, gradients et profondeur
- **Système de particules unifié** : API commune pour toutes les animations
- **Traînées lumineuses** et connexions dynamiques
- **Morphing complexe** avec 80+ points de contrôle

### 🔧 Technical Enhancements
- **Base Animation Class refactorisée** avec meilleures pratiques
- **Gestion d'erreurs robuste** et debugging amélioré
- **Cache audio intelligent** pour optimiser les performances
- **API extensible** pour créer des animations personnalisées

## 🎭 Animations Available

### Enhanced Animations (1-5)
1. **🫧 Enhanced Blob Morphing** - Liquide réactif avec particules orbitales
2. **✨ Enhanced Particle System** - Gravité audio-réactive avec traînées
3. **🌊 Enhanced Wave Forms** - 8 couches d'ondes avec réflexions 3D
4. **🔷 Enhanced Geometric Shapes** - Morphing entre formes avec fractales
5. **📊 Enhanced Audio Spectrum** - 64 barres avec modes dynamiques

### Classic Animations (6-10)
6. **⭕ Circular Waves** - Ondes concentriques réactives
7. **💻 Matrix Rain** - Effet Matrix avec caractères qui tombent
8. **🎆 Fireworks** - Feux d'artifice audio-réactifs
9. **🧬 DNA Helix** - Double hélice qui tourne avec l'audio
10. **🌳 Fractal Trees** - Arbres fractals qui poussent

### New Animations (11-12)
11. **🧠 Neural Network** - Réseau de neurones qui apprend de l'audio
12. **⚛️ Quantum Particles** - Particules avec dualité onde-particule

## 🎮 Controls

### Keyboard Shortcuts
- **1-0** : Switch to animations 1-10
- **-** : Neural Network (11)
- **=** : Quantum Particles (12)
- **Space** : Play/Pause audio
- **M** : Toggle microphone

### Audio Input
- **🎤 Microphone** : Real-time audio from your device
- **📁 File Upload** : Support for MP3, WAV, OGG files
- **🎵 Streaming** : Works with any audio source

## ��️ Installation

### Quick Start
```bash
# Clone the repository
git clone https://github.com/your-repo/pulsecolor.git
cd pulsecolor

# Open in your browser
# Or use a local server
python -m http.server 8000
# Then visit http://localhost:8000
```

### Requirements
- Modern browser with Web Audio API support
- HTTPS required for microphone access (or localhost)
- No additional dependencies

## 🎨 Customization

### Animation Options
```javascript
// Create custom animation with options
const customAnimation = new BlobAnimation(svg, {
  enable3D: true,        // 3D effects
  enableGlow: true,      // Glow effects
  enableParticles: true, // Particle system
  colorMode: 'frequency' // 'frequency', 'beat', 'static'
});
```

### Color Palettes
```javascript
// Custom color palettes
animation.colorPalette = {
  bass: ['#ff006e', '#ff6b6b'],
  mid: ['#4ecdc4', '#45b7d1'],
  high: ['#feca57', '#ff9ff3']
};
```

## 🔧 Performance

### Optimizations
- **60 FPS limit** for consistent performance
- **Smart frame skipping** when needed
- **Audio data caching** to avoid recalculation
- **Automatic cleanup** of temporary elements

### Monitoring
```javascript
// Get performance statistics
const stats = animation.getPerformanceStats();
console.log(stats);
// { frameCount: 1234, fps: 60, elementsCount: 45 }
```

## 📚 Documentation

- **[Enhanced Animations Guide](docs/animations/enhanced-animations.md)** - Detailed documentation of all animations
- **[API Reference](docs/api/)** - Complete API documentation
- **[Examples](examples/)** - Code examples and demos
- **[Performance Guide](docs/performance/)** - Optimization tips

## 🌟 Features

### Audio Analysis
- **Real-time FFT** analysis with 2048 samples
- **Frequency bands** : Bass (0-8%), Mid (8-40%), High (40-100%)
- **Beat detection** with adaptive threshold
- **Smoothing** for fluid animations

### Visual Effects
- **SVG-based** for crisp, scalable graphics
- **Hardware acceleration** where available
- **Responsive design** that adapts to screen size
- **Accessibility** features for screen readers

### Browser Support
- ✅ Chrome 66+
- ✅ Firefox 60+
- ✅ Safari 14+
- ✅ Edge 79+

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Install dependencies (if any)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Code Style
- Follow existing code style
- Add comments for complex logic
- Include tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Web Audio API** for real-time audio processing
- **SVG** for scalable vector graphics
- **Modern JavaScript** for clean, efficient code
- **Open Source Community** for inspiration and tools

## 🔮 Roadmap

### Version 3.1
- [ ] More animation presets
- [ ] Export to video functionality
- [ ] VR/AR support
- [ ] Mobile optimizations

### Version 4.0
- [ ] Plugin system for custom animations
- [ ] Advanced audio effects
- [ ] Real-time collaboration
- [ ] Cloud sync for settings

## 📞 Support

- **Issues** : [GitHub Issues](https://github.com/your-repo/pulsecolor/issues)
- **Discussions** : [GitHub Discussions](https://github.com/your-repo/pulsecolor/discussions)
- **Email** : support@pulsecolor.dev

---

<div align="center">
  <p>Made with ❤️ by the PulseColor Team</p>
  <p>🎵 Turn up the music and watch the magic happen! 🎵</p>
</div>
