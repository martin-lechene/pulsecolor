// Visualiseur à Barres Classiques - Barres verticales blanches
class ClassicBarsVisualizer extends BaseVisualizer {
    constructor(audioVisualizer) {
        super(audioVisualizer);
        this.barCount = 80; // Nombre de barres
        this.barWidth = 0;
        this.barSpacing = 0;
        this.maxBarHeight = 0;
        
        this.init();
    }

    init() {
        this.updateDimensions();
    }

    updateDimensions() {
        const { width, height } = this.getCanvasSize();
        this.barWidth = width / this.barCount * 0.8;
        this.barSpacing = width / this.barCount * 0.2;
        this.maxBarHeight = height * 0.8;
    }

    draw(ctx, frequencyData, timeData) {
        this.updateDimensions();
        
        // Effacer le canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const { width, height } = this.getCanvasSize();
        const centerY = height / 2;

        // Dessiner les barres
        for (let i = 0; i < this.barCount; i++) {
            // Calculer la position X
            const x = i * (this.barWidth + this.barSpacing) + this.barSpacing / 2;
            
            // Obtenir l'amplitude audio pour cette barre
            const dataIndex = Math.floor((i / this.barCount) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            
            // Calculer la hauteur de la barre
            const barHeight = this.map(amplitude, 0, 255, 0, this.maxBarHeight);
            
            if (barHeight > 2) {
                // Effet de lueur
                ctx.shadowColor = '#ffffff';
                ctx.shadowBlur = 5;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;

                // Barre principale
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x, centerY - barHeight / 2, this.barWidth, barHeight);

                // Effet de lueur supplémentaire
                ctx.shadowBlur = 10;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fillRect(x, centerY - barHeight / 2, this.barWidth, barHeight * 0.3);
            }
        }

        // Réinitialiser les ombres
        ctx.shadowBlur = 0;
    }
}
