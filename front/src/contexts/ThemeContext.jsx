import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "edudict-theme-mode";
const ThemeContext = createContext(null);

const getSystemThemeMode = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
};

const getStoredThemeMode = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedMode = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedMode === "light" || storedMode === "dark") {
    return storedMode;
  }

  return null;
};

export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(() => getStoredThemeMode() || getSystemThemeMode());

  const setThemeMode = useCallback((nextMode) => {
    if (nextMode !== "light" && nextMode !== "dark") {
      return;
    }

    setMode(nextMode);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode(mode === "light" ? "dark" : "light");
  }, [mode, setThemeMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "light" ? "#2f6f73" : "#7fc7c9",
          },
          secondary: {
            main: mode === "light" ? "#536176" : "#b5c3d6",
          },
          background: {
            default: mode === "light" ? "#f4f7fb" : "#111827",
            paper: mode === "light" ? "#ffffff" : "#1f2937",
          },
          error: {
            main: "#d32f2f",
          },
          success: {
            main: "#2e7d32",
          },
          warning: {
            main: "#ed6c02",
          },
        },
        shape: {
          borderRadius: 8,
        },
        typography: {
          fontFamily: "Arial, Helvetica, sans-serif",
          allVariants: {
            letterSpacing: 0,
          },
        },
      }),
    [mode]
  );

  const value = useMemo(
    () => ({
      mode,
      setThemeMode,
      toggleTheme,
    }),
    [mode, setThemeMode, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeContext deve ser usado dentro de AppThemeProvider");
  }

  return context;
}
