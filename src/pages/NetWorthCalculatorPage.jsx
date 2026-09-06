import { useState } from "react";

import { useSettings } from "../context/SettingsContext";

import { formatCurrency } from "../utils/currency";

import AdSlot from "../components/ads/AdSlot";

import Seo from "@/components/seo/Seo";
import { calculatorSchema } from "@/components/seo/schema";

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
        jsonLd={calculatorSchema({
          name: "Net Worth Calculator",
          description: "Calculate your net worth by listing all assets and liabilities. Understand your financial position with clear asset and liability analysis.",
          path: "/networth-calculator",
        })}
      />

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
       

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-emerald-700 font-semibold text-sm uppercase tracking-wider mb-2">
              Financial Health Tool
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Net Worth Calculator
            </h1>
            <p className="text-slate-500 text-lg mt-3 max-w-2xl">
              List all your assets and liabilities to get a clear picture of your financial position.
            </p>
          </div>

          {/* Main Grid: Assets & Liabilities side by side */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Assets Panel */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">Total Assets</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {Object.entries(assets).map(([key, value]) => {
                  // Format label nicely
                  const label = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())
                    .replace(/(\d+)/g, ' $1');
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <label className="text-sm text-slate-600 w-1/2">{label}</label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={value}
                        onChange={(e) => handleAssetChange(key, e.target.value)}
                        className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between font-bold text-lg">
                <span>Total Assets</span>
                <span className="text-emerald-700">{formatCurrency(totalAssets, currency)}</span>
              </div>
            </div>

            {/* Liabilities Panel */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">Total Liabilities</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {Object.entries(liabilities).map(([key, value]) => {
                  const label = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())
                    .replace(/(\d+)/g, ' $1');
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <label className="text-sm text-slate-600 w-1/2">{label}</label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={value}
                        onChange={(e) => handleLiabilityChange(key, e.target.value)}
                        className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between font-bold text-lg">
                <span>Total Liabilities</span>
                <span className="text-red-500">
  {formatCurrency(totalLiabilities, currency)}
</span>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="mt-10 bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Your Net Worth</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-600">Total Assets</span>
                  <span className="font-bold text-emerald-700">{formatCurrency(totalAssets, currency)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-600">Total Liabilities</span>
                  <span className="font-bold text-red-500">
  {formatCurrency(totalLiabilities, currency)}
</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-600">Net Worth</span>
                  <span
  className={`font-bold text-2xl ${
    netWorth >= 0 ? "text-emerald-600" : "text-red-600"
  }`}
>
  {formatCurrency(netWorth, currency)}
</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Debt to Asset Ratio</span>
                  
                  <span className="font-bold">{debtToAssetRatio}%</span>
                </div>
              </div>
              <div className="space-y-4 bg-slate-50 rounded-2xl p-4">
                <h3 className="font-semibold text-slate-700">Asset Liquidity Breakdown</h3>
                <div className="flex justify-between">
                  <span className="text-slate-600">Liquid Assets</span>
                  <span className="font-bold">
  {formatCurrency(liquidAssets, currency)}
</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Partial Liquid Assets</span>
                  <span className="font-bold">
  {formatCurrency(partialLiquidAssets, currency)}
</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Illiquid Assets</span>
                  <span className="font-bold">
  {formatCurrency(illiquidAssets, currency)}
</span>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 text-xs text-slate-400 space-y-1 border-t border-slate-200 pt-4">
            <p>
              <span className="font-medium text-slate-500">Disclaimer:</span>{" "}
              Please note that these calculators are for illustrations only and do not represent actual returns.
              Stock Market does not have a fixed rate of return and it is not possible to predict the rate of return.
            </p>
          </div>

          {/* SEO Content – optional */}
          <div className="mt-16 space-y-10">
            <AdSlot slotId="networth_calc_mid" />
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">What Is Net Worth?</h2>
              <p className="text-slate-500 leading-relaxed">
                Net worth is the difference between your total assets (what you own) and total liabilities (what you owe). 
                A positive net worth indicates financial health, while a negative one suggests you owe more than you own.
                Tracking your net worth over time helps you measure progress toward financial goals.
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">How to Use This Calculator</h2>
              <ol className="list-decimal list-inside text-slate-500 space-y-2">
                <li>Enter all your assets in the left column (bank balances, investments, real estate, etc.).</li>
                <li>Enter all your liabilities in the right column (loans, credit card dues, taxes, etc.).</li>
                <li>Your net worth and debt ratio update automatically.</li>
                <li>Use the liquidity breakdown to see how easily you can access your wealth.</li>
              </ol>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Why Track Net Worth
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    The One Number That Matters Most
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Income tells you what's coming in; net worth tells you what
                    you've actually kept and built. It's the single clearest
                    scoreboard for whether your financial decisions are working.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    Reveals Debt Trends Early
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Checking net worth periodically surfaces a growing liabilities
                    problem — like rising credit card balances — well before it
                    becomes a crisis.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    Not the Same as Income
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    A high earner with heavy debt and no savings can have a lower
                    net worth than a modest earner who saves consistently — net
                    worth measures accumulation, not paycheck size.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    A Trend, Not a Snapshot
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    A single net worth number matters less than its direction.
                    Recalculating quarterly or annually shows whether your overall
                    financial position is genuinely improving.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Should I include my home in net worth?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Yes, as an asset at its current market value, with any
                    outstanding mortgage counted as a liability. Some people track
                    net worth with and without the primary home separately, since
                    it's illiquid and not usually meant to be sold.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Is a negative net worth bad?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Common early in careers — student loans or a recent home
                    purchase can put net worth below zero temporarily. What matters
                    is the trend: is it moving toward positive over time?
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    How often should I recalculate my net worth?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Quarterly or annually is enough for most people. Checking
                    daily or weekly just tracks market noise rather than genuine
                    progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      
      </div>
    </>
  );
}