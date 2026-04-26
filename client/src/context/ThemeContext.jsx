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

  const syncTimer = useRef(null);

  // ── Sync preferences to DB (debounced 800ms) ──────────────────────────────
  const syncToServer = (updates) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      try {
        await api.put('/user/preferences', updates);
      } catch (err) {
        console.warn('Could not sync preferences to server:', err.message);
      }
    }, 800);
  };

  // ── Setters that update localStorage AND DB ────────────────────────────────
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    syncToServer({ theme: newTheme });
  };

  const toggleTheme = () => {
    // Cycles light → dark → system → light
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
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

  /**
   * Load preferences that came from the server (called by AuthContext after login/checkAuth).
   * This enables cross-device sync: preferences set on one device appear instantly on another.
   * Does NOT trigger a DB sync — the source already is the DB.
   */
  const loadUserPreferences = (prefs) => {
    if (!prefs) return;
    if (prefs.theme) {
      setThemeState(prefs.theme);
      localStorage.setItem('theme', prefs.theme);
    }
    if (prefs.fontSize) {
      setFontSizeState(prefs.fontSize);
      localStorage.setItem('font_size', prefs.fontSize);
    }
    if (typeof prefs.soundEnabled === 'boolean') {
      setSoundEnabledState(prefs.soundEnabled);
      localStorage.setItem('sound_enabled', String(prefs.soundEnabled));
    }
    if (typeof prefs.reducedMotion === 'boolean') {
      setReducedMotionState(prefs.reducedMotion);
      localStorage.setItem('reduced_motion', String(prefs.reducedMotion));
    }
  };

  // ── Apply theme to DOM ─────────────────────────────────────────────────────
  // When theme === 'system', listen to the OS preference and update the DOM attribute
  // whenever the user switches their OS dark mode.
  useEffect(() => {
    if (theme !== 'system') {
      document.documentElement.setAttribute('data-theme', theme);
      return;
    }

    // System theme: mirror OS preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    document.documentElement.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');

    const handler = (e) => {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  // ── Apply font size to DOM ─────────────────────────────────────────────────
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
    setSoundEnabled,
    loadUserPreferences
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
