# PulseColor - Documentation

## 🎵 Animations Audio-Réactives Open Source

PulseColor transforme votre musique en animations spectaculaires en temps réel. 10 animations différentes, open source et 100% gratuit.

## 📚 Table des Matières

- [🚀 Démarrage Rapide](./quickstart.md)
- [📖 Guide d'Intégration](./integration.md)
- [🔧 API Reference](./api.md)
- [🎯 Exemples](./examples.md)
- [🎨 Personnalisation](./customization.md)
- [❓ FAQ](./faq.md)

## ✨ Fonctionnalités

### 🎧 10 Animations Uniques
1. **Blob Morphing** - Formes organiques qui se déforment
2. **Système de Particules** - Particules réactives qui dansent
3. **Ondes Sonores** - Vagues fluides qui épousent les fréquences
4. **Formes Géométriques** - Shapes qui s'animent et se transforment
5. **Barres Audio** - Visualisation classique des fréquences
6. **Ondes Circulaires** - Cercles qui s'étendent depuis le centre
7. **Matrix Rain** - Caractères qui tombent style Matrix
8. **Feux d'Artifice** - Explosions colorées synchronisées
9. **Hélice ADN** - Double hélice qui tourne et vibre
10. **Arbres Fractals** - Structures fractales qui poussent

### 🔧 Caractéristiques Techniques
- **Analyse temps réel** basée sur l'API Web Audio
- **Détection de beat** simple et efficace
- **Couleurs dynamiques** réactives à l'énergie du signal
- **Performances optimisées** avec requestAnimationFrame
- **Accessibilité** complète (ARIA, navigation clavier)
- **Responsive design** pour tous les écrans

## 🚀 Installation

### CDN (Recommandé)
```html
<script src="https://cdn.pulsecolor.dev/pulsecolor.min.js"></script>
```

### NPM
```bash
npm install pulsecolor
```

### Manuel
1. Téléchargez les fichiers depuis [GitHub](https://github.com/pulsecolor/pulsecolor)
2. Incluez `css/main.css` et `js/main.js` dans votre projet

## 💻 Utilisation Basique

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <div id="pulsecolor-demo"></div>
  
  <script src="js/animations.js"></script>
  <script src="js/main.js"></script>
  <script>
    // Initialisation automatique
    new PulseColor();
  </script>
</body>
</html>
```

## 🎯 Cas d'Usage

### Sites Web
- Landing pages interactives
- Backgrounds animés
- Effets de survol audio-réactifs

### Événements
- DJ sets en direct
- Performances artistiques
- Installations interactives

### Streaming
- Overlays pour Twitch/YouTube
- Effets de transition
- Visualisations en temps réel

### Applications
- Players de musique
- Applications de fitness
- Outils de création

## 🔧 Configuration

### Options de Base
```javascript
const pulseColor = new PulseColor({
  container: '#my-container',
  animation: 'blob',
  sensitivity: 0.8,
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6'
  }
});
```

### Options Avancées
```javascript
const pulseColor = new PulseColor({
  // Audio
  audioSource: 'microphone', // 'microphone' | 'file' | 'stream'
  fftSize: 2048,
  smoothingTimeConstant: 0.8,
  
  // Visual
  animation: 'particles',
  fps: 60,
  quality: 'high', // 'low' | 'medium' | 'high'
  
  // Performance
  enablePerformanceTracking: true,
  enableNotifications: true,
  
  // Accessibilité
  enableKeyboardShortcuts: true,
  enableScreenReader: true
});
```

## 🎨 Personnalisation

### Créer une Animation Personnalisée
```javascript
class CustomAnimation extends BaseAnimation {
  constructor(svg) {
    super(svg);
  }

  init() {
    // Initialisation de votre animation
  }

  update(audioData) {
    const { bass, mid, high, beat } = audioData;
    // Logique de votre animation
  }
}

// Enregistrer l'animation
PulseColor.registerAnimation('custom', CustomAnimation);
```

### Personnaliser les Couleurs
```css
:root {
  --bg-a: 260 95% 60%;
  --bg-b: 200 95% 60%;
  --accent: 270 100% 67%;
}
```

## 📊 Performance

### Métriques
- **Latence moyenne** : < 4ms
- **FPS cible** : 60 FPS
- **Taille du bundle** : < 50KB gzippé
- **Compatibilité** : Tous les navigateurs modernes

### Optimisations
- Utilisation de `requestAnimationFrame`
- Variables CSS pour les animations
- Lazy loading des animations
- Debouncing des événements audio

## 🔒 Sécurité & Vie Privée

- **Aucune donnée envoyée** vers nos serveurs
- **Accès micro local** uniquement
- **Licence MIT** - utilisation commerciale autorisée
- **Code source ouvert** - audit complet possible

## 🤝 Contribution

Nous accueillons toutes les contributions !

### Comment Contribuer
1. Fork le projet sur GitHub
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

### Types de Contributions
- 🐛 Rapports de bugs
- ✨ Nouvelles fonctionnalités
- 📚 Amélioration de la documentation
- 🎨 Nouvelles animations
- ⚡ Optimisations de performance
- ♿ Améliorations d'accessibilité

## 📄 Licence

PulseColor est distribué sous licence MIT. Voir le fichier [LICENSE](../LICENSE) pour plus de détails.

## 🆘 Support

### Ressources
- [Documentation complète](./api.md)
- [Exemples d'utilisation](./examples.md)
- [FAQ](./faq.md)

### Communauté
- [GitHub Discussions](https://github.com/pulsecolor/pulsecolor/discussions)
- [Discord](https://discord.gg/pulsecolor)
- [Twitter](https://twitter.com/pulsecolor)

### Support Commercial
Pour un support personnalisé ou des développements sur mesure :
- 📧 contact@pulsecolor.dev
- 💼 [Services de personnalisation](./customization.md)

---

**Propulsé par l'amour de la musique et du code open source 🎵**
