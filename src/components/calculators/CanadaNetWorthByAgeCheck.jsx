import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { CANADA_NET_WORTH_BY_AGE, compareWithCanadianMedian } from "@/data/canadaNetWorthByAge";

// Always Canadian dollars: the medians are Statistics Canada's, so the
// site's currency setting doesn't apply here.
const cad = (n) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);

// "250,000", "$250 000", "-20000" and "−20,000" all parse.
function parseAmount(raw) {
  const cleaned = raw.replace(/[\s,$]/g, "").replace(/−/g, "-");
  if (cleaned === "" || cleaned === "-") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

const fieldClass =
  "w-full border border-[#111814]/15 bg-transparent px-3 py-2.5 text-[15px] text-[#111814] outline-none focus:border-[#047857] dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:focus:border-[#34d399]";
const labelClass = "text-[13px] font-medium text-[#111814]/70 dark:text-[#eef1ec]/70";

/**
 * Compares a family's net worth with Statistics Canada's median for its
 * age group. Embedded in /net-worth-by-age-canada.
 */
export default function CanadaNetWorthByAgeCheck() {
  const id = useId();
  const [groupId, setGroupId] = useState("");
  const [raw, setRaw] = useState("");
  const amount = parseAmount(raw);
  const result = groupId && amount !== null ? compareWithCanadianMedian(groupId, amount) : null;
  const { SURVEY_YEAR, allFamilies, groups } = CANADA_NET_WORTH_BY_AGE;

  let message = null;
  if (!groupId && amount === null) message = "Pick your age group and enter your net worth to compare with the typical Canadian family your age.";
  else if (!groupId) message = "Now pick your age group.";
  else if (amount === null) message = "Enter your net worth: everything you own minus everything you owe.";
  else if (!result) message = "Enter your net worth as a number, for example 250,000 or -20,000.";

  return (
    <div className="border border-[#111814]/12 bg-[#ffffff] p-6 dark:border-[#eef1ec]/12 dark:bg-[#0b1210] sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor={`${id}-age`} className={labelClass}>
            Age of the main income earner
          </label>
          <select id={`${id}-age`} value={groupId} onChange={(e) => setGroupId(e.target.value)} className={`${fieldClass} bg-[#ffffff] dark:bg-[#0b1210]`}>
            <option value="">Choose your age group</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label htmlFor={`${id}-nw`} className={labelClass}>
            Your net worth (CAD)
          </label>
          <div className="flex items-center border border-[#111814]/15 focus-within:border-[#047857] dark:border-[#eef1ec]/15 dark:focus-within:border-[#34d399]">
            <span className="pl-3 font-mono-tech text-[15px] text-[#111814]/55 dark:text-[#eef1ec]/50" aria-hidden="true">
              $
            </span>
            <input
              id={`${id}-nw`}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="e.g. 250,000"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              aria-describedby={`${id}-note`}
              className="w-full bg-transparent px-2 py-2.5 font-mono-tech text-[15px] tabular-nums text-[#111814] outline-none dark:text-[#eef1ec]"
            />
          </div>
        </div>
      </div>

      <div aria-live="polite" className="mt-6">
        {message && <p className="text-[14px] leading-6 text-[#111814]/65 dark:text-[#eef1ec]/65">{message}</p>}

        {result && (
          <div className="space-y-3">
            <p className="font-display text-[24px] font-extrabold leading-tight text-[#047857] dark:text-[#34d399]">
              {result.position === "at"
                ? "Right at the median"
                : result.position === "above"
                  ? `${cad(result.difference)} above the median`
                  : `${cad(result.difference)} below the median`}
            </p>
            <p className="text-[14px] leading-6 text-[#111814]/75 dark:text-[#eef1ec]/75">
              The typical Canadian family whose main earner is {result.group.label === "65+" ? "65 or older" : result.group.label === "Under 35" ? "under 35" : `aged ${result.group.label}`} has a net worth of{" "}
              <strong className="font-semibold text-[#111814] dark:text-[#eef1ec]">{cad(result.group.median)}</strong>.
            </p>
            {result.times !== null ? (
              <p className="text-[14px] leading-6 text-[#111814]/75 dark:text-[#eef1ec]/75">
                That makes yours{" "}
                <strong className="font-semibold text-[#111814] dark:text-[#eef1ec]">{result.times.toFixed(1)}×</strong> the
                typical Canadian family your age.
              </p>
            ) : (
              <p className="text-[14px] leading-6 text-[#111814]/75 dark:text-[#eef1ec]/75">
                You owe more than you own right now. That's common early in a career or after buying a home, and the
                number that matters most is whether it rises each year.
              </p>
            )}
            <p className="text-[13.5px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/55">
              All Canadian families: median {cad(allFamilies)}.
            </p>
          </div>
        )}
      </div>

      <Link
        to="/net-worth-percentile"
        className="mt-6 inline-flex h-11 items-center bg-[#047857] px-5 text-[13.5px] font-semibold text-white transition hover:bg-[#065f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857] dark:bg-[#34d399] dark:text-[#052e22] dark:hover:bg-[#6ee7b7]"
      >
        See your global rank →
      </Link>

      <p id={`${id}-note`} className="mt-5 border-t border-[#111814]/10 pt-4 text-[12px] leading-5 text-[#111814]/60 dark:border-[#eef1ec]/10 dark:text-[#eef1ec]/50">
        Based on Statistics Canada's Survey of Financial Security {SURVEY_YEAR}. Net worth = everything you own minus
        everything you owe.
      </p>
    </div>
  );
}
