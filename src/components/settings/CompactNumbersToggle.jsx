import { Hash } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";

// Replaces the old language picker. A finance app with numbers running
// into lakhs/crores or millions genuinely benefits from a compact-display
// toggle in a way that's actually deliverable end-to-end (unlike full
// site translation) — this setting is read by formatCurrency() and takes
// effect immediately anywhere that util is used.
export default function CompactNumbersToggle() {
  const { settings, setCompactNumbers } = useSettings();
  const preview = formatCurrency(12345000, settings.currency, settings.compactNumbers);

  return (
    <div className="flex flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="flex items-start gap-4 sm:items-center sm:gap-5">
        <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          <Hash size={22} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">Compact Numbers</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Show large amounts as <span className="font-semibold text-slate-700 dark:text-slate-300">{preview}</span> instead of the full figure.
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={settings.compactNumbers}
        onClick={() => setCompactNumbers(!settings.compactNumbers)}
        className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors ${
          settings.compactNumbers ? "bg-emerald-600" : "bg-slate-200 dark:bg-white/10"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            settings.compactNumbers ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
