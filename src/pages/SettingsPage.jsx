import Seo from "../components/seo/Seo";
import { Globe } from "lucide-react";

import SettingsSection from "../components/settings/SettingsSection";
import CompactNumbersToggle from "../components/settings/CompactNumbersToggle";
import ThemeToggle from "../components/settings/ThemeToggle";
import ClearDataControl from "../components/settings/ClearDataControl";
import { useSettings } from "../context/SettingsContext";
import { currencies } from "../data/currencies";

export default function SettingsPage() {
  const { settings, setCurrencyManually, resetCurrencyToAuto } = useSettings();

  return (
    <>
      <Seo
        title="Settings"
        description="Personalize your FINAIW currency, number format, and theme preferences."
        path="/settings"
        noindex
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="mb-10">
            <span className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Settings</span>

            <h1 className="font-display mt-3 text-4xl font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-5xl">
              Personalize FINAIW
            </h1>

            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
              Set your preferences once and every calculator, verdict and future AI feature will automatically
              follow them.
            </p>
          </div>

          <div className="space-y-8">
            <SettingsSection
              title="General"
              description="Personal preferences used across FINAIW."
            >
              <div className="flex flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <div className="flex items-start gap-4 sm:items-center sm:gap-5">
                  <Globe className="mt-0.5 flex-shrink-0 text-[#047857] dark:text-[#34d399]" size={20} />

                  <div>
                    <h3 className="font-semibold text-[#111814] dark:text-[#eef1ec]">
                      Preferred Currency
                    </h3>
                    <p className="mt-1 text-[13px] text-[#111814]/60 dark:text-[#eef1ec]/55">
                      Used across every calculator and dashboard.{" "}
                      {settings.region === "auto"
                        ? "Auto-detected from your device's timezone — pick one below to lock it in."
                        : "Set manually."}
                    </p>
                    {settings.region !== "auto" && (
                      <button
                        type="button"
                        onClick={resetCurrencyToAuto}
                        className="mt-1.5 text-[12.5px] font-semibold text-[#047857] underline decoration-[#047857]/30 underline-offset-2 dark:text-[#34d399] dark:decoration-[#34d399]/30"
                      >
                        Switch back to automatic
                      </button>
                    )}
                  </div>
                </div>

                <select
                  aria-label="Preferred currency"
                  value={settings.currency}
                  onChange={(e) => setCurrencyManually(e.target.value)}
                  className="w-full border border-[#111814]/15 bg-transparent px-4 py-2.5 text-[13.5px] font-medium text-[#111814] outline-none transition focus:border-[#047857] dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:focus:border-[#34d399] sm:w-auto"
                >
                  {currencies.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.code} ({item.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t border-[#111814]/10 dark:border-[#eef1ec]/10">
                <CompactNumbersToggle />
              </div>
            </SettingsSection>

            <SettingsSection
              title="Appearance"
              description="Customize how FINAIW looks."
            >
              <ThemeToggle />
            </SettingsSection>

            <div id="privacy-data" className="scroll-mt-28">
              <SettingsSection
                title="Privacy & Data"
                description="Everything FINAIW stores about you, and how to remove it."
              >
                <ClearDataControl />
              </SettingsSection>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
