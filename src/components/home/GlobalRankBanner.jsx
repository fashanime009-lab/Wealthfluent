import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "@/context/SettingsContext";
import { currencies } from "@/data/currencies";
import {
  calculateGlobalWealthPercentile,
  USD_CONVERSION_RATES,
} from "@/services/calculators/globalWealthPercentile";

// A working mini-tool, not just a link — GA4 showed visitors browsing the
// homepage without opening a calculator, so the flagship curiosity hook
// (global net worth percentile) now computes its answer right here,
// instead of asking for a click first. Placed right after the Hero on
// purpose, the most-seen real estate on the homepage, and kept to one
// input so it stays fast and above the fold on mobile.
export default function GlobalRankBanner() {
  const { settings } = useSettings();
  const currency = settings.currency;
  const symbol = currencies.find((c) => c.code === currency)?.symbol ?? "$";
  const rate = USD_CONVERSION_RATES[currency] ?? 1;
  const scale = (usd) => Math.round(usd / rate);

  const inputId = useId();
  const [netWorth, setNetWorth] = useState(() => scale(45000));

  const result = calculateGlobalWealthPercentile({ netWorth, currencyCode: currency });

  return (
    <section className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
      <div className="flex flex-col gap-4 rounded-lg bg-[#0e1512] p-5 sm:gap-6 sm:p-8 lg:flex-row lg:items-center lg:gap-10">
        <div className="min-w-0 lg:flex-1">
          <span className="text-[12.5px] font-semibold text-[#34d399]">Global Net Worth Percentile</span>
          <h2 className="font-display mt-1 text-[19px] font-extrabold leading-snug text-[#eef1ec] sm:mt-1.5 sm:text-[26px]">
            How rich are you, really?
          </h2>
          <p className="mt-1.5 max-w-[52ch] text-[13.5px] leading-6 text-[#eef1ec]/60 sm:mt-2">
            Not how you compare to your neighbors — how your net worth compares to every adult on Earth. Type a
            number, any currency, no signup.
          </p>
        </div>

        <div className="flex-shrink-0 lg:w-[320px]">
          <label htmlFor={inputId} className="text-[12.5px] font-medium text-[#eef1ec]/55">
            Your net worth (assets minus debts)
          </label>
          <div className="mt-2 flex items-baseline gap-1.5 border-b border-[#eef1ec]/25 pb-2 focus-within:border-[#34d399]">
            <span className="font-mono-tech text-[22px] text-[#eef1ec]/55">{symbol}</span>
            <input
              id={inputId}
              type="number"
              inputMode="numeric"
              value={netWorth}
              onChange={(e) => setNetWorth(Math.max(-1e12, Math.min(1e12, Number(e.target.value) || 0)))}
              className="font-mono-tech w-full bg-transparent text-[22px] text-[#eef1ec] outline-none"
            />
          </div>

          <div className="mt-3 min-h-[40px] sm:mt-4 sm:min-h-[48px]">
            {result.percentile !== null ? (
              <p className="text-[13.5px] leading-6 text-[#eef1ec]/85 sm:text-[14px]">
                You're wealthier than <strong className="text-[#34d399]">{result.percentile}%</strong> of the
                world's adults — top <strong className="text-[#34d399]">{result.topPercent}%</strong>.
              </p>
            ) : (
              <p className="text-[13px] leading-6 text-amber-400/90">Enter a positive net worth to see your rank.</p>
            )}
          </div>

          <Link
            to="/net-worth-percentile"
            className="mt-1 inline-block text-[13.5px] font-semibold text-[#eef1ec] underline decoration-[#eef1ec]/30 underline-offset-4 transition hover:decoration-[#eef1ec]/60 sm:mt-2"
          >
            See full breakdown →
          </Link>
        </div>
      </div>

      <p className="mt-3 text-[12.5px] text-[#111814]/50 dark:text-[#eef1ec]/45">
        Curious about income instead?{" "}
        <Link
          to="/income-percentile"
          className="font-semibold underline decoration-[#111814]/25 underline-offset-4 hover:text-[#111814] dark:decoration-[#eef1ec]/25 dark:hover:text-[#eef1ec]"
        >
          See your global income percentile
        </Link>
        .
      </p>
    </section>
  );
}
