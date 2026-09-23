import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import {
  calculateGlobalWealthPercentile,
  getReferenceThresholdsUSD,
  USD_CONVERSION_RATES,
} from "../services/calculators/globalWealthPercentile";
import AdSlot from "../components/ads/AdSlot";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "Where do the $8,500 median and $1,000,000 top-1% figures come from?", a: "They're the two most widely-cited reference points from global wealth-distribution research (the kind of figures repeated across financial media for years, drawing on data like the UBS/Credit Suisse Global Wealth Report): worldwide median adult net worth is roughly $8,500, and roughly $1,000,000 in net worth places someone in the wealthiest 1% of the world's adults. Everything in between is estimated from a statistical curve fit to those two points — not a precise, per-person ranking, since no dataset like that exists." },
  { q: "Why does so little net worth put me ahead of half the world?", a: "Global wealth is heavily concentrated — a large share of the world's adults have little to no savings or own no property, especially outside high-income countries, while a relatively small share holds a large share of total wealth. Someone with $8,500 in net worth — a single paid-off used car, say — is already at the world median, which surprises a lot of people in wealthier countries." },
  { q: "My net worth is negative — what does that mean here?", a: "It means your debts exceed your assets, which this model can't place on the curve (it's mathematically undefined at zero and below). It's also extremely common early in life or career in wealthy countries — student loans, a new mortgage — and says more about life stage and country than lifetime financial trajectory." },
  { q: "Is this the same as income percentile?", a: "No — this measures net worth (what you own minus what you owe), not annual income. The two are related but genuinely different: a retiree with a paid-off home and modest income can rank far higher on wealth than a high-earning 25-year-old who hasn't had time to accumulate assets yet." },
  { q: "How is my currency converted for this?", a: "Using a fixed, approximate conversion to US dollars (since the reference data is USD-denominated) — not a live exchange rate. It's accurate enough to place your number on the right part of the global curve, not precise enough to treat as today's actual rate." },
];

export default function NetWorthPercentilePage() {
  const { settings } = useSettings();
  const currency = settings.currency;
  const fmt = (v) => formatCurrency(v, currency);

  // Scale the default/slider range to whichever currency is active — a
  // slider hardcoded in raw numbers looks absurd in JPY (millions) or
  // wrong in INR (lakhs), and this page's whole point is a fair
  // comparison, so getting the input's scale right matters more here
  // than on a typical single-currency calculator.
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
    <>
      <Seo
        title="Global Net Worth Percentile Calculator – FINAIW"
        description="See exactly how your net worth compares to the rest of the world's adults — free global wealth percentile calculator, any currency, no signup."
        path="/net-worth-percentile"
        keywords="net worth percentile calculator, global wealth percentile, how rich am I compared to the world, am I in the top 1% net worth, global wealth calculator, net worth rank"
        jsonLd={[
          calculatorSchema({
            name: "Global Net Worth Percentile Calculator",
            description: "See exactly how your net worth compares to the rest of the world's adults — free global wealth percentile calculator, any currency, no signup.",
            path: "/net-worth-percentile",
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
            Global Net Worth Percentile Calculator
          </h1>
          <p className="mt-3 max-w-[56ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
            Not "how do I compare to my neighbors" — how does your net worth compare to every adult on Earth?
            Enter one number and find out.
          </p>

          {/* Main Grid */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            {/* Left Panel – Input */}
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
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
                Everything you own (savings, investments, property, vehicles at resale value) minus everything you
                owe (loans, credit card balances, mortgages). Not sure? The{" "}
                <Link to="/networth-calculator" className="font-semibold underline decoration-[#111814]/25 underline-offset-4 dark:decoration-[#eef1ec]/25">
                  Net Worth Calculator
                </Link>{" "}
                works it out for you.
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
                    the world's median adult net worth (≈ {fmt(8500 / rate)}).
                  </p>
                </div>
              ) : (
                <div className="border border-amber-500/25 bg-amber-500/[0.06] p-6 dark:border-amber-400/20 dark:bg-[#0e1512]">
                  <p className="text-[13px] text-[#111814]/65 dark:text-[#eef1ec]/65">Where you stand</p>
                  <p className="mt-1 text-[22px] font-bold text-amber-800 dark:text-amber-400">Debts exceed assets</p>
                  <p className="mt-1 text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">
                    Extremely common early in life or career — this says more about life stage than trajectory. See
                    the FAQ below.
                  </p>
                </div>
              )}

              {/* Reference thresholds */}
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <p className="py-3.5 text-[12px] font-semibold uppercase tracking-wide text-[#111814]/60 dark:text-[#eef1ec]/50">
                  What it takes, worldwide
                </p>
                {thresholds.map((t) => (
                  <CalcStat key={t.label} label={t.label} value={fmt(t.netWorthUSD / rate)} />
                ))}
              </div>

              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                <span className="font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">Disclaimer:</span>{" "}
                This is a statistical estimate calibrated to widely-cited global wealth research, not a precise
                per-person ranking or live dataset. See "How this is calculated" below.
              </p>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16">
            <AdSlot slotId="networth_percentile_mid" />

            <CalcSection title="How This Is Calculated">
              <p>
                No dataset ranks every adult on Earth by net worth — nothing like that exists. This tool instead
                uses a statistical curve (a log-normal distribution, the standard model for this kind of
                right-skewed data) calibrated against the two most widely-cited reference points from global
                wealth-distribution research: a worldwide median adult net worth around $8,500, and roughly
                $1,000,000 marking the entry point to the world's wealthiest 1%.
              </p>
              <p>
                Global wealth is heavily concentrated — a large share of adults worldwide have little to no net
                savings or property, especially outside high-income countries, while a comparatively small share
                holds a large share of total wealth. That's why the curve is steep near the bottom and stretches a
                long way at the top: modest savings by rich-country standards can already be above the world
                median, while true top-percentile wealth requires several orders of magnitude more.
              </p>
            </CalcSection>

            <CalcSection title="Why This Isn't What You'd Expect">
              <CalcBenefitGrid
                items={[
                  { title: "Net worth ≠ income", text: "This measures what you own minus what you owe — not your salary. A retiree with a paid-off home and modest income can rank far higher than a high earner who hasn't had time to accumulate assets yet." },
                  { title: "Global, not local", text: "Comparing to your country's average feels normal; comparing to the world is jarring, because global wealth is dramatically more unequal than most people intuit from their own country's distribution alone." },
                  { title: "Life stage matters enormously", text: "A 24-year-old with student debt and a 55-year-old nearing retirement occupy very different points on this curve for reasons that have little to do with financial skill — age and career stage explain a lot of the gap." },
                  { title: "It's a snapshot, not a verdict", text: "Where you rank today says nothing about your trajectory. The number that matters for your own planning is the trend over years, not a single global comparison." },
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
