import { useState } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { defaultFor } from "@/data/calculatorDefaults";
import { calcLinkClass, calcStrongClass } from "@/components/calculators/calcStyles";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema, howToSchema } from "@/components/seo/schema";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "Should I include my home in net worth?", a: "Yes, as an asset at its current market value, with any outstanding mortgage counted as a liability. Some people track net worth with and without the primary home separately, since it's illiquid and not usually meant to be sold." },
  { q: "Is a negative net worth bad?", a: "Common early in careers — student loans or a recent home purchase can put net worth below zero temporarily. What matters is the trend: is it moving toward positive over time?" },
  { q: "How often should I recalculate my net worth?", a: "Quarterly or annually is enough for most people. Checking daily or weekly just tracks market noise rather than genuine progress." },
  { q: "Should I include my car?", a: "Yes, at what you could sell it for today, not what you paid. Cars lose value every year, so update the figure each time you recalculate. Any car loan goes in liabilities." },
  { q: "Do retirement accounts count towards net worth?", a: "Yes. Provident fund, pension and other retirement balances are your money, even if you can't withdraw them freely yet. This calculator counts them as partly liquid, since getting at them early usually means rules, penalties or a wait." },
  { q: "What is a good net worth for my age?", a: "Compare yourself with the median for your age group and country, not the average, which a few very wealthy households pull up. Our net worth by age guides show the latest survey figures. More important than any benchmark is whether your own net worth rises from one year to the next." },
];

// How quickly each asset can be turned into cash without a large loss.
// Liquid: within days, at close to full value. Partly liquid: possible, but
// with a lock-in, penalty, waiting period or a price that moves. Illiquid:
// selling takes weeks or months, or may not be possible at a fair price.
const LIQUID_KEYS = [
  "savingsAccount", "currentAccount", "liquidMutualFunds", "fixedDeposits",
  "recurringDeposits", "debtMutualFunds", "shares", "equityMutualFunds",
];
const PARTLY_LIQUID_KEYS = [
  "retirementAccount", "spouseRetirementAccount", "childrenRetirementAccount",
  "employerRetirementPlan", "governmentRetirementPlan", "governmentBond",
  "savingsCertificate", "corporateDeposits", "postOfficeDeposits", "bonds",
  "debentures", "insurancePolicies", "goldSilverJewels",
  "other1", "other2", "other3", "other4", "other5", "other6",
];
const ILLIQUID_KEYS = ["annuities", "pensionFund", "artAntiques", "businessPartnership", "realEstate"];

export default function NetWorthCalculatorPage() {
  const { settings } = useSettings();
  const currency = settings.currency;
  // The sample figures were written in rupees. Scale them by how this
  // currency's typical home loan compares with India's (₹50 lakh vs
  // $350,000, from the EMI calculator's defaults), so a dollar visitor
  // starts with a realistic $350,000 home rather than "$5,000,000" or an
  // FX-converted $52,000.
  const scale = defaultFor("emi", "loan", currency) / defaultFor("emi", "loan", "INR");
  const inr = (rupees) => Math.round(rupees * scale);

  // ─── Asset States ──────────────────────────────────────────────
  const [assets, setAssets] = useState(() => ({
    savingsAccount: inr(100000),
    currentAccount: 0,
    liquidMutualFunds: inr(300000),
    fixedDeposits: inr(200000),
    recurringDeposits: 0,
    debtMutualFunds: 0,
    retirementAccount: inr(500000),
spouseRetirementAccount: 0,
childrenRetirementAccount: 0,
employerRetirementPlan: 0,
governmentRetirementPlan: inr(1000000),
governmentBond: 0,
savingsCertificate: 0,
    corporateDeposits: 0,
    postOfficeDeposits: 0,
    shares: 0,
    equityMutualFunds: inr(1000000),
    bonds: 0,
    debentures: 0,
    annuities: 0,
    pensionFund: 0,
    insurancePolicies: 0,
    goldSilverJewels: 0,
    artAntiques: 0,
    businessPartnership: 0,
    realEstate: inr(5000000),
    other1: 0,
    other2: 0,
    other3: 0,
    other4: 0,
    other5: 0,
    other6: 0,
  }));

  // ─── Liability States ──────────────────────────────────────────
  const [liabilities, setLiabilities] = useState(() => ({
    homeLoan: inr(2500000),
    carLoan: 0,
    personalLoan: 0,
    otherLoan1: 0,
    otherLoan2: 0,
    taxesDue: 0,
    creditCardDue: 0,
    otherBills: 0,
    other1: 0,
    other2: 0,
    other3: 0,
    other4: 0,
    other5: 0,
    other6: 0,
  }));

  // ─── Update handlers ────────────────────────────────────────────
  // Amounts can't be negative: a debt belongs in liabilities, not as a
  // negative asset (typing "-5" used to subtract from total assets).
  const toAmount = (value) => Math.max(0, Number(value) || 0);
  const handleAssetChange = (key, value) => {
    setAssets((prev) => ({ ...prev, [key]: toAmount(value) }));
  };

  const handleLiabilityChange = (key, value) => {
    setLiabilities((prev) => ({ ...prev, [key]: toAmount(value) }));
  };

  // ─── Computed totals ────────────────────────────────────────────
  const totalAssets = Object.values(assets).reduce((sum, val) => sum + val, 0);
  const totalLiabilities = Object.values(liabilities).reduce((sum, val) => sum + val, 0);
  const netWorth = totalAssets - totalLiabilities;
  const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets * 100).toFixed(2) : 0;
  const sumOf = (keys) => keys.reduce((sum, key) => sum + (assets[key] || 0), 0);
  const liquidAssets = sumOf(LIQUID_KEYS);
  const partialLiquidAssets = sumOf(PARTLY_LIQUID_KEYS);
  const illiquidAssets = sumOf(ILLIQUID_KEYS);

  // Worked example for the body copy.
  const exampleHome = inr(5000000);
  const exampleLoan = inr(3500000);

  // ─── Component ──────────────────────────────────────────────────
  return (
    <>
      <Seo
        title="Net Worth Calculator – Track Your Financial Health"
        description="Calculate your net worth by listing all assets and liabilities. Understand your financial position with clear asset and liability analysis."
        path="/networth-calculator"
        keywords="net worth calculator, financial health, assets, liabilities, debt ratio"
        jsonLd={[
        calculatorSchema({
          name: "Net Worth Calculator",
          description: "Calculate your net worth by listing all assets and liabilities. Understand your financial position with clear asset and liability analysis.",
          path: "/networth-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        howToSchema({
          name: "How to Use the Net Worth Calculator",
          description: "Calculate your net worth by listing all your assets and liabilities.",
          steps: [
            { name: "Enter your assets", text: "Enter every asset you own — bank balances, investments, retirement accounts, real estate and more — in the Total Assets panel." },
            { name: "Enter your liabilities", text: "Enter everything you owe — loans, credit card dues, taxes and other bills — in the Total Liabilities panel." },
            { name: "View your result instantly", text: "The calculator instantly shows your net worth, debt-to-asset ratio and a liquidity breakdown of your assets." },
          ],
        }),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Wealth & Goals"
            title="Net Worth Calculator"
            description="List all your assets and liabilities to get a clear picture of your financial position."
          />

          {/* Main Grid: Assets & Liabilities side by side */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Assets Panel */}
            <div className="border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <h2 className="font-display text-[18px] font-extrabold text-[#111814] dark:text-[#eef1ec]">Total Assets</h2>
              <div className="mt-5 max-h-[480px] space-y-4 overflow-y-auto pr-2">
                {Object.entries(assets).map(([key, value]) => {
                  // Format label nicely
                  const label = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())
                    .replace(/(\d+)/g, ' $1');
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <label htmlFor={`asset-${key}`} className="w-1/2 text-[13px] text-[#111814]/65 dark:text-[#eef1ec]/65">{label}</label>
                      <input
                        id={`asset-${key}`}
                        type="number"
                        min="0"
                        step="1000"
                        value={value}
                        onChange={(e) => handleAssetChange(key, e.target.value)}
                        className="w-1/2 border border-[#111814]/15 bg-transparent px-3 py-2 font-mono-tech text-[13.5px] tabular-nums text-[#111814] outline-none focus:border-[#047857] dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:focus:border-[#34d399]"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-between border-t border-[#111814]/10 pt-4 font-display text-[15px] font-bold text-[#111814] dark:border-[#eef1ec]/10 dark:text-[#eef1ec]">
                <span>Total Assets</span>
                <span className="font-mono-tech tabular-nums text-[#047857] dark:text-[#34d399]">{formatCurrency(totalAssets, currency)}</span>
              </div>
            </div>

            {/* Liabilities Panel */}
            <div className="border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <h2 className="font-display text-[18px] font-extrabold text-[#111814] dark:text-[#eef1ec]">Total Liabilities</h2>
              <div className="mt-5 max-h-[480px] space-y-4 overflow-y-auto pr-2">
                {Object.entries(liabilities).map(([key, value]) => {
                  const label = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())
                    .replace(/(\d+)/g, ' $1');
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <label htmlFor={`liability-${key}`} className="w-1/2 text-[13px] text-[#111814]/65 dark:text-[#eef1ec]/65">{label}</label>
                      <input
                        id={`liability-${key}`}
                        type="number"
                        min="0"
                        step="1000"
                        value={value}
                        onChange={(e) => handleLiabilityChange(key, e.target.value)}
                        className="w-1/2 border border-[#111814]/15 bg-transparent px-3 py-2 font-mono-tech text-[13.5px] tabular-nums text-[#111814] outline-none focus:border-[#047857] dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:focus:border-[#34d399]"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-between border-t border-[#111814]/10 pt-4 font-display text-[15px] font-bold text-[#111814] dark:border-[#eef1ec]/10 dark:text-[#eef1ec]">
                <span>Total Liabilities</span>
                <span className="font-mono-tech tabular-nums text-red-600 dark:text-red-400">
                  {formatCurrency(totalLiabilities, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-6">
              <CalcResultPanel label="Your Net Worth" value={formatCurrency(netWorth, currency)} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Total Assets" value={formatCurrency(totalAssets, currency)} tone="signal" />
                <CalcStat label="Total Liabilities" value={formatCurrency(totalLiabilities, currency)} />
                <CalcStat label="Debt to Asset Ratio" value={`${debtToAssetRatio}%`} />
              </div>
            </div>

            <div>
              <h3 className="text-[13px] font-semibold text-[#111814]/70 dark:text-[#eef1ec]/70">Asset Liquidity Breakdown</h3>
              <div className="mt-3 divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat
                  label="Liquid Assets"
                  value={formatCurrency(liquidAssets, currency)}
                  share={totalAssets > 0 ? (liquidAssets / totalAssets) * 100 : 0}
                  tone="signal"
                />
                <CalcStat
                  label="Partly Liquid Assets"
                  value={formatCurrency(partialLiquidAssets, currency)}
                  share={totalAssets > 0 ? (partialLiquidAssets / totalAssets) * 100 : 0}
                />
                <CalcStat
                  label="Illiquid Assets"
                  value={formatCurrency(illiquidAssets, currency)}
                  share={totalAssets > 0 ? (illiquidAssets / totalAssets) * 100 : 0}
                />
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="mt-8 text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
            <span className="font-medium text-[#111814]/60 dark:text-[#eef1ec]/60">Disclaimer:</span>{" "}
            Your net worth is only as accurate as the values you enter. Use what each asset could be sold for
            today, and every amount still owed.
          </p>

          {/* SEO Content */}
          <div className="mt-16">

            <CalcSection title="What Is Net Worth?">
              <p>
                Net worth is the difference between your total assets (what you own) and total liabilities (what you owe).
                A positive net worth indicates financial health, while a negative one suggests you owe more than you own.
                Tracking your net worth over time helps you measure progress toward financial goals.
              </p>
            </CalcSection>

            <CalcSection title="What to count as an asset, and at what value">
              <p>
                Count everything you own that has a cash value, at the price it would sell for today, not what you
                paid:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong className={calcStrongClass}>Cash and deposits:</strong> bank balances, fixed and recurring deposits, at their current balance.</li>
                <li><strong className={calcStrongClass}>Investments:</strong> shares and mutual funds at today's market value, from your latest statement.</li>
                <li><strong className={calcStrongClass}>Retirement accounts:</strong> provident fund, pension and similar balances.</li>
                <li><strong className={calcStrongClass}>Property:</strong> what similar homes nearby sell for, not the price you bought at.</li>
                <li><strong className={calcStrongClass}>Gold and jewellery:</strong> the value of the metal, not the price paid with making charges.</li>
                <li><strong className={calcStrongClass}>Insurance policies:</strong> only the surrender value of savings-type policies; a term plan has none.</li>
                <li><strong className={calcStrongClass}>Vehicles:</strong> resale value, which falls every year (use an Other row).</li>
              </ul>
              <p>
                Leave out everyday belongings like furniture, phones and clothes: they're hard to sell for much, and
                including them makes your net worth look bigger than it is.
              </p>
            </CalcSection>

            <CalcSection title="What to count as a liability">
              <p>
                Include the outstanding balance of every debt, not the monthly payment: home, car, personal and
                education loans, your full credit card balance, money borrowed from family, and taxes or bills
                that are due. If you own a home worth {formatCurrency(exampleHome, currency)} with{" "}
                {formatCurrency(exampleLoan, currency)} still owed on it, the home adds{" "}
                {formatCurrency(exampleHome - exampleLoan, currency)} to your net worth, not the full value.
              </p>
            </CalcSection>

            <CalcSection title="Liquid, partly liquid and illiquid assets">
              <p>
                Two people with the same net worth can be in very different positions. If most of yours is in a
                house, you can't use it to pay a hospital bill next week. The liquidity breakdown above sorts your
                assets by how quickly they turn into cash:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong className={calcStrongClass}>Liquid:</strong> bank balances, deposits, shares and mutual funds you can sell within days.</li>
                <li><strong className={calcStrongClass}>Partly liquid:</strong> retirement accounts, bonds, small-savings schemes, gold and policies with a surrender value, which can be cashed but with lock-ins, penalties or waiting periods. Other rows count here too.</li>
                <li><strong className={calcStrongClass}>Illiquid:</strong> property, a stake in a business, art, annuities and pension funds, which can take months to sell or can't be cashed at all.</li>
              </ul>
              <p>
                A healthy position has enough liquid assets to cover an emergency fund of several months'
                expenses, which the{" "}
                <Link to="/emergency-fund-calculator" className={calcLinkClass}>
                  Emergency Fund Calculator
                </Link>{" "}
                works out.
              </p>
            </CalcSection>

            <CalcSection title="Debt-to-asset ratio">
              <p>
                The debt-to-asset ratio shows what share of everything you own is financed by debt. It's often high
                just after buying a home with a loan, and should fall steadily as you repay it. Above 50%, more than
                half of what you own is borrowed, which leaves little room if your income drops or property prices
                fall. Watch the direction over time more than any single reading.
              </p>
            </CalcSection>

            <CalcSection title="How does your net worth compare?">
              <p>
                Once you have your number, see how it stacks up. The{" "}
                <Link to="/net-worth-percentile" className={calcLinkClass}>
                  Global Net Worth Percentile Calculator
                </Link>{" "}
                ranks it against the world's adults. For comparisons by age, see{" "}
                <Link to="/blog/net-worth-by-age" className={calcLinkClass}>
                  net worth by age
                </Link>{" "}
                for the US, UK and global figures, or{" "}
                <Link to="/net-worth-by-age-canada" className={calcLinkClass}>
                  net worth by age in Canada
                </Link>
                . And the{" "}
                <Link to="/how-am-i-doing-financially-for-my-age" className={calcLinkClass}>
                  5-point financial check for your age
                </Link>{" "}
                puts net worth next to four other numbers that matter.
              </p>
            </CalcSection>

            <CalcSection title="How to Use This Calculator">
              <ol className="list-decimal space-y-2 pl-5">
                <li>Enter all your assets in the left column (bank balances, investments, real estate, etc.).</li>
                <li>Enter all your liabilities in the right column (loans, credit card dues, taxes, etc.).</li>
                <li>Your net worth and debt ratio update automatically.</li>
                <li>Use the liquidity breakdown to see how easily you can access your wealth.</li>
              </ol>
            </CalcSection>

            <CalcSection title="Why Track Net Worth">
              <CalcBenefitGrid
                items={[
                  { title: "The One Number That Matters Most", text: "Income tells you what's coming in; net worth tells you what you've actually kept and built. It's the single clearest scoreboard for whether your financial decisions are working." },
                  { title: "Reveals Debt Trends Early", text: "Checking net worth periodically surfaces a growing liabilities problem — like rising credit card balances — well before it becomes a crisis." },
                  { title: "Not the Same as Income", text: "A high earner with heavy debt and no savings can have a lower net worth than a modest earner who saves consistently — net worth measures accumulation, not paycheck size." },
                  { title: "A Trend, Not a Snapshot", text: "A single net worth number matters less than its direction. Recalculating quarterly or annually shows whether your overall financial position is genuinely improving." },
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
