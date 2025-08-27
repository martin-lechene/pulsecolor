// Visualiseur Linéaire avec Grille - Forme d'onde blanche sur grille bleue en perspective
class LinearGridVisualizer extends BaseVisualizer {
    constructor(audioVisualizer) {
        super(audioVisualizer);
        this.time = 0;
        this.gridLines = 20;
        
        this.init();
    }

    init() {
        // Initialisation
    }

    draw(ctx, frequencyData, timeData) {
        const { width, height } = this.getCanvasSize();
        this.time += 0.016;

        // Effacer le canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Dessiner la grille en perspective
        this.drawPerspectiveGrid(ctx, width, height);

        // Dessiner la forme d'onde blanche
        this.drawWaveform(ctx, frequencyData, width, height);
    }

    drawPerspectiveGrid(ctx, width, height) {
        const horizonY = height * 0.3; // Point de fuite
        const gridSpacing = 60;

        ctx.strokeStyle = 'rgba(0, 100, 255, 0.4)';
        ctx.lineWidth = 1;

        // Lignes verticales convergentes
        for (let i = 0; i <= this.gridLines; i++) {
            const x = (i / this.gridLines) * width;
            const startY = height;
            const endY = horizonY;

            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, endY);
            ctx.stroke();
        }

        // Lignes horizontales convergentes
        for (let i = 0; i <= 10; i++) {
            const y = height - (i * gridSpacing);
            const startX = 0;
            const endX = width;

            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
            ctx.stroke();
        }
    }

    drawWaveform(ctx, frequencyData, width, height) {
        const baseY = height * 0.8; // Position de base de la forme d'onde
        const maxHeight = height * 0.4;

        ctx.beginPath();
        ctx.moveTo(0, baseY);

        // Créer la forme d'onde basée sur les données audio
        for (let x = 0; x < width; x += 2) {
            const dataIndex = Math.floor((x / width) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const normalizedAmplitude = amplitude / 255;
            
            // Créer une forme d'onde avec pic dominant à gauche
            let waveHeight;
            if (x < width * 0.2) {
                // Pic dominant à gauche (basses fréquences)
                waveHeight = normalizedAmplitude * maxHeight * 2;
            } else if (x < width * 0.6) {
                // Section médiane plus calme
                waveHeight = normalizedAmplitude * maxHeight * 0.3;
            } else {
                // Section droite avec pics moyens
                waveHeight = normalizedAmplitude * maxHeight * 0.8;
            }

            const y = baseY - waveHeight;
            ctx.lineTo(x, y);
        }

        // Effet de lueur
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Ligne principale
        ctx.shadowBlur = 5;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Ligne fine
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}
