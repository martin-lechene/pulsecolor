// Analyseur de Spectre Technique - Barres jaunes/vertes avec échelle logarithmique
class SpectrumAnalyzerVisualizer extends BaseVisualizer {
    constructor(audioVisualizer) {
        super(audioVisualizer);
        this.barCount = 64;
        this.frequencies = [31, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
        
        this.init();
    }

    init() {
        // Initialisation
    }

    draw(ctx, frequencyData, timeData) {
        const { width, height } = this.getCanvasSize();

        // Effacer le canvas avec fond bleu foncé
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, width, height);

        // Dessiner la grille de fond
        this.drawGrid(ctx, width, height);

        // Dessiner les barres de spectre
        this.drawSpectrumBars(ctx, frequencyData, width, height);

        // Dessiner les labels de fréquence
        this.drawFrequencyLabels(ctx, width, height);
    }

    drawGrid(ctx, width, height) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        // Lignes horizontales (dB)
        const dbLevels = [0, -10, -20, -30, -40, -50, -60, -70, -80, -90, -100];
        dbLevels.forEach((db, i) => {
            const y = (i / (dbLevels.length - 1)) * height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        });

        // Lignes verticales (fréquences)
        this.frequencies.forEach((freq, i) => {
            const x = (i / (this.frequencies.length - 1)) * width;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        });
    }

    drawSpectrumBars(ctx, frequencyData, width, height) {
        const barWidth = width / this.barCount;

        for (let i = 0; i < this.barCount; i++) {
            const x = i * barWidth;
            const dataIndex = Math.floor((i / this.barCount) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            
            // Convertir l'amplitude en dB (0-255 -> 0 à -100 dB)
            const db = this.map(amplitude, 0, 255, 0, -100);
            const barHeight = this.map(db, -100, 0, 0, height);

            if (barHeight > 2) {
                // Barre verte (bruit de fond)
                ctx.fillStyle = '#00ff00';
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);

                // Barre jaune (signal actif au-dessus de -60 dB)
                if (db > -60) {
                    const yellowHeight = this.map(db, -60, 0, 0, height);
                    ctx.fillStyle = '#ffff00';
                    ctx.fillRect(x, height - yellowHeight, barWidth, yellowHeight);
                }

                // Ligne blanche de référence (729 Hz)
                if (i === Math.floor(this.barCount * 0.4)) { // Approximation de 729 Hz
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, height);
                    ctx.stroke();
                }
            }
        }
    }

    drawFrequencyLabels(ctx, width, height) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';

        this.frequencies.forEach((freq, i) => {
            const x = (i / (this.frequencies.length - 1)) * width;
            const y = height - 5;
            ctx.fillText(freq.toString(), x, y);
        });

        // Labels dB
        ctx.textAlign = 'right';
        const dbLevels = [0, -20, -40, -60, -80, -100];
        dbLevels.forEach((db, i) => {
            const y = (i / (dbLevels.length - 1)) * height;
            ctx.fillText(db.toString(), 30, y + 4);
        });
    }
}
