# PulseColor 🎵

**Animations Audio-Réactives Open Source**

Transformez votre musique en animations spectaculaires en temps réel. 10 animations différentes, open source et 100% gratuit.

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/pulsecolor/pulsecolor/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Open Source](https://img.shields.io/badge/open%20source-100%25-brightgreen.svg)](https://github.com/pulsecolor/pulsecolor)
[![Stars](https://img.shields.io/github/stars/pulsecolor/pulsecolor?style=social)](https://github.com/pulsecolor/pulsecolor)

## ✨ Démo Live

🎵 **[Essayez PulseColor maintenant](https://pulsecolor.dev)**

## 🎨 10 Animations Uniques

1. **🫧 Blob Morphing** - Formes organiques qui se déforment
2. **✨ Système de Particules** - Particules réactives qui dansent
3. **🌊 Ondes Sonores** - Vagues fluides qui épousent les fréquences
4. **🔷 Formes Géométriques** - Shapes qui s'animent et se transforment
5. **📊 Barres Audio** - Visualisation classique des fréquences
6. **⭕ Ondes Circulaires** - Cercles qui s'étendent depuis le centre
7. **💻 Matrix Rain** - Caractères qui tombent style Matrix
8. **🎆 Feux d'Artifice** - Explosions colorées synchronisées
9. **🧬 Hélice ADN** - Double hélice qui tourne et vibre
10. **🌳 Arbres Fractals** - Structures fractales qui poussent

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
```bash
git clone https://github.com/pulsecolor/pulsecolor.git
cd pulsecolor
```

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

- **Latence moyenne** : < 4ms
- **FPS cible** : 60 FPS
- **Taille du bundle** : < 50KB gzippé
- **Compatibilité** : Tous les navigateurs modernes

## 🔒 Sécurité & Vie Privée

- **Aucune donnée envoyée** vers nos serveurs
- **Accès micro local** uniquement
- **Licence MIT** - utilisation commerciale autorisée
- **Code source ouvert** - audit complet possible

## 🛠️ Technologies

- **JavaScript ES6+** - Logique principale
- **Web Audio API** - Analyse audio temps réel
- **SVG** - Animations vectorielles
- **CSS Variables** - Couleurs dynamiques
- **PWA** - Application web progressive

## 📚 Documentation

- [🚀 Démarrage Rapide](docs/quickstart.md)
- [📖 Guide d'Intégration](docs/integration.md)
- [🔧 API Reference](docs/api.md)
- [🎯 Exemples](docs/examples.md)
- [🎨 Personnalisation](docs/customization.md)
- [❓ FAQ](docs/faq.md)

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

## 🆘 Support

### Communauté
- [GitHub Discussions](https://github.com/pulsecolor/pulsecolor/discussions)
- [Discord](https://discord.gg/pulsecolor)
- [Twitter](https://twitter.com/pulsecolor)

### Support Commercial
Pour un support personnalisé ou des développements sur mesure :
- 📧 contact@pulsecolor.dev
- 💼 [Services de personnalisation](docs/customization.md)

## 📄 Licence

PulseColor est distribué sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - Pour l'analyse audio
- [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) - Pour les animations vectorielles
- [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) - Pour la typographie
- Tous les contributeurs de la communauté

## 📈 Statistiques

![GitHub stars](https://img.shields.io/github/stars/pulsecolor/pulsecolor?style=social)
![GitHub forks](https://img.shields.io/github/forks/pulsecolor/pulsecolor?style=social)
![GitHub issues](https://img.shields.io/github/issues/pulsecolor/pulsecolor)
![GitHub pull requests](https://img.shields.io/github/issues-pr/pulsecolor/pulsecolor)
![GitHub contributors](https://img.shields.io/github/contributors/pulsecolor/pulsecolor)
![GitHub last commit](https://img.shields.io/github/last-commit/pulsecolor/pulsecolor)

---

**Propulsé par l'amour de la musique et du code open source 🎵**

[![PulseColor](https://img.shields.io/badge/PulseColor-2.0.0-blue?style=for-the-badge&logo=github)](https://pulsecolor.dev)
