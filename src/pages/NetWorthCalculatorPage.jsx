import { useState } from "react";

import { useSettings } from "../context/SettingsContext";

import { formatCurrency } from "../utils/currency";

import AdSlot from "../components/ads/AdSlot";

import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
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
];

export default function NetWorthCalculatorPage() {
  // ─── Asset States ──────────────────────────────────────────────
  const [assets, setAssets] = useState({
    savingsAccount: 100000,
    currentAccount: 0,
    liquidMutualFunds: 300000,
    fixedDeposits: 200000,
    recurringDeposits: 0,
    debtMutualFunds: 0,
    retirementAccount: 500000,
spouseRetirementAccount: 0,
childrenRetirementAccount: 0,
employerRetirementPlan: 0,
governmentRetirementPlan: 1000000,
governmentBond: 0,
savingsCertificate: 0,
    corporateDeposits: 0,
    postOfficeDeposits: 0,
    shares: 0,
    equityMutualFunds: 1000000,
    bonds: 0,
    debentures: 0,
    annuities: 0,
    pensionFund: 0,
    insurancePolicies: 0,
    goldSilverJewels: 0,
    artAntiques: 0,
    businessPartnership: 0,
    realEstate: 5000000,
    other1: 0,
    other2: 0,
    other3: 0,
    other4: 0,
    other5: 0,
    other6: 0,
  });

  // ─── Liability States ──────────────────────────────────────────

  const [liabilities, setLiabilities] = useState({
    homeLoan: 2500000,
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
  });
const { settings } = useSettings();

const currency = settings.currency;
  // ─── Update handlers ────────────────────────────────────────────
  const handleAssetChange = (key, value) => {
    setAssets((prev) => ({ ...prev, [key]: Number(value) || 0 }));
  };

  const handleLiabilityChange = (key, value) => {
    setLiabilities((prev) => ({ ...prev, [key]: Number(value) || 0 }));
  };

  // ─── Computed totals ────────────────────────────────────────────
  const totalAssets = Object.values(assets).reduce((sum, val) => sum + val, 0);
  const totalLiabilities = Object.values(liabilities).reduce((sum, val) => sum + val, 0);
  const netWorth = totalAssets - totalLiabilities;
  const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets * 100).toFixed(2) : 0;
  // Liquidity breakdown (based on category in the design)
  // We classify each asset as liquid, partial liquid, or illiquid.
  // Using the labels from the image:
  // Liquid: savingsAccount, currentAccount, liquidMutualFunds, fixedDeposits, recurringDeposits,
  // debtMutualFunds, nsc, kvp, corporateDeposits, postOfficeDeposits, shares, equityMutualFunds,
  // debentures, annuities, pensionFund, insurancePolicies, goldSilverJewels, artAntiques,
  // businessPartnership, realEstate, other1-6
  // Partial liquid: ppfSelf, ppfSpouse, ppfChildren, epf, nps, bonds
  // Illiquid: (none explicitly, but we can consider real estate as illiquid? Actually in the image it's labelled "liquid" but we follow the image classification)
  // From the image: "liquid" for most, "partial liquid" for PPF, EPF, NPS, bonds.
  // We'll use that classification.

  const liquidAssetKeys = [
    "savingsAccount", "currentAccount", "liquidMutualFunds", "fixedDeposits",
    "recurringDeposits", "debtMutualFunds", "nsc", "kvp", "corporateDeposits",
    "postOfficeDeposits", "shares", "equityMutualFunds", "debentures", "annuities",
    "pensionFund", "insurancePolicies", "goldSilverJewels", "artAntiques",
    "businessPartnership", "realEstate", "other1", "other2", "other3", "other4",
    "other5", "other6"
  ];
 const partialLiquidKeys = [
  "retirementAccount",
  "spouseRetirementAccount",
  "childrenRetirementAccount",
  "employerRetirementPlan",
  "governmentRetirementPlan",
  "bonds"
];
  const illiquidKeys = []; // none in this list

  const liquidAssets = liquidAssetKeys.reduce((sum, key) => sum + (assets[key] || 0), 0);
  const partialLiquidAssets = partialLiquidKeys.reduce((sum, key) => sum + (assets[key] || 0), 0);
  const illiquidAssets = illiquidKeys.reduce((sum, key) => sum + (assets[key] || 0), 0);

  // ─── Effect (optional) ──────────────────────────────────────────
  // You could add a useEffect to log or store results

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
        faqSchema([
          {
            "question": "Should I include my home in net worth?",
            "answer": "Yes, as an asset at its current market value, with any outstanding mortgage counted as a liability. Some people track net worth with and without the primary home separately, since it's illiquid and not usually meant to be sold."
          },
          {
            "question": "Is a negative net worth bad?",
            "answer": "Common early in careers — student loans or a recent home purchase can put net worth below zero temporarily. What matters is the trend: is it moving toward positive over time?"
          },
          {
            "question": "How often should I recalculate my net worth?",
            "answer": "Quarterly or annually is enough for most people. Checking daily or weekly just tracks market noise rather than genuine progress."
          }
        ]),
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
                  label="Partial Liquid Assets"
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
            Please note that these calculators are for illustrations only and do not represent actual returns.
            Stock Market does not have a fixed rate of return and it is not possible to predict the rate of return.
          </p>

          {/* SEO Content */}
          <div className="mt-16">
            <AdSlot slotId="networth_calc_mid" />

            <CalcSection title="What Is Net Worth?">
              <p>
                Net worth is the difference between your total assets (what you own) and total liabilities (what you owe).
                A positive net worth indicates financial health, while a negative one suggests you owe more than you own.
                Tracking your net worth over time helps you measure progress toward financial goals.
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
