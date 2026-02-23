import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';
type SetTheme = React.Dispatch<React.SetStateAction<Theme>>;

// Función auxiliar para obtener la preferencia de color del sistema
const getSystemPreference = (): 'dark' | 'light' =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const useTheme = (): [Theme, SetTheme] => {

  // Inicializa el tema: Usa localStorage, si no, usa 'system' como fallback.
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;

    // Si hay un valor guardado y es válido, úsalo. Si no, usa 'system' por defecto.
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      return savedTheme;
    }
    return 'system';
  });


  useEffect(() => {
    const root = window.document.documentElement;
    const isSystemDark = getSystemPreference() === 'dark';

    const shouldApplyDark = theme === 'dark' || (theme === 'system' && isSystemDark);

    // Limpia cualquier clase anterior y aplica la nueva
    root.classList.remove('light', 'dark');

    if (shouldApplyDark) {
      root.classList.add('dark');
    }

    localStorage.setItem('theme', theme);

  }, [theme]);

  // Manejar cambios en la preferencia del sistema cuando el tema es 'system'
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = () => {
        setTheme('system');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return [theme, setTheme];
};