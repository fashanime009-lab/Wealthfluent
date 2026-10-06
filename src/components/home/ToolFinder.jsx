import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { matchTool } from "@/utils/toolFinder";
import { CATEGORY_COLORS } from "@/data/categoryColors";

// Verdicts sit outside the four calculator categories, but already own
// the deep-emerald "verdict room" everywhere else on this page — reusing
// that same color here keeps a verdict match visually legible as "this is
// a verdict, not a calculator" the instant the card appears.
const VERDICT_TONE = { name: "Verdict", bright: "#34d399", panel: "#052e22" };

function toneFor(category) {
  return category === "verdict" ? VERDICT_TONE : CATEGORY_COLORS[category];
}

const PROMPTS = [
  "Should I pay off my loan or invest?",
  "How much do I need to retire?",
  "Buying vs renting a home",
  "What's my net worth?",
  "Do I need insurance?",
];

export default function ToolFinder() {
  const [query, setQuery] = useState("");
  const match = useMemo(() => matchTool(query), [query]);
  const showFallback = query.trim().length >= 3 && !match;

  return (
    <section className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8 lg:px-12">
      <div className="max-w-[640px]">
        <span className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Not sure where to start?</span>
        <h2 className="font-display mt-2 text-[20px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[22px]">
          Tell us what you're trying to figure out
        </h2>
        <p className="mt-3 text-[13.5px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/60">
          Type a real question and we'll point you to the right tool. Matching happens entirely in
          your browser — nothing you type here is stored or sent anywhere.
        </p>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. should I pay off my car loan or invest the extra cash?"
          className="mt-6 w-full border border-[#111814]/15 bg-transparent px-4 py-3.5 text-[14.5px] text-[#111814] outline-none transition placeholder:text-[#111814]/35 focus:border-[#047857] dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:placeholder:text-[#eef1ec]/35 dark:focus:border-[#34d399]"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setQuery(p)}
              className="border border-[#111814]/15 px-3 py-1.5 text-[12.5px] text-[#111814]/65 transition hover:border-[#047857]/40 hover:text-[#111814] dark:border-[#eef1ec]/15 dark:text-[#eef1ec]/65 dark:hover:border-[#34d399]/40 dark:hover:text-[#eef1ec]"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="mt-2 min-h-[132px]">
          {match && <ResultCard match={match} />}

          {showFallback && (
            <div className="mt-4 border border-[#111814]/15 px-5 py-4 dark:border-[#eef1ec]/15">
              <p className="text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">
                Nothing matched that exactly — browse{" "}
                <Link
                  to="/calculators"
                  className="font-semibold text-[#047857] underline decoration-[#047857]/30 underline-offset-2 dark:text-[#34d399] dark:decoration-[#34d399]/30"
                >
                  all calculators
                </Link>{" "}
                or{" "}
                <Link
                  to="/verdict"
                  className="font-semibold text-[#047857] underline decoration-[#047857]/30 underline-offset-2 dark:text-[#34d399] dark:decoration-[#34d399]/30"
                >
                  all verdicts
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ResultCard({ match }) {
  const { tool, matchedTerms } = match;
  const tone = toneFor(tool.category);

  return (
    <div className="mt-4 flex flex-col gap-4 border-l-4 p-5 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: tone.bright, backgroundColor: tone.panel }}>
      <div className="min-w-0">
        <span className="text-[12px] font-semibold" style={{ color: tone.bright }}>
          {tone.name}
        </span>
        <h3 className="font-display mt-1 text-[16px] font-bold text-[#eef1ec]">{tool.title}</h3>
        <p className="mt-1 text-[13px] leading-5 text-[#eef1ec]/60">{tool.description}</p>
        {matchedTerms.length > 0 && (
          <p className="mt-2 text-[11.5px] text-[#eef1ec]/50">Matched: {matchedTerms.slice(0, 4).join(", ")}</p>
        )}
      </div>
      <Link
        to={tool.route}
        className="inline-flex h-10 flex-shrink-0 items-center px-5 text-[13px] font-semibold transition"
        style={{ backgroundColor: tone.bright, color: tone.panel }}
      >
        Open {tool.title}
      </Link>
    </div>
  );
}
