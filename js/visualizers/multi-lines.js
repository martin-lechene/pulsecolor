// Visualiseur Multi-Lignes - Plusieurs lignes colorées superposées
class MultiLinesVisualizer extends BaseVisualizer {
    constructor(audioVisualizer) {
        super(audioVisualizer);
        this.time = 0;
        this.lines = [
            { color: '#ff0000', offset: 0 },
            { color: '#ffff00', offset: 0.2 },
            { color: '#00ff00', offset: 0.4 },
            { color: '#00ffff', offset: 0.6 },
            { color: '#ff8000', offset: 0.8 }
        ];
        
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
        const waveHeight = height * 0.3;

        // Dessiner chaque ligne
        this.lines.forEach((line, index) => {
            this.drawLine(ctx, frequencyData, centerY, waveHeight, line, index);
        });
    }

    drawLine(ctx, frequencyData, centerY, waveHeight, line, lineIndex) {
        const { width } = this.getCanvasSize();
        
        ctx.beginPath();
        ctx.moveTo(0, centerY);

        // Créer la forme d'onde pour cette ligne
        for (let x = 0; x < width; x += 2) {
            const dataIndex = Math.floor((x / width) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const normalizedAmplitude = amplitude / 255;
            
            // Créer une onde avec décalage pour chaque ligne
            const wave1 = Math.sin(x * 0.01 + this.time + line.offset) * waveHeight * 0.2 * normalizedAmplitude;
            const wave2 = Math.sin(x * 0.02 + this.time * 1.5 + line.offset) * waveHeight * 0.15 * normalizedAmplitude;
            const wave3 = Math.sin(x * 0.005 + this.time * 0.5 + line.offset) * waveHeight * 0.1 * normalizedAmplitude;
            
            const totalWave = wave1 + wave2 + wave3;
            const y = centerY + totalWave;

            ctx.lineTo(x, y);
        }

        // Effet de lueur
        ctx.shadowColor = line.color;
        ctx.shadowBlur = 8;
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Ligne fine
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}
