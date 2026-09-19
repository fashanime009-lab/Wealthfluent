import { useState } from "react";

// The exact set of first-party localStorage keys FINAIW writes to on this
// device (financial profile, goals, learning streak, calculator history,
// theme/currency preferences). Deliberately does NOT include
// "finaiw-cookie-consent" — that's a separate, already-controllable choice
// via "Cookie Preferences" in the footer, not app data.
const CLEARABLE_KEYS = [
  "finaiw-theme",
  "finaiw-settings",
  "finaiw-workspace",
  "finaiw-learning",
  "finaiw-goals",
  "finaiw-personal-goals",
  "finaiw-financial-profile",
  "finaiw-profile",
  "finaiw-history",
  "finaiw-dashboard-preferences",
];

export default function ClearDataControl() {
  const [confirming, setConfirming] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleClear = () => {
    CLEARABLE_KEYS.forEach((key) => localStorage.removeItem(key));
    setConfirming(false);
    setCleared(true);
    // Reload so every context (theme, settings, workspace, etc.) re-reads
    // its defaults instead of holding stale in-memory state.
    setTimeout(() => window.location.reload(), 900);
  };

  return (
    <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <h3 className="text-[14px] font-semibold text-[#111814] dark:text-[#eef1ec]">Clear my data</h3>
        <p className="mt-1 max-w-md text-[13px] leading-6 text-[#111814]/55 dark:text-[#eef1ec]/55">
          Permanently erases your financial profile, goals, learning streak, calculator history, and display
          preferences from this browser. Nothing was ever sent anywhere, so this is the only place it can be
          cleared — there's no account or server copy to delete.
        </p>
      </div>

      {cleared ? (
        <span className="flex-shrink-0 text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Cleared</span>
      ) : confirming ? (
        <div className="flex flex-shrink-0 gap-2">
          <button
            onClick={() => setConfirming(false)}
            className="border border-[#111814]/15 px-4 py-2.5 text-[13px] font-semibold text-[#111814]/70 transition hover:bg-[#111814]/5 dark:border-[#eef1ec]/15 dark:text-[#eef1ec]/70 dark:hover:bg-[#eef1ec]/5"
          >
            Cancel
          </button>
          <button
            onClick={handleClear}
            className="bg-[#9a3412] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#7c2d12]"
          >
            Yes, erase it
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="flex-shrink-0 border border-[#9a3412]/40 px-4 py-2.5 text-[13px] font-semibold text-[#9a3412] transition hover:bg-[#9a3412]/10 dark:text-[#d9552e] dark:border-[#d9552e]/40 dark:hover:bg-[#d9552e]/10"
        >
          Clear my data
        </button>
      )}
    </div>
  );
}
