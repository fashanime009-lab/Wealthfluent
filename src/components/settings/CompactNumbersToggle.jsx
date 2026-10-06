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
    <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <h3 id="compact-numbers-label" className="text-[14px] font-semibold text-[#111814] dark:text-[#eef1ec]">Compact numbers</h3>
        <p className="mt-1 text-[13px] text-[#111814]/60 dark:text-[#eef1ec]/55">
          Show large amounts as{" "}
          <span className="font-mono-tech tabular-nums text-[#111814] dark:text-[#eef1ec]">{preview}</span> instead
          of the full figure.
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-labelledby="compact-numbers-label"
        aria-checked={settings.compactNumbers}
        onClick={() => setCompactNumbers(!settings.compactNumbers)}
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
          settings.compactNumbers ? "bg-[#047857]" : "bg-[#111814]/15 dark:bg-[#eef1ec]/15"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-[#ffffff] transition-transform ${
            settings.compactNumbers ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
