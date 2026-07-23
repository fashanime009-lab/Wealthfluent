import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
 const [theme, setTheme] = useState(() => {
  const [theme, setTheme] = useState("light");
});

 useEffect(() => {
 const root = document.documentElement;

root.classList.remove("dark");

// Force light mode while redesigning FINAIW
localStorage.setItem("theme", "light");
}, [theme]);

  return (
    <ThemeContext.Provider
      value={{
    theme,
    setTheme,
}}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}