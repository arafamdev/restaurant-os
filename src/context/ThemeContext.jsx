import { useEffect, useState } from "react";

import { ThemeContext } from "./ThemeContextDefinition";

const THEME_STORAGE_KEY = "restaurantos-theme";
const DEFAULT_THEME = "dark";

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }
  } catch {
    // Use the default theme when localStorage is unavailable.
  }

  return DEFAULT_THEME;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // The theme remains functional without localStorage.
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
