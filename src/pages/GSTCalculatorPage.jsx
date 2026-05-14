import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function GSTCalculatorPage() {
  const [amount, setAmount] = useState(1000);
  const [gstRate, setGstRate] = useState(18);

  const gstAmount = (amount * gstRate) / 100;
  const totalAmount = amount + gstAmount;

  return (
    <>
      <Helmet>
        <title>
          GST Calculator India – Add or Remove GST
        </title>

        <meta
          name="description"
          content="Free GST Calculator to calculate GST amount, total invoice value, and tax breakdown instantly."
        />
      </Helmet>

      <div className="min-h-screen bg-[#07111f] text-white">
        {/* Header */}
        <header className="border-b border-white/10 bg-[#07111f]/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/">
              <h1 className="text-2xl font-black">
                Wealth<span className="text-cyan-400">Fluent</span>
              </h1>
            </Link>

            <Link
              to="/"
              className="text-cyan-400 hover:text-cyan-300"
            >
              ← Back To Home
            </Link>
          </div>
        </header>

        {/* Main */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="mb-14">
            <p className="text-cyan-400 font-semibold mb-3">
              TAX CALCULATION TOOL
            </p>

            <h1 className="text-6xl font-black">
              GST Calculator
            </h1>

            <p className="text-slate-400 text-lg mt-6 max-w-3xl">
              Calculate GST amount, tax-inclusive pricing,
              and invoice totals instantly for businesses
              and consumers in India.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Left */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <h2 className="text-3xl font-black mb-10">
                GST Details
              </h2>

              <div className="space-y-10">
                {/* Amount */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-semibold">
                      Base Amount
                    </label>

                    <span className="text-cyan-400 text-2xl font-black">
                      ₹{amount.toLocaleString()}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="100"
                    max="100000"
                    step="100"
                    value={amount}
                    onChange={(e) =>
                      setAmount(Number(e.target.value))
                    }
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* GST Rate */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-semibold">
                      GST Rate
                    </label>

                    <span className="text-cyan-400 text-2xl font-black">
                      {gstRate}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="28"
                    step="1"
                    value={gstRate}
                    onChange={(e) =>
                      setGstRate(Number(e.target.value))
                    }
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/10 rounded-[32px] p-8">
              <div className="space-y-8">
                <div className="bg-[#0d1a2b] rounded-3xl p-6 border border-white/10">
                  <p className="text-slate-400 mb-3">
                    GST Amount
                  </p>

                  <h2 className="text-5xl font-black text-cyan-400">
                    ₹{gstAmount.toLocaleString()}
                  </h2>
                </div>

                <div className="bg-[#0d1a2b] rounded-3xl p-6 border border-white/10">
                  <p className="text-slate-400 mb-3">
                    Total Amount Including GST
                  </p>

                  <h2 className="text-5xl font-black text-emerald-400">
                    ₹{totalAmount.toLocaleString()}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-24 space-y-10">
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-10">
              <h2 className="text-4xl font-black mb-6">
                What Is GST Calculator?
              </h2>

              <p className="text-slate-400 text-lg leading-relaxed">
                A GST Calculator helps businesses and consumers calculate
                Goods and Services Tax (GST) quickly for invoices,
                product pricing, and tax estimation in India.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-10">
              <h2 className="text-4xl font-black mb-8">
                Benefits Of GST Calculator
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                    Faster Invoice Calculation
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    Quickly estimate GST-inclusive invoice totals
                    without manual tax calculations.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                    Better Tax Planning
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    Businesses can estimate tax obligations and
                    product pricing more accurately.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-10">
              <h2 className="text-4xl font-black mb-8">
                Frequently Asked Questions
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-3">
                    What are common GST rates in India?
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    Common GST slabs include 5%, 12%, 18%, and 28%
                    depending on product and service category.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3">
                    How is GST calculated?
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    GST is calculated by multiplying the taxable amount
                    by the applicable GST percentage.
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