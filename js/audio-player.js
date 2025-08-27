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
                currentTime.textContent = this.formatTime(audioVisualizer.audio.currentTime);
            }
            if (totalTime) {
                totalTime.textContent = this.formatTime(audioVisualizer.audio.duration);
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
