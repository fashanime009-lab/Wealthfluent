import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext();

const STORAGE_KEY = "finaiw-theme";

function getSystemPrefersDark() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function applyTheme(theme) {
  const root = document.documentElement;
  const isDark = theme === "dark" || (theme === "system" && getSystemPrefersDark());
  root.classList.toggle("dark", isDark);
}

export function ThemeProvider({ children }) {
  // "light" | "dark" | "system"
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "system";
  });

  const setTheme = (value) => {
    setThemeState(value);
    localStorage.setItem(STORAGE_KEY, value);
  };

  useEffect(() => {
    applyTheme(theme);

    if (theme !== "system") return undefined;

    // Keep the applied theme in sync if the OS-level preference changes
    // while "System" is selected.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
