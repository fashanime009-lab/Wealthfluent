import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { CANADA_TOP_INCOME, canadaTopIncomeResult } from "@/data/canadaTopIncome";

// Always Canadian dollars: the thresholds are StatCan's, so the site's
// currency setting doesn't apply here.
const cad = (n) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);

const BRACKET_LABEL = {
  "top0.01": "Top 0.01%",
  "top0.1": "Top 0.1%",
  top1: "Top 1%",
  below: "Below the top 1%",
};

// "150,000", "$150 000" and "150000" all mean the same income.
function parseIncome(raw) {
  const cleaned = raw.replace(/[\s,$]/g, "");
  if (cleaned === "") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

/**
 * Compares one yearly income (CAD, before tax) with Statistics Canada's
 * top-income cutoffs. Embedded in /top-1-percent-income-canada.
 */
export default function CanadaTopIncomeCheck() {
  const id = useId();
  const [raw, setRaw] = useState("");
  const income = parseIncome(raw);
  const result = income === null ? null : canadaTopIncomeResult(income);
  const { TAX_YEAR, top1Cutoff } = CANADA_TOP_INCOME;

  let message = null;
  if (income === null) message = "Enter your yearly income to see how it compares with Canada's top earners.";
  else if (!result) message = "Enter an income above zero, in Canadian dollars, for example 85,000.";

  return (
    <div className="border border-[#111814]/12 bg-[#ffffff] p-6 dark:border-[#eef1ec]/12 dark:bg-[#0b1210] sm:p-7">
      <label htmlFor={`${id}-income`} className="text-[13px] font-medium text-[#111814]/70 dark:text-[#eef1ec]/70">
        Your yearly income before tax (CAD)
      </label>
      <div className="mt-2 flex items-center border border-[#111814]/15 focus-within:border-[#047857] dark:border-[#eef1ec]/15 dark:focus-within:border-[#34d399]">
        <span className="pl-3 font-mono-tech text-[15px] text-[#111814]/55 dark:text-[#eef1ec]/50" aria-hidden="true">
          $
        </span>
        <input
          id={`${id}-income`}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="e.g. 85,000"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          aria-describedby={`${id}-note`}
          className="w-full bg-transparent px-2 py-2.5 font-mono-tech text-[15px] tabular-nums text-[#111814] outline-none dark:text-[#eef1ec]"
        />
      </div>

      <div aria-live="polite" className="mt-5">
        {message && <p className="text-[14px] leading-6 text-[#111814]/65 dark:text-[#eef1ec]/65">{message}</p>}

        {result && (
          <div className="space-y-3">
            <p className="font-display text-[24px] font-extrabold leading-tight text-[#047857] dark:text-[#34d399]">
              {BRACKET_LABEL[result.bracket]}
            </p>
            <p className="text-[14px] leading-6 text-[#111814]/75 dark:text-[#eef1ec]/75">
              {cad(income)} is <strong className="font-semibold text-[#111814] dark:text-[#eef1ec]">{result.timesAverage.toFixed(1)}×</strong> the
              average Canadian tax filer&apos;s income.
            </p>
            {result.bracket === "below" && (
              <p className="text-[14px] leading-6 text-[#111814]/75 dark:text-[#eef1ec]/75">
                You&apos;d need <strong className="font-semibold text-[#111814] dark:text-[#eef1ec]">{cad(result.gapToTop1)}</strong> more a
                year to reach the top 1% cutoff of {cad(top1Cutoff)}.
              </p>
            )}
          </div>
        )}
      </div>

      <Link
        to="/income-percentile"
        className="mt-6 inline-flex h-11 items-center bg-[#047857] px-5 text-[13.5px] font-semibold text-white transition hover:bg-[#065f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857] dark:bg-[#34d399] dark:text-[#052e22] dark:hover:bg-[#6ee7b7]"
      >
        See your global rank →
      </Link>

      <p id={`${id}-note`} className="mt-5 border-t border-[#111814]/10 pt-4 text-[12px] leading-5 text-[#111814]/60 dark:border-[#eef1ec]/10 dark:text-[#eef1ec]/50">
        Based on Statistics Canada {TAX_YEAR} tax-filer data. Total income includes wages, investments, pensions and government transfers.
      </p>
    </div>
  );
}
