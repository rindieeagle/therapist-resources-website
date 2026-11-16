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
  // The first browser render must match the light theme used during prerendering.
  const [theme, setTheme] = useState('light');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let savedTheme = 'light';
    try {
      if (localStorage.getItem('tr-theme') === 'dark') savedTheme = 'dark';
    } catch {}
    setTheme(savedTheme);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    apply(theme);
    try {
      localStorage.setItem('tr-theme', theme);
    } catch {}
  }, [theme, initialized]);

  const toggle = () => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
