import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', toggle: () => {} });

function apply(theme) {
  const el = document.documentElement;
  if (theme === 'dark') {
    el.classList.add('dark');
    el.setAttribute('data-theme', 'dark');
  } else {
    el.classList.remove('dark');
    el.setAttribute('data-theme', 'light');
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('tr-theme') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    apply(theme);
    try {
      localStorage.setItem('tr-theme', theme);
    } catch {}
  }, [theme]);

  const toggle = () => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
