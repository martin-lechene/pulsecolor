// Collection de 12 Visualiseurs - Grille de mini-visualiseurs
class Collection12Visualizer extends BaseVisualizer {
    constructor(audioVisualizer) {
        super(audioVisualizer);
        this.time = 0;
        this.gridSize = 4; // 4x3 grille
        this.visualizers = [
            { type: 'waveform-sharp', color: 'orange-yellow' },
            { type: 'waveform-smooth', color: 'red-orange-yellow-green' },
            { type: 'bars-gradient', color: 'blue' },
            { type: 'bars-reflection', color: 'pink-violet' },
            { type: 'bars-rounded', color: 'green' },
            { type: 'waveform-smooth', color: 'pink-violet' },
            { type: 'waveform-sharp', color: 'green-yellow' },
            { type: 'line-wave', color: 'orange-pink' },
            { type: 'multi-lines', color: 'rainbow' },
            { type: 'bars-dotted', color: 'yellow-green' },
            { type: 'thin-lines', color: 'blue' },
            { type: 'thin-lines-dotted', color: 'orange-red' }
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

        const cellWidth = width / this.gridSize;
        const cellHeight = height / 3; // 3 lignes

        // Dessiner chaque mini-visualiseur
        this.visualizers.forEach((visualizer, index) => {
            const row = Math.floor(index / this.gridSize);
            const col = index % this.gridSize;
            const x = col * cellWidth;
            const y = row * cellHeight;

            ctx.save();
            ctx.translate(x, y);
            ctx.clipRect(0, 0, cellWidth, cellHeight);

            this.drawMiniVisualizer(ctx, visualizer, frequencyData, cellWidth, cellHeight);

            ctx.restore();
        });
    }

    drawMiniVisualizer(ctx, visualizer, frequencyData, width, height) {
        switch (visualizer.type) {
            case 'waveform-sharp':
                this.drawSharpWaveform(ctx, frequencyData, width, height, visualizer.color);
                break;
            case 'waveform-smooth':
                this.drawSmoothWaveform(ctx, frequencyData, width, height, visualizer.color);
                break;
            case 'bars-gradient':
                this.drawGradientBars(ctx, frequencyData, width, height, visualizer.color);
                break;
            case 'bars-reflection':
                this.drawReflectionBars(ctx, frequencyData, width, height, visualizer.color);
                break;
            case 'bars-rounded':
                this.drawRoundedBars(ctx, frequencyData, width, height, visualizer.color);
                break;
            case 'line-wave':
                this.drawLineWave(ctx, frequencyData, width, height, visualizer.color);
                break;
            case 'multi-lines':
                this.drawMultiLines(ctx, frequencyData, width, height, visualizer.color);
                break;
            case 'bars-dotted':
                this.drawDottedBars(ctx, frequencyData, width, height, visualizer.color);
                break;
            case 'thin-lines':
                this.drawThinLines(ctx, frequencyData, width, height, visualizer.color);
                break;
            case 'thin-lines-dotted':
                this.drawThinLinesDotted(ctx, frequencyData, width, height, visualizer.color);
                break;
        }
    }

    drawSharpWaveform(ctx, frequencyData, width, height, color) {
        const centerY = height / 2;
        const waveHeight = height * 0.3;

        ctx.beginPath();
        ctx.moveTo(0, centerY);

        for (let x = 0; x < width; x += 2) {
            const dataIndex = Math.floor((x / width) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const normalizedAmplitude = amplitude / 255;
            
            const wave = Math.sin(x * 0.05 + this.time) * waveHeight * normalizedAmplitude;
            const y = centerY + wave;
            ctx.lineTo(x, y);
        }

        ctx.strokeStyle = this.getColor(color, 0);
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    drawSmoothWaveform(ctx, frequencyData, width, height, color) {
        const centerY = height / 2;
        const waveHeight = height * 0.3;

        ctx.beginPath();
        ctx.moveTo(0, centerY);

        for (let x = 0; x < width; x += 2) {
            const dataIndex = Math.floor((x / width) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const normalizedAmplitude = amplitude / 255;
            
            const wave = Math.sin(x * 0.02 + this.time) * waveHeight * normalizedAmplitude;
            const y = centerY + wave;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(width, centerY);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, this.getColor(color, 0));
        gradient.addColorStop(1, this.getColor(color, 1));

        ctx.fillStyle = gradient;
        ctx.fill();
    }

    drawGradientBars(ctx, frequencyData, width, height, color) {
        const barCount = 20;
        const barWidth = width / barCount;

        for (let i = 0; i < barCount; i++) {
            const x = i * barWidth;
            const dataIndex = Math.floor((i / barCount) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const barHeight = (amplitude / 255) * height;

            if (barHeight > 2) {
                const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
                gradient.addColorStop(0, this.getColor(color, 0));
                gradient.addColorStop(1, this.getColor(color, 1));

                ctx.fillStyle = gradient;
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            }
        }
    }

    drawReflectionBars(ctx, frequencyData, width, height, color) {
        const barCount = 15;
        const barWidth = width / barCount;

        for (let i = 0; i < barCount; i++) {
            const x = i * barWidth;
            const dataIndex = Math.floor((i / barCount) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const barHeight = (amplitude / 255) * height * 0.4;

            if (barHeight > 2) {
                // Barre principale
                ctx.fillStyle = this.getColor(color, 0);
                ctx.fillRect(x, height / 2 - barHeight, barWidth, barHeight);

                // Réflexion
                ctx.fillStyle = `rgba(255, 0, 255, 0.3)`;
                ctx.fillRect(x, height / 2, barWidth, barHeight);
            }
        }
    }

    drawRoundedBars(ctx, frequencyData, width, height, color) {
        const barCount = 12;
        const barWidth = width / barCount;

        for (let i = 0; i < barCount; i++) {
            const x = i * barWidth;
            const dataIndex = Math.floor((i / barCount) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const barHeight = (amplitude / 255) * height * 0.6;

            if (barHeight > 2) {
                ctx.fillStyle = this.getColor(color, 0);
                ctx.beginPath();
                ctx.roundRect(x, height - barHeight, barWidth, barHeight, 5);
                ctx.fill();
            }
        }
    }

    drawLineWave(ctx, frequencyData, width, height, color) {
        const centerY = height / 2;
        const waveHeight = height * 0.2;

        ctx.beginPath();
        ctx.moveTo(0, centerY);

        for (let x = 0; x < width; x += 2) {
            const dataIndex = Math.floor((x / width) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const normalizedAmplitude = amplitude / 255;
            
            const wave = Math.sin(x * 0.03 + this.time) * waveHeight * normalizedAmplitude;
            const y = centerY + wave;
            ctx.lineTo(x, y);
        }

        ctx.strokeStyle = this.getColor(color, 0);
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    drawMultiLines(ctx, frequencyData, width, height, color) {
        const colors = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#ff8000'];
        
        colors.forEach((lineColor, index) => {
            const centerY = height / 2 + (index - 2) * 10;
            const waveHeight = height * 0.1;

            ctx.beginPath();
            ctx.moveTo(0, centerY);

            for (let x = 0; x < width; x += 3) {
                const dataIndex = Math.floor((x / width) * frequencyData.length);
                const amplitude = frequencyData[dataIndex] || 0;
                const normalizedAmplitude = amplitude / 255;
                
                const wave = Math.sin(x * 0.04 + this.time + index) * waveHeight * normalizedAmplitude;
                const y = centerY + wave;
                ctx.lineTo(x, y);
            }

            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    }

    drawDottedBars(ctx, frequencyData, width, height, color) {
        const barCount = 18;
        const barWidth = width / barCount;

        for (let i = 0; i < barCount; i++) {
            const x = i * barWidth;
            const dataIndex = Math.floor((i / barCount) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const barHeight = (amplitude / 255) * height * 0.5;

            if (barHeight > 2) {
                ctx.fillStyle = this.getColor(color, 0);
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            }
        }

        // Ligne pointillée de base
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(0, height * 0.8);
        ctx.lineTo(width, height * 0.8);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    drawThinLines(ctx, frequencyData, width, height, color) {
        const lineCount = 25;
        const lineSpacing = width / lineCount;

        for (let i = 0; i < lineCount; i++) {
            const x = i * lineSpacing;
            const dataIndex = Math.floor((i / lineCount) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const lineHeight = (amplitude / 255) * height * 0.6;

            if (lineHeight > 2) {
                const gradient = ctx.createLinearGradient(0, height, 0, height - lineHeight);
                gradient.addColorStop(0, this.getColor(color, 0));
                gradient.addColorStop(1, this.getColor(color, 1));

                ctx.fillStyle = gradient;
                ctx.fillRect(x, height - lineHeight, 2, lineHeight);
            }
        }
    }

    drawThinLinesDotted(ctx, frequencyData, width, height, color) {
        const lineCount = 20;
        const lineSpacing = width / lineCount;

        for (let i = 0; i < lineCount; i++) {
            const x = i * lineSpacing;
            const dataIndex = Math.floor((i / lineCount) * frequencyData.length);
            const amplitude = frequencyData[dataIndex] || 0;
            const lineHeight = (amplitude / 255) * height * 0.5;

            if (lineHeight > 2) {
                const gradient = ctx.createLinearGradient(0, height, 0, height - lineHeight);
                gradient.addColorStop(0, this.getColor(color, 0));
                gradient.addColorStop(1, this.getColor(color, 1));

                ctx.fillStyle = gradient;
                ctx.fillRect(x, height - lineHeight, 2, lineHeight);
            }
        }

        // Ligne pointillée de base
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(0, height * 0.8);
        ctx.lineTo(width, height * 0.8);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    getColor(colorType, position) {
        const colors = {
            'orange-yellow': ['#ff8000', '#ffff00'],
            'red-orange-yellow-green': ['#ff0000', '#00ff00'],
            'blue': ['#87ceeb', '#000080'],
            'pink-violet': ['#ff1493', '#4b0082'],
            'green': ['#00ff00', '#00ff00'],
            'orange-pink': ['#ff8000', '#ff1493'],
            'rainbow': ['#ff0000', '#00ffff'],
            'yellow-green': ['#ffff00', '#00ff00'],
            'orange-red': ['#ff8000', '#ff0000']
        };

        const colorPair = colors[colorType] || ['#ffffff', '#ffffff'];
        return colorPair[Math.floor(position * (colorPair.length - 1))];
    }
}
