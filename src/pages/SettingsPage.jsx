import Seo from "../components/seo/Seo";
import { Settings, Globe } from "lucide-react";

import SettingsSection from "../components/settings/SettingsSection";
import CompactNumbersToggle from "../components/settings/CompactNumbersToggle";
import ThemeToggle from "../components/settings/ThemeToggle";
import ClearDataControl from "../components/settings/ClearDataControl";
import { useSettings } from "../context/SettingsContext";
import { currencies } from "../data/currencies";

export default function SettingsPage() {
  const { settings, setCurrency } = useSettings();

  return (
    <>
      <Seo
        title="Settings"
        description="Personalize your FINAIW currency, number format, and theme preferences."
        path="/settings"
        noindex
      />

      <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950">
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Settings size={15} />
              Settings
            </div>

            <h1 className="mt-5 text-5xl font-black tracking-[-0.04em] text-slate-950 dark:text-white">
              Personalize FINAIW
            </h1>

            <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
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
                  <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Globe size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      Preferred Currency
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Used across every calculator and dashboard.
                    </p>
                  </div>
                </div>

                <select
                  value={settings.currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-500 outline-none transition focus:border-emerald-500 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 sm:w-auto"
                >
                  {currencies.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.code} ({item.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t border-slate-100 dark:border-white/10">
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
        </section>
      </div>
    </>
  );
}
