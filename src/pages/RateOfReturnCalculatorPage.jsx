import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import useExampleCurrency from "@/hooks/useExampleCurrency";
import useDefaultableField, { useFieldBounds } from "@/hooks/useDefaultableField";
import { assumptionsFor } from "@/data/calculatorDefaults";
import { useMemo } from "react";
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

const FAQ_ITEMS = [
  { q: "What is a good rate of return?", a: "One that beats inflation by a comfortable margin and holds up against a fair benchmark for the same kind of investment, such as a broad market index for an equity fund. Stock markets have delivered higher long-term returns than deposits and bonds, with much bigger swings, and results vary by country and period. The right target depends on your goals, risk tolerance and how long you're investing." },
  { q: "How is rate of return different from simple interest?", a: "Rate of return (CAGR) accounts for compound growth, while simple interest is calculated only on the principal. CAGR provides a more accurate picture of investment performance over time." },
  { q: "Can the rate of return be negative?", a: "Yes, if the future value is less than the present value, the rate of return will be negative, indicating a loss on the investment." },
  { q: "Is this the same as CAGR?", a: "Yes — annualized rate of return and CAGR describe the same calculation: the constant yearly growth rate that would take a present value to a future value over a given number of years." },
  { q: "Can I use this for a SIP?", a: "Not accurately. This calculation assumes one investment at the start. With a SIP, each instalment is invested at a different time, so use XIRR, which accounts for the date of every payment. Spreadsheets have an XIRR function, and most fund statements show it." },
  { q: "How do I work out my real return after inflation?", a: "Divide (1 + your return) by (1 + inflation) and subtract 1. A 10% return with 6% inflation is a real return of about 3.8%, slightly less than the 4% you'd get by simply subtracting." },
];

export default function RateOfReturnCalculatorPage() {
  // ─── State ──────────────────────────────────────────────────────
  const [presentValue, setPresentValue] = useDefaultableField("rateOfReturn", "present");
  const [futureValue, setFutureValue] = useDefaultableField("rateOfReturn", "future");
  const [yearsToGrow, setYearsToGrow] = useDefaultableField("rateOfReturn", "years");
  const presentBounds = useFieldBounds("rateOfReturn", "present");
  const futureBounds = useFieldBounds("rateOfReturn", "future");
  const yearsBounds = useFieldBounds("rateOfReturn", "years");
  const { settings } = useSettings();

  // ─── Calculations ──────────────────────────────────────────────
  const rateOfReturn = useMemo(() => {
    if (presentValue <= 0 || futureValue <= 0 || yearsToGrow <= 0) return 0;
    const rate = (Math.pow(futureValue / presentValue, 1 / yearsToGrow) - 1) * 100;
    return rate;
  }, [presentValue, futureValue, yearsToGrow]);

  // Shared, currency-aware formatter (lakh/crore grouping for INR, each
  // currency's own convention otherwise) — this page used to hardcode
  // en-US grouping with just the symbol, unlike the rest of the site.
  const fmt = (v) => formatCurrency(v, settings.currency);
  const { inr } = useExampleCurrency();
  const examplePresent = inr(10000);
  const exampleFuture = inr(20000);
  const { inflation } = assumptionsFor(settings.currency);
  // Real (inflation-adjusted) annual return: (1 + r) / (1 + i) − 1.
  const realReturn = ((1 + rateOfReturn / 100) / (1 + inflation / 100) - 1) * 100;
  const doublingRows = [2, 5, 10, 20].map((y) => [`${y} years`, "100%", `${((Math.pow(2, 1 / y) - 1) * 100).toFixed(1)}%`]);

  // ─── Format percentage ──────────────────────────────────────────
  const formatPercentage = (value) => {
    return value.toFixed(2);
  };

  // ─── Calculate gain ──────────────────────────────────────────
  const totalGain = futureValue - presentValue;
  const totalGainPercentage = presentValue > 0 ? (totalGain / presentValue) * 100 : 0;

  return (
    <>
      <Seo
        title="Rate of Return Calculator: Annualized Return"
        description="Calculate the annualized rate of return (CAGR) on any investment from its start value, end value and time held. See how much your money really grew."
        path="/rate-of-return-calculator"
        keywords="rate of return calculator, CAGR calculator, investment returns, annualized return"
        jsonLd={[
        calculatorSchema({
          name: "Rate of Return Calculator",
          description: "Calculate the annualized rate of return (CAGR) on any investment from its start value, end value and time held. See how much your money really grew.",
          path: "/rate-of-return-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        howToSchema({
          name: "How to Use the Rate of Return Calculator",
          description: "Calculate the annualized rate of return (CAGR) for an investment from its present value, future value and holding period.",
          steps: [
            { name: "Enter the present value", text: "Enter the investment's starting value in the Present value field." },
            { name: "Enter the future value", text: "Enter the investment's current or ending value in the Future value field." },
            { name: "Enter the years to grow", text: "Enter how many years the investment was held in the Years to grow field." },
            { name: "View your result instantly", text: "The calculator instantly shows the annualized rate of return (CAGR) and total gain." },
          ],
        }),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Loan & interest"
            title="Rate of Return Calculator"
            description="Calculate the annualized rate of return (CAGR) based on present value, future value, and time period."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Present value" value={presentValue} onChange={setPresentValue} {...presentBounds} format={fmt} />
              <CalcField label="Future value" value={futureValue} onChange={setFutureValue} {...futureBounds} format={fmt} />
              <CalcField label="Years to grow" value={yearsToGrow} onChange={setYearsToGrow} {...yearsBounds} suffix=" Years" />
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Rate of return (CAGR)" value={`${formatPercentage(rateOfReturn)}%`} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Present value" value={fmt(presentValue)} />
                <CalcStat label="Future value" value={fmt(futureValue)} tone="signal" />
                <div className="py-3.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">Total gain</span>
                    <span className={`font-mono-tech text-[15px] tabular-nums ${totalGain >= 0 ? "text-[#047857] dark:text-[#34d399]" : "text-red-500"}`}>
                      {fmt(totalGain)}
                    </span>
                  </div>
                </div>
                <div className="py-3.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">Total gain percentage</span>
                    <span className={`font-mono-tech text-[15px] tabular-nums ${totalGainPercentage >= 0 ? "text-[#047857] dark:text-[#34d399]" : "text-red-500"}`}>
                      {totalGainPercentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <CalcStat label="Time period" value={`${yearsToGrow} Years`} />
                <CalcStat label={`Real return (after ${inflation}% inflation)`} value={`${realReturn.toFixed(2)}%`} />
              </div>
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                Please note that these calculators are for illustrations only and do not represent actual returns.
                Stock Market does not have a fixed rate of return and it is not possible to predict the rate of return.
              </p>
            </div>
          </div>

          <div className="mt-16">

            <CalcSection title="What Is a Rate of Return Calculator?">
              <p>
                A Rate of Return Calculator helps you determine the annualized return (CAGR) of your investments. By
                entering the present value, future value, and time period, you can understand how well your
                investments have performed over time.
              </p>
            </CalcSection>

            <CalcSection title="How Is Annualized Return Calculated?">
              <p>This calculator solves the compound growth formula for the rate itself, given a known start and end value:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                Rate = [(Future Value / Present Value)^(1/Years) − 1] × 100
              </p>
              <p>
                For example, {fmt(examplePresent)} growing to {fmt(exampleFuture)} over 5 years works out to an annualized return of about
                14.87% — a single number that describes the average annual growth needed to turn the first figure
                into the second, regardless of how bumpy the actual year-by-year path was.
              </p>
            </CalcSection>

            <CalcSection title="Absolute return vs annualized return">
              <p>
                An <strong className={calcStrongClass}>absolute return</strong> is the total gain over the whole period: if
                your money doubled, that's 100%. An <strong className={calcStrongClass}>annualized return</strong> spreads
                that gain evenly over the years it took. The same 100% gain is impressive over two years and
                disappointing over twenty:
              </p>
              <CalcTable
                caption="The same doubling of your money, annualized over different periods"
                columns={["Time taken", "Absolute return", "Annualized return"]}
                rows={doublingRows}
              />
              <p>
                That's why investments held for different lengths of time should be compared on their annualized
                return, never on the absolute figure a brochure or app highlights.
              </p>
            </CalcSection>

            <CalcSection title="When to use XIRR instead">
              <p>
                This calculation assumes you invested one amount at the start and left it alone. That's right for a
                lump sum, a property or a single share purchase. It's wrong for a SIP or any investment where you
                added or withdrew money along the way, because later instalments had less time to grow.
              </p>
              <p>
                For those, use <strong className={calcStrongClass}>XIRR</strong> (extended internal rate of return), which
                takes the date and amount of every payment into account. Spreadsheets have an XIRR function: list each
                investment as a negative amount with its date, the current value as a positive amount with today's
                date, and it returns the annualized return. Most mutual fund statements show XIRR for your SIPs.
              </p>
            </CalcSection>

            <CalcSection title="Real return: what's left after inflation">
              <p>
                A return only builds wealth if it beats inflation. Your real return is{" "}
                <strong className={calcStrongClass}>(1 + return) ÷ (1 + inflation) − 1</strong>. With the numbers above, your{" "}
                {formatPercentage(rateOfReturn)}% a year becomes about {realReturn.toFixed(2)}% a year after {inflation}%
                inflation. A deposit earning about the same as inflation keeps your money's value but doesn't grow it.
              </p>
              <p>
                To judge whether a return is good, compare it with inflation and with a fair benchmark for the same
                kind of investment, such as a broad market index for an equity fund. Our lesson on{" "}
                <Link to="/learn/understanding-cagr" className={calcLinkClass}>
                  understanding CAGR
                </Link>{" "}
                covers the common mistakes, and the{" "}
                <Link to="/cagr-calculator" className={calcLinkClass}>
                  CAGR Calculator
                </Link>{" "}
                gives the same result with a few extra details.
              </p>
            </CalcSection>

            <CalcSection title="How to Use This Calculator">
              <ol className="list-decimal list-inside space-y-2">
                <li>Enter the present value (initial investment amount).</li>
                <li>Enter the future value (final investment amount).</li>
                <li>Set the number of years the investment has grown.</li>
                <li>The calculator will show the annualized rate of return (CAGR).</li>
                <li>Use the results to compare different investment opportunities.</li>
              </ol>
            </CalcSection>

            <CalcSection title="Understanding Rate of Return">
              <CalcBenefitGrid
                items={[
                  { title: "CAGR (Compound Annual Growth Rate)", text: "CAGR measures the average annual growth rate of an investment over a specific period. It smooths out volatility to show a consistent annual return." },
                  { title: "Absolute vs. Annualized Returns", text: "Absolute return is the total percentage gain over the entire period. Annualized return (CAGR) shows the average annual gain, making it easier to compare investments with different time horizons." },
                  { title: "Risk and Return", text: "Higher returns generally come with higher risk. Understanding your rate of return helps you assess whether the risk you're taking is justified." },
                  { title: "Inflation-Adjusted Returns", text: "Your real return is (1 + return) ÷ (1 + inflation) − 1, roughly your return minus inflation. It shows the actual increase in purchasing power." },
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
