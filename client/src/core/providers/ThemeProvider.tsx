import React, { createContext } from 'react';
// hooks
import { useTheme } from '@/features/theme/hooks';
// types
import { ThemeApi } from '@/features/theme/hooks/types';

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

// ===========================
// Types
// ===========================
export type ThemeContextType = {
  theme: ThemeApi;
}
