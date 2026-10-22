import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import useExampleCurrency from "@/hooks/useExampleCurrency";
import useDefaultableField, { useAssumptionField, useFieldBounds } from "@/hooks/useDefaultableField";
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

const FAQ_ITEMS = [
  { q: "What's the actual difference between simple and compound interest?", a: "Simple interest is paid only on the original amount, every year, so it grows by the same rupee amount annually. Compound interest is paid on the original amount plus everything it's already earned, so each year's gain is a little larger than the last. Over short periods the gap is small; over long ones it becomes the whole story." },
  { q: "Why does the gap between them grow so much over time?", a: "Because the compound side is earning returns on returns — an accelerating effect — while the simple side only ever earns on the original amount. Doubling the number of years roughly doubles simple interest's result, but can multiply compound interest's result several times over, depending on the rate." },
  { q: "Does this apply to a lump sum or a monthly investment like a SIP?", a: "This tool models a one-time lump sum. A SIP compounds too, but each monthly contribution starts compounding from a different date, which needs a different formula — see the SIP Calculator for that case." },
  { q: "Is a higher rate or more time the bigger lever?", a: "Time, in almost every realistic case — because compounding is exponential in the number of periods and only linear in the rate. Starting 10 years earlier at a modest rate usually beats starting later and chasing a higher one, which is also the exact point the rule of 72 illustrates: the years needed to double your money fall fast as the rate rises, but rise just as fast if you delay." },
  { q: "Does compound interest work against me too?", a: "Yes — debt compounds by the same mechanism, which is why high-interest debt (a credit card at 30%+) grows just as relentlessly as an investment, and why paying it off is often the highest-return move available before investing elsewhere." },
];

export default function PowerOfCompoundingPage() {
  const [principal, setPrincipal] = useDefaultableField("powerOfCompounding", "principal");
  const [rate, setRate] = useAssumptionField("equityReturn");
  const [years, setYears] = useDefaultableField("powerOfCompounding", "years");
  const principalBounds = useFieldBounds("powerOfCompounding", "principal");
  const rateBounds = useFieldBounds("powerOfCompounding", "rate");
  const yearsBounds = useFieldBounds("powerOfCompounding", "years");
  const { settings } = useSettings();

  const simpleValue = Math.round(principal + (principal * rate * years) / 100);
  const compoundValue = Math.round(principal * Math.pow(1 + rate / 100, years));
  const compoundingGain = compoundValue - simpleValue;

  const fmt = (v) => formatCurrency(v, settings.currency);
  const { inr } = useExampleCurrency();

  // Fixed worked examples for the body copy below, independent of the live
  // inputs above but currency-aware via inr().
  const simpleOf = (p, r, t) => Math.round(p + (p * r * t) / 100);
  const compoundOf = (p, r, t) => Math.round(p * Math.pow(1 + r / 100, t));
  const examplePrincipal = inr(100000);
  const example1Simple = simpleOf(examplePrincipal, 10, 20);
  const example1Compound = compoundOf(examplePrincipal, 10, 20);
  const example2Simple = simpleOf(examplePrincipal, 12, 30);
  const example2Compound = compoundOf(examplePrincipal, 12, 30);

  return (
    <>
      <Seo
        title="Power of Compounding Calculator – Simple vs Compound"
        description="See exactly how much more compound interest earns than simple interest on the same amount, rate and years. Free, no signup."
        path="/power-of-compounding"
        keywords="power of compounding calculator, simple vs compound interest calculator, compound interest calculator"
        jsonLd={[
        calculatorSchema({
          name: "Power of Compounding Calculator",
          description: "See exactly how much more compound interest earns than simple interest on the same amount, rate and years.",
          path: "/power-of-compounding",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Investment planning"
            title="Power of Compounding Calculator"
            description="See compound interest next to simple interest on the same numbers, so the difference is a figure, not just a phrase."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Lump sum invested" value={principal} onChange={setPrincipal} {...principalBounds} format={fmt} />
              <CalcField label="Annual return %" value={rate} onChange={setRate} {...rateBounds} suffix="%" />
              <CalcField label="Duration (Years)" value={years} onChange={setYears} {...yearsBounds} suffix=" Years" />
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Extra from compounding" value={fmt(compoundingGain)} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Compound interest value" value={fmt(compoundValue)} share={100} tone="signal" />
                <CalcStat label="Simple interest value" value={fmt(simpleValue)} share={(simpleValue / compoundValue) * 100} />
              </div>
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                Illustrative only — real returns vary year to year rather than compounding at one smooth rate.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <AdSlot slotId="compounding_calc_mid" />

            <CalcSection title="What does this calculator actually show?">
              <p>
                "The power of compounding" is usually said as a phrase, not shown as a number. This calculator
                puts the same lump sum, rate and time period through both simple and compound interest, side by
                side, so the gap between them is something you can actually see rather than take on faith.
              </p>
              <p>
                Simple interest pays the same amount every year, on the original sum only. Compound interest
                pays on the original sum plus everything it's already earned — so each year's gain is a little
                bigger than the one before it, and that effect itself grows over time.
              </p>
            </CalcSection>

            <CalcSection title="How is the difference calculated?">
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                Simple = P + (P × R × T) / 100 &nbsp;·&nbsp; Compound = P × (1 + R/100)^T
              </p>
              <p>
                {fmt(examplePrincipal)} at 10% for 20 years reaches {fmt(example1Simple)} under simple interest — a steady {fmt(examplePrincipal / 10)} a year, 20
                times over. Under compound interest, the same inputs reach about {fmt(example1Compound)} — more than double the
                simple-interest figure, from the exact same rate and time. That extra {fmt(example1Compound - example1Simple)} is money earned
                purely because each year's interest went on to earn its own interest.
              </p>
              <p>
                The gap isn't linear either: at 10 years the compound figure is only modestly ahead of simple; by
                30 years, compound interest on the same {fmt(examplePrincipal)} at 12% reaches roughly {fmt(example2Compound)} against simple
                interest's {fmt(example2Simple)} — a gap that keeps widening the longer the money is left alone.
              </p>
            </CalcSection>

            <CalcSection title="Why this matters for real decisions">
              <CalcBenefitGrid
                items={[
                  { title: "Makes 'start early' concrete", text: "Seeing the actual gap in your own currency, not just the advice, is what makes starting early feel worth the sacrifice it sometimes requires." },
                  { title: "Shows why rate alone isn't the whole story", text: "A small rate difference matters less over 5 years than over 25 — time is doing most of the work in the compound figure." },
                  { title: "Explains why debt is dangerous the same way", text: "The identical mechanism works against you on a credit card balance, which is why high-interest debt is worth clearing fast." },
                  { title: "A sanity check on 'guaranteed' return claims", text: "If a product's compound growth looks implausibly close to a linear, simple-interest-like line, it's worth asking exactly how the return is actually calculated." },
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
