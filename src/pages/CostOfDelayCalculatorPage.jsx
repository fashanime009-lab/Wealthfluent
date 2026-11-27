import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { Link } from "react-router-dom";
import { assumptionsFor, defaultFor } from "@/data/calculatorDefaults";
import useDefaultableField, { useAssumptionField, useFieldBounds } from "@/hooks/useDefaultableField";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema, howToSchema } from "@/components/seo/schema";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import CalcTable from "@/components/calculators/CalcTable";
import { calcLinkClass, calcStrongClass } from "@/components/calculators/calcStyles";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

function sipFutureValue(monthly, years, annualRate) {
  const r = annualRate / 1200;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

const FAQ_ITEMS = [
  { q: "Why does a short delay cost so much?", a: "Because the years you lose are the ones compounding would have worked on the longest — money invested early doesn't just have more years, those early years are also the ones multiplying every later year's growth. Losing the first 5 years of a 30-year plan costs far more than losing any other 5-year stretch in the middle." },
  { q: "What if I invest more later to make up for the delay?", a: "You can catch up, but it costs more than the delay suggests, because the money you invest later has less time to compound. The results show the monthly amount the late start would need to reach the same final value; it's usually far more than the original amount spread over fewer years." },
  { q: "Is this realistic, or does it assume a perfectly smooth return?", a: "It assumes a constant annual return for simplicity, which real markets don't deliver — any single period can run well above or below the long-term average. The point isn't the exact figure, it's the shape of the result: delay costs disproportionately more than the length of the delay itself suggests." },
  { q: "Does the order of the delay matter — early vs late?", a: "Yes, a lot. A delay at the start of a long horizon costs far more than an identical-length pause taken near the end, because the paused money would otherwise have compounded for the full remaining period. This calculator models delaying the start, which is the worst-case version of a pause." },
  { q: "What's the actual lesson here?", a: "Starting with a smaller amount today usually beats waiting to start with a larger one — because time invested is doing more of the work than the size of any single contribution. See the Compound Interest lesson for the same point made with a worked example." },
];

export default function CostOfDelayCalculatorPage() {
  const [monthly, setMonthly] = useDefaultableField("costOfDelay", "monthly");
  const [rate, setRate] = useAssumptionField("equityReturn");
  const [horizon, setHorizon] = useDefaultableField("costOfDelay", "horizon");
  const [delay, setDelay] = useDefaultableField("costOfDelay", "delay");
  const monthlyBounds = useFieldBounds("costOfDelay", "monthly");
  const rateBounds = useFieldBounds("costOfDelay", "rate");
  const horizonBounds = useFieldBounds("costOfDelay", "horizon");
  const delayBounds = useFieldBounds("costOfDelay", "delay", { horizon });
  const { settings } = useSettings();

  const investedYears = Math.max(0, horizon - delay);
  const noDelayValue = Math.round(sipFutureValue(monthly, horizon, rate));
  const delayedValue = Math.round(sipFutureValue(monthly, investedYears, rate));
  const costOfDelay = noDelayValue - delayedValue;

  const fmt = (v) => formatCurrency(v, settings.currency);
  const { equityReturn } = assumptionsFor(settings.currency);

  // Monthly amount the delayed start needs to reach the no-delay value.
  const catchUpMonthly = investedYears > 0 ? Math.round(noDelayValue / sipFutureValue(1, investedYears, rate)) : null;

  // Worked examples from this currency's defaults and return assumption
  // (they used to be FX-converted rupees at a fixed 12%).
  const exampleMonthly = defaultFor("costOfDelay", "monthly", settings.currency);
  const exampleNoDelay = Math.round(sipFutureValue(exampleMonthly, 25, equityReturn));
  const exampleDelayed = Math.round(sipFutureValue(exampleMonthly, 20, equityReturn));
  const exampleCost = exampleNoDelay - exampleDelayed;
  const delayRows = [1, 3, 5, 10].map((d) => {
    const late = sipFutureValue(exampleMonthly, 25 - d, equityReturn);
    return [
      `${d} year${d > 1 ? "s" : ""}`,
      fmt(Math.round(late)),
      fmt(Math.round(exampleNoDelay - late)),
      `${Math.round((1 - late / exampleNoDelay) * 100)}%`,
    ];
  });

  return (
    <>
      <Seo
        title="Cost of Delay Calculator – What Waiting Costs You"
        description="See exactly what delaying your monthly investment by a few years actually costs in final value — a real figure, not just advice. Free."
        path="/cost-of-delay-calculator"
        keywords="cost of delay calculator, cost of waiting to invest calculator, delay investing calculator"
        jsonLd={[
        calculatorSchema({
          name: "Cost of Delay Calculator",
          description: "See exactly what delaying your monthly investment by a few years actually costs in final value.",
          path: "/cost-of-delay-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        howToSchema({
          name: "How to Use the Cost of Delay Calculator",
          description: "See exactly what delaying your monthly investment by a few years costs in final value.",
          steps: [
            { name: "Enter your monthly investment", text: "Enter the amount you plan to invest every month in the Monthly investment field." },
            { name: "Enter the expected return", text: "Enter the expected annual rate of return as a percentage in the Expected return field." },
            { name: "Enter the total horizon", text: "Enter the total number of years you plan to invest in the Total horizon field." },
            { name: "Enter the delay in years", text: "Enter how many years you'd delay starting in the Years you'd delay starting field." },
            { name: "View your result instantly", text: "The calculator instantly shows what the delay costs you in final value." },
          ],
        }),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Investment planning"
            title="Cost of Delay Calculator"
            description="See what waiting a few years to start investing actually costs — not just in advice."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Monthly investment" value={monthly} onChange={setMonthly} {...monthlyBounds} format={fmt} />
              <CalcField label="Expected return (p.a.) %" value={rate} onChange={setRate} {...rateBounds} suffix="%" hint="Sample value. Enter your own." />
              <CalcField label="Total horizon (Years)" value={horizon} onChange={setHorizon} {...horizonBounds} suffix=" Years" />
              <CalcField label="Years you'd delay starting" value={delay} onChange={setDelay} {...delayBounds} suffix=" Years" />
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="What the delay costs you" value={fmt(costOfDelay)} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label={`Starting now (${horizon} yrs invested)`} value={fmt(noDelayValue)} share={100} tone="signal" />
                <CalcStat label={`Starting in ${delay} yrs (${investedYears} yrs invested)`} value={fmt(delayedValue)} share={noDelayValue > 0 ? (delayedValue / noDelayValue) * 100 : 0} />
                <CalcStat
                  label="Monthly amount the late start needs to catch up"
                  value={catchUpMonthly === null ? "—" : fmt(catchUpMonthly)}
                />
              </div>
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                Illustrative only — both paths invest the same monthly amount at the same assumed return; only the
                start date differs, and the end date is fixed.
              </p>
            </div>
          </div>

          <div className="mt-16">

            <CalcSection title="What does this calculator show?">
              <p>
                Everyone's heard "start investing now, not later" as advice. This calculator turns it into a
                number: the same monthly amount, the same assumed return, and the same end date — the only
                difference between the two paths is how many years late the second one starts.
              </p>
              <p>
                Because the money that's invested, instead of delayed, compounds for longer, the final values
                aren't just "a bit different" — the gap grows faster than the length of the delay itself would
                suggest.
              </p>
            </CalcSection>

            <CalcSection title="How is the cost of delay calculated?">
              <p>Both paths use the same future-value-of-a-SIP formula, just over different lengths of time:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                Cost of delay = FV(monthly, full horizon) − FV(monthly, horizon − delay)
              </p>
              <p>
                {fmt(exampleMonthly)} a month at {equityReturn}% for 25 years reaches about {fmt(exampleNoDelay)}. Delay the start by 5 years — so the
                same {fmt(exampleMonthly)} a month is invested for only 20 years, reaching the same end date — and the total
                drops to about {fmt(exampleDelayed)}. The 5-year delay costs roughly {fmt(exampleCost)}, which is more than the
                entire amount that would have been invested over those 5 years ({fmt(exampleMonthly * 60)}) many times over — almost
                all of that cost is lost compounding time, not lost contributions.
              </p>
            </CalcSection>

            <CalcSection title="What each year of waiting costs">
              <CalcTable
                caption={`${fmt(exampleMonthly)} a month at ${equityReturn}%, all paths ending in the same year (25 years from now)`}
                columns={["Delay", "Final value", "Cost of the delay", "Share lost"]}
                rows={delayRows}
              />
              <p>
                The losses grow faster than the delay. The years you skip are the ones that would have compounded
                the longest, so a short wait at the start costs far more than the same pause near the end.
              </p>
            </CalcSection>

            <CalcSection title="When waiting is the right call">
              <p>
                Delay isn't always a mistake. Two things usually come first: <strong className={calcStrongClass}>clearing
                expensive debt</strong>, since a credit card at 30–40% costs more than investing is likely to earn, and{" "}
                <strong className={calcStrongClass}>building an emergency fund</strong>, so a surprise bill doesn't force
                you to sell investments at a bad time. The{" "}
                <Link to="/verdict/debt-vs-invest" className={calcLinkClass}>
                  Debt vs Invest verdict
                </Link>{" "}
                and the{" "}
                <Link to="/emergency-fund-calculator" className={calcLinkClass}>
                  Emergency Fund Calculator
                </Link>{" "}
                help with both.
              </p>
              <p>
                Otherwise, start with whatever you can, even a small amount, and raise it each year. The{" "}
                <Link to="/step-up-sip-calculator" className={calcLinkClass}>
                  Step-Up SIP Calculator
                </Link>{" "}
                shows how a small SIP that grows with your income compares with waiting to start big, and{" "}
                <Link to="/blog/how-much-to-save-for-retirement-by-age" className={calcLinkClass}>
                  how much to save for retirement by age
                </Link>{" "}
                shows what each five years of waiting adds to the monthly amount you need.
              </p>
            </CalcSection>

            <CalcSection title="Why this is worth knowing">
              <CalcBenefitGrid
                items={[
                  { title: "Makes procrastination concrete", text: "'I'll start next year' is easy to say; seeing the actual cost of that one year is harder to brush off." },
                  { title: "Shows why small amounts now beat bigger amounts later", text: "A modest SIP started today often outgrows a larger one started a few years from now, because time compounds every unit invested, not just the newest ones." },
                  { title: "Useful for a real decision, not just motivation", text: "Weighing a genuine reason to delay — clearing debt first, building an emergency fund — against a real number, rather than a vague sense that 'later is fine.'" },
                  { title: "Works the other way too", text: "The same math shows what starting a few years early, instead of on schedule, is worth — useful when deciding whether to redirect a bonus into investing sooner." },
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
