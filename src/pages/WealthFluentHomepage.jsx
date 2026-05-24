import { Link } from "react-router-dom";
import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import axios from "axios";
import { useEffect } from "react";

import FinanceOrbHero from "../components/FinanceOrbHero";
export default function WealthFluentHomepage() {
    const { sipData } = useFinance();
    const [mobileMenu, setMobileMenu] = useState(false);
    const [marketData, setMarketData] = useState({
  bitcoin: null,
  gold: null,
  nifty: null,
  sensex: null,
  fearGreed: null,
});
useEffect(() => {
  const fetchMarketData = async () => {
  try {
   const results = await Promise.allSettled([

      axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"
      ),

      // GOLD
axios.get("https://api.gold-api.com/price/XAU"),

// NIFTY
axios.get(
  "https://api.allorigins.win/raw?url=https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI"
),

// SENSEX
axios.get(
  "https://api.allorigins.win/raw?url=https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN"
),

      axios.get(
        "https://api.alternative.me/fng/"
      ),
    ]);
    const [
  btcRes,
  goldRes,
  niftyRes,
  sensexRes,
  fearRes,
] = results;

    setMarketData({
      bitcoin:
  btcRes.status === "fulfilled"
    ? {
        price: btcRes.value.data.bitcoin.usd,
        change:
          btcRes.value.data.bitcoin.usd_24h_change,
      }
    : null,

      gold:
  goldRes.status === "fulfilled"
    ? {
        price: goldRes.value.data.price,
        change: goldRes.value.data.ch,
      }
    : null,

nifty:
  niftyRes.status === "fulfilled"
    ? {
        price:
          niftyRes.value.data.chart.result[0].meta.regularMarketPrice,

        change:
          niftyRes.value.data.chart.result[0].meta.regularMarketChangePercent,
      }
    : null,

sensex:
  sensexRes.status === "fulfilled"
    ? {
        price:
          sensexRes.value.data.chart.result[0].meta.regularMarketPrice,

        change:
          sensexRes.value.data.chart.result[0].meta.regularMarketChangePercent,
      }
    : null,

      fearGreed:
  fearRes.status === "fulfilled"
    ? {
        value:
          fearRes.value.data.data[0].value,

        text:
          fearRes.value.data.data[0].value_classification,
      }
    : null,
    });
  } catch (error) {
    console.log(error);
  }
};

  fetchMarketData();

  const interval = setInterval(fetchMarketData, 30000);

  return () => clearInterval(interval);
}, []);
  const calculators = [
    {
      title: "SIP Calculator",
      desc: "Calculate future wealth from monthly SIP investments.",
      icon: "📈",
      route: "/sip-calculator",
    },
    {
      title: "EMI Calculator",
      desc: "Estimate loan EMIs instantly with smart breakdowns.",
      icon: "🏦",
      route: "/emi-calculator",
    },
    {
      title: "FD Calculator",
      desc: "Check fixed deposit maturity and interest returns.",
      icon: "💰",
      route: "/fd-calculator",
    },
    {
      title: "CAGR Calculator",
      desc: "Measure annual investment growth accurately.",
      icon: "🚀",
      route: "/cagr-calculator",
    },
    {
      title: "GST Calculator",
      desc: "Add or remove GST quickly for invoices and pricing.",
      icon: "🧾",
      route: "/gst-calculator",
    },
    {
      title: "Retirement Calculator",
      desc: "Plan your future financial independence journey.",
      icon: "🌴",
      route: "/retirement-calculator",
    },
    {
  title: "Wealth Age Tool",
  desc: "Discover your financial age and wealth personality.",
  icon: "🧠",
  route: "/wealth-age-calculator",
},
  ];
const investedAmount =
  sipData.monthlyInvestment *
  sipData.years *
  12;

const gain =
  sipData.futureValue - investedAmount;

const growthPercentage =
  investedAmount > 0
    ? ((gain / investedAmount) * 100).toFixed(1)
    : 0;

const now = new Date();

const indiaTime = new Date(
  now.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  })
);

const day = indiaTime.getDay();

const hours = indiaTime.getHours();
const minutes = indiaTime.getMinutes();

const currentMinutes = hours * 60 + minutes;

const marketOpen =
  day >= 1 &&
  day <= 5 &&
  currentMinutes >= 555 && // 9:15
  currentMinutes <= 930;   // 15:30

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative">

  {/* Background Effects */}
  <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full" />

  <div className="absolute top-[40%] right-[-200px] w-[500px] h-[500px] bg-blue-500/20 blur-[160px] rounded-full" />

  <div className="absolute bottom-[-250px] left-[30%] w-[600px] h-[600px] bg-cyan-400/10 blur-[180px] rounded-full" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_30%)]" />

<div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] bg-[size:90px_90px]" />

  <div className="relative z-10">
      {/* Navbar */}
<header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/60 shadow-2xl shadow-cyan-500/5 backdrop-blur-xl">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    {/* Logo */}
    <Link to="/">
      <h1 className="text-3xl font-black tracking-tight drop-shadow-lg">
        Wealth<span className="text-cyan-400">Fluent</span>
      </h1>
    </Link>

    {/* Desktop Nav */}
    <nav className="hidden lg:flex items-center gap-8 text-sm text-slate-300">
      <a href="#calculators" className="hover:text-white transition">
        Calculators
      </a>

      <a href="#articles" className="hover:text-white transition">
        Articles
      </a>

      <Link to="/about" className="hover:text-white transition">
        About
      </Link>

      <Link to="/contact" className="hover:text-white transition">
        Contact
      </Link>
    </nav>

    {/* Desktop Button */}
    <div className="hidden lg:block">
      <Link
  to="/tools"
  className="bg-cyan-500 hover:bg-cyan-400 transition px-5 py-3 rounded-2xl text-black font-bold shadow-lg shadow-cyan-500/20"
>
  Explore Tools
</Link>
    </div>

    {/* Mobile Button */}
    <button
      onClick={() => setMobileMenu(!mobileMenu)}
      className="lg:hidden w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-2xl"
    >
      {mobileMenu ? "✕" : "☰"}
    </button>
  </div>

  {/* Mobile Menu */}
  {mobileMenu && (
    <div className="lg:hidden border-t border-white/10 bg-[#07111f]">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-5">
        <a
          href="#calculators"
          onClick={() => setMobileMenu(false)}
          className="text-slate-300 hover:text-white transition"
        >
          Calculators
        </a>

        <a
          href="#articles"
          onClick={() => setMobileMenu(false)}
          className="text-slate-300 hover:text-white transition"
        >
          Articles
        </a>

        <Link
          to="/about"
          onClick={() => setMobileMenu(false)}
          className="text-slate-300 hover:text-white transition"
        >
          About
        </Link>

        <Link
          to="/contact"
          onClick={() => setMobileMenu(false)}
          className="text-slate-300 hover:text-white transition"
        >
          Contact
        </Link>

        <Link
          to="/sip-calculator"
          onClick={() => setMobileMenu(false)}
          className="bg-cyan-500 hover:bg-cyan-400 transition px-5 py-4 rounded-2xl text-black font-bold text-center mt-3"
        >
          Explore Tools
        </Link>
      </div>
    </div>
  )}
</header>
<FinanceOrbHero />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute right-[-150px] top-[50px] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />

<div className="absolute left-[-200px] bottom-[-100px] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.15),transparent_45%)]" />

        <div className="max-w-7xl mx-auto px-6 py-36 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 px-4 py-2 rounded-full text-sm mb-8">
                ⚡ Smart Finance Tools For Everyone
              </div>

              <h1 className="text-5xl md:text-7xl xl:text-8xl font-black leading-[0.9] tracking-[-4px] max-w-4xl">
                Control Your Wealth
<span className="block text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-500 bg-clip-text">
Intelligently
</span>
              </h1>

              <p className="text-slate-300 text-2xl leading-relaxed mt-8 max-w-2xl">
                Powerful calculators, investment tools, loan estimators,
                and financial resources designed to help users make
                smarter money decisions.
              </p>

              <div className="flex flex-wrap gap-5 mt-10">
                
  <Link
    to="/calculators"
   className="group relative overflow-hidden rounded-2xl bg-cyan-400 px-8 py-4 font-bold text-black transition-all duration-300 hover:scale-[1.03] hover:bg-cyan-300 shadow-lg shadow-cyan-500/20"
  >
    <span className="relative z-10">
      Start Calculating
    </span>

    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition duration-500" />
  </Link>

  <a
    href="/tools"
    className="border border-white/10 bg-white/5 backdrop-blur-xl hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-all duration-300 px-10 py-5 rounded-3xl font-semibold hover:scale-105"
  >
    Explore Tools
  </a>

</div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-16">
                <div>
                  <h3 className="text-4xl font-black text-cyan-400">
                    100+
                  </h3>

                  <p className="text-slate-400 mt-2 text-sm">
                    Planned Finance Tools
                  </p>
                </div>

                <div>
                  <h3 className="text-4xl font-black text-cyan-400">
                    Free
                  </h3>

                  <p className="text-slate-400 mt-2 text-sm">
                    Forever Access
                  </p>
                </div>

                <div>
                  <h3 className="text-4xl font-black text-cyan-400">
                    Fast
                  </h3>

                  <p className="text-slate-400 mt-2 text-sm">
                    Optimized Experience
                  </p>
                </div>
              </div>
            </div>

            {/* Right Dashboard */}
            <div className="relative bg-[#0b1220]/90 border border-white/10 rounded-[40px] p-10 shadow-2xl shadow-black/40 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-400/10 to-transparent" />
                <div>
                  <p className="text-slate-400 text-sm">
                    Portfolio Growth
                  </p>

                  <h2
  className={`text-5xl font-black mt-2 ${
    gain >= 0
      ? "text-emerald-400"
      : "text-red-400"
  }`}
>
  {gain >= 0 ? "+" : ""}
  {growthPercentage}%
</h2>
                </div>

                <div
  className={`px-4 py-2 rounded-2xl font-bold ${
    gain >= 0
      ? "bg-emerald-500/10 text-emerald-400"
      : "bg-red-500/10 text-red-400"
  }`}
>
  {gain >= 0 ? "+" : "-"}₹
  {Math.abs(gain).toLocaleString()}
</div>
              </div>

              <div className="space-y-6">

  {/* Wealth Score */}
  <div className="bg-white/5 border border-white/10 rounded-3xl p-5 hover:border-cyan-400/20 transition">

    <div className="flex items-center justify-between mb-4">
      <p className="text-slate-400">
        Wealth Score
      </p>

      <span className="text-cyan-400 font-bold">
        Elite
      </span>
    </div>

    <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
      <div className="h-full w-[82%] bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full shadow-[0_0_25px_rgba(0,255,255,0.5)]" />
    </div>

    <div className="flex justify-between mt-3 text-sm">
      <span className="text-slate-500">
        Score
      </span>

      <span className="text-white font-bold">
        {Math.min(
  100,
  Math.floor(
    sipData.monthlyInvestment / 500 +
    sipData.years * 2
  )
)} / 100
      </span>
    </div>
  </div>

  {/* Asset Allocation */}
  <div className="bg-white/5 border border-white/10 rounded-3xl p-5 hover:border-cyan-400/20 transition">

    <div className="flex items-center justify-between mb-5">
      <p className="text-slate-400">
        Asset Allocation
      </p>

      <span className={`font-bold ${
  marketData.bitcoin?.change >= 0
    ? "text-emerald-400"
    : "text-red-400"
}`}>
        Diversified
      </span>
    </div>

    <div className="space-y-4">

      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Equity</span>
          <span>65%</span>
        </div>

        <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
          <div className="h-full w-[65%] bg-cyan-400 rounded-full" />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Gold</span>
          <span>15%</span>
        </div>

        <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
          <div className="h-full w-[15%] bg-yellow-400 rounded-full" />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>FD</span>
          <span>20%</span>
        </div>

        <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
          <div className="h-full w-[20%] bg-emerald-400 rounded-full" />
        </div>
      </div>

    </div>
  </div>

  {/* Passive Income */}
  <div className="bg-[#0b1220] border border-cyan-400/10 rounded-3xl p-6">

    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm">
          Monthly Passive Income
        </p>

        <h3 className="text-4xl font-black mt-2 text-cyan-300">
          ₹18,500
        </h3>
      </div>

      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-3xl">
        💸
      </div>
    </div>
  </div>

</div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-slate-400 text-sm">
                    Monthly SIP
                  </p>

                  <h3 className="text-3xl font-black mt-2">
                    ₹{sipData.monthlyInvestment.toLocaleString()}
                  </h3>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-slate-400 text-sm">
                    Projected Value
                  </p>

                  <h3 className="text-3xl font-black mt-2">
                    ₹{sipData.futureValue.toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
{/* Market Overview */}
<section className="max-w-7xl mx-auto px-6 py-36 relative">
  <div className="flex items-center justify-between mb-14 flex-wrap gap-5">
    <div>
      <p className="text-cyan-400 font-semibold mb-3">
        LIVE MARKET OVERVIEW
      </p>

      <h2 className="text-5xl font-black">
        Financial Market Snapshot
      </h2>
    </div>

    <div
  className={`px-5 py-3 rounded-2xl font-semibold ${
    marketOpen
      ? "bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 animate-pulse"
      : "bg-red-500/10 border border-red-400/20 text-red-400"
  }`}
>
  {marketOpen
    ? "Markets Open"
    : "Markets Closed"}
</div>
  </div>

  <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
    {/* Card 1 */}
    <div className="bg-[#0b1220]/80 border border-white/10 rounded-[40px] p-8 hover:border-cyan-400/30 hover:bg-[#111827] transition-all duration-500 hover:-translate-y-2">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-slate-400 text-sm mb-2">
            NIFTY 50
          </p>

          <h3 className="text-3xl xl:text-4xl font-black tracking-tight">
            {marketData.nifty?.price
  ? marketData.nifty.price.toLocaleString()
  : "Unavailable"}
          </h3>
        </div>

        <div className="text-4xl">📈</div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`font-bold ${
  marketData.nifty?.change >= 0
    ? "text-emerald-400"
    : "text-red-400"
}`}>
          {marketData.nifty?.change
  ? `${marketData.nifty.change.toFixed(2)}%`
  : "--"}
        </span>

        <span className="text-slate-500 text-sm">
          Today
        </span>
      </div>
    </div>

    {/* Card 2 */}
    <div className="bg-[#0b1220]/80 border border-white/10 rounded-[40px] p-8 hover:border-cyan-400/30 hover:bg-[#111827] transition-all duration-500 hover:-translate-y-2">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-slate-400 text-sm mb-2">
            SENSEX
          </p>

         <h3 className="text-3xl xl:text-4xl font-black tracking-tight">
  {marketData.sensex?.price
    ? marketData.sensex.price.toLocaleString()
    : "Unavailable"}
</h3>
        </div>

        <div className="text-4xl">🏛️</div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`font-bold ${
  marketData.sensex?.change >= 0
    ? "text-emerald-400"
    : "text-red-400"
}`}>
          {marketData.sensex?.change
  ? `${marketData.sensex.change.toFixed(2)}%`
  : "--"}
        </span>

        <span className="text-slate-500 text-sm">
          Today
        </span>
      </div>
    </div>

    {/* Card 3 */}
    <div className="bg-[#0b1220]/80 border border-white/10 rounded-[40px] p-8 hover:border-cyan-400/30 hover:bg-[#111827] transition-all duration-500 hover:-translate-y-2">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-slate-400 text-sm mb-2">
            GOLD
          </p>

          <h3 className="text-3xl xl:text-4xl font-black tracking-tight">
            ₹{
  marketData.gold?.price
    ? marketData.gold.price.toLocaleString()
    : "74,200"
}
          </h3>
        </div>

        <div className="text-4xl">🥇</div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`font-bold ${
  marketData.gold?.change >= 0
    ? "text-emerald-400"
    : "text-red-400"
}`}>
          {marketData.gold?.change
  ? `${marketData.gold.change.toFixed(2)}%`
  : "-0.12%"}
        </span>

        <span className="text-slate-500 text-sm">
          Today
        </span>
      </div>
    </div>

    {/* Card 4 */}
    <div className="bg-[#0b1220]/80 border border-white/10 rounded-[40px] p-8 hover:border-cyan-400/30 hover:bg-[#111827] transition-all duration-500 hover:-translate-y-2">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-slate-400 text-sm mb-2">
            BITCOIN
          </p>

          <h3 className="text-3xl xl:text-4xl font-black tracking-tight">
            $
{
  marketData.bitcoin?.price
    ? marketData.bitcoin.price.toLocaleString()
    : "79,000"
}
          </h3>
        </div>

        <div className="text-4xl">₿</div>
      </div>

      <div className="text-emerald-400 font-bold">
        <span
  className={`font-bold ${
    marketData.bitcoin?.change >= 0
      ? "text-emerald-400"
      : "text-red-400"
  }`}
>
          {marketData.bitcoin?.change
  ? `${marketData.bitcoin.change.toFixed(2)}%`
  : "-1.20%"}
        </span>

        <span className="text-slate-500 text-sm">
          Today
        </span>
      </div>
    </div>
  </div>

  {/* Bottom Insights */}
  <div className="grid lg:grid-cols-3 gap-8 mt-10">
    {/* Trending */}
    <div className="lg:col-span-2 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/10 rounded-[36px] p-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-cyan-400 font-semibold mb-2">
            TRENDING INSIGHT
          </p>

          <h3 className="text-3xl xl:text-4xl font-black tracking-tight">
            Market Momentum
          </h3>
        </div>

        <div className="text-6xl">
          🚀
        </div>
      </div>

      <p className="text-slate-300 text-lg leading-relaxed mb-8">
        Indian equity markets continue showing strong investor
        participation with increasing SIP inflows, retail
        investing growth, and positive long-term sentiment.
      </p>

      <div className="flex flex-wrap gap-4">
        <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
          SIP Growth
        </div>

        <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
          Retail Investors
        </div>

        <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
          Long-Term Investing
        </div>
      </div>
    </div>

    {/* Fear & Greed */}
    <div className="bg-white/5 border border-white/10 rounded-[36px] p-10 flex flex-col justify-between">
      <div>
        <p className="text-cyan-400 font-semibold mb-2">
          MARKET SENTIMENT
        </p>

        <h3 className="text-4xl font-black mb-10">
          Fear & Greed
        </h3>

        <div className="w-48 h-48 mx-auto rounded-full border-[18px] border-emerald-400 flex items-center justify-center text-center">
          <div>
            <h4 className="text-5xl font-black text-emerald-400">
              {marketData.fearGreed?.value}
            </h4>

            <p className="text-slate-400 mt-2">
              {marketData.fearGreed?.text}
            </p>
          </div>
        </div>
      </div>

      <p className="text-slate-400 text-center mt-10">
        Market sentiment indicates strong investor optimism.
      </p>
    </div>
  </div>
</section>
      {/* Calculators */}
      <section
        id="calculators"
        className="max-w-7xl mx-auto px-6 py-36 relative"
      >
        <div className="flex items-center justify-between mb-14">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition duration-500" />
          <div>
            <p className="text-cyan-400 font-semibold mb-3">
              TOOLS
            </p>

            <h2 className="text-5xl font-black">
              Popular Finance Calculators
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {calculators.map((item, index) => (
            <div
              key={index}
             className="group relative overflow-hidden bg-[#0b1220]/80 border border-white/10 rounded-[36px] p-8 hover:border-cyan-400/30 hover:-translate-y-3 transition-all duration-500"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/20 flex items-center justify-center text-4xl mb-8">
                {item.icon}
              </div>

              <h3 className="text-4xl font-black mb-5">
                {item.title}
              </h3>

              <p className="text-slate-400 leading-relaxed mb-8">
                {item.desc}
              </p>

              <Link
                to={item.route}
                className="text-cyan-400 font-semibold hover:text-cyan-300 transition inline-block"
              >
                Open Calculator →
              </Link>
            </div>
          ))}
        </div>
      </section>

     {/* Articles */}
<section
  id="articles"
 className="max-w-7xl mx-auto px-6 py-36 relative"
>
  <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
    <div>
      <p className="text-cyan-400 font-semibold mb-3">
        FINANCE GUIDES
      </p>

      <h2 className="text-5xl font-black leading-tight">
        Latest Financial Articles
      </h2>

      <p className="text-slate-400 mt-5 text-lg max-w-2xl">
        Learn investing, budgeting, wealth creation,
        retirement planning, and personal finance strategies.
      </p>
    </div>

    <Link
      to="/blog"
      className="border border-white/10 hover:border-cyan-400/30 hover:bg-cyan-500/10 transition px-6 py-3 rounded-2xl font-semibold"
    >
      View All Articles
    </Link>
  </div>

  <div className="grid lg:grid-cols-3 gap-8">
    {/* Article 1 */}
    <Link
      to="/how-sip-builds-wealth"
      className="group bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-cyan-400/20 hover:-translate-y-4 hover:shadow-[0_20px_80px_rgba(0,255,255,0.08)] transition duration-300"
    >
      <div className="h-56 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,255,255,0.25),transparent_50%)]" />

        <div className="absolute bottom-5 left-5 bg-black/30 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl text-sm font-semibold text-cyan-300">
          INVESTING
        </div>
      </div>

      <h3 className="text-4xl font-black leading-tight mb-5 group-hover:text-cyan-300 transition">
        How SIP Investments Build Long-Term Wealth
      </h3>

      <p className="text-slate-400 leading-relaxed mb-8">
        Understand compounding, disciplined investing,
        and long-term wealth creation strategies using SIPs.
      </p>

      <div className="flex items-center justify-between">
        <span className="text-cyan-400 font-bold">
          Read Article →
        </span>

        <span className="text-slate-500 text-sm">
          5 min read
        </span>
      </div>
    </Link>

    {/* Article 2 */}
    <Link
      to="/best-financial-habits"
      className="group bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-cyan-400/20 hover:-translate-y-4 hover:shadow-[0_20px_80px_rgba(0,255,255,0.08)] transition duration-300"
    >
      <div className="h-56 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 mb-8 overflow-hidden relative">
        <div className="absolute bottom-5 left-5 bg-black/30 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl text-sm font-semibold text-cyan-300">
          PERSONAL FINANCE
        </div>
      </div>

      <h3 className="text-4xl font-black leading-tight mb-5 group-hover:text-cyan-300 transition">
        Best Financial Habits For Beginners
      </h3>

      <p className="text-slate-400 leading-relaxed mb-8">
        Learn practical money management habits
        that improve long-term financial stability.
      </p>

      <div className="flex items-center justify-between">
        <span className="text-cyan-400 font-bold">
          Read Article →
        </span>

        <span className="text-slate-500 text-sm">
          4 min read
        </span>
      </div>
    </Link>

    {/* Article 3 */}
    <Link
      to="/emi-vs-full-payment"
      className="group bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-cyan-400/20 hover:-translate-y-4 hover:shadow-[0_20px_80px_rgba(0,255,255,0.08)] transition duration-300"
    >
      <div className="h-56 rounded-3xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 mb-8 overflow-hidden relative">
        <div className="absolute bottom-5 left-5 bg-black/30 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl text-sm font-semibold text-cyan-300">
          LOANS
        </div>
      </div>

      <h3 className="text-4xl font-black leading-tight mb-5 group-hover:text-cyan-300 transition">
        EMI vs Full Payment: Which Is Better?
      </h3>

      <p className="text-slate-400 leading-relaxed mb-8">
        Compare EMI financing and full payment strategies
        for smarter financial decisions.
      </p>

      <div className="flex items-center justify-between">
        <span className="text-cyan-400 font-bold">
          Read Article →
        </span>

        <span className="text-slate-500 text-sm">
          6 min read
        </span>
      </div>
    </Link>
  </div>
</section>
{/* Trending Tools */}
<section className="max-w-7xl mx-auto px-6 pb-24">
  <div className="flex items-center justify-between mb-14 flex-wrap gap-5">
    <div>
      <p className="text-cyan-400 font-semibold mb-3">
        TRENDING TOOLS
      </p>

      <h2 className="text-5xl font-black">
        Most Used Finance Calculators
      </h2>
    </div>

    <div className="bg-cyan-500/10 border border-cyan-400/20 px-5 py-3 rounded-2xl text-cyan-300 font-semibold">
      Updated Daily
    </div>
  </div>

  <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
    {/* Tool 1 */}
    <Link
      to="/sip-calculator"
      className="group bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/10 rounded-[40px] p-8 hover:border-cyan-400/30 transition duration-300 hover:-translate-y-2"
    >
      <div className="text-5xl mb-6">📈</div>

      <h3 className="text-3xl font-black mb-4 group-hover:text-cyan-300 transition">
        SIP Calculator
      </h3>

      <p className="text-slate-400 leading-relaxed mb-8">
        Estimate mutual fund SIP returns and future wealth growth.
      </p>

      <div className="flex items-center justify-between">
        <span className="text-cyan-400 font-bold">
          Open Tool →
        </span>

        <span className="text-slate-500 text-sm">
          Trending
        </span>
      </div>
    </Link>

    {/* Tool 2 */}
    <Link
      to="/emi-calculator"
      className="group bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-cyan-400/10 rounded-[40px] p-8 hover:border-cyan-400/30 transition duration-300 hover:-translate-y-2"
    >
      <div className="text-5xl mb-6">🏦</div>

      <h3 className="text-3xl font-black mb-4 group-hover:text-cyan-300 transition">
        EMI Calculator
      </h3>

      <p className="text-slate-400 leading-relaxed mb-8">
        Calculate monthly loan repayments with smart breakdowns.
      </p>

      <div className="flex items-center justify-between">
        <span className="text-cyan-400 font-bold">
          Open Tool →
        </span>

        <span className="text-slate-500 text-sm">
          Popular
        </span>
      </div>
    </Link>

    {/* Tool 3 */}
    <Link
      to="/retirement-calculator"
      className="group bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-cyan-400/10 rounded-[40px] p-8 hover:border-cyan-400/30 transition duration-300 hover:-translate-y-2"
    >
      <div className="text-5xl mb-6">🌴</div>

      <h3 className="text-3xl font-black mb-4 group-hover:text-cyan-300 transition">
        Retirement Tool
      </h3>

      <p className="text-slate-400 leading-relaxed mb-8">
        Plan future retirement wealth using compounding growth.
      </p>

      <div className="flex items-center justify-between">
        <span className="text-cyan-400 font-bold">
          Open Tool →
        </span>

        <span className="text-slate-500 text-sm">
          High Growth
        </span>
      </div>
    </Link>

    {/* Tool 4 */}
    <Link
      to="/fd-calculator"
      className="group bg-gradient-to-br from-orange-500/10 to-cyan-500/10 border border-cyan-400/10 rounded-[40px] p-8 hover:border-cyan-400/30 transition duration-300 hover:-translate-y-2"
    >
      <div className="text-5xl mb-6">💰</div>

      <h3 className="text-3xl font-black mb-4 group-hover:text-cyan-300 transition">
        FD Calculator
      </h3>

      <p className="text-slate-400 leading-relaxed mb-8">
        Estimate fixed deposit maturity value and returns.
      </p>

      <div className="flex items-center justify-between">
        <span className="text-cyan-400 font-bold">
          Open Tool →
        </span>

        <span className="text-slate-500 text-sm">
          Stable Returns
        </span>
      </div>
    </Link>
  </div>
</section>
      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-[#0b1220] border border-cyan-400/20 rounded-[40px] p-14 text-center">
          <p className="text-cyan-400 font-semibold mb-4">
            START SMARTER FINANCIAL PLANNING
          </p>

          <h2 className="text-5xl md:text-6xl font-black leading-tight">
            Free Financial Tools
            <span className="block bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              For Better Decisions
            </span>
          </h2>

          <p className="text-slate-400 text-lg mt-8 max-w-3xl mx-auto leading-relaxed">
            Explore modern finance calculators, investment planning tools,
            and educational resources designed for smarter wealth growth.
          </p>

          <div className="flex justify-center mt-10">
            <Link
  to="/calculators"
  className="bg-cyan-500 hover:bg-cyan-400 transition px-8 py-4 rounded-2xl text-black font-black inline-block"
>
  Explore Calculators
</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div>
            <h2 className="text-3xl font-black">
              Wealth<span className="text-cyan-400">Fluent</span>
            </h2>

            <p className="text-slate-400 mt-3">
              Smart finance tools for modern wealth planning.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-slate-400">
            <Link to="/about" className="hover:text-white transition">
              About
            </Link>

            <Link
              to="/privacy-policy"
              className="hover:text-white transition"
            >
              Privacy Policy
            </Link>

            <Link
              to="/disclaimer"
              className="hover:text-white transition"
            >
              Disclaimer
            </Link>

            <Link
              to="/contact"
              className="hover:text-white transition"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
    </div>
  );
}