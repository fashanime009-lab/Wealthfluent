import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { detectCurrency } from "@/utils/autoDetect";

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
  currency: "USD",
  compactNumbers: false,
  // "auto" means the currency below is a guess from the device's own
  // timezone (see utils/autoDetect.js), re-checked on every visit so it
  // keeps following the person if they travel. The moment someone picks
  // a currency by hand in Settings, this flips to "manual" and the guess
  // stops overwriting their choice — see setCurrencyManually.
  region: "auto",
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("finaiw-settings");
    const parsed = saved ? JSON.parse(saved) : {};

    // Merge with defaults so anyone with an old saved settings blob (from
    // before compactNumbers existed, or with a stale `language` key from
    // the removed translator) still gets a valid, complete settings object.
    const merged = { ...DEFAULT_SETTINGS, ...parsed };

    // Re-detected on every load while region stays "auto" — right here in
    // the initializer, not a later effect, so the first render already
    // shows the right currency instead of flashing USD then correcting.
    // Someone who travels (or is just testing in a different timezone)
    // sees the currency actually follow them, the same way the "auto"
    // theme follows the current time rather than a one-time snapshot.
    if (merged.region === "auto") merged.currency = detectCurrency();

    return merged;
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

  // The Settings page's currency picker calls this, not setCurrency
  // directly — an explicit choice should permanently override the
  // auto-detected guess, not just for this session.
  const setCurrencyManually = (currency) => {
    setSettings((prev) => ({ ...prev, currency, region: "manual" }));
  };

  // Hands control back to auto-detection — re-detects immediately so the
  // switch is visible right away instead of waiting for the next reload.
  const resetCurrencyToAuto = () => {
    setSettings((prev) => ({ ...prev, currency: detectCurrency(), region: "auto" }));
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
        setCurrencyManually,
        resetCurrencyToAuto,
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
