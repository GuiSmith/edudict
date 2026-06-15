import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

const THEME_STORAGE_KEY = "edudict-theme-mode";
const THEME_MODE_CHANGE_EVENT = "edudict-theme-mode-change";
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

const getThemeModeSnapshot = () => {
  return getStoredThemeMode() || getSystemThemeMode();
};

const getServerThemeModeSnapshot = () => {
  return "light";
};

const subscribeThemeMode = (onStoreChange) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)");

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_MODE_CHANGE_EVENT, onStoreChange);
  mediaQuery?.addEventListener("change", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_MODE_CHANGE_EVENT, onStoreChange);
    mediaQuery?.removeEventListener("change", onStoreChange);
  };
};

export function AppThemeProvider({ children }) {
  const mode = useSyncExternalStore(
    subscribeThemeMode,
    getThemeModeSnapshot,
    getServerThemeModeSnapshot
  );

  const setThemeMode = useCallback((nextMode) => {
    if (nextMode !== "light" && nextMode !== "dark") {
      return;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
      window.dispatchEvent(new Event(THEME_MODE_CHANGE_EVENT));
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
          h1: {
            fontSize: "2rem",
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: 0,
          },
          h2: {
            fontSize: "1.55rem",
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: 0,
          },
          h3: {
            fontSize: "1.08rem",
            fontWeight: 700,
            lineHeight: 1.35,
            letterSpacing: 0,
          },
          body1: {
            lineHeight: 1.7,
            letterSpacing: 0,
          },
          body2: {
            lineHeight: 1.65,
            letterSpacing: 0,
          },
          allVariants: {
            letterSpacing: 0,
          },
        },
        components: {
          MuiTab: {
            styleOverrides: {
              root: {
                alignItems: "flex-start",
                borderRadius: 6,
                fontWeight: 700,
                letterSpacing: 0,
                minHeight: 42,
                textTransform: "none",
              },
            },
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
