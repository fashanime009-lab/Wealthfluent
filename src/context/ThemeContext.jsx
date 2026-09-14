import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { isDaytime } from "@/utils/autoDetect";

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
  const isDark =
    theme === "dark" ||
    (theme === "system" && getSystemPrefersDark()) ||
    (theme === "auto" && !isDaytime());
  root.classList.toggle("dark", isDark);
}

export function ThemeProvider({ children }) {
  // "light" | "dark" | "system" | "auto" — "auto" is the default: light
  // by day, dark by night, from the device's own clock (see
  // utils/autoDetect.js). Distinct from "system", which instead follows
  // the OS's own light/dark setting, whatever that happens to be.
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "auto";
  });

  const setTheme = (value) => {
    setThemeState(value);
    localStorage.setItem(STORAGE_KEY, value);
  };

  useEffect(() => {
    applyTheme(theme);

    if (theme === "system") {
      // Keep the applied theme in sync if the OS-level preference
      // changes while "System" is selected.
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = () => applyTheme("system");
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }

    if (theme === "auto") {
      // Re-check periodically so a tab left open across the day/night
      // boundary actually flips, instead of waiting for the next visit.
      const interval = setInterval(() => applyTheme("auto"), 5 * 60 * 1000);
      return () => clearInterval(interval);
    }

    return undefined;
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
