// Visualiseur Grille 3D Wireframe - Grille en perspective avec lignes verticales
class Grid3DVisualizer extends BaseVisualizer {
    constructor(audioVisualizer) {
        super(audioVisualizer);
        this.time = 0;
        this.gridSize = 20;
        this.perspective = 0.8;
        
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

        // Dessiner la grille de base
        this.drawGrid(ctx, width, height);

        // Dessiner les lignes verticales réactives
        this.drawVerticalLines(ctx, frequencyData, width, height);
    }

    drawGrid(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const gridSpacing = 40;

        ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
        ctx.lineWidth = 1;

        // Lignes horizontales de la grille
        for (let i = -this.gridSize; i <= this.gridSize; i++) {
            const y = centerY + i * gridSpacing;
            const startX = centerX - this.gridSize * gridSpacing;
            const endX = centerX + this.gridSize * gridSpacing;

            // Appliquer la perspective
            const perspectiveY = centerY + (y - centerY) * this.perspective;
            const perspectiveStartX = centerX + (startX - centerX) * this.perspective;
            const perspectiveEndX = centerX + (endX - centerX) * this.perspective;

            ctx.beginPath();
            ctx.moveTo(perspectiveStartX, perspectiveY);
            ctx.lineTo(perspectiveEndX, perspectiveY);
            ctx.stroke();
        }

        // Lignes verticales de la grille
        for (let i = -this.gridSize; i <= this.gridSize; i++) {
            const x = centerX + i * gridSpacing;
            const startY = centerY - this.gridSize * gridSpacing;
            const endY = centerY + this.gridSize * gridSpacing;

            // Appliquer la perspective
            const perspectiveX = centerX + (x - centerX) * this.perspective;
            const perspectiveStartY = centerY + (startY - centerY) * this.perspective;
            const perspectiveEndY = centerY + (endY - centerY) * this.perspective;

            ctx.beginPath();
            ctx.moveTo(perspectiveX, perspectiveStartY);
            ctx.lineTo(perspectiveX, perspectiveEndY);
            ctx.stroke();
        }
    }

    drawVerticalLines(ctx, frequencyData, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const gridSpacing = 40;
        const maxHeight = height * 0.4;

        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;

        // Dessiner les lignes verticales réactives
        for (let i = -this.gridSize; i <= this.gridSize; i++) {
            for (let j = -this.gridSize; j <= this.gridSize; j++) {
                const x = centerX + i * gridSpacing;
                const y = centerY + j * gridSpacing;

                // Appliquer la perspective
                const perspectiveX = centerX + (x - centerX) * this.perspective;
                const perspectiveY = centerY + (y - centerY) * this.perspective;

                // Obtenir l'amplitude audio
                const dataIndex = Math.floor(((i + this.gridSize) / (this.gridSize * 2)) * frequencyData.length);
                const amplitude = frequencyData[dataIndex] || 0;
                const lineHeight = this.map(amplitude, 0, 255, 0, maxHeight);

                if (lineHeight > 5) {
                    // Effet de lueur
                    ctx.shadowColor = '#00ffff';
                    ctx.shadowBlur = 10;

                    // Ligne verticale
                    ctx.beginPath();
                    ctx.moveTo(perspectiveX, perspectiveY);
                    ctx.lineTo(perspectiveX, perspectiveY - lineHeight);
                    ctx.stroke();

                    // Point lumineux au sommet
                    ctx.beginPath();
                    ctx.arc(perspectiveX, perspectiveY - lineHeight, 3, 0, 2 * Math.PI);
                    ctx.fillStyle = '#00ffff';
                    ctx.fill();
                }
            }
        }

        ctx.shadowBlur = 0;
    }
}
