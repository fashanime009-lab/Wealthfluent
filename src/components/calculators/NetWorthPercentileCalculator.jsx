import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SITE_URL } from "@/components/seo/Seo";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";
import {
  calculateGlobalWealthPercentile,
  getReferenceThresholdsUSD,
  USD_CONVERSION_RATES,
  MEDIAN_DISPLAY_USD,
} from "@/services/calculators/globalWealthPercentile";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import ShareResult from "@/components/share/ShareResult";
import { drawNetWorthShareCard } from "@/components/share/drawNetWorthShareCard";

const helperLink =
  "font-semibold underline decoration-[#111814]/25 underline-offset-4 dark:decoration-[#eef1ec]/25";

/**
 * The Global Net Worth Percentile calculator: one net worth in, a world
 * rank out. Used by /net-worth-percentile and embedded unchanged in guide
 * pages, so both always give the same answer.
 *
 * `compact` (guide pages): panels stack, and the reference-threshold list
 * and the helper-text links are left out, since the guide page carries its
 * own table and links. `sharedTopPercent` shows the "your friend is in the
 * top X%" banner for visitors arriving from a share link.
 */
export default function NetWorthPercentileCalculator({ compact = false, sharedTopPercent = null }) {
  const { settings } = useSettings();
  const currency = settings.currency;
  const fmt = (v) => formatCurrency(v, currency);

  // Scale the default/slider range to whichever currency is active — a
  // slider hardcoded in raw numbers looks absurd in JPY (millions) or
  // wrong in INR (lakhs), and this tool's whole point is a fair
  // comparison, so getting the input's scale right matters.
  const rate = USD_CONVERSION_RATES[currency] ?? 1;
  const scale = (usd) => Math.round(usd / rate);

  const [netWorth, setNetWorth] = useState(() => scale(45000));

  const result = useMemo(
    () => calculateGlobalWealthPercentile({ netWorth, currencyCode: currency }),
    [netWorth, currency]
  );

  const thresholds = useMemo(() => getReferenceThresholdsUSD(), []);

  const headline =
    result.percentile === null
      ? "Your net worth is below zero"
      : result.percentile >= 99
        ? `You're wealthier than ${result.percentile}% of the world`
        : `You're wealthier than ${result.percentile}% of the world's adults`;

  return (
    <div className={`grid grid-cols-1 gap-8 ${compact ? "" : "lg:grid-cols-[1fr_1.1fr]"}`}>
      {/* Input */}
      <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
        {sharedTopPercent !== null && (
          <p className="border border-[#047857]/30 bg-[#047857]/[0.08] px-4 py-3 text-[13.5px] font-semibold text-[#047857] dark:border-[#34d399]/25 dark:bg-[#34d399]/[0.08] dark:text-[#34d399]">
            Your friend is in the top {sharedTopPercent}% of the world. Where do you rank?
          </p>
        )}
        <CalcField
          label="Your net worth (assets minus debts)"
          value={netWorth}
          onChange={setNetWorth}
          min={scale(-100000)}
          max={scale(5000000)}
          step={Math.max(1, scale(1000))}
          format={fmt}
        />
        <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
          Everything you own (savings, investments, property, vehicles at resale value) minus everything you owe
          (loans, credit card balances, mortgages).
          {!compact && (
            <>
              {" "}Not sure? The{" "}
              <Link to="/networth-calculator" className={helperLink}>
                Net Worth Calculator
              </Link>{" "}
              works it out for you. Curious how your salary compares instead? Try the{" "}
              <Link to="/income-percentile" className={helperLink}>
                Income Percentile Calculator
              </Link>
              .
            </>
          )}
        </p>
      </div>

      {/* Result */}
      <div className="space-y-6">
        <CalcResultPanel
          label={result.percentile === null ? "Global standing" : "Your global standing"}
          value={result.percentile === null ? "—" : `Top ${result.topPercent}%`}
          note={headline}
        />

        {result.percentile !== null ? (
          <div className="border border-[#047857]/25 bg-[#047857]/[0.06] p-6 dark:border-[#34d399]/20 dark:bg-[#0e1512]">
            <p className="text-[13px] text-[#111814]/65 dark:text-[#eef1ec]/65">Where you stand</p>
            <p className="mt-1 text-[22px] font-bold text-[#047857] dark:text-[#34d399]">You're in {result.bucket}</p>
            <p className="mt-1 text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">
              That's roughly{" "}
              <strong className="text-[#111814] dark:text-[#eef1ec]">
                {result.timesMedian >= 1 ? `${result.timesMedian.toFixed(1)}×` : `${(result.timesMedian * 100).toFixed(0)}%`}
              </strong>{" "}
              the world's median adult net worth (≈ {fmt(scale(MEDIAN_DISPLAY_USD))}).
            </p>
            <p className="mt-3 text-[11px] text-[#111814]/45 dark:text-[#eef1ec]/40">
              Data: UBS Global Wealth Report 2026 (estimate)
            </p>
          </div>
        ) : (
          <div className="border border-amber-500/25 bg-amber-500/[0.06] p-6 dark:border-amber-400/20 dark:bg-[#0e1512]">
            <p className="text-[13px] text-[#111814]/65 dark:text-[#eef1ec]/65">Where you stand</p>
            <p className="mt-1 text-[22px] font-bold text-amber-800 dark:text-amber-400">Debts exceed assets</p>
            <p className="mt-1 text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">
              Extremely common early in life or career — this says more about life stage than trajectory.
              {!compact && " See the FAQ below."}
            </p>
          </div>
        )}

        {result.percentile !== null && (
          <ShareResult
            shareUrl={`${SITE_URL}/net-worth-percentile/share?p=${result.topPercent}`}
            shareText={`I'm in the top ${result.topPercent}% of the world by net worth — wealthier than ${result.percentile}% of adults. Where do you rank?`}
            drawCard={(ctx, size) => drawNetWorthShareCard(ctx, size, result)}
            fileName="finaiw-net-worth-percentile.png"
            analyticsContext="net_worth_percentile"
          />
        )}

        {!compact && (
          <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
            <p className="py-3.5 text-[12px] font-semibold uppercase tracking-wide text-[#111814]/60 dark:text-[#eef1ec]/50">
              What it takes, worldwide
            </p>
            {thresholds.map((t) => (
              <CalcStat key={t.label} label={t.label} value={fmt(scale(t.netWorthUSD))} />
            ))}
          </div>
        )}

        <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
          <span className="font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">Disclaimer:</span> This is a
          statistical estimate calibrated to widely-cited global wealth research, not a precise per-person ranking or
          live dataset.{!compact && ' See "How this is calculated" below.'}
        </p>
      </div>
    </div>
  );
}
