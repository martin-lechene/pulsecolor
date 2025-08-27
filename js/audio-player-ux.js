// Audio Player UX Improvements
class AudioPlayerUX {
    constructor() {
        this.isFullscreen = false;
        this.currentFullscreenCanvas = null;
        this.draggedTrack = null;
        this.dragOverTrack = null;
        this.keyboardShortcuts = new Map();
        
        this.init();
    }

    init() {
        this.setupKeyboardShortcuts();
        this.setupFullscreenMode();
        this.setupDragAndDrop();
        this.setupTooltips();
        this.setupStatusMessages();
        this.setupDoubleClickHandlers();
    }

    // ===== RACCOURCIS CLAVIER =====
    setupKeyboardShortcuts() {
        this.keyboardShortcuts.set(' ', () => this.togglePlayPause());
        this.keyboardShortcuts.set('ArrowLeft', () => this.previousTrack());
        this.keyboardShortcuts.set('ArrowRight', () => this.nextTrack());
        this.keyboardShortcuts.set('s', () => this.stopTrack());
        this.keyboardShortcuts.set('S', () => this.stopTrack());
        this.keyboardShortcuts.set('Escape', () => this.closeFullscreen());
        this.keyboardShortcuts.set('f', () => this.toggleFullscreen());
        this.keyboardShortcuts.set('F', () => this.toggleFullscreen());

        document.addEventListener('keydown', (e) => {
            // Ignorer si on est dans un champ de saisie
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            const shortcut = this.keyboardShortcuts.get(e.key);
            if (shortcut) {
                e.preventDefault();
                shortcut();
            }
        });
    }

    togglePlayPause() {
        if (window.audioVisualizer) {
            if (window.audioVisualizer.getIsPlaying()) {
                window.audioVisualizer.pause();
            } else {
                window.audioVisualizer.play();
            }
        }
    }

    previousTrack() {
        if (window.audioVisualizer) {
            window.audioVisualizer.previous();
        }
    }

    nextTrack() {
        if (window.audioVisualizer) {
            window.audioVisualizer.next();
        }
    }

    stopTrack() {
        if (window.audioVisualizer) {
            window.audioVisualizer.stop();
        }
    }

    // ===== MODE PLEIN ÉCRAN =====
    setupFullscreenMode() {
        const containers = document.querySelectorAll('.visualization-container');
        containers.forEach(container => {
            container.addEventListener('click', () => {
                this.openFullscreen(container);
            });
        });
    }

    openFullscreen(container) {
        const canvas = container.querySelector('canvas');
        const overlay = document.getElementById('fullscreen-overlay');
        const fullscreenCanvas = document.getElementById('fullscreen-canvas');
        const title = document.getElementById('fullscreen-title');
        const instructions = document.getElementById('fullscreen-instructions');

        if (!canvas || !overlay || !fullscreenCanvas) return;

        // Copier les propriétés du canvas
        fullscreenCanvas.width = canvas.width * 3;
        fullscreenCanvas.height = canvas.height * 3;
        fullscreenCanvas.style.width = '90vw';
        fullscreenCanvas.style.height = '70vh';

        // Mettre à jour le titre
        const label = container.querySelector('.visualization-label');
        if (label) {
            title.textContent = label.textContent;
        }

        // Afficher l'overlay
        overlay.classList.add('active');
        this.isFullscreen = true;
        this.currentFullscreenCanvas = canvas;

        // Copier le contenu du canvas
        this.copyCanvasContent(canvas, fullscreenCanvas);

        // Démarrer l'animation en plein écran
        this.startFullscreenAnimation(canvas, fullscreenCanvas);

        this.showStatusMessage('Mode plein écran activé - Appuyez sur Échap pour fermer');
    }

    copyCanvasContent(sourceCanvas, targetCanvas) {
        const sourceCtx = sourceCanvas.getContext('2d');
        const targetCtx = targetCanvas.getContext('2d');
        
        // Copier l'image actuelle
        const imageData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
        targetCtx.putImageData(imageData, 0, 0);
    }

    startFullscreenAnimation(sourceCanvas, targetCanvas) {
        const animate = () => {
            if (this.isFullscreen && window.audioVisualizer && window.audioVisualizer.getIsPlaying()) {
                this.copyCanvasContent(sourceCanvas, targetCanvas);
            }
            requestAnimationFrame(animate);
        };
        animate();
    }

    closeFullscreen() {
        const overlay = document.getElementById('fullscreen-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        this.isFullscreen = false;
        this.currentFullscreenCanvas = null;
        this.showStatusMessage('Mode plein écran fermé');
    }

    toggleFullscreen() {
        if (this.isFullscreen) {
            this.closeFullscreen();
        } else {
            const activeContainer = document.querySelector('.visualization-container:hover');
            if (activeContainer) {
                this.openFullscreen(activeContainer);
            }
        }
    }

    // ===== DRAG & DROP =====
    setupDragAndDrop() {
        const playlistContainer = document.getElementById('playlist-container');
        if (!playlistContainer) return;

        playlistContainer.addEventListener('dragstart', (e) => {
            this.handleDragStart(e);
        });

        playlistContainer.addEventListener('dragover', (e) => {
            this.handleDragOver(e);
        });

        playlistContainer.addEventListener('drop', (e) => {
            this.handleDrop(e);
        });

        playlistContainer.addEventListener('dragend', (e) => {
            this.handleDragEnd(e);
        });
    }

    handleDragStart(e) {
        const track = e.target.closest('.playlist-track');
        if (!track) return;

        this.draggedTrack = track;
        track.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', track.outerHTML);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const track = e.target.closest('.playlist-track');
        if (!track || track === this.draggedTrack) return;

        // Supprimer la classe drag-over de tous les tracks
        document.querySelectorAll('.playlist-track').forEach(t => {
            t.classList.remove('drag-over');
        });

        // Ajouter la classe drag-over au track survolé
        track.classList.add('drag-over');
        this.dragOverTrack = track;
    }

    handleDrop(e) {
        e.preventDefault();
        
        if (!this.draggedTrack || !this.dragOverTrack) return;

        const playlistContainer = document.getElementById('playlist-container');
        const tracks = Array.from(playlistContainer.children);
        const draggedIndex = tracks.indexOf(this.draggedTrack);
        const dropIndex = tracks.indexOf(this.dragOverTrack);

        if (draggedIndex !== -1 && dropIndex !== -1) {
            // Réorganiser la playlist
            this.reorderPlaylist(draggedIndex, dropIndex);
        }
    }

    handleDragEnd(e) {
        if (this.draggedTrack) {
            this.draggedTrack.classList.remove('dragging');
        }
        
        document.querySelectorAll('.playlist-track').forEach(t => {
            t.classList.remove('drag-over');
        });

        this.draggedTrack = null;
        this.dragOverTrack = null;
    }

    reorderPlaylist(fromIndex, toIndex) {
        if (window.audioVisualizer && window.audioVisualizer.playlist) {
            const playlist = window.audioVisualizer.playlist;
            const [movedTrack] = playlist.splice(fromIndex, 1);
            playlist.splice(toIndex, 0, movedTrack);

            // Mettre à jour l'interface
            window.audioVisualizer.updatePlaylistUI();
            this.showStatusMessage('Playlist réorganisée');
        }
    }

    // ===== TOOLTIPS =====
    setupTooltips() {
        // Les tooltips sont gérés par CSS avec les attributs data-tooltip
        // Ajoutons des tooltips dynamiques pour les éléments qui n'en ont pas
        this.addDynamicTooltips();
    }

    addDynamicTooltips() {
        // Ajouter des tooltips pour les éléments qui n'en ont pas
        const elements = document.querySelectorAll('[data-tooltip]');
        elements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.getAttribute('data-tooltip'));
            });

            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        // Créer un tooltip personnalisé si nécessaire
        let tooltip = document.getElementById('custom-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'custom-tooltip';
            tooltip.style.cssText = `
                position: absolute;
                background: hsl(var(--surface-elevated));
                color: hsl(var(--text-primary));
                padding: var(--space-xs) var(--space-sm);
                border-radius: var(--radius-sm);
                font-size: var(--font-size-xs);
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity var(--transition-fast);
                z-index: 10000;
                box-shadow: var(--shadow-md);
            `;
            document.body.appendChild(tooltip);
        }

        tooltip.textContent = text;
        tooltip.style.opacity = '1';

        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    }

    hideTooltip() {
        const tooltip = document.getElementById('custom-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
        }
    }

    // ===== MESSAGES D'ÉTAT =====
    setupStatusMessages() {
        // Les messages d'état sont gérés par la méthode showStatusMessage
    }

    showStatusMessage(message, duration = 3000) {
        const statusElement = document.getElementById('status-message');
        if (!statusElement) return;

        statusElement.textContent = message;
        statusElement.classList.add('show');

        setTimeout(() => {
            statusElement.classList.remove('show');
        }, duration);
    }

    // ===== DOUBLE-CLICK =====
    setupDoubleClickHandlers() {
        const playlistContainer = document.getElementById('playlist-container');
        if (!playlistContainer) return;

        playlistContainer.addEventListener('dblclick', (e) => {
            const track = e.target.closest('.playlist-track');
            if (track) {
                this.playTrackFromPlaylist(track);
            }
        });
    }

    playTrackFromPlaylist(trackElement) {
        const tracks = Array.from(document.querySelectorAll('.playlist-track'));
        const index = tracks.indexOf(trackElement);
        
        if (index !== -1 && window.audioVisualizer) {
            window.audioVisualizer.loadTrack(index);
            window.audioVisualizer.play();
            this.showStatusMessage('Lecture de la piste sélectionnée');
        }
    }

    // ===== AMÉLIORATIONS DE L'INTERFACE =====
    updateLoadingState(isLoading) {
        const player = document.getElementById('audio-player');
        const trackInfo = document.getElementById('track-info');
        
        if (isLoading) {
            player.classList.add('loading');
            trackInfo.classList.add('loading');
            trackInfo.textContent = 'Chargement...';
        } else {
            player.classList.remove('loading');
            trackInfo.classList.remove('loading');
        }
    }

    updatePlayButtonState(isPlaying) {
        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.innerHTML = isPlaying ? '⏸' : '▶';
            playBtn.setAttribute('data-tooltip', isPlaying ? 'Pause (Espace)' : 'Lecture (Espace)');
        }
    }

    // ===== GESTIONNAIRE D'ÉVÉNEMENTS =====
    addEventListeners() {
        // Écouter les événements du visualiseur audio
        if (window.audioVisualizer) {
            window.audioVisualizer.addEventListener('play', () => {
                this.updatePlayButtonState(true);
                this.showStatusMessage('Lecture en cours');
            });

            window.audioVisualizer.addEventListener('pause', () => {
                this.updatePlayButtonState(false);
                this.showStatusMessage('Lecture en pause');
            });

            window.audioVisualizer.addEventListener('stop', () => {
                this.updatePlayButtonState(false);
                this.showStatusMessage('Lecture arrêtée');
            });
        }
    }
}

// Initialiser les améliorations UX
let audioPlayerUX;

document.addEventListener('DOMContentLoaded', () => {
    audioPlayerUX = new AudioPlayerUX();
    
    // Attendre que le visualiseur audio soit initialisé
    setTimeout(() => {
        audioPlayerUX.addEventListeners();
    }, 1000);
});

// Fonctions globales pour les événements HTML
function closeFullscreen() {
    if (audioPlayerUX) {
        audioPlayerUX.closeFullscreen();
    }
}

// Exposer les fonctions pour l'utilisation globale
window.AudioPlayerUX = AudioPlayerUX;
window.closeFullscreen = closeFullscreen;

