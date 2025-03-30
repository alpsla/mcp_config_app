import React, { createContext, useContext, useEffect, useState } from 'react';

// Define theme types
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Create theme context
const ThemeContext = createContext({
  theme: THEMES.SYSTEM,
  setTheme: () => {},
});

export const ThemeProvider = ({ children, defaultTheme = THEMES.SYSTEM }) => {
  const [theme, setTheme] = useState(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Access localStorage only after component is mounted on the client
  useEffect(() => {
    setMounted(true);
    // Get theme from localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme && Object.values(THEMES).includes(storedTheme)) {
      setTheme(storedTheme);
    }
  }, []);

  // Apply theme to document element
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Remove both theme classes
    root.classList.remove(THEMES.LIGHT, THEMES.DARK);

    if (theme === THEMES.SYSTEM) {
      // Apply system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? THEMES.DARK
        : THEMES.LIGHT;
      
      root.classList.add(systemTheme);
      return;
    }

    // Apply selected theme
    root.classList.add(theme);
  }, [theme, mounted]);

  // Theme context value
  const contextValue = {
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem('theme', newTheme);
      setTheme(newTheme);
    },
  };

  // Avoid flash of incorrect theme during initial load
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export theme constants
export { THEMES };

export default ThemeProvider;
