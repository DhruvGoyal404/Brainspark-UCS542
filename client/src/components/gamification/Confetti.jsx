import { useEffect, useRef } from 'react';
import './Confetti.css';

const Confetti = ({
    active = true,
    duration = 3000,
    particleCount = 100
}) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!active || !containerRef.current) return;

        const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
        const particles = [];

        const createConfetti = () => {
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'confetti-particle';

                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                const randomX = Math.random() * 100;
                const randomDelay = Math.random() * 0.5;
                const randomDuration = 2 + Math.random() * 2;
                const randomRotation = Math.random() * 360;

                particle.style.left = `${randomX}%`;
                particle.style.background = randomColor;
                particle.style.animationDelay = `${randomDelay}s`;
                particle.style.animationDuration = `${randomDuration}s`;
                particle.style.transform = `rotate(${randomRotation}deg)`;

                containerRef.current.appendChild(particle);
                particles.push(particle);
            }
        };

        createConfetti();

        const timeout = setTimeout(() => {
            particles.forEach(particle => particle.remove());
        }, duration);

        return () => {
            clearTimeout(timeout);
            particles.forEach(particle => particle.remove());
        };
    }, [active, duration, particleCount]);

    if (!active) return null;

    return <div ref={containerRef} className="confetti-container" />;
};

export default Confetti;
