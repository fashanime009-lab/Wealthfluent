import { useState } from "react";
import { Bookmark, BookmarkCheck, Trash2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { getSavedResultsForRoute, saveResult, removeSavedResult } from "@/utils/savedResults";

/**
 * The light-touch "save this result" prompt rendered right after a
 * calculator's or verdict's headline result: a one-click, no-account save
 * (localStorage only), plus an inline list of everything saved from this
 * same page so far. A page can save several distinct amounts (change an
 * input, save again) but can't save the exact same displayed value twice.
 * Shown by CalcResultPanel and VerdictResult, so it appears after every
 * tool's result without each of the 30+ pages needing to render it
 * themselves.
 */
export default function PostResultPrompt({ label, value, route }) {
  const [saved, setSaved] = useState(() => getSavedResultsForRoute(route));
  const alreadySaved = saved.some((r) => r.value === value);

  const handleSave = () => {
    if (alreadySaved) return;
    const next = saveResult({ label, value, route });
    setSaved(next.filter((r) => r.route === route));
    trackEvent("save_result", { route });
  };

  const handleRemove = (id) => {
    const next = removeSavedResult(id);
    setSaved(next.filter((r) => r.route === route));
  };

  return (
    <div className="border border-[#111814]/12 bg-[#ffffff] px-5 py-4 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
      <button
        type="button"
        onClick={handleSave}
        disabled={alreadySaved}
        className={`flex items-center gap-1.5 text-[13px] font-semibold transition ${
          alreadySaved
            ? "cursor-default text-[#047857] dark:text-[#34d399]"
            : "text-[#111814]/70 hover:text-[#111814] dark:text-[#eef1ec]/70 dark:hover:text-[#eef1ec]"
        }`}
      >
        {alreadySaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
        {alreadySaved ? "Saved" : "Save this result"}
      </button>

      {saved.length > 0 && (
        <div className="mt-3 divide-y divide-[#111814]/10 border-t border-[#111814]/10 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/10">
          {saved.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="font-mono-tech truncate text-[13px] text-[#111814] dark:text-[#eef1ec]">{r.value}</p>
                <p className="text-[11px] text-[#111814]/45 dark:text-[#eef1ec]/40">
                  {new Date(r.savedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(r.id)}
                aria-label={`Remove saved result ${r.value}`}
                className="flex-shrink-0 text-[#111814]/40 transition hover:text-[#9a3412] dark:text-[#eef1ec]/40 dark:hover:text-[#d9552e]"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
