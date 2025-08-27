// Visualiseur Multi-Couches - Superposition cyan/magenta avec effet de lueur
class MultiLayerVisualizer extends BaseVisualizer {
    constructor(audioVisualizer) {
        super(audioVisualizer);
        this.time = 0;
        this.waveform = [];
        
        this.init();
    }

    init() {
        // Initialisation
    }

    draw(ctx, frequencyData, timeData) {
        const { width, height } = this.getCanvasSize();
        this.time += 0.016;

        // Effacer le canvas
        ctx.fillStyle = '#0A0A1A';
        ctx.fillRect(0, 0, width, height);

        const centerY = height / 2;
        const waveHeight = height * 0.4;

        // Dessiner la ligne centrale de référence
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.strokeStyle = '#40E0D0';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Dessiner la forme d'onde cyan (couche supérieure)
        this.drawWaveformLayer(ctx, frequencyData, centerY, waveHeight, '#00FFFF', 0.8, 1);

        // Dessiner la forme d'onde magenta (couche inférieure)
        this.drawWaveformLayer(ctx, frequencyData, centerY, waveHeight, '#FF00FF', 0.8, -1);

        // Dessiner les zones de superposition (violet)
        this.drawSuperposition(ctx, frequencyData, centerY, waveHeight);
    }

    drawWaveformLayer(ctx, frequencyData, centerY, waveHeight, color, opacity, direction) {
        const { width } = this.getCanvasSize();
        
        ctx.beginPath();
        ctx.moveTo(0, centerY);

        // Créer la forme d'onde
        for (let x = 0; x < width; x += 2) {
            const dataIndex = Math.floor((x / width) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const normalizedAmplitude = amplitude / 255;
            
            // Créer une onde complexe
            const wave1 = Math.sin(x * 0.01 + this.time) * waveHeight * 0.3 * normalizedAmplitude;
            const wave2 = Math.sin(x * 0.02 + this.time * 1.5) * waveHeight * 0.2 * normalizedAmplitude;
            const wave3 = Math.sin(x * 0.005 + this.time * 0.5) * waveHeight * 0.1 * normalizedAmplitude;
            
            const totalWave = (wave1 + wave2 + wave3) * direction;
            const y = centerY + totalWave;

            ctx.lineTo(x, y);
        }

        // Effet de lueur
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = opacity;
        ctx.stroke();

        // Ligne principale
        ctx.shadowBlur = 8;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Ligne fine
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.globalAlpha = 1;
    }

    drawSuperposition(ctx, frequencyData, centerY, waveHeight) {
        const { width } = this.getCanvasSize();
        
        ctx.beginPath();
        ctx.moveTo(0, centerY);

        // Créer la zone de superposition
        for (let x = 0; x < width; x += 2) {
            const dataIndex = Math.floor((x / width) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const normalizedAmplitude = amplitude / 255;
            
            // Créer des ondes pour la superposition
            const wave1 = Math.sin(x * 0.01 + this.time) * waveHeight * 0.3 * normalizedAmplitude;
            const wave2 = Math.sin(x * 0.02 + this.time * 1.5) * waveHeight * 0.2 * normalizedAmplitude;
            const wave3 = Math.sin(x * 0.005 + this.time * 0.5) * waveHeight * 0.1 * normalizedAmplitude;
            
            const totalWave = wave1 + wave2 + wave3;
            const y = centerY + totalWave;

            ctx.lineTo(x, y);
        }

        // Zone de superposition avec effet violet
        ctx.shadowColor = '#8A2BE2';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#8A2BE2';
        ctx.lineWidth = 4;
        ctx.globalAlpha = 0.6;
        ctx.stroke();

        // Lueur blanche aux points d'amplitude maximale
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 25;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
}
