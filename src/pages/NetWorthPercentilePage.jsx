import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { USD_CONVERSION_RATES, MEDIAN_DISPLAY_USD } from "../services/calculators/globalWealthPercentile";
import NetWorthPercentileCalculator from "@/components/calculators/NetWorthPercentileCalculator";
import CalcSection from "@/components/calculators/CalcSection";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";
import useShareLanding from "@/hooks/useShareLanding";

function buildFaqItems(usdFmt) {
  // The quoted median comes from the model (MEDIAN_DISPLAY_USD), the same
  // value the calculator's result card shows, so the two can't drift apart.
  const median = usdFmt(MEDIAN_DISPLAY_USD);
  return [
    { q: `Where do the ${median} median and ${usdFmt(1000000)} top-1% figures come from?`, a: `Both come from the UBS Global Wealth Report 2026, the most current major global wealth-distribution study. It states that just over 41% of the world's adults held under ${usdFmt(10000)} in net worth in 2025 — fitting a statistical curve to that (41% below ${usdFmt(10000)}) and the world's ~57.5 million-strong dollar-millionaire population (almost exactly 1% of all adults) implies a global median net worth of roughly ${median}, with about ${usdFmt(1000000)} still marking the entry point to the wealthiest 1%. Everything in between is estimated from that same curve — not a precise, per-person ranking, since no dataset like that exists.` },
    { q: "Why does so little net worth put me ahead of half the world?", a: `Global wealth is heavily concentrated — a large share of the world's adults have little to no savings or own no property, especially outside high-income countries, while a relatively small share holds a large share of total wealth. Someone with ${median} in net worth — a modest used car and some savings, say — is already at the world median, which surprises a lot of people in wealthier countries.` },
    { q: "My net worth is negative — what does that mean here?", a: "It means your debts exceed your assets, which this model can't place on the curve (it's mathematically undefined at zero and below). It's also extremely common early in life or career in wealthy countries — student loans, a new mortgage — and says more about life stage and country than lifetime financial trajectory." },
    { q: "Is this the same as income percentile?", a: "No — this measures net worth (what you own minus what you owe), not annual income. The two are related but genuinely different: a retiree with a paid-off home and modest income can rank far higher on wealth than a high-earning 25-year-old who hasn't had time to accumulate assets yet." },
    { q: "How is my currency converted for this?", a: "Using a fixed, approximate conversion between currencies (since the reference data is USD-denominated) — not a live exchange rate. It's accurate enough to place your number on the right part of the global curve, not precise enough to treat as today's actual rate." },
    { q: "Is this calculator based on the UBS Global Wealth Report?", a: `Yes. The UBS Global Wealth Report 2026 is the source for both reference points this calculator is calibrated against: that just over 41% of the world's adults held under ${usdFmt(10000)} in net worth in 2025, and that the world's roughly 57.5 million dollar-millionaires make up almost exactly 1% of all adults. Every percentile in between is a statistical estimate fitted to those two UBS figures, not a number UBS itself publishes.` },
    { q: "What net worth do I need to be in the global top 1%?", a: `Roughly ${usdFmt(1000000)} in net worth — assets minus debts — puts you at the entry point of the world's wealthiest 1% of adults, based on the UBS Global Wealth Report's count of roughly 57.5 million dollar-millionaires worldwide. That threshold is far lower than what's needed to rank in the top 1% within a wealthy country, because the comparison here is against every adult on Earth, most of whom live in lower-income countries.` },
    { q: "Can I see my net worth percentile by age?", a: "This calculator ranks you against every adult in the world, whatever their age. Wealth usually builds with age, so someone in their 20s will rank lower than someone in their 50s with the same habits, and that is normal. For typical figures at each age, see FINAIW's Net worth by age guide, which uses the US Federal Reserve's 2025 survey, along with UK and global data." },
    { q: "How does this compare to a global rich list?", a: `A rich list (like the various billionaire rankings) only names a few thousand people at the extreme top. This calculator instead estimates where an ordinary net worth — ${median}, ${usdFmt(100000)}, ${usdFmt(500000)} — falls among all ~5.5 billion adults worldwide, which is a far more useful comparison for most people than a billionaire list.` },
  ];
}

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
  // The UBS reference figures quoted in the FAQ and methodology copy below
  // were originally written in USD; usdFmt converts each one into the
  // selected currency the same way the live calculator's own numbers do.
  const usdFmt = (usd) => fmt(scale(usd));
  const FAQ_ITEMS = buildFaqItems(usdFmt);

  // A visitor arriving via a shared link (?p=<top-percent>) sees a banner
  // instead of the blank default input. Fires a consent-gated
  // share_landing GA4 event once.
  const sharedTopPercent = useShareLanding("p", { context: "net_worth_percentile" });

  return (
    <>
      <Seo
        title="Net Worth Percentile Calculator: Your Global Wealth Rank"
        description="What wealth percentile am I in? Compare your net worth with every adult worldwide using UBS Global Wealth Report 2026 data. Free, any currency, no signup."
        path="/net-worth-percentile"
        keywords="net worth percentile calculator, global wealth percentile, how rich am I compared to the world, world net worth percentile, UBS global wealth report calculator, net worth needed to be top 1% in the world, global rich list, am I in the top 1% net worth"
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

          <div className="mt-10">
            <NetWorthPercentileCalculator sharedTopPercent={sharedTopPercent} />
          </div>

          {/* SEO Content */}
          <div className="mt-16">

            <CalcSection title="How Rich Am I Compared to the World? The Method Behind This World Net Worth Percentile">
              <p>
                No dataset ranks every adult on Earth by net worth — nothing like that exists. This tool instead
                uses a statistical curve (a log-normal distribution, the standard model for this kind of
                right-skewed data) calibrated against two figures from the{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">UBS Global Wealth Report 2026</strong>: just
                over 41% of the world's adults held under {usdFmt(10000)} in net worth in 2025, and the world's roughly 57.5
                million dollar-millionaires are almost exactly 1% of all adults, keeping {usdFmt(1000000)} as the entry
                point to the world's wealthiest 1%. Fitting a curve to those two points implies a worldwide median
                adult net worth of roughly {usdFmt(MEDIAN_DISPLAY_USD)} — itself an estimate, not a UBS-quoted figure.
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
