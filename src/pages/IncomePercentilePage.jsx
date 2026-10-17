import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Seo, { SITE_URL } from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import {
  calculateGlobalIncomePercentile,
  getIncomeReferenceThresholdsUSD,
  USD_CONVERSION_RATES,
  MEDIAN_INCOME_USD,
} from "../services/calculators/globalIncomePercentile";
import AdSlot from "../components/ads/AdSlot";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";
import ShareResult from "@/components/share/ShareResult";
import useShareLanding from "@/hooks/useShareLanding";
import { drawIncomeShareCard } from "@/components/share/drawIncomeShareCard";

const FAQ_ITEMS = [
  { q: "What is a global income percentile calculator?", a: "A tool that estimates where your annual income ranks among all the world's adults — not just people in your own country. It answers \"how rich am I compared to the world\" for income specifically, the same way the Net Worth Percentile Calculator does for assets minus debts." },
  { q: "Where does the data come from?", a: "The World Inequality Report 2026 (World Inequality Lab, wid.world), which states that the poorest half of the world's adults receive about 8% of global income while the richest 10% receive about 53%. This calculator fits a statistical curve to the 8% figure, then anchors its dollar scale using world GDP (PPP) divided by the world adult population — the standard, publicly checkable proxy for aggregate global income. See \"How this is calculated\" below for the full method." },
  { q: "Is this the same as net worth percentile?", a: "No — income is what you earn in a year; net worth is what you own minus what you owe, accumulated over a lifetime. They're related but genuinely different: a retiree can have a modest income but a high net worth, while a high-earning young professional with large debts can have the opposite. Try the Net Worth Percentile Calculator for the other half of that picture." },
  { q: "Why does a modest salary rank so high globally?", a: "Global income is heavily concentrated, and most of the world's adults live in lower-income countries where typical earnings are a small fraction of wages common in high-income countries. An income that feels average or modest in a wealthy country can sit well above the global median." },
  { q: "How is my currency converted for this?", a: "Using the same fixed, approximate conversion to US dollars as the Net Worth Percentile Calculator — not a live exchange rate, and not a PPP conversion for your specific country. It's accurate enough to place your number on the right part of the global curve, not precise enough to treat as today's actual rate or as a true cost-of-living adjustment." },
  { q: "Is this calculator's estimate exact?", a: "No — and it says so deliberately. No dataset ranks every adult on Earth by income. This is a smooth statistical model calibrated to the World Inequality Report's published shares, meant to give a reasonable sense of scale, not a precise per-person rank." },
];

export default function IncomePercentilePage() {
  const { settings } = useSettings();
  const currency = settings.currency;
  const fmt = (v) => formatCurrency(v, currency);

  // Scale the default/slider range to whichever currency is active — same
  // reasoning as the net worth percentile page's own slider scaling.
  const rate = USD_CONVERSION_RATES[currency] ?? 1;
  const scale = (usd) => Math.round(usd / rate);
  // The World Inequality Report / IMF reference figures quoted in the
  // methodology copy below were originally written in USD; usdFmt converts
  // each one into the selected currency the same way the live calculator's
  // own numbers do.
  const usdFmt = (usd) => fmt(scale(usd));

  const [income, setIncome] = useState(() => scale(30000));

  const result = useMemo(
    () => calculateGlobalIncomePercentile({ income, currencyCode: currency }),
    [income, currency]
  );

  const thresholds = useMemo(() => getIncomeReferenceThresholdsUSD(), []);

  const sharedTopPercent = useShareLanding("p", { context: "income_percentile" });

  const headline =
    result.percentile === null
      ? "Enter a positive annual income"
      : result.percentile >= 99
        ? `You earn more than ${result.percentile}% of the world`
        : `You earn more than ${result.percentile}% of the world's adults`;

  return (
    <>
      <Seo
        title="Global Income Percentile Calculator: How Rich Is Your Salary?"
        description="See your global income percentile using World Inequality Report data — free income percentile calculator comparing your salary to the world's adults, any currency."
        path="/income-percentile"
        keywords="income percentile calculator, global income percentile, how rich am I compared to the world, world income percentile, global income distribution, am I in the top 1% income, salary percentile world"
        jsonLd={[
          calculatorSchema({
            name: "Global Income Percentile Calculator",
            description: "See your global income percentile using World Inequality Report data — free income percentile calculator comparing your salary to the world's adults, any currency.",
            path: "/income-percentile",
          }),
          faqSchema(
            FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))
          ),
        ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <span className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Wealth & Goals</span>
          <h1 className="font-display mt-2 text-[32px] font-extrabold leading-tight tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[40px]">
            Global Income Percentile Calculator
          </h1>
          <p className="mt-3 max-w-[56ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
            Not "how do I compare to my coworkers" — how does your income compare to every working adult on Earth?
            Enter one number and find out.
          </p>

          {/* Main Grid */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            {/* Left Panel – Input */}
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              {sharedTopPercent !== null && (
                <p className="border border-[#047857]/30 bg-[#047857]/[0.08] px-4 py-3 text-[13.5px] font-semibold text-[#047857] dark:border-[#34d399]/25 dark:bg-[#34d399]/[0.08] dark:text-[#34d399]">
                  Your friend earns more than the top {sharedTopPercent}% of the world. Where do you rank?
                </p>
              )}
              <CalcField
                label="Your annual income (before tax)"
                value={income}
                onChange={setIncome}
                min={0}
                max={scale(2000000)}
                step={Math.max(1, scale(500))}
                format={fmt}
              />
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                Your total income before tax over the last 12 months — salary, self-employment income, and any other
                regular earnings. Not your net worth: for how your savings and assets compare instead, see the{" "}
                <Link to="/net-worth-percentile" className="font-semibold underline decoration-[#111814]/25 underline-offset-4 dark:decoration-[#eef1ec]/25">
                  Net Worth Percentile Calculator
                </Link>
                .
              </p>
            </div>

            {/* Right Panel – Result */}
            <div className="space-y-6">
              <CalcResultPanel
                label={result.percentile === null ? "Global standing" : "Your global standing"}
                value={result.percentile === null ? "—" : `Top ${result.topPercent}%`}
                note={headline}
              />

              {result.percentile !== null ? (
                <div className="border border-[#047857]/25 bg-[#047857]/[0.06] p-6 dark:border-[#34d399]/20 dark:bg-[#0e1512]">
                  <p className="text-[13px] text-[#111814]/65 dark:text-[#eef1ec]/65">Where you stand</p>
                  <p className="mt-1 text-[22px] font-bold text-[#047857] dark:text-[#34d399]">
                    You're in {result.bucket}
                  </p>
                  <p className="mt-1 text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">
                    That's roughly{" "}
                    <strong className="text-[#111814] dark:text-[#eef1ec]">
                      {result.timesMedian >= 1 ? `${result.timesMedian.toFixed(1)}×` : `${(result.timesMedian * 100).toFixed(0)}%`}
                    </strong>{" "}
                    the world's estimated median adult income (≈ {fmt(MEDIAN_INCOME_USD / rate)}/year).
                  </p>
                  <p className="mt-3 text-[11px] text-[#111814]/45 dark:text-[#eef1ec]/40">
                    Data: World Inequality Report 2026 (estimate)
                  </p>
                </div>
              ) : (
                <div className="border border-amber-500/25 bg-amber-500/[0.06] p-6 dark:border-amber-400/20 dark:bg-[#0e1512]">
                  <p className="text-[13px] text-[#111814]/65 dark:text-[#eef1ec]/65">Where you stand</p>
                  <p className="mt-1 text-[22px] font-bold text-amber-800 dark:text-amber-400">Enter your income</p>
                  <p className="mt-1 text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">
                    The model needs a positive annual income figure to place you on the curve.
                  </p>
                </div>
              )}

              {result.percentile !== null && (
                <ShareResult
                  shareUrl={`${SITE_URL}/income-percentile/share?p=${result.topPercent}`}
                  shareText={`I earn more than the top ${result.topPercent}% of the world — higher-earning than ${result.percentile}% of adults. Where do you rank?`}
                  drawCard={(ctx, size) => drawIncomeShareCard(ctx, size, result)}
                  fileName="finaiw-income-percentile.png"
                  analyticsContext="income_percentile"
                />
              )}

              {/* Reference thresholds */}
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <p className="py-3.5 text-[12px] font-semibold uppercase tracking-wide text-[#111814]/60 dark:text-[#eef1ec]/50">
                  What it takes, worldwide (per year)
                </p>
                {thresholds.map((t) => (
                  <CalcStat key={t.label} label={t.label} value={fmt(t.incomeUSD / rate)} />
                ))}
              </div>

              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                <span className="font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">Disclaimer:</span>{" "}
                This is a statistical estimate calibrated to widely-cited global income research, not a precise
                per-person ranking or live dataset. See "How this is calculated" below.
              </p>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16">
            <AdSlot slotId="income_percentile_mid" />

            <CalcSection title="How Rich Is Your Salary Compared to the World? The Method Behind This Income Percentile">
              <p>
                No dataset ranks every working adult on Earth by income — nothing like that exists. This tool
                instead uses a statistical curve (a log-normal distribution, the standard model for this kind of
                right-skewed data) shaped to match the headline figures in the{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">World Inequality Report 2026</strong>: the
                poorest half of the world's adults receive about 8% of global income, while the richest 10% receive
                about 53%. The curve's dollar scale is then anchored using world GDP (PPP) — about {formatCurrency(scale(209000000000000), currency, true)},
                per the IMF's October 2025 World Economic Outlook — divided by roughly 5.6 billion adults worldwide,
                giving a mean income of about {usdFmt(37300)} a year. Fitting the curve to those figures implies a world
                median adult income of roughly {usdFmt(13900)} a year — itself an estimate, not a figure either report
                quotes directly.
              </p>
              <p>
                Global income is heavily concentrated for the same underlying reason global wealth is: a large share
                of the world's adults live in lower-income countries where typical earnings are a small fraction of
                wages common in high-income countries, while a comparatively small share of the world's adults earn
                the bulk of global income. That's why an income that feels ordinary in a wealthy country can already
                sit well above the global median.
              </p>
            </CalcSection>

            <CalcSection title="Why This Isn't What You'd Expect">
              <CalcBenefitGrid
                items={[
                  { title: "Income ≠ net worth", text: "This measures what you earn in a year — not what you own. A high earner with large debts and no savings can rank lower on wealth than a modest earner with a paid-off home. Try the Net Worth Percentile Calculator for that comparison." },
                  { title: "Global, not local", text: "Comparing to your country's average feels normal; comparing to the world is jarring, because global income is dramatically more unequal than most people intuit from their own country's distribution alone." },
                  { title: "PPP and local cost of living aren't the same", text: "This model uses a fixed currency conversion, not a true purchasing-power adjustment for your specific country — your real-world buying power can differ meaningfully from the raw dollar comparison." },
                  { title: "It's a snapshot, not a verdict", text: "Where your income ranks today says nothing about your trajectory or your total financial picture. A single global comparison is one data point, not a judgment." },
                ]}
              />
            </CalcSection>

            <RelatedLinks />

            <VerdictFAQ items={FAQ_ITEMS} className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10" />
          </div>
        </div>
      </div>
    </>
  );
}
