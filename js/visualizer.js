// Audio Visualizer - Script Principal
class AudioVisualizer {
    constructor() {
        this.audioContext = null;
        this.audioSource = null;
        this.analyser = null;
        this.audioElement = null;
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isPlaying = false;
        this.currentVisualizer = null;
        this.visualizers = {};
        this.fps = 60;
        this.lastTime = 0;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupAudio();
        this.setupEventListeners();
        this.setupVisualizers();
        this.updateVisualizer();
    }

    setupCanvas() {
        this.canvas = document.getElementById('visualizerCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    setupAudio() {
        // Créer l'élément audio
        this.audioElement = new Audio();
        this.audioElement.crossOrigin = 'anonymous';
        
        // Créer le contexte audio
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        
        // Configuration de l'analyseur
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.8;
        this.analyser.minDecibels = -90;
        this.analyser.maxDecibels = -10;
        
        // Connecter l'audio
        this.audioSource = this.audioContext.createMediaElementSource(this.audioElement);
        this.audioSource.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        
        // Tableaux pour les données audio
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        this.timeData = new Uint8Array(this.analyser.frequencyBinCount);
    }

    setupEventListeners() {
        // Contrôles de fichier
        const fileInput = document.getElementById('audioFile');
        fileInput.addEventListener('change', (e) => this.loadAudioFile(e.target.files[0]));

        // Contrôles de lecture
        document.getElementById('playBtn').addEventListener('click', () => this.play());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
        document.getElementById('stopBtn').addEventListener('click', () => this.stop());

        // Contrôle du volume
        const volumeSlider = document.getElementById('volumeSlider');
        volumeSlider.addEventListener('input', (e) => {
            this.audioElement.volume = e.target.value;
        });

        // Sélecteur de visualiseur
        const visualizerSelect = document.getElementById('visualizerSelect');
        visualizerSelect.addEventListener('change', (e) => {
            this.changeVisualizer(e.target.value);
        });

        // Événements audio
        this.audioElement.addEventListener('loadedmetadata', () => {
            this.updateDuration();
        });

        this.audioElement.addEventListener('timeupdate', () => {
            this.updateTime();
        });

        this.audioElement.addEventListener('ended', () => {
            this.stop();
        });
    }

    setupVisualizers() {
        // Enregistrer tous les visualiseurs disponibles
        this.visualizers = {
            'circular-radial': new CircularRadialVisualizer(this),
            'grid-3d': new Grid3DVisualizer(this),
            'linear-grid': new LinearGridVisualizer(this),
            'classic-bars': new ClassicBarsVisualizer(this),
            'neon-futuristic': new NeonFuturisticVisualizer(this),
            'multi-layer': new MultiLayerVisualizer(this),
            'spectrum-analyzer': new SpectrumAnalyzerVisualizer(this),
            'collection-12': new Collection12Visualizer(this),
            'spectrogram': new SpectrogramVisualizer(this),
            'professional': new ProfessionalVisualizer(this),
            'circular-simple': new CircularSimpleVisualizer(this),
            'arc-particles': new ArcParticlesVisualizer(this),
            'multi-lines': new MultiLinesVisualizer(this),
            'symmetric': new SymmetricVisualizer(this),
            'waveform-smooth': new WaveformSmoothVisualizer(this)
        };

        // Définir le visualiseur par défaut
        this.currentVisualizer = this.visualizers['circular-radial'];
    }

    loadAudioFile(file) {
        if (!file) return;

        const url = URL.createObjectURL(file);
        this.audioElement.src = url;
        
        // Mettre à jour le titre
        document.getElementById('visualizerTitle').textContent = `🎵 ${file.name}`;
        
        console.log(`Fichier audio chargé: ${file.name}`);
    }

    async play() {
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        
        try {
            await this.audioElement.play();
            this.isPlaying = true;
            this.startAnimation();
            this.updatePlaybackControls();
        } catch (error) {
            console.error('Erreur lors de la lecture:', error);
        }
    }

    pause() {
        this.audioElement.pause();
        this.isPlaying = false;
        this.updatePlaybackControls();
    }

    stop() {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.isPlaying = false;
        this.updatePlaybackControls();
    }

    updatePlaybackControls() {
        const playBtn = document.getElementById('playBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const stopBtn = document.getElementById('stopBtn');

        if (this.isPlaying) {
            playBtn.disabled = true;
            pauseBtn.disabled = false;
            stopBtn.disabled = false;
        } else {
            playBtn.disabled = false;
            pauseBtn.disabled = true;
            stopBtn.disabled = false;
        }
    }

    updateTime() {
        const currentTime = document.getElementById('currentTime');
        const time = this.audioElement.currentTime;
        currentTime.textContent = this.formatTime(time);
    }

    updateDuration() {
        const duration = document.getElementById('duration');
        const time = this.audioElement.duration;
        duration.textContent = this.formatTime(time);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    changeVisualizer(type) {
        if (this.visualizers[type]) {
            this.currentVisualizer = this.visualizers[type];
            this.updateVisualizerTitle();
            console.log(`Visualiseur changé: ${type}`);
        }
    }

    updateVisualizerTitle() {
        const titles = {
            'circular-radial': 'Circulaire Radial (Arc-en-ciel)',
            'grid-3d': 'Grille 3D Wireframe',
            'linear-grid': 'Linéaire avec Grille',
            'classic-bars': 'Barres Classiques',
            'neon-futuristic': 'Néon Futuriste',
            'multi-layer': 'Multi-Couches Cyan/Magenta',
            'spectrum-analyzer': 'Analyseur de Spectre',
            'collection-12': 'Collection de 12 Visualiseurs',
            'spectrogram': 'Spectrogramme Temporel',
            'professional': 'Audio Professionnel',
            'circular-simple': 'Circulaire Simple',
            'arc-particles': 'Arc avec Particules',
            'multi-lines': 'Multi-Lignes',
            'symmetric': 'Symétrique',
            'waveform-smooth': 'Forme d\'Onde Douce'
        };

        const select = document.getElementById('visualizerSelect');
        const title = titles[select.value] || 'Visualiseur Audio';
        document.getElementById('visualizerTitle').textContent = title;
    }

    startAnimation() {
        if (this.animationId) return;
        
        const animate = (currentTime) => {
            if (!this.isPlaying) {
                this.animationId = null;
                return;
            }

            // Calculer le FPS
            const deltaTime = currentTime - this.lastTime;
            const fps = 1000 / deltaTime;
            this.fps = Math.round(fps);
            this.lastTime = currentTime;

            // Mettre à jour les données audio
            this.updateAudioData();

            // Dessiner le visualiseur
            this.draw();

            // Mettre à jour les informations
            this.updateInfo();

            this.animationId = requestAnimationFrame(animate);
        };

        this.animationId = requestAnimationFrame(animate);
    }

    updateAudioData() {
        this.analyser.getByteFrequencyData(this.frequencyData);
        this.analyser.getByteTimeDomainData(this.timeData);
    }

    draw() {
        // Effacer le canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner le visualiseur actuel
        if (this.currentVisualizer && this.currentVisualizer.draw) {
            this.currentVisualizer.draw(this.ctx, this.frequencyData, this.timeData);
        }
    }

    updateInfo() {
        // Mettre à jour le FPS
        document.getElementById('fps').textContent = `FPS: ${this.fps}`;

        // Trouver la fréquence de pic
        let maxIndex = 0;
        let maxValue = 0;
        for (let i = 0; i < this.frequencyData.length; i++) {
            if (this.frequencyData[i] > maxValue) {
                maxValue = this.frequencyData[i];
                maxIndex = i;
            }
        }

        // Convertir l'index en fréquence
        const sampleRate = this.audioContext.sampleRate;
        const frequency = (maxIndex * sampleRate) / (this.analyser.fftSize * 2);
        
        document.getElementById('peakFreq').textContent = `Pic: ${Math.round(frequency)} Hz`;
    }

    // Méthodes utilitaires pour les visualiseurs
    getFrequencyData() {
        return this.frequencyData;
    }

    getTimeData() {
        return this.timeData;
    }

    getCanvasSize() {
        return {
            width: this.canvas.width,
            height: this.canvas.height
        };
    }

    getAudioContext() {
        return this.audioContext;
    }

    getAnalyser() {
        return this.analyser;
    }
}

// Classe de base pour tous les visualiseurs
class BaseVisualizer {
    constructor(audioVisualizer) {
        this.audioVisualizer = audioVisualizer;
        this.canvas = audioVisualizer.canvas;
        this.ctx = audioVisualizer.ctx;
    }

    draw(ctx, frequencyData, timeData) {
        // Méthode à surcharger dans les classes enfants
        console.warn('Méthode draw() non implémentée');
    }

    // Méthodes utilitaires communes
    getCanvasSize() {
        return this.audioVisualizer.getCanvasSize();
    }

    getFrequencyData() {
        return this.audioVisualizer.getFrequencyData();
    }

    getTimeData() {
        return this.audioVisualizer.getTimeData();
    }

    // Utilitaires de couleur
    getHueColor(hue, saturation = 100, lightness = 50) {
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    getGradientColor(position, startColor, endColor) {
        const r1 = parseInt(startColor.slice(1, 3), 16);
        const g1 = parseInt(startColor.slice(3, 5), 16);
        const b1 = parseInt(startColor.slice(5, 7), 16);
        
        const r2 = parseInt(endColor.slice(1, 3), 16);
        const g2 = parseInt(endColor.slice(3, 5), 16);
        const b2 = parseInt(endColor.slice(5, 7), 16);
        
        const r = Math.round(r1 + (r2 - r1) * position);
        const g = Math.round(g1 + (g2 - g1) * position);
        const b = Math.round(b1 + (b2 - b1) * position);
        
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Utilitaires de mathématiques
    map(value, inMin, inMax, outMin, outMax) {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }

    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
}

// Initialiser le visualiseur quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    window.audioVisualizer = new AudioVisualizer();
});

// Exporter pour utilisation dans les modules de visualiseurs
window.BaseVisualizer = BaseVisualizer;
