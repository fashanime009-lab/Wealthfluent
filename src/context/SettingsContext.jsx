import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
  currency: "USD",
  language: "en",
  region: "auto",
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("finaiw-settings");

    return saved
      ? JSON.parse(saved)
      : DEFAULT_SETTINGS;
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

const setLanguage = (language) => {
  updateSetting("language", language);
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
  setLanguage,
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