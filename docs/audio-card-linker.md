# Système de Liaison Audio-Animations des Cartes

## Vue d'ensemble

Le système de liaison audio-animations des cartes permet de synchroniser les animations des cartes du hero avec le son du player audio en temps réel. Chaque carte réagit différemment selon les fréquences audio détectées.

## Fonctionnalités

### 🎵 Réactivité Audio
- **Analyse en temps réel** : Capture des données de fréquence audio (basses, moyennes, hautes)
- **Détection de beats** : Identification automatique des rythmes basés sur les basses fréquences
- **Réactivité immédiate** : Animations qui s'adaptent instantanément au son

### 🎨 Animations Spécifiques par Carte

#### 1. **Geometric** 🔷
- **Réagit aux** : Basses fréquences (20-250 Hz)
- **Effets** : 
  - Rotation basée sur l'intensité des basses
  - Échelle dynamique
  - Effet de glow
  - Pulse sur les beats

#### 2. **Audio Bars** 📊
- **Réagit aux** : Moyennes fréquences (500-2000 Hz)
- **Effets** :
  - Barres audio animées en temps réel
  - Changement de couleur selon l'intensité
  - Échelle modérée

#### 3. **Circular** ⭕
- **Réagit aux** : Hautes fréquences (4000-20000 Hz)
- **Effets** :
  - Rotation rapide
  - Opacité variable
  - Échelle dynamique

#### 4. **Matrix** 💻
- **Réagit aux** : Amplitude générale
- **Effets** :
  - Vitesse d'animation variable
  - Opacité basée sur l'intensité globale
  - Pulse sur les beats

#### 5. **Fireworks** 🎆
- **Réagit aux** : Beats et combinaison basses/moyennes
- **Effets** :
  - Particules explosives sur les beats
  - Couleurs dynamiques
  - Échelle importante

#### 6. **DNA Helix** 🧬
- **Réagit aux** : Moyennes et hautes fréquences
- **Effets** :
  - Rotation modérée
  - Opacité variable
  - Animation fluide

#### 7. **Fractal** 🌳
- **Réagit aux** : Toutes les fréquences
- **Effets** :
  - Croissance fractale
  - Couleurs dynamiques
  - Échelle globale

## Architecture Technique

### Fichiers Principaux

1. **`js/audio-player.js`**
   - Classe `AudioVisualizer` principale
   - Analyse audio en temps réel
   - Gestion des événements audio

2. **`js/card-audio-linker.js`**
   - Classe `CardAudioLinker` dédiée
   - Liaison entre audio et animations des cartes
   - Gestion des effets spéciaux

3. **`css/audio-player.css`**
   - Styles pour les animations des cartes
   - Keyframes pour les effets visuels
   - Responsive design

### Classes Principales

#### AudioVisualizer
```javascript
class AudioVisualizer {
    constructor() {
        this.audioData = {
            bass: 0,      // 20-250 Hz
            lowMid: 0,    // 250-500 Hz
            mid: 0,       // 500-2000 Hz
            highMid: 0,   // 2000-4000 Hz
            treble: 0,    // 4000-20000 Hz
            overall: 0    // Amplitude générale
        };
    }
}
```

#### CardAudioLinker
```javascript
class CardAudioLinker {
    constructor(audioVisualizer) {
        this.audioVisualizer = audioVisualizer;
        this.cards = new Map();
        this.isActive = false;
    }
}
```

## Utilisation

### Initialisation Automatique
Le système s'initialise automatiquement quand le DOM est prêt :

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // AudioVisualizer s'initialise automatiquement
    // CardAudioLinker s'initialise après 1 seconde
});
```

### Contrôle Manuel
```javascript
// Accéder aux instances
const audioVisualizer = window.audioVisualizer;
const cardLinker = window.cardAudioLinker;

// Vérifier l'état
if (cardLinker.isAudioActive()) {
    console.log('Audio actif, animations en cours');
}

// Obtenir les données audio
const audioData = cardLinker.getAudioData();
console.log('Basses:', audioData.bass);
console.log('Moyennes:', audioData.mid);
console.log('Hautes:', audioData.high);
```

## Événements

### Événements Audio
- `play` : Déclenché quand l'audio commence
- `pause` : Déclenché quand l'audio est mis en pause
- `stop` : Déclenché quand l'audio s'arrête

### Événements Carte
- `mouseenter` : Amélioration de l'animation au survol
- `mouseleave` : Réinitialisation de l'animation
- `click` : Activation de l'animation correspondante

## Configuration

### Seuils de Beat
```javascript
const beatThreshold = 0.4; // Seuil pour détecter les beats
const beatCooldown = 200;  // Délai minimum entre beats (ms)
```

### Paramètres d'Animation
```javascript
// Échelle maximale
const maxScale = 1.3;

// Vitesse de rotation
const maxRotation = 720; // degrés

// Intensité du glow
const maxGlow = 0.8;
```

## Performance

### Optimisations
- **RequestAnimationFrame** : Boucle d'animation optimisée
- **Throttling** : Limitation des mises à jour pour éviter la surcharge
- **Cleanup automatique** : Suppression des éléments temporaires

### Monitoring
```javascript
// Vérifier les performances
console.log('FPS:', audioVisualizer.fps);
console.log('Temps par frame:', audioVisualizer.msAvg);
```

## Dépannage

### Problèmes Courants

1. **Animations ne fonctionnent pas**
   - Vérifier que l'audio joue
   - Contrôler la console pour les erreurs
   - S'assurer que les cartes ont les bons attributs `data-animation`

2. **Performance dégradée**
   - Réduire la complexité des animations
   - Vérifier les ressources système
   - Optimiser les paramètres d'animation

3. **Audio non détecté**
   - Vérifier les permissions microphone
   - Contrôler la connexion audio
   - Tester avec un fichier audio local

### Debug
```javascript
// Mode debug
window.cardAudioLinker.debug = true;

// Logs détaillés
console.log('Cartes trouvées:', window.cardAudioLinker.cards.size);
console.log('État audio:', window.cardAudioLinker.isAudioActive());
```

## Extensions Futures

### Fonctionnalités Prévues
- [ ] Contrôles de sensibilité par carte
- [ ] Animations personnalisées par utilisateur
- [ ] Export des animations
- [ ] Mode performance pour appareils mobiles

### API Publique
```javascript
// Interface pour extensions
window.PulseColorAPI = {
    getAudioData: () => audioVisualizer.getAudioData(),
    isPlaying: () => audioVisualizer.getIsPlaying(),
    switchAnimation: (type) => pulseColor.switchAnimation(type),
    addCustomAnimation: (name, config) => { /* ... */ }
};
```

## Support

Pour toute question ou problème :
1. Vérifier la console du navigateur
2. Consulter cette documentation
3. Tester avec différents fichiers audio
4. Vérifier la compatibilité navigateur
