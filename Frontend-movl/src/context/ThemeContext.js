import { createContext, useContext, useState } from 'react';

// 1. Definimos las paletas de colores
const LightTheme = {
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#212121',
  textSecondary: '#757575',
  border: '#ffebee',
};

const DarkTheme = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  border: '#333333',
};

const ThemeContext = createContext();

// 2. Proveedor que envolverá a la aplicación
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Elegimos los colores dependiendo del estado
  const colors = isDarkMode ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Hook personalizado para usarlo fácilmente
export const useTheme = () => useContext(ThemeContext);