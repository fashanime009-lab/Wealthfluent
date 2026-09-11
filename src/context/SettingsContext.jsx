import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
  currency: "USD",
  compactNumbers: false,
  region: "auto",
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("finaiw-settings");
    const parsed = saved ? JSON.parse(saved) : {};

    // Merge with defaults so anyone with an old saved settings blob (from
    // before compactNumbers existed, or with a stale `language` key from
    // the removed translator) still gets a valid, complete settings object.
    return { ...DEFAULT_SETTINGS, ...parsed };
  });

  useEffect(() => {
    localStorage.setItem(
      "finaiw-settings",
      JSON.stringify(settings)
    );
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const setCurrency = (currency) => {
    updateSetting("currency", currency);
  };

  const setCompactNumbers = (compactNumbers) => {
    updateSetting("compactNumbers", compactNumbers);
  };

  const setRegion = (region) => {
    updateSetting("region", region);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        setCurrency,
        setCompactNumbers,
        setRegion,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings must be used inside SettingsProvider"
    );
  }

  return context;
}
