import { useEffect, useState } from 'react';

// Persisted light/dark theme bound to <html data-theme>.
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('kanflow_theme') || 'dark'; }
    catch { return 'dark'; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('kanflow_theme', theme); } catch { /* ignore */ }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  return { theme, toggle };
}
