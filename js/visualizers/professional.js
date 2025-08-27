// Visualiseur Audio Professionnel - Formes verticales ondulantes avec dégradé
class ProfessionalVisualizer extends BaseVisualizer {
    constructor(audioVisualizer) {
        super(audioVisualizer);
        this.time = 0;
        this.barCount = 100;
        this.frequencies = [650, 1300, 1950, 2600, 3250, 3900, 4550, 5200, 6441, 11308];
        
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

        // Dessiner les formes verticales ondulantes
        this.drawVerticalShapes(ctx, frequencyData, width, height);

        // Dessiner la ligne inférieure
        this.drawBottomLine(ctx, frequencyData, width, height);

        // Dessiner les labels de fréquence
        this.drawFrequencyLabels(ctx, width, height);
    }

    drawVerticalShapes(ctx, frequencyData, width, height) {
        const barWidth = width / this.barCount;
        const maxHeight = height * 0.6;

        for (let i = 0; i < this.barCount; i++) {
            const x = i * barWidth;
            const dataIndex = Math.floor((i / this.barCount) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const normalizedAmplitude = amplitude / 255;

            // Créer une forme ondulante
            const baseHeight = normalizedAmplitude * maxHeight;
            const waveHeight = Math.sin(i * 0.1 + this.time) * 20 * normalizedAmplitude;
            const totalHeight = baseHeight + waveHeight;

            if (totalHeight > 5) {
                // Dégradé de couleur horizontal
                const hue = (i / this.barCount) * 360;
                const color = this.getHueColor(hue, 100, 60);

                // Effet de lueur
                ctx.shadowColor = color;
                ctx.shadowBlur = 10;

                // Forme principale
                ctx.fillStyle = color;
                ctx.fillRect(x, height - totalHeight, barWidth, totalHeight);

                // Couche supérieure plus claire
                ctx.shadowBlur = 20;
                ctx.fillStyle = this.getHueColor(hue, 100, 80);
                ctx.fillRect(x, height - totalHeight, barWidth, totalHeight * 0.3);
            }
        }

        ctx.shadowBlur = 0;
    }

    drawBottomLine(ctx, frequencyData, width, height) {
        const centerY = height * 0.8;

        ctx.beginPath();
        ctx.moveTo(0, centerY);

        // Créer une ligne ondulante basée sur l'audio
        for (let x = 0; x < width; x += 2) {
            const dataIndex = Math.floor((x / width) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const normalizedAmplitude = amplitude / 255;
            
            const wave = Math.sin(x * 0.01 + this.time) * 10 * normalizedAmplitude;
            const y = centerY + wave;

            ctx.lineTo(x, y);
        }

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    drawFrequencyLabels(ctx, width, height) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';

        this.frequencies.forEach((freq, i) => {
            const x = (i / (this.frequencies.length - 1)) * width;
            const y = height - 5;
            ctx.fillText(freq.toString(), x, y);
        });
    }
}
