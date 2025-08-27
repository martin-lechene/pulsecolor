// Visualiseur Arc avec Particules - Arc de cercle avec barres bleues et particules
class ArcParticlesVisualizer extends BaseVisualizer {
    constructor(audioVisualizer) {
        super(audioVisualizer);
        this.particles = [];
        this.maxParticles = 150;
        this.segments = 60;
        this.centerX = 0;
        this.centerY = 0;
        this.radius = 0;
        
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
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.6 + 0.2,
                life: Math.random() * 100 + 50
            });
        }
    }

    draw(ctx, frequencyData, timeData) {
        const { width, height } = this.getCanvasSize();
        
        // Effacer le canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        this.centerX = width * 0.4; // Décalé vers la gauche
        this.centerY = height / 2;
        this.radius = Math.min(width, height) * 0.3;

        // Mettre à jour et dessiner les particules
        this.updateParticles(ctx, frequencyData);

        // Dessiner l'arc de barres
        this.drawArcBars(ctx, frequencyData);
    }

    updateParticles(ctx, frequencyData) {
        const { width, height } = this.getCanvasSize();
        const avgAmplitude = frequencyData.reduce((sum, val) => sum + val, 0) / frequencyData.length;

        this.particles.forEach((particle, index) => {
            // Mettre à jour la position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;

            // Rebondir sur les bords
            if (particle.x < 0 || particle.x > width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > height) particle.vy *= -1;

            // Réagir à l'audio
            const audioInfluence = avgAmplitude / 255;
            particle.size = Math.random() * 2 + 0.5 + audioInfluence * 1.5;
            particle.opacity = Math.random() * 0.6 + 0.2 + audioInfluence * 0.4;

            // Régénérer les particules mortes
            if (particle.life <= 0) {
                particle.x = Math.random() * width;
                particle.y = Math.random() * height;
                particle.life = Math.random() * 100 + 50;
            }

            // Dessiner la particule
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity})`;
            ctx.fill();

            // Effet de lueur
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = particle.size * 3;
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    }

    drawArcBars(ctx, frequencyData) {
        const startAngle = Math.PI * 0.25; // 45 degrés
        const endAngle = Math.PI * 1.75;   // 315 degrés
        const angleStep = (endAngle - startAngle) / this.segments;

        for (let i = 0; i < this.segments; i++) {
            const angle = startAngle + i * angleStep;
            
            // Obtenir l'amplitude audio pour cette barre
            const dataIndex = Math.floor((i / this.segments) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const barHeight = this.map(amplitude, 0, 255, 0, this.radius * 0.6);

            // Position de la barre
            const barX = this.centerX + Math.cos(angle) * this.radius;
            const barY = this.centerY + Math.sin(angle) * this.radius;

            if (barHeight > 5) {
                ctx.save();
                ctx.translate(barX, barY);
                ctx.rotate(angle + Math.PI / 2);

                // Effet de lueur intense
                ctx.shadowColor = '#00ffff';
                ctx.shadowBlur = 15;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;

                // Barre principale
                const barWidth = (2 * Math.PI * this.radius) / this.segments * 0.7;
                ctx.fillStyle = '#00ffff';
                ctx.fillRect(-barWidth / 2, 0, barWidth, barHeight);

                // Effet de lueur supplémentaire
                ctx.shadowBlur = 25;
                ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
                ctx.fillRect(-barWidth / 2, 0, barWidth, barHeight * 0.3);

                ctx.restore();
            }
        }

        // Dessiner un arc de base
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}
