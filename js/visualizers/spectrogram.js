// Visualiseur Spectrogramme Temporel - Défilement horizontal avec couleurs d'intensité
class SpectrogramVisualizer extends BaseVisualizer {
    constructor(audioVisualizer) {
        super(audioVisualizer);
        this.spectrogramData = [];
        this.maxHistory = 200;
        this.time = 0;
        
        this.init();
    }

    init() {
        // Initialiser le tableau de données du spectrogramme
        for (let i = 0; i < this.maxHistory; i++) {
            this.spectrogramData[i] = new Array(64).fill(0);
        }
    }

    draw(ctx, frequencyData, timeData) {
        const { width, height } = this.getCanvasSize();
        this.time += 0.016;

        // Effacer le canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Mettre à jour les données du spectrogramme
        this.updateSpectrogramData(frequencyData);

        // Dessiner le spectrogramme
        this.drawSpectrogram(ctx, width, height);

        // Dessiner les labels
        this.drawLabels(ctx, width, height);
    }

    updateSpectrogramData(frequencyData) {
        // Décaler les données vers la gauche
        this.spectrogramData.shift();
        
        // Ajouter les nouvelles données à droite
        const newData = [];
        for (let i = 0; i < 64; i++) {
            const dataIndex = Math.floor((i / 64) * frequencyData.length);
            newData.push(frequencyData[dataIndex] || 0);
        }
        this.spectrogramData.push(newData);
    }

    drawSpectrogram(ctx, width, height) {
        const cellWidth = width / this.spectrogramData[0].length;
        const cellHeight = height / this.spectrogramData.length;

        for (let x = 0; x < this.spectrogramData[0].length; x++) {
            for (let y = 0; y < this.spectrogramData.length; y++) {
                const amplitude = this.spectrogramData[y][x];
                const normalizedAmplitude = amplitude / 255;

                // Déterminer la couleur basée sur l'amplitude
                let color;
                if (normalizedAmplitude > 0.8) {
                    color = '#ffff00'; // Jaune (intensité élevée)
                } else if (normalizedAmplitude > 0.6) {
                    color = '#ff0000'; // Rouge
                } else if (normalizedAmplitude > 0.4) {
                    color = '#ff00ff'; // Magenta
                } else if (normalizedAmplitude > 0.2) {
                    color = '#800080'; // Violet
                } else {
                    color = '#000000'; // Noir (silence)
                }

                // Dessiner la cellule
                ctx.fillStyle = color;
                ctx.fillRect(
                    x * cellWidth,
                    y * cellHeight,
                    cellWidth,
                    cellHeight
                );
            }
        }
    }

    drawLabels(ctx, width, height) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';

        // Labels de fréquence (axe Y)
        const frequencies = [0, 2, 4, 6, 8, 10];
        frequencies.forEach((freq, i) => {
            const y = (i / (frequencies.length - 1)) * height;
            ctx.fillText(`${freq}k`, 30, y + 4);
        });

        // Labels de temps (axe X)
        ctx.textAlign = 'center';
        const times = [0, 10, 20, 30, 40, 50];
        times.forEach((time, i) => {
            const x = (i / (times.length - 1)) * width;
            ctx.fillText(`${time}s`, x, height - 5);
        });
    }
}
