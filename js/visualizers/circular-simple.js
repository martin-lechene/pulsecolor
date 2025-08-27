// Visualiseur Circulaire Simple - Barres radiales avec dégradé bleu
class CircularSimpleVisualizer extends BaseVisualizer {
    constructor(audioVisualizer) {
        super(audioVisualizer);
        this.segments = 80;
        this.centerX = 0;
        this.centerY = 0;
        this.radius = 0;
        
        this.init();
    }

    init() {
        this.updateDimensions();
    }

    updateDimensions() {
        const { width, height } = this.getCanvasSize();
        this.centerX = width / 2;
        this.centerY = height / 2;
        this.radius = Math.min(width, height) * 0.25;
    }

    draw(ctx, frequencyData, timeData) {
        this.updateDimensions();
        
        // Effacer le canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner les barres radiales
        for (let i = 0; i < this.segments; i++) {
            const angle = (i / this.segments) * 2 * Math.PI;
            
            // Obtenir l'amplitude audio pour cette barre
            const dataIndex = Math.floor((i / this.segments) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const barLength = this.map(amplitude, 0, 255, 0, this.radius * 0.8);

            // Position de la barre
            const barX = this.centerX + Math.cos(angle) * this.radius;
            const barY = this.centerY + Math.sin(angle) * this.radius;

            if (barLength > 5) {
                ctx.save();
                ctx.translate(barX, barY);
                ctx.rotate(angle + Math.PI / 2);

                // Dégradé bleu
                const gradient = ctx.createLinearGradient(0, 0, 0, barLength);
                gradient.addColorStop(0, '#87CEEB'); // Bleu ciel clair
                gradient.addColorStop(1, '#000080'); // Bleu foncé

                // Barre principale
                const barWidth = (2 * Math.PI * this.radius) / this.segments * 0.8;
                ctx.fillStyle = gradient;
                ctx.fillRect(-barWidth / 2, 0, barWidth, barLength);

                ctx.restore();
            }
        }

        // Dessiner un anneau de base
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(135, 206, 235, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}
