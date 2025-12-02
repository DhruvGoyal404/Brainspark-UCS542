/**
 * Confetti Particle System using Canvas API
 */

export class ConfettiParticle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = -20;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: Math.random() * 3 + 2,
        };
        this.gravity = 0.1;
        this.size = Math.random() * 8 + 4;
        this.opacity = 1;
        this.colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.shape = Math.random() > 0.5 ? 'circle' : 'square';
    }

    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.rotation += this.rotationSpeed;

        // Fade out near bottom
        if (this.y > this.canvas.height * 0.8) {
            this.opacity -= 0.02;
        }

        return this.y < this.canvas.height && this.opacity > 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);

        ctx.fillStyle = this.color;

        if (this.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }

        ctx.restore();
    }
}

export class ConfettiSystem {
    constructor(canvasId, particleCount = 100) {
        this.canvas = document.getElementById(canvasId) || this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = particleCount;
        this.running = false;
        this.animationFrame = null;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);
        return canvas;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        if (this.running) return;

        this.running = true;
        this.particles = [];

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new ConfettiParticle(this.canvas));
        }

        this.animate();
    }

    animate() {
        if (!this.running) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles = this.particles.filter((particle) => {
            const isAlive = particle.update();
            if (isAlive) {
                particle.draw(this.ctx);
            }
            return isAlive;
        });

        if (this.particles.length === 0) {
            this.stop();
            return;
        }

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    stop() {
        this.running = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    destroy() {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

/**
 * Simple confetti trigger function
 */
export const triggerConfetti = (duration = 3000, particleCount = 100) => {
    const system = new ConfettiSystem('confetti-canvas', particleCount);
    system.start();

    setTimeout(() => {
        system.destroy();
    }, duration);

    return system;
};

export default {
    ConfettiParticle,
    ConfettiSystem,
    triggerConfetti,
};
