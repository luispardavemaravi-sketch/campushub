import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(
    () => localStorage.getItem('sporthub_tema') || 'claro'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('sporthub_tema', tema);
  }, [tema]);

  function alternarTema() {
    setTema((actual) =>
      actual === 'claro' ? 'oscuro' : 'claro'
    );
  }

  return (
    <ThemeContext.Provider value={{ tema, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {

  //Guarda el tema seleccionado por el usuario: claro u oscuro.
  const contexto = useContext(ThemeContext);

  if (!contexto) {
    throw new Error('useTheme debe utilizarse dentro de ThemeProvider.');
  }

  return contexto;
}