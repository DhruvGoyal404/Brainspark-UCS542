import { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../utils/api';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  const [reducedMotion, setReducedMotionState] = useState(() => {
    const saved = localStorage.getItem('reduced_motion');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [fontSize, setFontSizeState] = useState(() => {
    return localStorage.getItem('font_size') || 'medium';
  });

  const [soundEnabled, setSoundEnabledState] = useState(() => {
    const saved = localStorage.getItem('sound_enabled');
    return saved === null ? true : saved === 'true';
  });

  // Debounce timer ref for syncing to DB
  const syncTimer = useRef(null);

  // ── Sync preferences to DB (debounced 800ms) ──
  const syncToServer = (updates) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return; // Not logged in — skip API call

    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      try {
        await api.put('/user/preferences', updates);
      } catch (err) {
        // Silently fail — localStorage is still updated
        console.warn('Could not sync preferences to server:', err.message);
      }
    }, 800);
  };

  // ── Setters that update both localStorage AND DB ──
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    syncToServer({ theme: newTheme });
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const setFontSize = (newSize) => {
    setFontSizeState(newSize);
    localStorage.setItem('font_size', newSize);
    syncToServer({ fontSize: newSize });
  };

  const setSoundEnabled = (val) => {
    setSoundEnabledState(val);
    localStorage.setItem('sound_enabled', val);
    syncToServer({ soundEnabled: val });
  };

  const setReducedMotion = (val) => {
    setReducedMotionState(val);
    localStorage.setItem('reduced_motion', val);
    syncToServer({ reducedMotion: val });
  };

  // ── Apply theme to DOM ──
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ── Apply font size to DOM ──
  useEffect(() => {
    const fontSizes = { small: '14px', medium: '16px', large: '18px' };
    document.documentElement.style.fontSize = fontSizes[fontSize] || '16px';
  }, [fontSize]);

  const value = {
    theme,
    setTheme,
    toggleTheme,
    reducedMotion,
    setReducedMotion,
    fontSize,
    setFontSize,
    soundEnabled,
    setSoundEnabled
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
