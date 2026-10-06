import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
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

const linkClass =
  "font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25";

const FAQ_ITEMS = [
  { q: "What is a step-up SIP?", a: "A step-up (or top-up) SIP increases your monthly investment by a fixed percentage every year, instead of keeping it flat for the whole duration — usually timed to a yearly salary increment." },
  { q: "How much difference does stepping up actually make?", a: "A large one. At the defaults on this page — ₹5,000/month, 12% return, 15 years — a flat SIP invests ₹9,00,000 in total and grows to about ₹25,22,880. The same starting amount with a 10% annual step-up invests roughly ₹19,06,349 and grows to about ₹43,41,925 — more than double, because later (larger) installments arrive while the corpus is already big, so their added contribution compounds alongside it." },
  { q: "What step-up percentage should I use?", a: "A common starting point is matching your expected annual salary increment — often 8-12% in many careers — so the step-up tracks your actual rising capacity to invest rather than becoming a stretch." },
  { q: "Does the calculator assume the step-up happens every year without fail?", a: "Yes — it assumes the increase is applied consistently, every 12 months, for the full duration. In practice, missing a step-up in a lean year and resuming the next is a minor change against the overall arithmetic, not something that needs its own calculation." },
  { q: "How is this different from a flat SIP calculator?", a: "A flat SIP keeps the monthly amount constant for the entire period. This one recalculates the monthly amount at the start of every year — year 1 at your starting amount, year 2 at that amount plus your step-up percentage, and so on — then compounds each year's installments for whatever time remains." },
];

export default function StepUpSIPCalculatorPage() {
  const [initialSip, setInitialSip] = useState(5000);
  const [stepUpPercent, setStepUpPercent] = useState(10);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(15);
  const { settings } = useSettings();

  const result = useMemo(() => {
    const r = annualReturn / 12 / 100;
    const totalMonths = years * 12;
    let balance = 0;
    let invested = 0;
    let finalMonthlySip = initialSip;
    for (let m = 0; m < totalMonths; m++) {
      const yearIndex = Math.floor(m / 12);
      const sipThisMonth = initialSip * Math.pow(1 + stepUpPercent / 100, yearIndex);
      balance = (balance + sipThisMonth) * (1 + r);
      invested += sipThisMonth;
      finalMonthlySip = sipThisMonth;
    }
    return {
      futureValue: Math.round(balance),
      invested: Math.round(invested),
      returns: Math.round(balance - invested),
      finalMonthlySip: Math.round(finalMonthlySip),
    };
  }, [initialSip, stepUpPercent, annualReturn, years]);

  const fmt = (v) => formatCurrency(v, settings.currency);

  return (
    <>
      <Seo
        title="Step-Up SIP Calculator – SIP With a Yearly Increase"
        description="Calculate what a SIP grows to when you increase the monthly amount every year. Free, no signup — compare against a flat SIP instantly."
        path="/step-up-sip-calculator"
        keywords="step up sip calculator, sip step up calculator, top up sip calculator, annual step up sip"
        jsonLd={[
        calculatorSchema({
          name: "Step-Up SIP Calculator",
          description: "Calculate what a SIP grows to when you increase the monthly amount every year.",
          path: "/step-up-sip-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Investment planning"
            title="Step-Up SIP Calculator"
            description="Find the future value of a SIP that increases every year, and see it against a flat SIP of the same starting amount."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Starting monthly SIP" value={initialSip} onChange={setInitialSip} min={500} max={100000} step={500} format={fmt} />
              <CalcField label="Annual step-up %" value={stepUpPercent} onChange={setStepUpPercent} min={0} max={50} step={1} suffix="%" />
              <CalcField label="Expected Rate of Return (p.a.) %" value={annualReturn} onChange={setAnnualReturn} min={-15} max={30} step={0.5} suffix="%" />
              <CalcField label="Investment Duration (In Years)" value={years} onChange={setYears} min={1} max={50} suffix=" Years" />
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Future value of your investment" value={fmt(result.futureValue)} />

              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Total invested" value={fmt(result.invested)} share={(result.invested / result.futureValue) * 100} tone="signal" />
                <CalcStat label="Final year's monthly SIP" value={fmt(result.finalMonthlySip)} />
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
                </div>
              </div>

              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                Illustrative only — assumes the step-up applies every year without fail and a smooth, constant
                monthly-compounding return for the full period. Real fund returns vary and can be negative.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <AdSlot slotId="stepupsip_calc_mid" />

            <CalcSection title="What is a step-up SIP?">
              <p>
                A step-up (or top-up) SIP increases your monthly investment by a fixed percentage every year,
                instead of keeping the same amount for the whole duration. It's usually timed to match an expected
                annual salary increment, so the amount you invest grows alongside your actual capacity to invest —
                rather than staying fixed while your income rises around it.
              </p>
              <p>
                This calculator answers what that increase is actually worth: given a starting SIP, a yearly
                step-up percentage, an expected return, and a duration, what does the final corpus look like
                against a flat SIP of the same starting amount?
              </p>
            </CalcSection>

            <CalcSection title="How is step-up SIP calculated?">
              <p>
                Unlike a flat SIP, the monthly amount changes every 12 months. For year index{" "}
                <strong className="text-[#111814] dark:text-[#eef1ec]">k</strong> (starting at 0), that year's
                monthly contribution is:
              </p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                SIPₖ = P₀ × (1 + step-up%)^k
              </p>
              <p>
                Each month's contribution is then added to the running balance and compounded forward at the
                monthly rate, month by month, for the rest of the duration — the same mechanics as a flat SIP,
                just with a monthly amount that resets higher at the start of every year instead of staying fixed.
              </p>
              <p>
                At this page's defaults — ₹5,000 starting monthly SIP, 10% annual step-up, 12% return, 15 years —
                total investment comes to about ₹19,06,349 (against ₹9,00,000 for a flat SIP of the same starting
                amount) and the corpus grows to about ₹43,41,925, against{" "}
                <Link to="/sip-calculator" className={linkClass}>
                  roughly ₹25,22,880 for the flat SIP
                </Link>
                {" "}— more than 70% larger, for investing only about twice as much in total. Later installments
                are bigger and arrive while the corpus is already sizeable, so their contribution compounds
                alongside everything already invested.
              </p>
            </CalcSection>

            <CalcSection title="Step-up SIP vs flat SIP — which should you use?">
              <p>
                A flat SIP is simpler and easier to commit to without re-checking your budget every year. A
                step-up SIP asks more of you — a yearly decision to actually increase the amount — but it closes
                the gap between what you can invest at 25 and what you can invest at 40, instead of investing
                today's amount for the next few decades regardless of how much more you'll eventually be earning.
              </p>
              <p>
                For how a SIP's math works in the first place, see the{" "}
                <Link to="/sip-calculator" className={linkClass}>
                  SIP Calculator
                </Link>
                . For a one-time amount instead of a recurring one, see the{" "}
                <Link to="/lumpsum-calculator" className={linkClass}>
                  Lumpsum Calculator
                </Link>
                .
              </p>
            </CalcSection>

            <CalcSection title="Benefits of a step-up SIP">
              <CalcBenefitGrid
                items={[
                  { title: "Tracks rising income", text: "Keeps your investment rate proportional to your income instead of shrinking as a share of it every year you don't increase it manually." },
                  { title: "Meaningfully larger corpus", text: "Because later, larger installments arrive while the corpus is already sizeable, the step-up effect compounds — often producing a dramatically larger final value for a similar starting commitment." },
                  { title: "Low effort once set up", text: "Most fund platforms let you set the step-up percentage once at the start, rather than manually increasing the SIP amount yourself every year." },
                  { title: "Still flexible", text: "Unlike a fixed long-term commitment, the step-up rate (or the SIP itself) can usually be paused, lowered, or stopped if a year turns out tighter than expected." },
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
