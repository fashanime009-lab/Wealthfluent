import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function BondYieldCalculatorPage() {
  // ─── State ──────────────────────────────────────────────────────
  const [currentPrice, setCurrentPrice] = useState(950);
  const [parValue, setParValue] = useState(1000);
  const [couponRate, setCouponRate] = useState(8);
  const [yearsToMaturity, setYearsToMaturity] = useState(10);

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

  // ─── Format currency ──────────────────────────────────────────
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // ─── Format percentage ──────────────────────────────────────────
  const formatPercentage = (value) => {
    return value.toFixed(2);
  };

  // ─── Handlers ──────────────────────────────────────────────────
  const handlePriceChange = (e) => {
    setCurrentPrice(Number(e.target.value) || 0);
  };

  const handleParChange = (e) => {
    setParValue(Number(e.target.value) || 0);
  };

  const handleCouponChange = (e) => {
    setCouponRate(Number(e.target.value) || 0);
  };

  const handleYearsChange = (e) => {
    setYearsToMaturity(Number(e.target.value) || 1);
  };

  return (
    <>
      <Helmet>
        <title>Bond Yield Calculator – Current Yield & YTM</title>
        <meta
          name="description"
          content="Calculate bond current yield and yield to maturity (YTM) based on price, par value, coupon rate, and years to maturity."
        />
        <meta
          name="keywords"
          content="bond yield calculator, current yield, yield to maturity, YTM, bond calculator"
        />
      </Helmet>

      <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
        <Navbar />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Header */}
          <div className="mb-10">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Fixed Income Calculator
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Bond Yield Calculator
            </h1>
            <p className="text-slate-500 text-lg mt-3 max-w-2xl">
              Calculate the current yield and yield to maturity (YTM) of a bond based on price, par value, coupon rate, and time to maturity.
            </p>
          </div>

          {/* Calculator Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel – Inputs */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                Bond Details
              </h2>

              <div className="space-y-8">
                {/* Current Price */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Current Price
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                      ₹{formatCurrency(currentPrice)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="5"
                    value={currentPrice}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>₹100</span>
                    <span>₹10,000</span>
                  </div>
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    step="5"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(Number(e.target.value) || 100)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Par Value */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Par Value
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                      ₹{formatCurrency(parValue)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={parValue}
                    onChange={handleParChange}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>₹100</span>
                    <span>₹10,000</span>
                  </div>
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    step="100"
                    value={parValue}
                    onChange={(e) => setParValue(Number(e.target.value) || 100)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Coupon Rate */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Coupon Rate (%)
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                      {couponRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.5"
                    value={couponRate}
                    onChange={handleCouponChange}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>0%</span>
                    <span>20%</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    value={couponRate}
                    onChange={(e) => setCouponRate(Number(e.target.value) || 0)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Years to Maturity */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">
                      Years to Maturity
                    </label>
                    <span className="text-sm font-semibold text-blue-600">
                      {yearsToMaturity} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={yearsToMaturity}
                    onChange={handleYearsChange}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1 Year</span>
                    <span>50 Years</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    step="1"
                    value={yearsToMaturity}
                    onChange={(e) => setYearsToMaturity(Number(e.target.value) || 1)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Calculate Button (optional since we have real-time) */}
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-2xl shadow-lg shadow-blue-200 text-lg"
                  onClick={() => {}}
                >
                  Calculate
                </button>
              </div>
            </div>

            {/* Right Panel – Results */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 flex flex-col">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                Bond Yield Results
              </h2>

              <div className="flex-1 space-y-6">
                {/* Current Yield */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <p className="text-sm text-slate-500">Current Yield</p>
                  <p className="text-4xl md:text-5xl font-bold text-blue-600 mt-1">
                    {formatPercentage(results.currentYield)}%
                  </p>
                </div>

                {/* Yield to Maturity */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                  <p className="text-sm text-slate-500">Yield to Maturity (YTM)</p>
                  <p className="text-4xl md:text-5xl font-bold text-emerald-600 mt-1">
                    {formatPercentage(results.ytm)}%
                  </p>
                </div>

                {/* Bond Details Summary */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/50 space-y-3">
                  <h3 className="font-semibold text-slate-700 text-sm">Bond Summary</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Coupon Payment</span>
                    <span className="font-medium">₹{formatCurrency(results.couponPayment)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Current Price</span>
                    <span className="font-medium">₹{formatCurrency(currentPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Par Value</span>
                    <span className="font-medium">₹{formatCurrency(parValue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Years to Maturity</span>
                    <span className="font-medium">{yearsToMaturity} years</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-slate-200 pt-2">
                    <span className="text-slate-500">Price vs Par</span>
                    <span className={`font-medium ${currentPrice > parValue ? 'text-amber-600' : currentPrice < parValue ? 'text-blue-600' : 'text-slate-600'}`}>
                      {currentPrice > parValue ? 'Premium' : currentPrice < parValue ? 'Discount' : 'At Par'}
                    </span>
                  </div>
                </div>

                {/* Visual indicator */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/50">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Current Yield</span>
                    <span>YTM</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${Math.min((results.currentYield / Math.max(results.ytm, results.currentYield)) * 100, 100)}%`,
                      }}
                    />
                    <div
                      className="h-full bg-emerald-500"
                      style={{
                        width: `${Math.min((results.ytm / Math.max(results.ytm, results.currentYield)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>{formatPercentage(results.currentYield)}%</span>
                    <span>{formatPercentage(results.ytm)}%</span>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 text-xs text-slate-400 space-y-1 border-t border-slate-200 pt-4">
                <p>
                  <span className="font-medium text-slate-500">Disclaimer:</span>{" "}
                  Please note that these calculators are for illustrations only and do not represent actual returns.
                </p>
                <p>
                  Stock Market does not have a fixed rate of return and it is not possible to predict the rate of return.
                </p>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16 space-y-10">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">What Is a Bond Yield Calculator?</h2>
              <p className="text-slate-500 leading-relaxed">
                A Bond Yield Calculator helps investors estimate the return they can expect from a bond investment. It calculates the current yield (annual coupon payment divided by current price) and the yield to maturity (total return if held until maturity), providing insights into bond valuation and investment decisions.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">How to Use This Calculator</h2>
              <ol className="list-decimal list-inside text-slate-500 space-y-2">
                <li>Enter the bond's current market price.</li>
                <li>Enter the bond's par value (face value).</li>
                <li>Enter the coupon rate (annual interest rate).</li>
                <li>Enter the number of years until maturity.</li>
                <li>The calculator will display the current yield and yield to maturity.</li>
              </ol>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Understanding Bond Yields</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Current Yield</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Current yield is the annual coupon payment divided by the current market price. It shows the income return relative to the price paid, but doesn't account for capital gains or losses at maturity.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Yield to Maturity (YTM)</h3>
                  <p className="text-slate-500 leading-relaxed">
                    YTM is the total annualized return an investor will earn if they hold the bond until maturity, including both coupon payments and any capital gain or loss if the bond is purchased at a discount or premium.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Bond Pricing</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Bonds trade at a discount when the current price is below par value, at a premium when above par, and at par when equal. The YTM inversely relates to price – higher price means lower YTM.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Risk Considerations</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Bonds carry interest rate risk, credit risk, and reinvestment risk. A higher YTM often implies higher risk. Always consider the issuer's creditworthiness before investing.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">What is the difference between current yield and YTM?</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Current yield only considers the coupon income relative to the price paid, while YTM accounts for all future cash flows (coupons and principal repayment) and provides the annualized return if the bond is held to maturity.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">Is a higher YTM always better?</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Not necessarily. A higher YTM may indicate higher risk (credit risk, interest rate risk). Investors should assess the bond's credit rating and the issuer's financial health before investing.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700">How does YTM relate to bond price?</h3>
                  <p className="text-slate-500 leading-relaxed">
                    YTM and bond price have an inverse relationship. When market interest rates rise, bond prices fall, and the YTM increases. When rates fall, bond prices rise, and YTM decreases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}