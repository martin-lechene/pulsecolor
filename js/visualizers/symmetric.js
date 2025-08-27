// Visualiseur Symétrique - Formes cyan/magenta miroir autour d'une ligne centrale
class SymmetricVisualizer extends BaseVisualizer {
    constructor(audioVisualizer) {
        super(audioVisualizer);
        this.time = 0;
        
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

        // Dessiner la ligne centrale blanche
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Dessiner la forme d'onde cyan (supérieure)
        this.drawSymmetricWaveform(ctx, frequencyData, centerY, waveHeight, '#00FFFF', -1);

        // Dessiner la forme d'onde magenta (inférieure)
        this.drawSymmetricWaveform(ctx, frequencyData, centerY, waveHeight, '#FF00FF', 1);
    }

    drawSymmetricWaveform(ctx, frequencyData, centerY, waveHeight, color, direction) {
        const { width } = this.getCanvasSize();
        
        ctx.beginPath();
        ctx.moveTo(0, centerY);

        // Créer la forme d'onde symétrique
        for (let x = 0; x < width; x += 2) {
            const dataIndex = Math.floor((x / width) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const normalizedAmplitude = amplitude / 255;
            
            // Créer une onde en forme de goutte/amande
            const progress = x / width;
            const waveShape = Math.sin(progress * Math.PI) * 2; // Forme en cloche
            const wave = Math.sin(x * 0.01 + this.time) * waveHeight * 0.2 * normalizedAmplitude;
            
            const totalWave = (waveShape + wave) * direction;
            const y = centerY + totalWave;

            ctx.lineTo(x, y);
        }

        // Fermer la forme pour créer un remplissage
        ctx.lineTo(width, centerY);
        ctx.closePath();

        // Effet de lueur
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;
        ctx.fill();

        // Contour
        ctx.shadowBlur = 8;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Ligne fine
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.globalAlpha = 1;
    }
}
