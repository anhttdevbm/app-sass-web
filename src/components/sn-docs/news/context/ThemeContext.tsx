/* eslint-disable @typescript-eslint/no-explicit-any */
import useTheme from "hooks/useTheme";
import React, { createContext, useEffect, useState } from "react";
import { useAppSelector } from "store/hooks";

export const ThemeContext = createContext<any>({ undefined });

export const ThemeProvider: React.FC<{ children: any }> = ({ children }) => {
  const { isDarkMode } = useTheme();
  const [theme, setTheme] = useState("");

  useEffect(() => {
    const storedTheme = isDarkMode ? "dark" : "light";
    setTheme(storedTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    setTheme(theme);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
