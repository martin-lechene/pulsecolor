/**
 * Card Audio Linker
 * Système de liaison audio-animations pour les cartes du hero
 */

class CardAudioLinker {
    constructor(audioVisualizer) {
        this.audioVisualizer = audioVisualizer;
        this.cards = new Map();
        this.isActive = false;
        
        this.init();
    }

    init() {
        this.setupCards();
        this.setupEventListeners();
        this.startAnimationLoop();
    }

    setupCards() {
        // Identifier toutes les cartes d'animation
        const cardSelectors = [
            '[data-animation="geometric"]',
            '[data-animation="audioBars"]',
            '[data-animation="circular"]',
            '[data-animation="matrix"]',
            '[data-animation="fireworks"]',
            '[data-animation="dna"]',
            '[data-animation="fractal"]'
        ];

        cardSelectors.forEach(selector => {
            const card = document.querySelector(selector);
            if (card) {
                const animationType = card.getAttribute('data-animation');
                this.cards.set(animationType, {
                    element: card,
                    type: animationType,
                    lastBeat: 0,
                    intensity: 0,
                    isHovered: false
                });
            }
        });

        console.log(`CardAudioLinker: ${this.cards.size} cartes d'animation trouvées`);
    }

    setupEventListeners() {
        // Écouter les changements d'état du player audio
        this.audioVisualizer.addEventListener('play', () => {
            this.isActive = true;
            this.activateCards();
        });

        this.audioVisualizer.addEventListener('pause', () => {
            this.isActive = false;
            this.deactivateCards();
        });

        // Écouter les événements de hover sur les cartes
        this.cards.forEach((cardData, type) => {
            const card = cardData.element;
            
            card.addEventListener('mouseenter', () => {
                cardData.isHovered = true;
                this.enhanceCardAnimation(type);
            });

            card.addEventListener('mouseleave', () => {
                cardData.isHovered = false;
                this.resetCardAnimation(type);
            });

            // Cliquer sur une carte pour activer l'animation correspondante
            card.addEventListener('click', () => {
                this.activateAnimation(type);
            });
        });
    }

    startAnimationLoop() {
        const animate = () => {
            if (this.isActive && this.audioVisualizer.getIsPlaying()) {
                this.updateCardAnimations();
            }
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    updateCardAnimations() {
        const audioData = this.audioVisualizer.getAudioData();
        const time = Date.now();

        this.cards.forEach((cardData, type) => {
            const { bass, mid, high, overall } = audioData;
            
            // Détecter les beats
            const beatThreshold = 0.4;
            const isBeat = bass > beatThreshold && (time - cardData.lastBeat) > 200;
            
            if (isBeat) {
                cardData.lastBeat = time;
                this.triggerBeatEffect(type);
            }

            // Appliquer les animations basées sur le type de carte
            this.applyCardAnimation(type, {
                bass,
                mid,
                high,
                overall,
                isBeat,
                time
            });
        });
    }

    applyCardAnimation(cardType, audioData) {
        const cardData = this.cards.get(cardType);
        if (!cardData) return;

        const { bass, mid, high, overall, isBeat } = audioData;
        const card = cardData.element;

        // Paramètres d'animation spécifiques à chaque type
        const animationParams = this.getAnimationParams(cardType, audioData);

        // Appliquer les transformations
        const transforms = [];
        
        if (animationParams.scale) {
            transforms.push(`scale(${animationParams.scale})`);
        }
        
        if (animationParams.rotation) {
            transforms.push(`rotate(${animationParams.rotation}deg)`);
        }

        if (transforms.length > 0) {
            card.style.transform = transforms.join(' ');
        }

        // Appliquer les autres propriétés
        if (animationParams.opacity !== undefined) {
            card.style.opacity = animationParams.opacity;
        }

        if (animationParams.glow) {
            card.style.filter = `drop-shadow(0 0 ${animationParams.glow * 20}px rgba(255, 255, 255, ${animationParams.glow}))`;
        }

        if (animationParams.pulse) {
            card.style.animation = `card-pulse ${2 / animationParams.pulse}s ease-in-out infinite`;
        }

        // Appliquer les couleurs
        if (animationParams.color) {
            const icon = card.querySelector('.animation-icon');
            if (icon) {
                icon.style.color = animationParams.color;
            }
        }

        // Effets spéciaux
        this.applySpecialEffects(cardType, card, animationParams);
    }

    getAnimationParams(cardType, audioData) {
        const { bass, mid, high, overall, isBeat } = audioData;

        switch (cardType) {
            case 'geometric':
                return {
                    scale: 1 + bass * 0.3,
                    rotation: bass * 360,
                    glow: bass * 0.8,
                    pulse: isBeat ? 1.2 : 1,
                    color: `hsl(${200 + bass * 60}, 70%, 60%)`
                };

            case 'audioBars':
                return {
                    scale: 1 + mid * 0.2,
                    height: mid * 100,
                    color: `hsl(${180 + mid * 180}, 70%, 60%)`,
                    pulse: isBeat ? 1.15 : 1
                };

            case 'circular':
                return {
                    scale: 1 + high * 0.25,
                    rotation: high * 720,
                    opacity: 0.6 + high * 0.4,
                    pulse: isBeat ? 1.1 : 1,
                    color: `hsl(${30 + high * 60}, 80%, 60%)`
                };

            case 'matrix':
                return {
                    scale: 1 + overall * 0.2,
                    speed: 1 + overall * 2,
                    opacity: 0.5 + overall * 0.5,
                    pulse: isBeat ? 1.25 : 1,
                    color: `hsl(${120 + overall * 120}, 70%, 60%)`
                };

            case 'fireworks':
                return {
                    scale: 1 + (bass + mid) * 0.3,
                    intensity: isBeat ? 1 : 0.3,
                    color: `hsl(${30 + bass * 60}, 80%, 60%)`,
                    pulse: isBeat ? 1.3 : 1
                };

            case 'dna':
                return {
                    scale: 1 + (mid + high) * 0.2,
                    rotation: (mid + high) * 180,
                    opacity: 0.4 + (mid + high) * 0.6,
                    pulse: isBeat ? 1.18 : 1,
                    color: `hsl(${280 + (mid + high) * 80}, 70%, 60%)`
                };

            case 'fractal':
                return {
                    scale: 1 + overall * 0.25,
                    growth: overall * 0.5,
                    color: `hsl(${120 + overall * 120}, 70%, 60%)`,
                    pulse: isBeat ? 1.22 : 1
                };

            default:
                return {
                    scale: 1,
                    pulse: 1
                };
        }
    }

    applySpecialEffects(cardType, card, params) {
        switch (cardType) {
            case 'audioBars':
                this.createAudioBars(card, params);
                break;
            case 'fireworks':
                this.createFireworks(card, params);
                break;
            case 'fractal':
                this.animateFractal(card, params);
                break;
        }
    }

    createAudioBars(card, params) {
        let barsContainer = card.querySelector('.audio-bars');
        if (!barsContainer) {
            barsContainer = document.createElement('div');
            barsContainer.className = 'audio-bars';
            barsContainer.style.cssText = `
                position: absolute;
                bottom: 10px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 2px;
                height: 20px;
                align-items: end;
                z-index: 10;
            `;
            
            // Créer 5 barres
            for (let i = 0; i < 5; i++) {
                const bar = document.createElement('div');
                bar.style.cssText = `
                    width: 3px;
                    background: white;
                    border-radius: 1px;
                    transition: height 0.1s ease;
                    min-height: 2px;
                `;
                barsContainer.appendChild(bar);
            }
            
            card.appendChild(barsContainer);
        }

        // Animer les barres
        const bars = barsContainer.children;
        for (let i = 0; i < bars.length; i++) {
            const height = Math.random() * (params.height || 50) + 5;
            bars[i].style.height = `${height}px`;
            bars[i].style.opacity = 0.3 + Math.random() * 0.7;
        }
    }

    createFireworks(card, params) {
        if (params.intensity > 0.8) {
            this.createFireworkParticle(card);
        }
    }

    createFireworkParticle(card) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            animation: firework-explode 1s ease-out forwards;
            z-index: 20;
        `;
        
        // Position aléatoire
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        card.appendChild(particle);
        
        // Supprimer après l'animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }

    animateFractal(card, params) {
        const icon = card.querySelector('.animation-icon');
        if (icon && params.growth) {
            icon.style.transform = `scale(${1 + params.growth})`;
        }
    }

    triggerBeatEffect(cardType) {
        const cardData = this.cards.get(cardType);
        if (!cardData) return;

        const card = cardData.element;
        
        // Effet de flash sur les beats
        card.style.animation = 'none';
        card.offsetHeight; // Force reflow
        card.style.animation = `card-pulse 0.2s ease-out`;
        
        // Ajouter une classe temporaire
        card.classList.add('beat-active');
        setTimeout(() => {
            card.classList.remove('beat-active');
        }, 200);
    }

    enhanceCardAnimation(cardType) {
        const cardData = this.cards.get(cardType);
        if (!cardData) return;

        const card = cardData.element;
        card.style.transform = 'scale(1.1)';
        card.style.boxShadow = '0 15px 40px rgba(255, 255, 255, 0.3)';
    }

    resetCardAnimation(cardType) {
        const cardData = this.cards.get(cardType);
        if (!cardData) return;

        const card = cardData.element;
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '';
    }

    activateCards() {
        this.cards.forEach((cardData, type) => {
            cardData.element.classList.add('audio-active');
        });
    }

    deactivateCards() {
        this.cards.forEach((cardData, type) => {
            cardData.element.classList.remove('audio-active');
            this.resetCardAnimation(type);
            
            // Supprimer les éléments temporaires
            const tempElements = cardData.element.querySelectorAll('.audio-bars, .firework-particle');
            tempElements.forEach(el => el.remove());
        });
    }

    activateAnimation(cardType) {
        // Activer l'animation correspondante dans le système principal
        if (window.pulseColor && window.pulseColor.switchAnimation) {
            window.pulseColor.switchAnimation(cardType);
        }
        
        // Feedback visuel
        const cardData = this.cards.get(cardType);
        if (cardData) {
            this.triggerBeatEffect(cardType);
        }
    }

    // Méthode pour obtenir les données audio en temps réel
    getAudioData() {
        return this.audioVisualizer.getAudioData();
    }

    // Méthode pour vérifier si le système est actif
    isAudioActive() {
        return this.isActive && this.audioVisualizer.getIsPlaying();
    }
}

// Initialiser le système quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que l'audioVisualizer soit initialisé
    setTimeout(() => {
        if (window.audioVisualizer) {
            window.cardAudioLinker = new CardAudioLinker(window.audioVisualizer);
            console.log('CardAudioLinker initialisé avec succès');
        } else {
            console.warn('AudioVisualizer non trouvé, CardAudioLinker non initialisé');
        }
    }, 1000);
});

// Export pour utilisation modulaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CardAudioLinker;
}
