import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { calculatorSchema } from "@/components/seo/schema";
import AdSlot from "../components/ads/AdSlot";

export default function GSTCalculatorPage() {
  const [amount, setAmount] = useState(1000);
  const [gstRate, setGstRate] = useState(18);

  const gstAmount = (amount * gstRate) / 100;
  const totalAmount = amount + gstAmount;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <Seo
        title="GST Calculator India – Add or Remove GST"
        description="Free GST Calculator to calculate GST amount, total invoice value, and tax breakdown instantly for businesses and consumers in India."
        path="/gst-calculator"
        keywords="GST calculator, goods and services tax, GST calculation, tax calculator"
        jsonLd={calculatorSchema({
          name: "GST Calculator India",
          description: "Free GST Calculator to calculate GST amount, total invoice value, and tax breakdown instantly for businesses and consumers in India.",
          path: "/gst-calculator",
        })}
      />

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
        

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-emerald-700 font-semibold text-sm uppercase tracking-wider mb-2">
              Tax Calculation Tool
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              GST Calculator
            </h1>
            <p className="text-slate-500 text-lg mt-3 max-w-2xl">
              Calculate GST amount, tax-inclusive pricing, and invoice totals
              instantly for businesses and consumers in India.
            </p>
          </div>

          {/* Calculator Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel – Inputs */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                GST Details
              </h2>

              <div className="space-y-8">
                {/* Base Amount */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Base Amount
                    </label>
                    <span className="text-sm font-semibold text-emerald-700">
                      ₹{formatCurrency(amount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="100000"
                    step="100"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>₹100</span>
                    <span>₹1,00,000</span>
                  </div>
                  <input
                    type="number"
                    min="100"
                    max="100000"
                    step="100"
                    value={amount}
                    onChange={(e) =>
                      setAmount(Number(e.target.value) || 100)
                    }
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>

                {/* GST Rate */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      GST Rate (%)
                    </label>
                    <span className="text-sm font-semibold text-emerald-700">
                      {gstRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="28"
                    step="1"
                    value={gstRate}
                    onChange={(e) => setGstRate(Number(e.target.value))}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1%</span>
                    <span>28%</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="28"
                    step="1"
                    value={gstRate}
                    onChange={(e) =>
                      setGstRate(Number(e.target.value) || 1)
                    }
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Right Panel – Results */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 flex flex-col">
              <div className="mb-6">
                <p className="text-sm text-slate-500">GST Amount</p>
                <h2 className="text-4xl md:text-5xl font-bold text-emerald-700 mt-1">
                  ₹{formatCurrency(gstAmount)}
                </h2>
              </div>

              <div className="space-y-4 flex-1">
                {/* Total Amount */}
                <div className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total Amount (Including GST)</span>
                    <span className="text-lg font-semibold text-emerald-600">
                      ₹{formatCurrency(totalAmount)}
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{
                        width: `${Math.min((gstAmount / totalAmount) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Breakup */}
                <div className="bg-slate-50 rounded-2xl p-5">
                  <p className="text-sm text-slate-500 mb-2">Tax Breakdown</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Base Amount</span>
                    <span className="font-medium text-slate-700">
                      ₹{formatCurrency(amount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-slate-600">GST @ {gstRate}%</span>
                    <span className="font-medium text-emerald-700">
                      + ₹{formatCurrency(gstAmount)}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 text-xs text-slate-400 space-y-1 border-t border-slate-100 pt-4">
                <p>
                  <span className="font-medium text-slate-500">Disclaimer:</span>{" "}
                  This calculator is for illustrative purposes only. GST rates
                  and classifications may vary based on goods/services and
                  government notifications. Please consult a tax professional
                  for accurate tax compliance.
                </p>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16 space-y-10">
            <AdSlot slotId="gst_calc_mid" />
            {/* What is GST Calculator */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                What Is GST Calculator?
              </h2>
              <p className="text-slate-500 leading-relaxed">
                A GST Calculator helps businesses and consumers calculate
                Goods and Services Tax (GST) quickly for invoices,
                product pricing, and tax estimation in India. It supports
                common GST slabs and provides instant tax-inclusive totals.
              </p>
              <p className="text-slate-500 leading-relaxed mt-4">
                GST replaced most of India's earlier indirect taxes (VAT, service
                tax, excise duty) with a single, unified tax applied at each stage
                of the supply chain. Depending on whether a transaction happens
                within a state or across states, GST is split into CGST + SGST
                (intra-state) or IGST (inter-state) — the combined rate a buyer
                pays is the same either way, only how it's divided between central
                and state governments differs.
              </p>
            </div>

            {/* How GST Is Calculated */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                How Is GST Calculated?
              </h2>
              <p className="text-slate-500 leading-relaxed">
                For adding GST to a base amount:
              </p>
              <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700">
                GST Amount = (Base Amount × GST Rate) / 100 &nbsp;|&nbsp; Total = Base Amount + GST Amount
              </p>
              <p className="text-slate-500 leading-relaxed mt-4">
                For example, a ₹1,000 base amount at 18% GST adds ₹180, for a total
                of ₹1,180. If you instead have a GST-inclusive price and need to find
                the base amount, divide by (1 + rate/100): a ₹1,180 inclusive price
                at 18% GST works back to a ₹1,000 base — the reverse of the forward
                calculation above.
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Benefits Of GST Calculator
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    Faster Invoice Calculation
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Quickly estimate GST-inclusive invoice totals
                    without manual tax calculations.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    Better Tax Planning
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Businesses can estimate tax obligations and
                    product pricing more accurately.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    Transparent Pricing
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Consumers can understand how much tax they are
                    paying on purchases.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    Error-Free Calculations
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Avoid manual errors in tax computation and
                    ensure accurate billing.
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
                    What are common GST rates in India?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Common GST slabs include 5%, 12%, 18%, and 28%
                    depending on product and service category. Some
                    essential goods are taxed at 0% or 5%.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    How is GST calculated?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    GST is calculated by multiplying the taxable amount
                    by the applicable GST percentage. The total amount
                    is the sum of the base amount and the GST amount.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Can this calculator be used for all GST types?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    This calculator works for both CGST+SGST (intra-state)
                    and IGST (inter-state) by applying the combined rate.
                    For detailed bifurcation, consult a tax advisor.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    How do I remove GST from a total price?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    Divide the GST-inclusive total by (1 + GST rate/100) to get the
                    base amount, then subtract that from the total to find the GST
                    portion — the reverse of adding GST to a base amount.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">
                    Is GST the same across all of India?
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    The rate slabs (5%, 12%, 18%, 28%) are set nationally and apply
                    uniformly across states — what changes state to state is only
                    the CGST/SGST split, never the total rate a buyer pays.
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