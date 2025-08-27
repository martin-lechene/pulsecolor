// Visualiseur Forme d'Onde Douce - Lignes parallèles avec dégradé
class WaveformSmoothVisualizer extends BaseVisualizer {
    constructor(audioVisualizer) {
        super(audioVisualizer);
        this.time = 0;
        this.lineCount = 20;
        
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

        const centerY = height / 2;
        const waveHeight = height * 0.4;

        // Dessiner les lignes parallèles
        for (let i = 0; i < this.lineCount; i++) {
            const offset = (i - this.lineCount / 2) * 2;
            const opacity = 1 - (Math.abs(i - this.lineCount / 2) / (this.lineCount / 2)) * 0.8;
            
            this.drawSmoothLine(ctx, frequencyData, centerY + offset, waveHeight, opacity);
        }

        // Dessiner les formes de fond
        this.drawBackgroundShapes(ctx, frequencyData, centerY, waveHeight);
    }

    drawSmoothLine(ctx, frequencyData, centerY, waveHeight, opacity) {
        const { width } = this.getCanvasSize();
        
        ctx.beginPath();
        ctx.moveTo(0, centerY);

        // Créer la forme d'onde douce
        for (let x = 0; x < width; x += 2) {
            const dataIndex = Math.floor((x / width) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const normalizedAmplitude = amplitude / 255;
            
            // Créer une onde très douce et arrondie
            const wave1 = Math.sin(x * 0.005 + this.time) * waveHeight * 0.3 * normalizedAmplitude;
            const wave2 = Math.sin(x * 0.01 + this.time * 0.5) * waveHeight * 0.2 * normalizedAmplitude;
            const wave3 = Math.sin(x * 0.002 + this.time * 0.2) * waveHeight * 0.1 * normalizedAmplitude;
            
            const totalWave = wave1 + wave2 + wave3;
            const y = centerY + totalWave;

            ctx.lineTo(x, y);
        }

        // Dégradé de couleur
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, `rgba(255, 0, 255, ${opacity})`);
        gradient.addColorStop(1, `rgba(128, 0, 128, ${opacity})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    drawBackgroundShapes(ctx, frequencyData, centerY, waveHeight) {
        const { width } = this.getCanvasSize();
        
        // Forme de fond gauche
        ctx.beginPath();
        ctx.moveTo(0, centerY);

        for (let x = 0; x < width * 0.4; x += 2) {
            const dataIndex = Math.floor((x / width) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const normalizedAmplitude = amplitude / 255;
            
            const wave = Math.sin(x * 0.01 + this.time) * waveHeight * 0.2 * normalizedAmplitude;
            const y = centerY + wave;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(width * 0.4, centerY);
        ctx.closePath();

        ctx.fillStyle = 'rgba(128, 0, 128, 0.3)';
        ctx.fill();

        // Forme de fond droite
        ctx.beginPath();
        ctx.moveTo(width * 0.6, centerY);

        for (let x = width * 0.6; x < width; x += 2) {
            const dataIndex = Math.floor((x / width) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const normalizedAmplitude = amplitude / 255;
            
            const wave = Math.sin(x * 0.01 + this.time) * waveHeight * 0.2 * normalizedAmplitude;
            const y = centerY + wave;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(width, centerY);
        ctx.closePath();

        ctx.fillStyle = 'rgba(128, 0, 128, 0.3)';
        ctx.fill();
    }
}
