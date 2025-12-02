import { useCallback, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Custom hook for playing sound effects using Web Audio API
 */
const useSound = (soundName) => {
    const { soundEnabled } = useTheme();
    const audioContextRef = useRef(null);
    const audioBufferRef = useRef(null);
    const soundUrlsRef = useRef({
        correct: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
        incorrect: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
        achievement: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
        click: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
        notification: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
    });

    // Initialize Audio Context
    useEffect(() => {
        if (typeof window !== 'undefined' && !audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }

        return () => {
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);

    // Play sound using HTML5 Audio (fallback approach for simplicity)
    const play = useCallback((volume = 0.5) => {
        if (!soundEnabled) return;

        try {
            // Create oscillator for different sound types
            const audioContext = audioContextRef.current;
            if (!audioContext) return;

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Configure based on sound type
            switch (soundName) {
                case 'correct':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.2);
                    break;

                case 'incorrect':
                    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.15);
                    oscillator.type = 'sawtooth';
                    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.15);
                    break;

                case 'achievement':
                    // Triumphant sound - multiple frequencies
                    [600, 800, 1000].forEach((freq, index) => {
                        const osc = audioContext.createOscillator();
                        const gain = audioContext.createGain();
                        osc.connect(gain);
                        gain.connect(audioContext.destination);
                        osc.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1);
                        gain.gain.setValueAtTime(volume * 0.3, audioContext.currentTime + index * 0.1);
                        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.3);
                        osc.start(audioContext.currentTime + index * 0.1);
                        osc.stop(audioContext.currentTime + index * 0.1 + 0.3);
                    });
                    return; // Early return as we handled it differently

                case 'click':
                    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
                    oscillator.type = 'sine';
                    gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.05);
                    break;

                case 'notification':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.05);
                    gainNode.gain.setValueAtTime(volume * 0.4, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.1);
                    break;

                default:
                    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.1);
            }
        } catch (error) {
            console.warn('Error playing sound:', error);
        }
    }, [soundEnabled, soundName]);

    return { play, isEnabled: soundEnabled };
};

export default useSound;
