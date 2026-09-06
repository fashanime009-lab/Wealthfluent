import { useState } from "react";
import { Trash2, ShieldCheck } from "lucide-react";

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
    <div className="flex flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="flex items-start gap-4 sm:items-center sm:gap-5">
        <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
          <Trash2 size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">
            Clear My Data
          </h3>
          <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
            Permanently erases your financial profile, goals, learning streak,
            calculator history, and display preferences from this browser.
            Nothing was ever sent anywhere, so this is the only place it can
            be cleared — there's no account or server copy to delete.
          </p>
        </div>
      </div>

      {cleared ? (
        <span className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 sm:w-auto">
          <ShieldCheck size={16} /> Cleared
        </span>
      ) : confirming ? (
        <div className="flex flex-shrink-0 gap-2">
          <button
            onClick={() => setConfirming(false)}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5 sm:flex-none"
          >
            Cancel
          </button>
          <button
            onClick={handleClear}
            className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700 sm:flex-none"
          >
            Yes, erase it
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="w-full flex-shrink-0 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10 sm:w-auto"
        >
          Clear my data
        </button>
      )}
    </div>
  );
}
