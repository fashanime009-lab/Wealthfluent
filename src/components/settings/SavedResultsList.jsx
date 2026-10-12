import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { getSavedResults, removeSavedResult } from "@/utils/savedResults";

// The viewer for results saved via the "Save this result" button on any
// calculator or verdict page (see PostResultPrompt) — without this, saving
// would be a write-only feature with no way to ever see what was saved.
export default function SavedResultsList() {
  const [results, setResults] = useState(() => getSavedResults());

  if (results.length === 0) {
    return (
      <p className="px-6 py-6 text-[13px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/55 sm:px-8">
        Nothing saved yet — look for "Save this result" under any calculator or verdict's answer.
      </p>
    );
  }

  return (
    <div className="divide-y divide-[#111814]/10 dark:divide-[#eef1ec]/10">
      {results.map((r) => (
        <div key={r.id} className="flex items-center justify-between gap-4 px-6 py-4 sm:px-8">
          <div className="min-w-0">
            <Link
              to={r.route}
              className="text-[13.5px] font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25"
            >
              {r.label}
            </Link>
            <p className="font-mono-tech mt-0.5 truncate text-[13px] text-[#111814]/60 dark:text-[#eef1ec]/55">
              {r.value}
            </p>
            <p className="mt-0.5 text-[11.5px] text-[#111814]/45 dark:text-[#eef1ec]/40">
              {new Date(r.savedAt).toLocaleDateString()}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setResults(removeSavedResult(r.id))}
            aria-label={`Remove saved result: ${r.label}`}
            className="flex-shrink-0 text-[#111814]/40 transition hover:text-[#9a3412] dark:text-[#eef1ec]/40 dark:hover:text-[#d9552e]"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
