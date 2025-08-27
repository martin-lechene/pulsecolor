// Audio Player avec analyseur de spectre et contrôle d'animations
class AudioVisualizer {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.audio = null;
        this.isPlaying = false;
        this.playlist = [];
        this.currentTrackIndex = 0;
        this.audioData = {
            bass: 0,      // 20-250 Hz
            lowMid: 0,    // 250-500 Hz
            mid: 0,       // 500-2000 Hz
            highMid: 0,   // 2000-4000 Hz
            treble: 0,    // 4000-20000 Hz
            overall: 0    // Amplitude générale
        };
        
        // Nouvelles propriétés pour les animations des cartes
        this.cardAnimations = {
            geometric: { intensity: 0, lastBeat: 0 },
            audioBars: { intensity: 0, lastBeat: 0 },
            circular: { intensity: 0, lastBeat: 0 },
            matrix: { intensity: 0, lastBeat: 0 },
            fireworks: { intensity: 0, lastBeat: 0 },
            dna: { intensity: 0, lastBeat: 0 },
            fractal: { intensity: 0, lastBeat: 0 }
        };
        
        this.init();
    }

    async init() {
        try {
            // Créer le contexte audio
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            
            // Configuration de l'analyseur
            this.analyser.fftSize = 2048;
            this.analyser.smoothingTimeConstant = 0.8;
            
            // Connecter l'analyseur
            this.analyser.connect(this.audioContext.destination);
            
            // Charger la playlist
            await this.loadPlaylist();
            
            // Initialiser les visualisations
            this.initVisualizations();
            
            // Démarrer l'analyse
            this.startAnalysis();
            
        } catch (error) {
            console.error('Erreur d\'initialisation audio:', error);
        }
    }

    async loadPlaylist() {
        // Liste des fichiers audio disponibles
        this.playlist = [
            'assets/audios/Des voyages de rêve.mp3',
            'assets/audios/Des voyages de rêve (1).mp3',
            'assets/audios/Des voyages de rêve (2).mp3',
            'assets/audios/Des voyages de rêve (3).mp3',
            'assets/audios/Des voyages de rêve (4).mp3',
            'assets/audios/Des voyages de rêve (5).mp3',
            'assets/audios/Des voyages de rêve (6).mp3',
            'assets/audios/Des lignes de voyage.mp3',
            'assets/audios/Des lignes de voyage (1).mp3'
        ];
        
        // Mettre à jour l'interface
        this.updatePlaylistUI();
    }

    updatePlaylistUI() {
        const playlistContainer = document.getElementById('playlist-container');
        if (!playlistContainer) return;
        
        playlistContainer.innerHTML = '';
        
        this.playlist.forEach((track, index) => {
            const trackName = track.split('/').pop().replace('.mp3', '');
            const trackElement = document.createElement('div');
            trackElement.className = `playlist-track ${index === this.currentTrackIndex ? 'active' : ''}`;
            trackElement.innerHTML = `
                <span class="track-name">${trackName}</span>
                <span class="track-duration">--:--</span>
            `;
            trackElement.addEventListener('click', () => this.loadTrack(index));
            playlistContainer.appendChild(trackElement);
        });
    }

    async loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        this.currentTrackIndex = index;
        
        try {
            // Arrêter la lecture actuelle
            if (this.audio) {
                this.audio.pause();
                this.audio = null;
            }
            
            // Créer un nouvel élément audio
            this.audio = new Audio(this.playlist[index]);
            this.audio.crossOrigin = 'anonymous';
            
            // Attendre que l'audio soit chargé
            await new Promise((resolve, reject) => {
                this.audio.addEventListener('canplaythrough', resolve);
                this.audio.addEventListener('error', reject);
                this.audio.load();
            });
            
            // Connecter à l'analyseur
            this.source = this.audioContext.createMediaElementSource(this.audio);
            this.source.connect(this.analyser);
            
            // Mettre à jour l'interface
            this.updatePlaylistUI();
            this.updateTrackInfo();
            
            // Démarrer la lecture si c'était en cours
            if (this.isPlaying) {
                this.play();
            }
            
        } catch (error) {
            console.error('Erreur de chargement de la piste:', error);
        }
    }

    play() {
        if (!this.audio) {
            this.loadTrack(0);
            return;
        }
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.audio.play();
        this.isPlaying = true;
        this.updatePlayButton();
    }

    pause() {
        if (this.audio) {
            this.audio.pause();
            this.isPlaying = false;
            this.updatePlayButton();
        }
    }

    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isPlaying = false;
            this.updatePlayButton();
        }
    }

    next() {
        const nextIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(nextIndex);
    }

    previous() {
        const prevIndex = this.currentTrackIndex === 0 ? this.playlist.length - 1 : this.currentTrackIndex - 1;
        this.loadTrack(prevIndex);
    }

    updatePlayButton() {
        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.innerHTML = this.isPlaying ? '⏸' : '▶';
        }
    }

    updateTrackInfo() {
        const trackInfo = document.getElementById('track-info');
        if (trackInfo && this.audio) {
            const trackName = this.playlist[this.currentTrackIndex].split('/').pop().replace('.mp3', '');
            trackInfo.textContent = trackName;
        }
    }

    initVisualizations() {
        // Créer les canvas pour les visualisations
        this.createSpectrumVisualizer();
        this.createVUMeter();
        this.createEqualizer();
    }

    createSpectrumVisualizer() {
        const canvas = document.getElementById('spectrum-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        this.drawSpectrum = () => {
            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            this.analyser.getByteFrequencyData(dataArray);
            
            ctx.clearRect(0, 0, width, height);
            
            const barWidth = width / bufferLength * 2.5;
            let barHeight;
            let x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 255 * height;
                
                // Couleurs basées sur la fréquence
                const hue = (i / bufferLength) * 360;
                ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
                
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };
    }

    createVUMeter() {
        const canvas = document.getElementById('vu-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        this.drawVUMeter = () => {
            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            this.analyser.getByteFrequencyData(dataArray);
            
            // Calculer l'amplitude moyenne
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }
            const average = sum / bufferLength;
            
            ctx.clearRect(0, 0, width, height);
            
            // Dessiner le VU-mètre
            const barHeight = (average / 255) * height;
            const gradient = ctx.createLinearGradient(0, height, 0, 0);
            gradient.addColorStop(0, '#00ff00');
            gradient.addColorStop(0.5, '#ffff00');
            gradient.addColorStop(1, '#ff0000');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, height - barHeight, width, barHeight);
            
            // Mettre à jour l'amplitude générale
            this.audioData.overall = average / 255;
        };
    }

    createEqualizer() {
        const canvas = document.getElementById('equalizer-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        this.drawEqualizer = () => {
            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            this.analyser.getByteFrequencyData(dataArray);
            
            ctx.clearRect(0, 0, width, height);
            
            // Diviser le spectre en 5 bandes
            const bands = 5;
            const bandSize = Math.floor(bufferLength / bands);
            
            for (let band = 0; band < bands; band++) {
                let sum = 0;
                const start = band * bandSize;
                const end = start + bandSize;
                
                for (let i = start; i < end; i++) {
                    sum += dataArray[i];
                }
                
                const average = sum / bandSize;
                const barHeight = (average / 255) * height;
                const barWidth = width / bands - 2;
                const x = band * (width / bands) + 1;
                
                // Couleurs pour chaque bande
                const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
                ctx.fillStyle = colors[band];
                
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);
                
                // Mettre à jour les données audio
                switch(band) {
                    case 0: this.audioData.bass = average / 255; break;
                    case 1: this.audioData.lowMid = average / 255; break;
                    case 2: this.audioData.mid = average / 255; break;
                    case 3: this.audioData.highMid = average / 255; break;
                    case 4: this.audioData.treble = average / 255; break;
                }
            }
        };
    }

    startAnalysis() {
        const animate = () => {
            if (this.isPlaying) {
                // Dessiner les visualisations
                if (this.drawSpectrum) this.drawSpectrum();
                if (this.drawVUMeter) this.drawVUMeter();
                if (this.drawEqualizer) this.drawEqualizer();
                
                // Contrôler les animations
                this.controlAnimations();
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    controlAnimations() {
        // Contrôler toutes les animations basées sur l'audio
        const animations = {
            // Animations basées sur l'amplitude générale
            'particle-float': this.audioData.overall,
            'particle-explosion': this.audioData.overall,
            'morph-blob': this.audioData.overall,
            'liquid-wave': this.audioData.overall,
            'neon-pulse': this.audioData.overall,
            'background-pulse': this.audioData.overall,
            
            // Animations basées sur les basses fréquences
            'rotate-3d': this.audioData.bass,
            'flip-card': this.audioData.bass,
            'border-dance': this.audioData.bass,
            'shadow-pulse': this.audioData.bass,
            
            // Animations basées sur les moyennes fréquences
            'text-wave': this.audioData.mid,
            'hover-lift': this.audioData.mid,
            'perspective-rotate': this.audioData.mid,
            
            // Animations basées sur les hautes fréquences
            'glitch-text': this.audioData.treble,
            'neon-flicker': this.audioData.treble,
            'hover-shake': this.audioData.treble,
            
            // Animations complexes basées sur toutes les fréquences
            'complex-animation': (this.audioData.bass + this.audioData.mid + this.audioData.treble) / 3
        };
        
        // Appliquer les contrôles aux animations
        Object.entries(animations).forEach(([className, intensity]) => {
            const elements = document.querySelectorAll(`.${className}`);
            elements.forEach(element => {
                // Ajuster la vitesse d'animation
                const baseDuration = 2; // durée de base en secondes
                const newDuration = baseDuration / (1 + intensity * 2);
                element.style.animationDuration = `${newDuration}s`;
                
                // Ajuster l'échelle basée sur l'intensité
                const scale = 1 + intensity * 0.3;
                element.style.transform = `scale(${scale})`;
                
                // Ajuster l'opacité
                const opacity = 0.5 + intensity * 0.5;
                element.style.opacity = opacity;
            });
        });
        
        // Contrôler les animations des cartes du hero
        this.controlCardAnimations();
    }

    controlCardAnimations() {
        if (!this.isPlaying) {
            // Réinitialiser les animations quand l'audio ne joue pas
            this.resetCardAnimations();
            return;
        }

        const { bass, mid, high, overall } = this.audioData;
        const time = Date.now();
        
        // Détecter les beats basés sur les basses fréquences
        const beatThreshold = 0.4;
        const isBeat = bass > beatThreshold && (time - this.cardAnimations.geometric.lastBeat) > 200;
        
        if (isBeat) {
            // Mettre à jour le dernier beat pour toutes les cartes
            Object.values(this.cardAnimations).forEach(card => {
                card.lastBeat = time;
            });
        }

        // Animation Geometric - Réagit aux basses fréquences
        this.animateCard('geometric', {
            scale: 1 + bass * 0.3,
            rotation: bass * 360,
            glow: bass * 0.8,
            pulse: isBeat ? 1.2 : 1
        });

        // Animation Audio Bars - Réagit aux moyennes fréquences
        this.animateCard('audioBars', {
            scale: 1 + mid * 0.2,
            height: mid * 100,
            color: `hsl(${180 + mid * 180}, 70%, 60%)`,
            pulse: isBeat ? 1.15 : 1
        });

        // Animation Circular - Réagit aux hautes fréquences
        this.animateCard('circular', {
            scale: 1 + high * 0.25,
            rotation: high * 720,
            opacity: 0.6 + high * 0.4,
            pulse: isBeat ? 1.1 : 1
        });

        // Animation Matrix - Réagit à l'amplitude générale
        this.animateCard('matrix', {
            scale: 1 + overall * 0.2,
            speed: 1 + overall * 2,
            opacity: 0.5 + overall * 0.5,
            pulse: isBeat ? 1.25 : 1
        });

        // Animation Fireworks - Réagit aux beats
        this.animateCard('fireworks', {
            scale: 1 + (bass + mid) * 0.3,
            intensity: isBeat ? 1 : 0.3,
            color: `hsl(${30 + bass * 60}, 80%, 60%)`,
            pulse: isBeat ? 1.3 : 1
        });

        // Animation DNA - Réagit aux moyennes et hautes fréquences
        this.animateCard('dna', {
            scale: 1 + (mid + high) * 0.2,
            rotation: (mid + high) * 180,
            opacity: 0.4 + (mid + high) * 0.6,
            pulse: isBeat ? 1.18 : 1
        });

        // Animation Fractal - Réagit à toutes les fréquences
        this.animateCard('fractal', {
            scale: 1 + overall * 0.25,
            growth: overall * 0.5,
            color: `hsl(${120 + overall * 120}, 70%, 60%)`,
            pulse: isBeat ? 1.22 : 1
        });
    }

    animateCard(cardType, properties) {
        const card = document.querySelector(`[data-animation="${cardType}"]`);
        if (!card) return;

        // Appliquer les transformations
        const transforms = [];
        
        if (properties.scale) {
            transforms.push(`scale(${properties.scale})`);
        }
        
        if (properties.rotation) {
            transforms.push(`rotate(${properties.rotation}deg)`);
        }
        
        if (transforms.length > 0) {
            card.style.transform = transforms.join(' ');
        }

        // Appliquer les autres propriétés
        if (properties.opacity !== undefined) {
            card.style.opacity = properties.opacity;
        }

        if (properties.glow) {
            card.style.filter = `drop-shadow(0 0 ${properties.glow * 20}px rgba(255, 255, 255, ${properties.glow}))`;
        }

        if (properties.pulse) {
            card.style.animation = `card-pulse ${2 / properties.pulse}s ease-in-out infinite`;
        }

        // Appliquer les couleurs si spécifiées
        if (properties.color) {
            const icon = card.querySelector('.animation-icon');
            if (icon) {
                icon.style.color = properties.color;
            }
        }

        // Effets spéciaux pour certains types de cartes
        switch (cardType) {
            case 'audioBars':
                this.animateAudioBars(card, properties);
                break;
            case 'fireworks':
                this.animateFireworks(card, properties);
                break;
            case 'fractal':
                this.animateFractal(card, properties);
                break;
        }
    }

    animateAudioBars(card, properties) {
        // Créer des barres audio réactives
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
            `;
            
            // Créer 5 barres
            for (let i = 0; i < 5; i++) {
                const bar = document.createElement('div');
                bar.style.cssText = `
                    width: 3px;
                    background: white;
                    border-radius: 1px;
                    transition: height 0.1s ease;
                `;
                barsContainer.appendChild(bar);
            }
            
            card.appendChild(barsContainer);
        }

        // Animer les barres
        const bars = barsContainer.children;
        for (let i = 0; i < bars.length; i++) {
            const height = Math.random() * properties.height + 5;
            bars[i].style.height = `${height}px`;
            bars[i].style.opacity = 0.3 + Math.random() * 0.7;
        }
    }

    animateFireworks(card, properties) {
        // Créer des particules de feu d'artifice
        if (properties.intensity > 0.8) {
            this.createFireworkParticles(card);
        }
    }

    createFireworkParticles(card) {
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

    animateFractal(card, properties) {
        // Animer la croissance fractale
        const icon = card.querySelector('.animation-icon');
        if (icon && properties.growth) {
            icon.style.transform = `scale(${1 + properties.growth})`;
        }
    }

    resetCardAnimations() {
        // Réinitialiser toutes les animations des cartes
        const cards = document.querySelectorAll('[data-animation]');
        cards.forEach(card => {
            card.style.transform = 'scale(1) rotate(0deg)';
            card.style.opacity = '1';
            card.style.filter = 'none';
            card.style.animation = 'none';
            
            // Supprimer les éléments temporaires
            const tempElements = card.querySelectorAll('.audio-bars, .firework-particle');
            tempElements.forEach(el => el.remove());
        });
    }

    // Getters pour accéder aux données audio depuis l'extérieur
    getAudioData() {
        return this.audioData;
    }

    getIsPlaying() {
        return this.isPlaying;
    }

    getCurrentTrack() {
        return this.playlist[this.currentTrackIndex];
    }
}

// Initialiser le visualiseur audio
let audioVisualizer;

document.addEventListener('DOMContentLoaded', () => {
    audioVisualizer = new AudioVisualizer();
    
    // Gestionnaires d'événements pour les contrôles
    document.getElementById('play-btn')?.addEventListener('click', () => {
        if (audioVisualizer.getIsPlaying()) {
            audioVisualizer.pause();
        } else {
            audioVisualizer.play();
        }
    });
    
    document.getElementById('stop-btn')?.addEventListener('click', () => {
        audioVisualizer.stop();
    });
    
    document.getElementById('next-btn')?.addEventListener('click', () => {
        audioVisualizer.next();
    });
    
    document.getElementById('prev-btn')?.addEventListener('click', () => {
        audioVisualizer.previous();
    });
    
    // Contrôle du volume
    document.getElementById('volume-slider')?.addEventListener('input', (e) => {
        if (audioVisualizer.audio) {
            audioVisualizer.audio.volume = e.target.value / 100;
        }
    });
    
    // Contrôle de la progression
    document.getElementById('progress-slider')?.addEventListener('input', (e) => {
        if (audioVisualizer.audio) {
            const time = (e.target.value / 100) * audioVisualizer.audio.duration;
            audioVisualizer.audio.currentTime = time;
        }
    });
    
    // Mettre à jour la progression en temps réel
    setInterval(() => {
        if (audioVisualizer.audio && audioVisualizer.isPlaying) {
            const progress = (audioVisualizer.audio.currentTime / audioVisualizer.audio.duration) * 100;
            const progressSlider = document.getElementById('progress-slider');
            if (progressSlider) {
                progressSlider.value = progress;
            }
            
            // Mettre à jour le temps affiché
            const currentTime = document.getElementById('current-time');
            const totalTime = document.getElementById('total-time');
            
            if (currentTime) {
                currentTime.textContent = formatTime(audioVisualizer.audio.currentTime);
            }
            if (totalTime) {
                totalTime.textContent = formatTime(audioVisualizer.audio.duration);
            }
        }
    }, 100);
});

// Fonction utilitaire pour formater le temps
function formatTime(seconds) {
    if (isNaN(seconds)) return '--:--';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
