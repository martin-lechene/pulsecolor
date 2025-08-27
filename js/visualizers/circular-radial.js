// Visualiseur Circulaire Radial - Arc-en-ciel avec barres verticales
class CircularRadialVisualizer extends BaseVisualizer {
    constructor(audioVisualizer) {
        super(audioVisualizer);
        this.segments = 120; // Nombre de segments radiaux
        this.bars = []; // Barres verticales
        this.centerX = 0;
        this.centerY = 0;
        this.radius = 0;
        this.barWidth = 0;
        this.maxBarHeight = 0;
        
        this.init();
    }

    init() {
        this.updateDimensions();
    }

    updateDimensions() {
        const { width, height } = this.getCanvasSize();
        this.centerX = width / 2;
        this.centerY = height / 2;
        this.radius = Math.min(width, height) * 0.3;
        this.barWidth = (2 * Math.PI * this.radius) / this.segments * 0.8;
        this.maxBarHeight = this.radius * 0.8;
    }

    draw(ctx, frequencyData, timeData) {
        this.updateDimensions();
        
        // Effacer le canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner le cercle central
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#000000';
        ctx.fill();

        // Dessiner les lignes radiales et barres
        for (let i = 0; i < this.segments; i++) {
            const angle = (i / this.segments) * 2 * Math.PI;
            const hue = (i / this.segments) * 360; // Dégradé arc-en-ciel complet
            
            // Couleur de la ligne radiale
            const lineColor = this.getHueColor(hue, 100, 60);
            
            // Dessiner la ligne radiale
            ctx.beginPath();
            ctx.moveTo(this.centerX, this.centerY);
            ctx.lineTo(
                this.centerX + Math.cos(angle) * this.radius,
                this.centerY + Math.sin(angle) * this.radius
            );
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Calculer la hauteur de la barre basée sur les données audio
            const dataIndex = Math.floor((i / this.segments) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const barHeight = this.map(amplitude, 0, 255, 0, this.maxBarHeight);

            // Position de la barre
            const barX = this.centerX + Math.cos(angle) * this.radius;
            const barY = this.centerY + Math.sin(angle) * this.radius;

            // Dessiner la barre verticale
            if (barHeight > 5) {
                ctx.save();
                ctx.translate(barX, barY);
                ctx.rotate(angle + Math.PI / 2);

                // Effet de lueur
                ctx.shadowColor = lineColor;
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;

                // Barre principale
                ctx.fillStyle = lineColor;
                ctx.fillRect(-this.barWidth / 2, 0, this.barWidth, barHeight);

                // Effet de lueur supplémentaire
                ctx.shadowBlur = 20;
                ctx.fillStyle = this.getHueColor(hue, 100, 80);
                ctx.fillRect(-this.barWidth / 2, 0, this.barWidth, barHeight * 0.3);

                ctx.restore();
            }
        }

        // Dessiner un anneau de base
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}
