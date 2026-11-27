import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { useMemo } from "react";
import useDefaultableField, { useFieldBounds } from "@/hooks/useDefaultableField";
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
  { q: "What is the difference between current yield and YTM?", a: "Current yield only considers the coupon income relative to the price paid, while YTM accounts for all future cash flows (coupons and principal repayment) and provides the annualized return if the bond is held to maturity." },
  { q: "Is a higher YTM always better?", a: "Not necessarily. A higher YTM may indicate higher risk (credit risk, interest rate risk). Investors should assess the bond's credit rating and the issuer's financial health before investing." },
  { q: "How does YTM relate to bond price?", a: "YTM and bond price have an inverse relationship. When market interest rates rise, bond prices fall, and the YTM increases. When rates fall, bond prices rise, and YTM decreases." },
  { q: "What's the difference between a discount and premium bond?", a: "A discount bond trades below its par value (its YTM exceeds its coupon rate), while a premium bond trades above par (its YTM is below its coupon rate). A bond at exactly par value yields exactly its coupon rate." },
  { q: "How accurate is this YTM?", a: "It solves for the exact yield that makes the bond's future coupons and repayment worth its current price, assuming one coupon a year. Many bonds pay twice a year, which gives a slightly different quoted yield, and the result also assumes you hold to maturity and the issuer pays in full." },
  { q: "How can I buy bonds in India?", a: "Government securities and treasury bills can be bought directly through the RBI Retail Direct platform. Listed corporate bonds trade on the stock exchanges through a demat account, and online bond platforms registered with SEBI sell them in smaller lots. Debt mutual funds are the simplest way to own a spread of bonds." },
];

// Price of a bond paying one coupon a year, at a given yield.
function bondPrice(face, couponRate, years, yieldRate) {
  const c = (couponRate / 100) * face;
  const y = yieldRate / 100;
  if (y === 0) return c * years + face;
  const discount = Math.pow(1 + y, -years);
  return c * ((1 - discount) / y) + face * discount;
}

// Exact yield to maturity: the annual yield at which bondPrice equals the
// market price, solved by bisection (price falls as yield rises). Whole
// years and annual coupons.
function exactYtm(price, face, couponRate, years) {
  if (price <= 0 || face <= 0 || years <= 0) return 0;
  let lo = -0.99 * 100;
  let hi = 1000;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (bondPrice(face, couponRate, years, mid) > price) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export default function BondYieldCalculatorPage() {
  // ─── State ──────────────────────────────────────────────────────
  const [currentPrice, setCurrentPrice] = useDefaultableField("bondYield", "price");
  const [parValue, setParValue] = useDefaultableField("bondYield", "faceValue");
  const [couponRate, setCouponRate] = useDefaultableField("bondYield", "coupon");
  const [yearsToMaturity, setYearsToMaturity] = useDefaultableField("bondYield", "years");
  const priceBounds = useFieldBounds("bondYield", "price");
  const faceValueBounds = useFieldBounds("bondYield", "faceValue");
  const couponBounds = useFieldBounds("bondYield", "coupon");
  const yearsBounds = useFieldBounds("bondYield", "years");
  const { settings } = useSettings();

  // ─── Calculations ──────────────────────────────────────────────
  const results = useMemo(() => {
    const couponPayment = (couponRate / 100) * parValue;

    // Current Yield
    const currentYield = currentPrice > 0 ? (couponPayment / currentPrice) * 100 : 0;

    // Yield to maturity, solved exactly (this page used to show only the
    // rough approximation below, which drifts for long, deep-discount bonds).
    const ytm = exactYtm(currentPrice, parValue, couponRate, yearsToMaturity);
    let approxYtm = 0;
    if (yearsToMaturity > 0 && currentPrice > 0) {
      const numerator = couponPayment + (parValue - currentPrice) / yearsToMaturity;
      const denominator = (parValue + currentPrice) / 2;
      approxYtm = (numerator / denominator) * 100;
    }

    return {
      currentYield: currentYield,
      ytm: ytm,
      approxYtm,
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

  // What this bond would be worth if market yields moved.
  const yieldSteps = [-2, -1, 0, 1, 2];
  const priceRows = yieldSteps
    .map((step) => Math.round((results.ytm + step) * 100) / 100)
    .filter((y) => y > -50)
    .map((y) => {
      const price = bondPrice(parValue, couponRate, yearsToMaturity, y);
      const change = currentPrice > 0 ? ((price - currentPrice) / currentPrice) * 100 : 0;
      return [`${y.toFixed(2)}%`, fmt(price), `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`];
    });

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
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        howToSchema({
          name: "How to Use the Bond Yield Calculator",
          description: "Calculate a bond's current yield and yield to maturity (YTM) from its price, par value, coupon rate and years to maturity.",
          steps: [
            { name: "Enter the current price", text: "Enter the bond's current market price in the Current price field." },
            { name: "Enter the par value", text: "Enter the bond's par value (face value) in the Par value field." },
            { name: "Enter the coupon rate", text: "Enter the bond's annual coupon rate as a percentage in the Coupon rate field." },
            { name: "Enter the years to maturity", text: "Enter how many years remain until the bond matures in the Years to maturity field." },
            { name: "View your result instantly", text: "The calculator instantly shows the current yield and yield to maturity (YTM)." },
          ],
        }),
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
              <CalcField label="Current price" value={currentPrice} onChange={setCurrentPrice} {...priceBounds} format={fmt} />
              <CalcField label="Par value" value={parValue} onChange={setParValue} {...faceValueBounds} format={fmt} />
              <CalcField label="Coupon rate (%)" value={couponRate} onChange={setCouponRate} {...couponBounds} suffix="%" hint="Sample value. Enter your own." />
              <CalcField label="Years to maturity" value={yearsToMaturity} onChange={setYearsToMaturity} {...yearsBounds} suffix=" Years" />
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Current yield" value={`${formatPercentage(results.currentYield)}%`} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Yield to maturity (YTM)" value={`${formatPercentage(results.ytm)}%`} tone="signal" />
                <CalcStat label="Quick approximation of YTM" value={`${formatPercentage(results.approxYtm)}%`} />
                <CalcStat label="Coupon payment" value={fmt(results.couponPayment)} />
                <CalcStat label="Current price" value={fmt(currentPrice)} />
                <CalcStat label="Par value" value={fmt(parValue)} />
                <CalcStat label="Years to maturity" value={`${yearsToMaturity} years`} />
                <div className="py-3.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[13.5px] text-[#111814]/65 dark:text-[#eef1ec]/65">Price vs par</span>
                    <span className={`font-mono-tech text-[15px] tabular-nums ${currentPrice > parValue ? "text-amber-700 dark:text-amber-400" : currentPrice < parValue ? "text-[#047857] dark:text-[#34d399]" : "text-[#111814] dark:text-[#eef1ec]"}`}>
                      {currentPrice > parValue ? "Premium" : currentPrice < parValue ? "Discount" : "At Par"}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                Please note that these calculators are for illustrations only and do not represent actual returns.
                Bond yields and market prices change over time based on interest rates, credit quality, and market
                conditions. Actual investment returns may differ from these estimates.
              </p>
            </div>
          </div>

          <div className="mt-16">

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
                YTM is the single yearly rate that makes all the bond's future payments, every coupon plus the par
                value at maturity, add up to today's price once discounted:
              </p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                Price = Σ Coupon / (1 + YTM)^t + Par / (1 + YTM)^N
              </p>
              <p>
                There's no direct formula for it, so this calculator solves it exactly by trial and error, assuming
                one coupon a year. For a quick check by hand, the common approximation is shown in the results too:
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

            <CalcSection title="Why bond prices move when rates change">
              <p>
                A bond's coupon is fixed, so when market yields rise, its price has to fall until its yield matches
                new bonds, and the reverse when yields fall. The longer the bond, the bigger the move. Here's what
                this bond would be worth if the market yield for it moved from today's {formatPercentage(results.ytm)}%:
              </p>
              <CalcTable
                caption={`${fmt(parValue)} par, ${couponRate}% coupon, ${yearsToMaturity} years to maturity`}
                columns={["Market yield", "Bond price", "Change from today's price"]}
                rows={priceRows}
              />
              <p>
                If you hold to maturity, these swings don't change what you get back: the coupons and the par value.
                They matter if you might sell early, and they're why a long-duration debt fund can fall when
                interest rates rise.
              </p>
            </CalcSection>

            <CalcSection title="Credit risk: what the yield is paying you for">
              <p>
                Government bonds pay the least because the government is the safest borrower. Company bonds pay
                more, and lower-rated companies pay more still, to make up for the chance they don't repay. Credit
                rating agencies grade bonds from AAA (strongest) downwards; anything below BBB- is speculative. A
                yield far above similar bonds is usually a warning, not a bargain.
              </p>
            </CalcSection>

            <CalcSection title="How to invest in bonds in India">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className={calcStrongClass}>Government securities and T-bills:</strong> buy directly from the RBI
                  through the RBI Retail Direct platform.
                </li>
                <li>
                  <strong className={calcStrongClass}>Corporate bonds:</strong> listed bonds trade on the stock exchanges
                  through a demat account; SEBI-registered online bond platforms sell them in smaller amounts.
                </li>
                <li>
                  <strong className={calcStrongClass}>Debt mutual funds:</strong> the easiest way to own many bonds at once.
                  Our lesson on{" "}
                  <Link to="/learn/mutual-fund-types" className={calcLinkClass}>
                    types of mutual funds
                  </Link>{" "}
                  explains the debt fund categories.
                </li>
              </ul>
              <p>
                Interest from bonds is taxed at your income-tax slab rate. To compare a bond's yield with a fixed
                deposit, use the{" "}
                <Link to="/fd-calculator" className={calcLinkClass}>
                  FD Calculator
                </Link>
                .
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
