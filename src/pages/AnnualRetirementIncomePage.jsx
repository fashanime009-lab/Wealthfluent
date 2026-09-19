import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { useState, useMemo } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
import AdSlot from "../components/ads/AdSlot";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";
import useTilt from "@/hooks/useTilt";

const FAQ_ITEMS = [
  { q: "What is a realistic pre-retirement growth rate?", a: "Expected long-term investment returns vary depending on your portfolio, asset allocation, and market conditions. Stocks have historically delivered higher long-term returns than bonds or cash, but they also involve greater risk. Choose assumptions that match your investment strategy. Choose based on your asset allocation." },
  { q: "What should I enter for \"Years to Pay Out\"?", a: "Estimate your life expectancy minus your retirement age. A common approach is to plan for 25-30 years post-retirement." },
  { q: "Can I withdraw more than the calculated amount?", a: "Withdrawing more may deplete your corpus sooner. The calculator provides a sustainable annual income assuming the corpus earns the given rate and lasts the specified years. Adjust the parameters to see different scenarios." },
  { q: "Does this account for inflation during retirement?", a: "Not directly — the annual income figure is level (the same amount each year) rather than rising with inflation. In practice, expenses tend to rise over a 25-30 year retirement, so treat this figure as a starting point and build in some buffer or a rising withdrawal schedule." },
];

export default function AnnualRetirementIncomePage() {
  const { ref: corpusRef, style: corpusStyle, onPointerMove: onCorpusMove, onPointerLeave: onCorpusLeave } = useTilt();
  // ─── State ──────────────────────────────────────────────────────
  const [currentPrincipal, setCurrentPrincipal] = useState(100000);
  const [annualAddition, setAnnualAddition] = useState(12000);
  const [yearsToGrow, setYearsToGrow] = useState(20);
  const [preRetGrowthRate, setPreRetGrowthRate] = useState(12);
  const [yearsToPayOut, setYearsToPayOut] = useState(25);
  const [postRetGrowthRate, setPostRetGrowthRate] = useState(8);
  const { settings } = useSettings();

  // ─── Calculations ──────────────────────────────────────────────
  const results = useMemo(() => {
    const r1 = preRetGrowthRate / 100;
    const r2 = postRetGrowthRate / 100;
    const n1 = yearsToGrow;
    const n2 = yearsToPayOut;

    // Pre-retirement accumulation
    // Future value of current principal
    const fvPrincipal = currentPrincipal * Math.pow(1 + r1, n1);

    // Future value of annual additions (ordinary annuity)
    let fvAdditions = 0;
    if (annualAddition > 0) {
      if (r1 === 0) {
        fvAdditions = annualAddition * n1;
      } else {
        fvAdditions = annualAddition * ((Math.pow(1 + r1, n1) - 1) / r1);
      }
    }

    const corpusAtRetirement = fvPrincipal + fvAdditions;

    // Post-retirement payout: compute annual income (annuity)
    let annualIncome = 0;
    if (n2 > 0 && corpusAtRetirement > 0) {
      if (r2 === 0) {
        annualIncome = corpusAtRetirement / n2;
      } else {
        // PMT = PV * r / (1 - (1+r)^-n)
        annualIncome = corpusAtRetirement * r2 / (1 - Math.pow(1 + r2, -n2));
      }
    }

    return {
      corpusAtRetirement: Math.round(corpusAtRetirement),
      annualIncome: Math.round(annualIncome),
      totalInvested: currentPrincipal + annualAddition * n1,
    };
  }, [currentPrincipal, annualAddition, yearsToGrow, preRetGrowthRate, yearsToPayOut, postRetGrowthRate]);

  // Shared, currency-aware formatter (lakh/crore grouping for INR, each
  // currency's own convention otherwise) — this page used to hardcode
  // en-US grouping with just the symbol, unlike the rest of the site.
  const fmt = (v) => formatCurrency(v, settings.currency);

  return (
    <>
      <Seo
        title="Annual Retirement Income Calculator – Plan Your Retirement"
        description="Calculate your retirement corpus and annual retirement income based on your pre-retirement savings and post-retirement payout period."
        path="/annual-retirement-income"
        keywords="retirement income calculator, annual retirement income, retirement planning, corpus calculator"
        jsonLd={[
        calculatorSchema({
          name: "Annual Retirement Income Calculator",
          description: "Calculate your retirement corpus and annual retirement income based on your pre-retirement savings and post-retirement payout period.",
          path: "/annual-retirement-income",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Retirement planning"
            title="Annual Retirement Income Calculator"
            description="Estimate your retirement corpus and the annual income you can expect during retirement."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-8 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <div className="space-y-7 border-b border-[#111814]/10 pb-8 dark:border-[#eef1ec]/10">
                <p className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Pre-retirement</p>
                <CalcField label="Current principal" value={currentPrincipal} onChange={setCurrentPrincipal} min={0} max={10000000} step={1000} format={fmt} />
                <CalcField label="Annual addition" value={annualAddition} onChange={setAnnualAddition} min={0} max={1000000} step={500} format={fmt} />
                <CalcField label="Years to grow" value={yearsToGrow} onChange={setYearsToGrow} min={1} max={50} suffix=" yrs" />
                <CalcField label="Growth rate" value={preRetGrowthRate} onChange={setPreRetGrowthRate} min={0} max={30} step={0.5} suffix="%" />
              </div>

              <div className="space-y-7">
                <p className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">In retirement</p>
                <CalcField label="Years to pay out" value={yearsToPayOut} onChange={setYearsToPayOut} min={1} max={50} suffix=" yrs" />
                <CalcField label="Growth rate" value={postRetGrowthRate} onChange={setPostRetGrowthRate} min={0} max={15} step={0.5} suffix="%" />
              </div>
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Annual retirement income" value={fmt(results.annualIncome)} />
              <div
                ref={corpusRef}
                onPointerMove={onCorpusMove}
                onPointerLeave={onCorpusLeave}
                style={corpusStyle}
                className="rounded-lg bg-[#0e1512] p-6 sm:p-7"
              >
                <p className="text-[13px] text-[#eef1ec]/55">Corpus at retirement</p>
                <p className="font-mono-tech mt-1 text-[26px] font-medium leading-none tabular-nums text-[#eef1ec] sm:text-[30px]">
                  {fmt(results.corpusAtRetirement)}
                </p>
              </div>
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Total invested (pre-retirement)" value={fmt(results.totalInvested)} />
                <CalcStat label="Pre-retirement growth rate" value={`${preRetGrowthRate}%`} />
                <CalcStat label="Years to grow" value={`${yearsToGrow} yrs`} />
                <CalcStat label="Post-retirement growth rate" value={`${postRetGrowthRate}%`} />
                <CalcStat label="Payout period" value={`${yearsToPayOut} yrs`} />
              </div>
              <p className="text-[12px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
                Please note that these calculators are for illustrations only and do not represent actual returns.
                Investment returns are not guaranteed. Actual retirement income depends on investment performance,
                inflation, taxes, fees, and future market conditions.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <AdSlot slotId="arincome_calc_mid" />

            <CalcSection title="What is an annual retirement income calculator?">
              <p>
                This calculator helps you estimate how much annual income you can expect during retirement based on
                your current savings, regular contributions, and expected returns. It projects your corpus at
                retirement and then calculates a sustainable annual withdrawal over your retirement years.
              </p>
            </CalcSection>

            <CalcSection title="How is this calculated?">
              <p>
                The calculation runs in two stages. First, your pre-retirement corpus grows using compound growth
                on your current principal plus the future value of your annual additions. Second, that corpus is
                treated as a fixed pool earning the post-retirement growth rate, and the calculator solves for the
                level annual withdrawal that exactly exhausts it after your chosen payout period — similar to how a
                loan amortizes, just running in reverse from a lump sum down to zero instead of from zero up to a
                payoff.
              </p>
              <p>
                This means your post-retirement growth rate assumption matters enormously: a corpus that keeps
                earning even a modest return during retirement can sustain meaningfully higher withdrawals than one
                assumed to sit in cash, since the remaining balance keeps growing between withdrawals rather than
                only shrinking.
              </p>
            </CalcSection>

            <CalcSection title="How to use this calculator">
              <ol className="list-decimal space-y-2 pl-5">
                <li>Enter your current principal (savings earmarked for retirement).</li>
                <li>Enter your annual addition (how much you'll add each year until retirement).</li>
                <li>Set the years to grow (remaining working years).</li>
                <li>Choose a pre-retirement growth rate (expected return on investments).</li>
                <li>Specify the years to pay out (your expected retirement duration).</li>
                <li>Choose a post-retirement growth rate (return on remaining corpus).</li>
                <li>The calculator will show your annual retirement income and corpus.</li>
              </ol>
            </CalcSection>

            <CalcSection title="Understanding the results">
              <CalcBenefitGrid
                items={[
                  { title: "Corpus at retirement", text: "This is the total amount you'll have saved by the time you retire, considering your current savings, annual additions, and investment growth." },
                  { title: "Annual retirement income", text: "This is the amount you can withdraw each year during retirement, assuming the remaining corpus continues to earn the post-retirement growth rate." },
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
