import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import useExampleCurrency from "@/hooks/useExampleCurrency";
import useDefaultableField, { useAssumptionField, useFieldBounds } from "@/hooks/useDefaultableField";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema, howToSchema } from "@/components/seo/schema";
import AdSlot from "../components/ads/AdSlot";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const linkClass =
  "font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25";

// Shared by the worked examples in the body copy below, mirroring the live
// calculator's own monthly-compounding formula (and a matching SIP future-
// value formula for the comparison section) so the figures render in
// whichever currency formatCurrency() is given.
const lumpFVOf = (p, annualReturn, years) => Math.round(p * Math.pow(1 + annualReturn / 12 / 100, years * 12));
const sipFVOf = (monthly, annualReturn, years) => {
  const r = annualReturn / 12 / 100;
  const n = years * 12;
  return Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
};

const FAQ_ITEMS = [
  { q: "What is a lumpsum investment?", a: "A lumpsum investment is a single, one-time investment of a large amount — a bonus, maturity proceeds, or savings — rather than smaller amounts invested regularly. The whole amount starts compounding from day one." },
  { q: "Is lumpsum better than SIP?", a: "If the money is already available, a steady-return calculation always favours investing it all at once, since every unit starts earning sooner. A SIP's real advantage isn't a higher return — it's spreading your entry points so you're not investing everything right before a downturn, which a fixed-return calculator like this one can't show." },
  { q: "How is compounding frequency assumed here?", a: "Monthly, to match the convention used by this site's SIP Calculator — so a lumpsum and a SIP result are directly comparable on the same assumption. Some calculators assume annual compounding instead, which gives a slightly different number for the same inputs; always check which convention you're comparing against." },
  { q: "Is lumpsum investment taxed differently from SIP?", a: "No — a lumpsum investment in mutual funds is taxed the same way as SIP units: as capital gains, short or long-term depending on the holding period, not as income. The tax treatment doesn't change based on whether you invested all at once or in installments." },
  { q: "What's a realistic return rate to assume?", a: "That depends entirely on where the lumpsum goes — equity, debt, or a mix. There's no single 'correct' rate; run the calculator at a conservative and an optimistic rate to see the range, rather than trusting one number." },
];

export default function LumpsumCalculatorPage() {
  const [lumpsum, setLumpsum] = useDefaultableField("lumpsum", "principal");
  const [annualReturn, setAnnualReturn] = useAssumptionField("equityReturn");
  const [years, setYears] = useDefaultableField("lumpsum", "years");
  const principalBounds = useFieldBounds("lumpsum", "principal");
  const annualReturnBounds = useFieldBounds("lumpsum", "annualReturn");
  const yearsBounds = useFieldBounds("lumpsum", "years");
  const { settings } = useSettings();

  const result = useMemo(() => {
    const r = annualReturn / 12 / 100;
    const n = years * 12;
    const futureValue = lumpsum * Math.pow(1 + r, n);
    return {
      futureValue: Math.round(futureValue),
      returns: Math.round(futureValue - lumpsum),
    };
  }, [lumpsum, annualReturn, years]);

  const fmt = (v) => formatCurrency(v, settings.currency);
  const { inr } = useExampleCurrency();

  const examplePrincipal = inr(100000);
  const example1FV = lumpFVOf(examplePrincipal, 12, 10);
  const exampleLumpPrincipal = inr(600000);
  const lumpExample = lumpFVOf(exampleLumpPrincipal, 12, 5);
  const exampleSipMonthly = inr(10000);
  const sipExample = sipFVOf(exampleSipMonthly, 12, 5);

  return (
    <>
      <Seo
        title="Lumpsum Calculator – What a One-Time Investment Grows To"
        description="Calculate the maturity value of a one-time (lumpsum) mutual fund investment. Free, no signup — see future value and total returns instantly."
        path="/lumpsum-calculator"
        keywords="lumpsum calculator, lumpsum investment calculator, mutual fund lumpsum calculator, one time investment calculator"
        jsonLd={[
        calculatorSchema({
          name: "Lumpsum Calculator",
          description: "Calculate the maturity value of a one-time (lumpsum) mutual fund investment.",
          path: "/lumpsum-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        howToSchema({
          name: "How to Use the Lumpsum Calculator",
          description: "Calculate the future value of a one-time mutual fund investment, compounded monthly.",
          steps: [
            { name: "Enter your lumpsum amount", text: "Enter the one-time amount you're investing in the Lumpsum amount field." },
            { name: "Enter the expected rate of return", text: "Enter your expected annual rate of return as a percentage in the Expected Rate of Return field." },
            { name: "Enter the investment duration", text: "Enter how many years the investment will grow in the Investment Duration field." },
            { name: "View your result instantly", text: "The calculator instantly shows the future value of your investment." },
          ],
        }),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Investment planning"
            title="Lumpsum Calculator"
            description="Find the future value of a one-time investment, compounded monthly."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Lumpsum amount" value={lumpsum} onChange={setLumpsum} {...principalBounds} format={fmt} />
              <CalcField label="Expected Rate of Return (p.a.) %" value={annualReturn} onChange={setAnnualReturn} {...annualReturnBounds} suffix="%" hint="Sample value. Enter your own." />
              <CalcField label="Investment Duration (In Years)" value={years} onChange={setYears} {...yearsBounds} suffix=" Years" />
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Future value of your investment" value={fmt(result.futureValue)} />

              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Your Investment" value={fmt(lumpsum)} share={(lumpsum / result.futureValue) * 100} tone="signal" />
                <div className="py-3.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">Estimated Returns</span>
                    <span
                      className={`font-mono-tech text-[15px] tabular-nums ${
                        result.returns >= 0 ? "text-[#047857] dark:text-[#34d399]" : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {result.returns >= 0 ? "+" : "-"}
                      {fmt(Math.abs(result.returns))}
                    </span>
                  </div>
                  <div className="mt-2 h-[3px] rounded-full bg-[#111814]/10 dark:bg-[#eef1ec]/12">
                    <div
                      className={`h-full rounded-full opacity-70 dark:opacity-80 ${
                        result.returns >= 0 ? "bg-[#047857] dark:bg-[#34d399]" : "bg-red-600 dark:bg-red-400"
                      }`}
                      style={{ width: `${Math.min(Math.abs((result.returns / lumpsum) * 100), 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                Illustrative only — assumes a smooth, constant monthly-compounding return for the full period. Real
                fund returns vary from year to year and can be negative.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <AdSlot slotId="lumpsum_calc_mid" />

            <CalcSection title="What is a lumpsum investment?">
              <p>
                A lumpsum investment puts a single, large amount into a mutual fund in one go — a bonus, maturity
                proceeds from another investment, or savings you've already built up — instead of spreading it
                across smaller monthly installments. The entire amount starts compounding immediately.
              </p>
              <p>
                This calculator answers the question a lumpsum decision actually needs answered: given an amount,
                an expected return, and a time horizon, what does it grow to?
              </p>
            </CalcSection>

            <CalcSection title="How is lumpsum future value calculated?">
              <p>With monthly compounding, the formula is:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                FV = P × (1 + r)^n
              </p>
              <p>
                Here <strong className="text-[#111814] dark:text-[#eef1ec]">P</strong> is the lumpsum amount,{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">r</strong> is the monthly rate of return (the
                annual rate divided by 12, then by 100), and{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">n</strong> is the number of months (years ×
                12).
              </p>
              <p>
                For {fmt(examplePrincipal)} invested at 12% for 10 years: r = 12 ÷ 12 ÷ 100 = 0.01, n = 120 months, so
                (1.01)^120 ≈ 3.30039 — multiplying by {fmt(examplePrincipal)} gives about {fmt(example1FV)}, the same figure the
                calculator above produces for those defaults.
              </p>
              <p>
                This calculator compounds monthly to match the convention used by the{" "}
                <Link to="/sip-calculator" className={linkClass}>
                  SIP Calculator
                </Link>{" "}
                on this site, so the two are directly comparable on the same assumption — some calculators elsewhere
                assume annual compounding instead, which gives a slightly different number for identical inputs.
              </p>
            </CalcSection>

            <CalcSection title="Lumpsum vs SIP — which is better?">
              <p>
                With a steady, assumed return, a lumpsum always wins on paper — every unit starts earning sooner
                than it would in a SIP's spread-out installments. Investing {fmt(exampleLumpPrincipal)} as a lumpsum for 5 years at
                12% grows to about {fmt(lumpExample)}; the same amount as a {fmt(exampleSipMonthly)} monthly SIP over those 5 years grows to
                about {fmt(sipExample)}, because most of the money hasn't started earning yet in the early months.
              </p>
              <p>
                But that gap is a property of assuming a smooth, constant return — real markets fall as well as
                rise, and a lumpsum invested right before a downturn has no averaging to soften the hit. A SIP's
                real advantage isn't a higher expected return; it's spreading entry points across highs and lows.
              </p>
              <p>
                For the full comparison, including the middle path of investing part now and staggering the rest,
                read the{" "}
                <Link to="/learn/sip-vs-lump-sum" className={linkClass}>
                  SIP vs Lump Sum
                </Link>{" "}
                lesson.
              </p>
            </CalcSection>

            <CalcSection title="When a lumpsum makes sense">
              <CalcBenefitGrid
                items={[
                  { title: "Already have the money", text: "A bonus, inheritance, or maturity payout — money that exists today, rather than income you're yet to earn, is the natural case for a lumpsum." },
                  { title: "Longer time to compound", text: "The full amount starts earning from day one, instead of each installment compounding for a progressively shorter period." },
                  { title: "Fewer ongoing decisions", text: "One decision, made once — no recurring mandate to manage or keep funded every month." },
                  { title: "Best paired with a plan", text: "A lumpsum into a volatile asset class right before a downturn has no averaging to fall back on — splitting a very large amount across a few months is a common middle ground." },
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
