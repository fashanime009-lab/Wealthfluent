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

const FAQ_ITEMS = [
  { q: "What is the difference between current yield and YTM?", a: "Current yield only considers the coupon income relative to the price paid, while YTM accounts for all future cash flows (coupons and principal repayment) and provides the annualized return if the bond is held to maturity." },
  { q: "Is a higher YTM always better?", a: "Not necessarily. A higher YTM may indicate higher risk (credit risk, interest rate risk). Investors should assess the bond's credit rating and the issuer's financial health before investing." },
  { q: "How does YTM relate to bond price?", a: "YTM and bond price have an inverse relationship. When market interest rates rise, bond prices fall, and the YTM increases. When rates fall, bond prices rise, and YTM decreases." },
  { q: "What's the difference between a discount and premium bond?", a: "A discount bond trades below its par value (its YTM exceeds its coupon rate), while a premium bond trades above par (its YTM is below its coupon rate). A bond at exactly par value yields exactly its coupon rate." },
];

export default function BondYieldCalculatorPage() {
  // ─── State ──────────────────────────────────────────────────────
  const [currentPrice, setCurrentPrice] = useState(950);
  const [parValue, setParValue] = useState(1000);
  const [couponRate, setCouponRate] = useState(8);
  const [yearsToMaturity, setYearsToMaturity] = useState(10);
  const { settings } = useSettings();

  // ─── Calculations ──────────────────────────────────────────────
  const results = useMemo(() => {
    const couponPayment = (couponRate / 100) * parValue;

    // Current Yield
    const currentYield = currentPrice > 0 ? (couponPayment / currentPrice) * 100 : 0;

    // Yield to Maturity (approximation using bond pricing formula)
    // We'll use the standard approximation:
    // YTM ≈ (Coupon + (Par - Price)/Years) / ((Par + Price)/2) * 100
    let ytm = 0;
    if (yearsToMaturity > 0 && currentPrice > 0) {
      const numerator = couponPayment + (parValue - currentPrice) / yearsToMaturity;
      const denominator = (parValue + currentPrice) / 2;
      ytm = (numerator / denominator) * 100;
    }

    return {
      currentYield: currentYield,
      ytm: ytm,
      couponPayment: couponPayment,
    };
  }, [currentPrice, parValue, couponRate, yearsToMaturity]);

  // Shared, currency-aware formatter (lakh/crore grouping for INR, each
  // currency's own convention otherwise) — this page used to hardcode
  // en-US grouping with just the symbol, unlike the rest of the site.
  const fmt = (v) => formatCurrency(v, settings.currency, false, 2);

  // ─── Format percentage ──────────────────────────────────────────
  const formatPercentage = (value) => {
    return value.toFixed(2);
  };

  return (
    <>
      <Seo
        title="Bond Yield Calculator – Current Yield & YTM"
        description="Calculate bond current yield and yield to maturity (YTM) based on price, par value, coupon rate, and years to maturity."
        path="/bond-yield-calculator"
        keywords="bond yield calculator, current yield, yield to maturity, YTM, bond calculator"
        jsonLd={[
        calculatorSchema({
          name: "Bond Yield Calculator",
          description: "Calculate bond current yield and yield to maturity (YTM) based on price, par value, coupon rate, and years to maturity.",
          path: "/bond-yield-calculator",
        }),
        faqSchema([
          {
            "question": "What is the difference between current yield and YTM?",
            "answer": "Current yield only considers the coupon income relative to the price paid, while YTM accounts for all future cash flows (coupons and principal repayment) and provides the annualized return if the bond is held to maturity."
          },
          {
            "question": "Is a higher YTM always better?",
            "answer": "Not necessarily. A higher YTM may indicate higher risk (credit risk, interest rate risk). Investors should assess the bond's credit rating and the issuer's financial health before investing."
          },
          {
            "question": "How does YTM relate to bond price?",
            "answer": "YTM and bond price have an inverse relationship. When market interest rates rise, bond prices fall, and the YTM increases. When rates fall, bond prices rise, and YTM decreases."
          },
          {
            "question": "What's the difference between a discount and premium bond?",
            "answer": "A discount bond trades below its par value (its YTM exceeds its coupon rate), while a premium bond trades above par (its YTM is below its coupon rate). A bond at exactly par value yields exactly its coupon rate."
          }
        ]),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Loan & interest"
            title="Bond Yield Calculator"
            description="Calculate the current yield and yield to maturity (YTM) of a bond based on price, par value, coupon rate, and time to maturity."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Current price" value={currentPrice} onChange={setCurrentPrice} min={100} max={10000} step={5} format={fmt} />
              <CalcField label="Par value" value={parValue} onChange={setParValue} min={100} max={10000} step={100} format={fmt} />
              <CalcField label="Coupon rate (%)" value={couponRate} onChange={setCouponRate} min={0} max={20} step={0.5} suffix="%" />
              <CalcField label="Years to maturity" value={yearsToMaturity} onChange={setYearsToMaturity} min={1} max={50} step={1} suffix=" Years" />
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Current yield" value={`${formatPercentage(results.currentYield)}%`} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Yield to maturity (YTM)" value={`${formatPercentage(results.ytm)}%`} tone="signal" />
                <CalcStat label="Coupon payment" value={fmt(results.couponPayment)} />
                <CalcStat label="Current price" value={fmt(currentPrice)} />
                <CalcStat label="Par value" value={fmt(parValue)} />
                <CalcStat label="Years to maturity" value={`${yearsToMaturity} years`} />
                <div className="py-3.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">Price vs par</span>
                    <span className={`font-mono-tech text-[15px] tabular-nums ${currentPrice > parValue ? "text-amber-600" : currentPrice < parValue ? "text-[#047857] dark:text-[#34d399]" : "text-[#111814] dark:text-[#eef1ec]"}`}>
                      {currentPrice > parValue ? "Premium" : currentPrice < parValue ? "Discount" : "At Par"}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[12px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
                Please note that these calculators are for illustrations only and do not represent actual returns.
                Bond yields and market prices change over time based on interest rates, credit quality, and market
                conditions. Actual investment returns may differ from these estimates.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <AdSlot slotId="bondyield_calc_mid" />

            <CalcSection title="What Is a Bond Yield Calculator?">
              <p>
                A Bond Yield Calculator helps investors estimate the return they can expect from a bond investment.
                It calculates the current yield (annual coupon payment divided by current price) and the yield to
                maturity (total return if held until maturity), providing insights into bond valuation and
                investment decisions.
              </p>
            </CalcSection>

            <CalcSection title="How Are These Yields Calculated?">
              <p>Current yield is straightforward:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                Current Yield = (Annual Coupon Payment / Current Price) × 100
              </p>
              <p>
                YTM has no simple closed-form formula and is technically solved by iteration, but this calculator
                uses the standard approximation used across the industry for a quick estimate:
              </p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                YTM ≈ [Coupon + (Par − Price)/Years] / [(Par + Price)/2] × 100
              </p>
              <p>
                A bond bought below par (a discount) has YTM higher than its coupon rate, since you also gain the
                difference between purchase price and par value at maturity. A bond bought above par (a premium) has
                YTM lower than its coupon rate, for the opposite reason.
              </p>
            </CalcSection>

            <CalcSection title="How to Use This Calculator">
              <ol className="list-decimal list-inside space-y-2">
                <li>Enter the bond's current market price.</li>
                <li>Enter the bond's par value (face value).</li>
                <li>Enter the coupon rate (annual interest rate).</li>
                <li>Enter the number of years until maturity.</li>
                <li>The calculator will display the current yield and yield to maturity.</li>
              </ol>
            </CalcSection>

            <CalcSection title="Understanding Bond Yields">
              <CalcBenefitGrid
                items={[
                  { title: "Current Yield", text: "Current yield is the annual coupon payment divided by the current market price. It shows the income return relative to the price paid, but doesn't account for capital gains or losses at maturity." },
                  { title: "Yield to Maturity (YTM)", text: "YTM is the total annualized return an investor will earn if they hold the bond until maturity, including both coupon payments and any capital gain or loss if the bond is purchased at a discount or premium." },
                  { title: "Bond Pricing", text: "Bonds trade at a discount when the current price is below par value, at a premium when above par, and at par when equal. The YTM inversely relates to price – higher price means lower YTM." },
                  { title: "Risk Considerations", text: "Bonds carry interest rate risk, credit risk, and reinvestment risk. A higher YTM often implies higher risk. Always consider the issuer's creditworthiness before investing." },
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
