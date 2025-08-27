// Visualiseur Néon Futuriste - Forme d'onde cyan électrique avec particules
class NeonFuturisticVisualizer extends BaseVisualizer {
    constructor(audioVisualizer) {
        super(audioVisualizer);
        this.particles = [];
        this.waveform = [];
        this.maxParticles = 100;
        this.time = 0;
        
        this.init();
    }

    init() {
        this.createParticles();
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    draw(ctx, frequencyData, timeData) {
        const { width, height } = this.getCanvasSize();
        this.time += 0.016; // ~60fps

        // Effacer le canvas avec un fond dégradé
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#0A141A');
        gradient.addColorStop(1, '#000000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Mettre à jour et dessiner les particules
        this.updateParticles(ctx, frequencyData);

        // Dessiner la forme d'onde principale
        this.drawWaveform(ctx, frequencyData, timeData);

        // Dessiner les reflets
        this.drawReflections(ctx, frequencyData);
    }

    updateParticles(ctx, frequencyData) {
        const { width, height } = this.getCanvasSize();
        const avgAmplitude = frequencyData.reduce((sum, val) => sum + val, 0) / frequencyData.length;

        this.particles.forEach((particle, index) => {
            // Mettre à jour la position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Rebondir sur les bords
            if (particle.x < 0 || particle.x > width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > height) particle.vy *= -1;

            // Réagir à l'audio
            const audioInfluence = avgAmplitude / 255;
            particle.size = Math.random() * 3 + 1 + audioInfluence * 2;
            particle.opacity = Math.random() * 0.5 + 0.2 + audioInfluence * 0.3;

            // Dessiner la particule
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity})`;
            ctx.fill();

            // Effet de lueur
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = particle.size * 2;
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    }

    drawWaveform(ctx, frequencyData, timeData) {
        const { width, height } = this.getCanvasSize();
        const centerY = height * 0.4;
        const waveHeight = height * 0.3;

        ctx.beginPath();
        ctx.moveTo(0, centerY);

        // Créer la forme d'onde basée sur les données audio
        for (let x = 0; x < width; x += 2) {
            const dataIndex = Math.floor((x / width) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const normalizedAmplitude = amplitude / 255;
            
            // Créer une onde sinusoïdale modulée par l'audio
            const wave = Math.sin(x * 0.02 + this.time * 2) * waveHeight * 0.3;
            const audioWave = Math.sin(x * 0.01 + this.time) * waveHeight * 0.2 * normalizedAmplitude;
            const y = centerY + wave + audioWave;

            ctx.lineTo(x, y);
        }

        // Effet de lueur intense
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Ligne principale
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Ligne fine
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    drawReflections(ctx, frequencyData) {
        const { width, height } = this.getCanvasSize();
        const reflectionY = height * 0.7;

        // Créer un effet de miroir/reflet
        ctx.save();
        ctx.globalAlpha = 0.3;
        
        // Dessiner des ondulations de reflet
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(0, reflectionY + i * 10);

            for (let x = 0; x < width; x += 5) {
                const dataIndex = Math.floor((x / width) * frequencyData.length);
                const amplitude = frequencyData[dataIndex] || 0;
                const normalizedAmplitude = amplitude / 255;
                
                const wave = Math.sin(x * 0.01 + this.time + i) * 20 * normalizedAmplitude;
                const y = reflectionY + i * 10 + wave;

                ctx.lineTo(x, y);
            }

            ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 - i * 0.1})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        ctx.restore();
    }
}
