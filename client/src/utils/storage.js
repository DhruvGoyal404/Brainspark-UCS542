/**
 * LocalStorage Helper Functions
 * Centralized storage management with error handling
 */

const storage = {
    /**
     * Get item from localStorage
     */
    get: (key, defaultValue = null) => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return defaultValue;
        }
    },

    /**
     * Set item in LocalStorage
     */
    set: (key, value) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
            return false;
        }
    },

    /**
     * Remove item from localStorage
     */
    remove: (key) => {
        try {
            window.localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
            return false;
        }
    },

    /**
     * Clear all localStorage
     */
    clear: () => {
        try {
            window.localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    /**
     * Check if key exists
     */
    has: (key) => {
        return window.localStorage.getItem(key) !== null;
    },

    /**
     * Get all keys
     */
    keys: () => {
        return Object.keys(window.localStorage);
    },

    /**
     * Get storage size in bytes
     */
    size: () => {
        let total = 0;
        for (let key in window.localStorage) {
            if (window.localStorage.hasOwnProperty(key)) {
                total += window.localStorage[key].length + key.length;
            }
        }
        return total;
    },

    /**
     * Get item with expiry
     */
    getWithExpiry: (key) => {
        try {
            const item = window.localStorage.getItem(key);
            if (!item) return null;

            const data = JSON.parse(item);
            if (data.expiry && Date.now() > data.expiry) {
                window.localStorage.removeItem(key);
                return null;
            }

            return data.value;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}" with expiry:`, error);
            return null;
        }
    },

    /**
     * Set item with expiry (in milliseconds)
     */
    setWithExpiry: (key, value, ttl) => {
        try {
            const data = {
                value: value,
                expiry: Date.now() + ttl,
            };
            window.localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error setting localStorage key "${key}" with expiry:`, error);
            return false;
        }
    },
};

// Specific app storage keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    THEME: 'theme',
    FONT_SIZE: 'fontSize',
    SOUND_ENABLED: 'soundEnabled',
    REDUCED_MOTION: 'reducedMotion',
    QUIZ_STATE: (quizId) => `quiz_state_${quizId}`,
    QUIZ_CACHE: (quizId) => `quiz_cache_${quizId}`,
    ANALYTICS: 'analytics_data',
    ONBOARDING_COMPLETE: 'onboarding_complete',
};

export default storage;
