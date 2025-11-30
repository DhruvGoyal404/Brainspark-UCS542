import { Howl } from 'howler';

// Sound effects using Web Audio API (no external files needed)
// Using data URIs for simple beep sounds

class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = localStorage.getItem('soundEnabled') !== 'false';
        this.initSounds();
    }

    initSounds() {
        // Success sound (higher pitch beep)
        this.sounds.correct = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N+QQAoUXrTp66hVFApGn+DyvW0gBjiS2PTNfTIGH2+26+ehUBELTqTj8LdkHQU7k9r0yoMuBSN1x/HhnT4MGlqy6+qnUxQKRp/h78FuHgY2jdT0znwxBSNyt/Llt3cmBzWH0vPUgjMHHnKt5O+TRw0PVa3o8bJjGgU7k9r0zHowBSF0xe7fpkwSEVGr5O+zYhoFPJPa9c1+MQUhcsXw36FIDBZW'],
            volume: 0.3
        });

        // Error sound (lower pitch buzz)
        this.sounds.incorrect = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAhYiFbF1gdZiurpFhNTRfn9HbqmEcBj+Z2vLEcSQGLIHO8tiJNggZaLns6J5MEQxQqOPxtmMcBjiR1/LMeS0GI3fI8d+PQAkVXrXo7KlUFApGn+DyvW4gBjiS2PTNfjEGIHC26+ehUBEMTqPj8LhlHQU7k9r0yoIuBSNzt/Lkt3cmBzWG0fTVgjIGIHGu5e+SRg0PVa3o8bJjGgU7k9r0zHowBSF0xe7fpUsREVGs5O+zYxoFO5Pa9c1+MAUhcsXv4aFJDBdY'],
            volume: 0.3
        });

        // Achievement sound (triumphant beep)
        this.sounds.achievement = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAhYiFbF5gdZiurpBiNTRfn9HbqmEcBkCa2vLEcSQGLIHO8tiKNAgZaLns6J9NEAxRqOPxtWQdBTiR2PLLey0FJHjI79+PQAoTX7Xo7KlVEwpGn+Hxvm0gBjiS2PTNfTIGH3C26+ehUREMTqPi8bZlHQU8ktv1yoMtBCR0x/HgmkALGF6z6eyoVBIJRqDg8r9tHwY5k9nzzoAxBSJyvPLkt3YnBzaH0fTVgjIGIG+u5O+TRg0OVK3o8bJjGgU7k9r0zHoxBSByxe/fpUsREVKr5O+zYxoFO5Pa9c1+MAUhcsXv4aFJCxdW'],
            volume: 0.4
        });

        // Click sound (subtle tap)
        this.sounds.click = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAhYmEbV9fdZiurI9hNjZgodDbq2EcBj+a2/LDciUGK4HO8tmJNwgZaLvs559NEAxQp+PwtmMcBjiR1/LMeSsFJHfH8eGQPwsVXrPp7KlTEwtGnuHzwG4dBjiS2PPOnTIGHnC16+miTxIMT6Xk8LhlHQU6lNr0yoIuBSNzxvHhnkALF1u16+unVBQLRqDh8sJ0IgY4j9T0zYEuBSJyvPLguXkmBzaIz/LThjEGInCr5fGTSAwPVK3n8LJkGgU7k9n0zHowBSFzxvDfpk0SElKr4+6zYxoFO5Pa9cx+MAUhc8Xw4KRLDBdV'],
            volume: 0.2
        });

        // Notification sound
        this.sounds.notification = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAhYqFbF5gdJiurJBhNTVgodDbq2IcBT+a2vPDcyQGK4HO8tmJOAgYaLvs6J5NEQxPpuLxtWQcBTiR1/LMeSsFJHfH8eCPQAsTX7Tp66lVEwpHn+HyvW4fBjiS2PTNfTIGIG+26+ehURENTqPj8LdkHgU6lNr0yoMuBSNzxvHgnz4LGFqz6eqoUxQLRp/g8r9tIAY4jtnzy30yBiJyu/Lkt3cmBzWH0fPUgjMGIG+u5O6SRw0OVKzo8bJkGgY7k9n0zHoxBSByxe7fpk0RElGr5O+zYxoFO5Pa9c1+MAUhcsXw4KNIDBdW'],
            volume: 0.25
        });
    }

    play(soundName) {
        if (!this.enabled) return;

        const sound = this.sounds[soundName];
        if (sound) {
            sound.play();
        }
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        localStorage.setItem('soundEnabled', enabled.toString());
    }

    isEnabled() {
        return this.enabled;
    }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;

// Export individual functions for convenience
export const playCorrectSound = () => soundManager.play('correct');
export const playIncorrectSound = () => soundManager.play('incorrect');
export const playAchievementSound = () => soundManager.play('achievement');
export const playClickSound = () => soundManager.play('click');
export const playNotificationSound = () => soundManager.play('notification');
export const setSoundEnabled = (enabled) => soundManager.setEnabled(enabled);
export const isSoundEnabled = () => soundManager.isEnabled();
