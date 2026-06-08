import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import { useFinance } from "../context/FinanceContext";
import { useTheme } from "../context/ThemeContext";

import {
  TrendingUp,
  Wallet,
  Landmark,
  Target,
  ArrowRight,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  ShieldCheck,
  Globe,
  Sparkles,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
export default function WealthFluentHomepage() {
  const chartData = [
  { value: 120 },
  { value: 135 },
  { value: 142 },
  { value: 158 },
  { value: 173 },
  { value: 180 },
  { value: 210 },
];

const marketSparkline = [
  { value: 100 },
  { value: 120 },
  { value: 115 },
  { value: 145 },
  { value: 160 },
  { value: 190 },
  { value: 210 },
];
const bullishData = [
  { value: 100 },
  { value: 120 },
  { value: 118 },
  { value: 140 },
  { value: 170 },
  { value: 185 },
  { value: 210 },
];

const goldData = [
  { value: 100 },
  { value: 105 },
  { value: 110 },
  { value: 115 },
  { value: 120 },
  { value: 130 },
  { value: 135 },
];

const btcData = [
  { value: 100 },
  { value: 80 },
  { value: 120 },
  { value: 140 },
  { value: 110 },
  { value: 180 },
  { value: 220 },
];
  const { darkMode, setDarkMode } = useTheme();
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

const [simulator, setSimulator] = useState({
  sip: 10000,
  years: 20,
  returnRate: 12,
});

const r = simulator.returnRate / 100 / 12;
const n = simulator.years * 12;

const futureValue =
  simulator.sip *
  (((Math.pow(1 + r, n) - 1) / r) * (1 + r));

const invested = simulator.sip * n;

const profit = futureValue - invested;

const passiveIncome = futureValue * 0.04 / 12;

const wealthMultiplier =
  invested > 0
    ? (futureValue / invested).toFixed(1)
    : 0;

const goal = 10000000;

const progress = Math.min(
  (futureValue / goal) * 100,
  100
);

  return (
  <div
className={darkMode
  ? "min-h-screen bg-[#020617] text-white"
  : "min-h-screen bg-[#f4f7fb] text-slate-900"
}
>

  {/* Background Effects */}
  <div className="hidden dark:block absolute top-[-200px]  left-[-200px] w-[500px] h-[500px] bg-cyan-500/20 blur-[90px] rounded-full" />

  <div className="hidden dark:block absolute top-[40%] right-[-200px] w-[500px] h-[500px] bg-blue-500/20 blur-[100px] rounded-full" />

  <div className="hidden dark:block absolute bottom-[-250px] left-[30%] w-[600px] h-[600px] bg-cyan-400/10 blur-[120px] rounded-full" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_30%)]" />

<div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] bg-[size:90px_90px]" />

  <div className="relative z-10">
      {/* Navbar */}
<header className="
sticky top-0 z-50
border-b border-slate-200
dark:border-white/10

bg-[#f8fafc]/80
dark:bg-slate-950/70

shadow-lg
dark:shadow-2xl dark:shadow-cyan-500/5

backdrop-blur-xl
">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    {/* Logo */}
    <Link to="/">
      <h1 className="text-3xl font-black tracking-tight drop-shadow-lg">
        Wealth<span className="text-cyan-400">Fluent</span>
      </h1>
    </Link>

    {/* Desktop Nav */}
    <nav className="
hidden lg:flex items-center gap-8 text-sm
text-slate-700
dark:text-slate-300
">
      <a href="#calculators" className="hover:text-blue-600
dark:hover:text-whitetransition">
        Calculators
      </a>

      <a href="#articles" className="hover:text-blue-600
dark:hover:text-white transition">
        Articles
      </a>

      <Link to="/about" className="hover:text-blue-600
dark:hover:text-white transition">
        About
      </Link>

      <Link to="/contact" className="hover:text-blue-600
dark:hover:text-whitetransition">
        Contact
      </Link>
    </nav>

    {/* Desktop Button */}
    <div className="hidden lg:flex items-center gap-3">
  <button
    onClick={() => setDarkMode(!darkMode)}
    className="
    w-12
    h-12
    rounded-2xl
    border
    border-slate-300
    dark:border-white/10
    bg-white
    dark:bg-white/5
    flex
    items-center
    justify-center
    text-xl
    transition
    "
  >
    {darkMode ? "☀️" : "🌙"}
  </button>

  <Link
    to="/tools"
    className="
    bg-blue-600
    hover:bg-blue-700
    dark:bg-cyan-500
    dark:hover:bg-cyan-400
    transition
    px-5
    py-3
    rounded-2xl
    text-white
    dark:text-black
    font-bold
    "
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
<section
className="
relative
overflow-hidden

bg-gradient-to-b

from-white
to-[#f4f7fb]

dark:from-[#020617]
dark:to-[#020617]
"
>

  <div className="absolute inset-0">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-blue-500/10 blur-[180px] rounded-full" />
  </div>

  <div className="max-w-7xl mx-auto px-6 py-32 relative z-10">

    <div className="grid lg:grid-cols-2 gap-20 items-center">

      <div>

        <div className="
        inline-flex
        items-center
        gap-2

        bg-blue-500/10

        text-blue-500

        px-4 py-2

        rounded-full

        mb-8
        ">
          <Sparkles size={16} />
          Wealth Planning Platform
        </div>

        <h1 className="
        text-6xl
        md:text-7xl
        xl:text-8xl

        font-black

        leading-[0.9]
        ">
          Build Wealth
          <span className="block text-blue-500">
            With Confidence.
          </span>
        </h1>

        <p className="
        mt-8
        text-xl

        text-slate-600
        dark:text-slate-400

        max-w-xl
        ">
          Professional finance calculators,
          live market insights,
          and long-term wealth planning tools
          built for modern investors.
        </p>

        <div className="flex gap-4 mt-10">

          <Link
            to="/sip-calculator"
            className="
            bg-blue-600
            hover:bg-blue-700

            px-8 py-4

            rounded-2xl

            text-white

            font-semibold

            flex
            items-center
            gap-2
            "
          >
            Start Planning
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/tools"
            className="
            border

            border-slate-300
            dark:border-white/10

            px-8 py-4

            rounded-2xl

            font-semibold
            "
          >
            Explore Tools
          </Link>

        </div>

      </div>

      <div className="relative hidden lg:block h-[550px]">

        <div className="
        absolute

        top-0
        left-0

        w-[350px]

        bg-white
dark:bg-[#0f172a]

border
border-slate-200
dark:border-white/5

        rounded-[32px]

        shadow-2xl

        p-8
        ">
          <div className="flex items-center gap-3 mb-6">
            <Wallet className="text-blue-500" />
            Portfolio Value
          </div>

          <h3 className="text-5xl font-black">
            ₹12.8L
          </h3>

          <p className="text-emerald-500 mt-4 font-semibold">
            +18.2% this year
          </p>

          <div className="h-28 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  fill="#2563eb20"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="
        absolute
        right-0
        top-24

       bg-white
dark:bg-[#0f172a]

border
border-slate-200
dark:border-white/5

        rounded-[32px]

        shadow-2xl

        p-8
        ">
          <TrendingUp
            size={32}
            className="text-emerald-500"
          />

          <h3 className="text-4xl font-black mt-4">
            +18.2%
          </h3>

          <p className="text-slate-400">
            Annual Growth
          </p>
        </div>

        <div className="
        absolute

        bottom-20
        left-12

        w-[300px]

        bg-white
dark:bg-[#0f172a]

border
border-slate-200
dark:border-white/5

        rounded-[32px]

        shadow-2xl

        p-8
        ">
          <div className="flex items-center gap-3 mb-5">
            <Target className="text-blue-500" />
            Goal Progress
          </div>

          <div className="h-3 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
            <div className="w-[78%] h-full bg-blue-500" />
          </div>

          <p className="mt-4 font-semibold">
            78% Completed
          </p>
        </div>

        <div className="
        absolute

        bottom-0
        right-12

        bg-blue-600

        text-white

        rounded-[32px]

        shadow-2xl

        p-8
        ">
          <Landmark size={30} />

          <p className="mt-4 text-white/70">
            Passive Income
          </p>

          <h3 className="text-4xl font-black">
            ₹33K
          </h3>
        </div>

      </div>

    </div>

  </div>

</section>
<section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
  <div className="grid md:grid-cols-4 gap-6">

    <div className="bg-white
dark:bg-[#0b1220]

shadow-[0_8px_30px_rgba(15,23,42,0.06)]
dark:shadow-none rounded-3xl p-6 border border-slate-200 dark:border-white/10">
      <p className="text-slate-600 dark:text-slate-400 text-sm">Financial Tools</p>
      <h3 className="text-4xl font-black mt-2 text-slate-900 dark:text-white">7+</h3>
    </div>

    <div className="bg-white
dark:bg-[#0b1220]

shadow-[0_8px_30px_rgba(15,23,42,0.06)]
dark:shadow-none rounded-3xl p-6 border border-slate-200 dark:border-white/10">
      <p className="text-slate-600 dark:text-slate-400 text-sm">Free Access</p>
      <h3 className="text-4xl font-black mt-2 text-slate-900 dark:text-white">100%</h3>
    </div>

    <div className="bg-white
dark:bg-[#0b1220]

shadow-[0_8px_30px_rgba(15,23,42,0.06)]
dark:shadow-none rounded-3xl p-6 border border-slate-200 dark:border-white/10">
      <p className="text-slate-600 dark:text-slate-400 text-sm">Availability</p>
      <h3 className="text-4xl font-black mt-2 text-slate-900 dark:text-white">24/7</h3>
    </div>

    <div className="bg-white
dark:bg-[#0b1220]

shadow-[0_8px_30px_rgba(15,23,42,0.06)]
dark:shadow-none rounded-3xl p-6 border border-slate-200 dark:border-white/10">
      <p className="text-slate-600 dark:text-slate-400 text-sm">Coverage</p>
      <h3 className="text-4xl font-black mt-2 text-slate-900 dark:text-white">Global</h3>
    </div>

  </div>
</section>
    {/* Wealth Dashboard Showcase */}
{/* Wealth Simulator */}
<section className="max-w-7xl mx-auto px-6 py-24">

  <div className="mb-20">

    <p className="text-blue-500 font-semibold uppercase tracking-[0.2em]">
      Wealth Simulator
    </p>

    <h2 className="
    text-5xl
    md:text-6xl

    font-black

    mt-4
    ">
      Visualize Your Future Wealth
    </h2>

    <p className="
    mt-6

    max-w-2xl

    text-lg

    text-slate-600
    dark:text-slate-400
    ">
      Experiment with monthly investments,
      time horizon, and expected returns to
      understand how compounding grows wealth.
    </p>

  </div>

  <div className="
  grid

  lg:grid-cols-[1.4fr_0.9fr]

  gap-8
  ">

    {/* RESULTS */}
    <div
      className="
      bg-white
dark:bg-[#0f172a]

border
border-slate-200
dark:border-white/5

      rounded-[40px]

      shadow-[0_10px_40px_rgba(15,23,42,0.08)]
dark:shadow-none

      p-8
      "
    >

      <p className="text-slate-500">
        Future Wealth Projection
      </p>

      <h2 className="
      text-6xl
      md:text-7xl

      font-black

      mt-4

      text-blue-500
      ">
        ₹{Math.round(futureValue).toLocaleString()}
      </h2>

      <p className="
      mt-4

      text-slate-500
      ">
        Estimated portfolio value after
        {simulator.years} years.
      </p>

      {/* Progress */}
      <div className="mt-10">

        <div className="flex justify-between mb-3">

          <span className="font-medium">
            ₹1 Crore Goal
          </span>

          <span className="font-bold text-blue-500">
            {progress.toFixed(1)}%
          </span>

        </div>

        <div className="
        h-4

        bg-slate-200
        dark:bg-white/10

        rounded-full
        overflow-hidden
        ">
          <div
            className="
            h-full

            bg-gradient-to-r
            from-blue-500
            to-cyan-400
            "
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

      </div>

      {/* Metrics */}
      <div className="
      grid
      md:grid-cols-2

      gap-6

      mt-10
      ">

        <div className="
        bg-slate-50
        dark:bg-white/5

        rounded-3xl

        p-7
min-h-[210px]
        ">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Total Invested
          </p>

          <h3 className="text-3xl font-black mt-3">
            ₹{invested.toLocaleString()}
          </h3>
        </div>

        <div className="
        bg-slate-50
        dark:bg-white/5

        rounded-3xl

        p-7
min-h-[210px]
        ">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Wealth Gain
          </p>

          <h3 className="
          text-3xl
          font-black

          mt-3

          text-emerald-500
          ">
            ₹{Math.round(profit).toLocaleString()}
          </h3>
        </div>

        <div className="
        bg-slate-50
        dark:bg-white/5

        rounded-3xl

        p-7
min-h-[210px]
        ">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Passive Income
          </p>

          <h3 className="
          text-3xl
          font-black

          mt-3

          text-blue-500
          ">
            ₹{Math.round(passiveIncome).toLocaleString()}
          </h3>
        </div>

        <div className="
        bg-slate-50
        dark:bg-white/5

        rounded-3xl

        p-7
min-h-[210px]
        ">
         <p className="text-slate-600 dark:text-slate-400 text-sm">
            Wealth Multiplier
          </p>

          <h3 className="
          text-3xl
          font-black

          mt-3
          ">
            {wealthMultiplier}×
          </h3>
        </div>

      </div>

    </div>

    {/* CONTROLS */}
    <div
      className="
     bg-white
dark:bg-[#0f172a]

border
border-slate-200
dark:border-white/5

      rounded-[40px]

      shadow-[0_10px_40px_rgba(15,23,42,0.08)]
dark:shadow-none

      p-8
      "
    >

      <h3 className="
      text-3xl
      font-black

      mb-10
      ">
        Investment Settings
      </h3>

      {/* SIP */}
      <div className="mb-10">

        <div className="
        flex
        justify-between

        mb-3
        ">
          <span>
            Monthly SIP
          </span>

          <span className="
          font-bold
          text-blue-500
          ">
            ₹{simulator.sip.toLocaleString()}
          </span>
        </div>

        <input
          type="range"
          min="1000"
          max="100000"
          step="500"
          value={simulator.sip}
          onChange={(e) =>
            setSimulator({
              ...simulator,
              sip: Number(e.target.value),
            })
          }
          className="w-full accent-blue-500"
        />

      </div>

      {/* YEARS */}
      <div className="mb-10">

        <div className="
        flex
        justify-between

        mb-3
        ">
          <span>
            Duration
          </span>

          <span className="
          font-bold
          text-blue-500
          ">
            {simulator.years} Years
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="40"
          value={simulator.years}
          onChange={(e) =>
            setSimulator({
              ...simulator,
              years: Number(e.target.value),
            })
          }
          className="w-full accent-blue-500"
        />

      </div>

      {/* RETURN */}
      <div>

        <div className="
        flex
        justify-between

        mb-3
        ">
          <span>
            Expected Return
          </span>

          <span className="
          font-bold
          text-blue-500
          ">
            {simulator.returnRate}%
          </span>
        </div>

        <input
          type="range"
          min="6"
          max="18"
          value={simulator.returnRate}
          onChange={(e) =>
            setSimulator({
              ...simulator,
              returnRate: Number(e.target.value),
            })
          }
          className="w-full accent-blue-500"
        />

      </div>

      {/* Summary Box */}
      <div className="
      mt-12

      bg-blue-500

      rounded-3xl

      p-7
min-h-[210px]

      text-white
      ">

        <p className="text-white/70">
          Monthly Wealth Potential
        </p>

        <h3 className="
        text-4xl
        font-black

        mt-3
        ">
          ₹{Math.round(passiveIncome).toLocaleString()}
        </h3>

        <p className="mt-3 text-white/70">
          Estimated passive income using a 4% withdrawal strategy.
        </p>

      </div>

    </div>

  </div>

</section>
{/* Market Overview */}
{/* Market Dashboard */}
<section className="max-w-7xl mx-auto px-6 py-24">

  <div className="mb-16">

    <div className="
    inline-flex

    items-center
    gap-2

    bg-blue-500/10

    text-blue-500

    px-4 py-2

    rounded-full

    mb-6
    ">
      <BarChart3 size={16} />
      Live Market Dashboard
    </div>

    <h2 className="
    text-5xl
    md:text-6xl

    font-black
    ">
      Markets At A Glance
    </h2>

    <p className="
    mt-5

    text-lg

    text-slate-600
    dark:text-slate-400

    max-w-2xl
    ">
      Track major financial assets,
      investor sentiment, and market
      momentum in real time.
    </p>

  </div>

  {/* Market Cards */}
  <div className="
  grid

  lg:grid-cols-4
  md:grid-cols-2

  gap-6
  ">

    {/* NIFTY */}
    <div className="
   bg-white
dark:bg-[#0f172a]

border
border-slate-200
dark:border-white/5

    rounded-[32px]

   shadow-[0_10px_40px_rgba(15,23,42,0.08)]
dark:shadow-none

    p-7
min-h-[210px]
    ">

      <div className="
      flex
      justify-between

      items-start
      ">
        <div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            NIFTY 50
          </p>

          <h3 className="
          text-3xl

          font-black

          mt-2
          ">
            {marketData.nifty?.price
              ? marketData.nifty.price.toLocaleString()
              : "--"}
          </h3>
        </div>

        <TrendingUp
          className="text-emerald-500"
        />
      </div>

      <p className="
      text-emerald-500

      font-semibold

      mt-3
      ">
        {marketData.nifty?.change
          ? `${marketData.nifty.change.toFixed(2)}%`
          : "--"}
      </p>

      <div className="h-20 mt-4">

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={bullishData}>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              fill="#10b98120"
            />
          </AreaChart>
        </ResponsiveContainer>

      </div>

    </div>

    {/* SENSEX */}
    <div className="
    bg-white
dark:bg-[#0f172a]

border
border-slate-200
dark:border-white/5

    rounded-[32px]

    shadow-[0_10px_40px_rgba(15,23,42,0.08)]
dark:shadow-none

    p-7
min-h-[210px]
    ">

      <div className="
      flex
      justify-between

      items-start
      ">
        <div>

          <p className="text-slate-600 dark:text-slate-400 text-sm">
            SENSEX
          </p>

          <h3 className="
          text-3xl

          font-black

          mt-2
          ">
            {marketData.sensex?.price
              ? marketData.sensex.price.toLocaleString()
              : "--"}
          </h3>

        </div>

        <Landmark
          className="text-blue-500"
        />
      </div>

      <p className="
      text-blue-500

      font-semibold

      mt-3
      ">
        {marketData.sensex?.change
          ? `${marketData.sensex.change.toFixed(2)}%`
          : "--"}
      </p>

      <div className="h-20 mt-4">

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={bullishData}>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              fill="#2563eb20"
            />
          </AreaChart>
        </ResponsiveContainer>

      </div>

    </div>

    {/* GOLD */}
    <div className="
   bg-white
dark:bg-[#0f172a]

border
border-slate-200
dark:border-white/5

    rounded-[32px]

   shadow-[0_10px_40px_rgba(15,23,42,0.08)]
dark:shadow-none

    p-7
min-h-[210px]
    ">

      <div className="
      flex
      justify-between

      items-start
      ">

        <div>

          <p className="text-slate-600 dark:text-slate-400 text-sm">
            GOLD
          </p>

          <h3 className="
          text-3xl

          font-black

          mt-2
          ">
            ₹{marketData.gold?.price
              ? marketData.gold.price.toLocaleString()
              : "--"}
          </h3>

        </div>

        <Wallet
          className="text-yellow-500"
        />
      </div>

      <p className="
      text-yellow-500

      font-semibold

      mt-3
      ">
        {marketData.gold?.change
          ? `${marketData.gold.change.toFixed(2)}%`
          : "--"}
      </p>

      <div className="h-20 mt-4">

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={goldData}>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#eab308"
              fill="#eab30820"
            />
          </AreaChart>
        </ResponsiveContainer>

      </div>

    </div>

    {/* BITCOIN */}
    <div className="
    bg-white
dark:bg-[#0f172a]

border
border-slate-200
dark:border-white/5

    rounded-[32px]

    shadow-[0_10px_40px_rgba(15,23,42,0.08)]
dark:shadow-none

    p-7
min-h-[210px]
    ">

      <div className="
      flex
      justify-between

      items-start
      ">

        <div>

          <p className="text-slate-600 dark:text-slate-400 text-sm">
            BITCOIN
          </p>

          <h3 className="
          text-3xl

          font-black

          mt-2
          ">
            ${marketData.bitcoin?.price
              ? marketData.bitcoin.price.toLocaleString()
              : "--"}
          </h3>

        </div>

        <TrendingUp
          className="text-orange-500"
        />
      </div>

      <p className="
      text-orange-500

      font-semibold

      mt-3
      ">
        {marketData.bitcoin?.change
          ? `${marketData.bitcoin.change.toFixed(2)}%`
          : "--"}
      </p>

      <div className="h-20 mt-4">

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={btcData}>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#f97316"
              fill="#f9731620"
            />
          </AreaChart>
        </ResponsiveContainer>

      </div>

    </div>

  </div>

  {/* Bottom Panel */}
  <div className="
  grid

  lg:grid-cols-[2fr_1fr]

  gap-6

  mt-8
  ">

    {/* Insight Card */}
    <div className="
    bg-gradient-to-br

    from-blue-500
via-blue-600
to-indigo-700

    rounded-[40px]

    p-10

    text-white
    ">

      <p className="text-white/70 mb-3">
        Market Insight
      </p>

      <h3 className="
      text-4xl

      font-black
      ">
        Long-Term Investing Continues To Win
      </h3>

      <p className="
      mt-5

      text-white/80

      text-lg

      max-w-2xl
      ">
        Consistent SIP investments and disciplined
        portfolio allocation remain the most reliable
        path toward long-term wealth creation.
      </p>

    </div>

    {/* Fear Greed */}
    <div className="
    bg-white
dark:bg-[#0f172a]

border
border-slate-200
dark:border-white/5

    rounded-[40px]

    shadow-[0_10px_40px_rgba(15,23,42,0.08)]
dark:shadow-none

    p-8

    text-center
    ">

      <p className="text-slate-500">
        Market Sentiment
      </p>

      <h3 className="
      text-5xl

      font-black

      mt-4

      text-blue-500
      ">
        {marketData.fearGreed?.value || "--"}
      </h3>

      <p className="
      mt-3

      text-slate-500
      ">
        {marketData.fearGreed?.text || "Loading"}
      </p>

    </div>

  </div>

</section>
      {/* Calculators */}
{/* Finance Tools */}
<section
  id="calculators"
  className="max-w-7xl mx-auto px-6 py-24"
>

  <div className="mb-16">

    <p className="text-blue-500 font-semibold uppercase tracking-[0.2em]">
      Finance Tools
    </p>

    <h2 className="text-5xl md:text-6xl font-black mt-4">
      Everything You Need
      <br />
      To Manage Money
    </h2>

  </div>

  <div className="grid lg:grid-cols-12 gap-6">

    {/* FEATURED SIP */}
    <Link
      to="/sip-calculator"
      className="
      lg:col-span-6

      bg-gradient-to-br
      from-blue-500
via-blue-600
to-indigo-700

      text-white

      rounded-[40px]

      p-10

      group
      "
    >

      <TrendingUp size={40} />

      <h3 className="text-4xl font-black mt-8">
        SIP Calculator
      </h3>

      <p className="mt-4 text-white/80">
        Project long-term wealth growth with
        systematic investment planning.
      </p>

      <div className="mt-8 flex items-center gap-2 font-semibold">
        Open Tool
        <ChevronRight />
      </div>

    </Link>

    {/* FEATURED EMI */}
    <Link
      to="/emi-calculator"
      className="
      lg:col-span-6

      bg-white
dark:bg-[#0f172a]

border
border-slate-200
dark:border-white/5

      rounded-[40px]

      p-10

      shadow-[0_10px_40px_rgba(15,23,42,0.08)]
dark:shadow-none

      group
      "
    >

      <Landmark
        size={40}
        className="text-blue-500"
      />

      <h3 className="text-4xl font-black mt-8">
        EMI Calculator
      </h3>

      <p className="mt-4 text-slate-400">
        Calculate monthly loan repayments
        instantly.
      </p>

      <div className="mt-8 flex items-center gap-2 font-semibold text-blue-500">
        Open Tool
        <ChevronRight />
      </div>

    </Link>

    {[
      {
        title: "FD Calculator",
        route: "/fd-calculator",
      },
      {
        title: "GST Calculator",
        route: "/gst-calculator",
      },
      {
        title: "CAGR Calculator",
        route: "/cagr-calculator",
      },
      {
        title: "Retirement",
        route: "/retirement-calculator",
      },
      {
        title: "Wealth Age",
        route: "/wealth-age-calculator",
      },
    ].map((tool) => (

      <Link
        key={tool.title}
        to={tool.route}
        className="
        lg:col-span-4

        bg-white
dark:bg-[#0f172a]

border
border-slate-200
dark:border-white/5

        rounded-[32px]

        shadow-lg

        p-8

        hover:-translate-y-1

        transition
        "
      >

        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
          {tool.title}
        </h3>

        <p className="mt-3 text-slate-500">
          Open calculator
        </p>

      </Link>

    ))}

  </div>

</section>

     {/* Articles */}
<section className="max-w-7xl mx-auto px-6 py-24">

  <div className="text-center mb-20">

    <p className="text-blue-500 font-semibold uppercase tracking-[0.2em]">
      Why WealthFluent
    </p>

    <h2 className="text-5xl md:text-6xl font-black mt-4">
      Built For Modern Investors
    </h2>

  </div>

  <div className="grid md:grid-cols-3 gap-8">

    <div className="
    bg-gradient-to-b
from-white
to-slate-50

dark:from-[#0f172a]
dark:to-[#111827]
dark:bg-[#0f172a]

border
border-slate-200
dark:border-white/5

    rounded-[40px]

    shadow-[0_10px_40px_rgba(15,23,42,0.08)]
dark:shadow-none

    p-10
    ">

      <TrendingUp
        size={40}
        className="text-blue-500"
      />

      <h3 className="text-3xl font-black mt-6">
        Smart Planning
      </h3>

      <p className="mt-4 text-slate-600 dark:text-slate-400">
        Visualize future wealth and
        retirement outcomes instantly.
      </p>

    </div>

    <div className="
    bg-gradient-to-b
from-white
to-slate-50

dark:from-[#0f172a]
dark:to-[#111827]
dark:bg-[#0f172a]

border
border-slate-200
dark:border-white/5

    rounded-[40px]

    shadow-[0_10px_40px_rgba(15,23,42,0.08)]
dark:shadow-none

    p-10
    ">

      <ShieldCheck
        size={40}
        className="text-emerald-500"
      />

      <h3 className="text-3xl font-black mt-6">
        No Signup Required
      </h3>

      <p className="mt-4 text-slate-600 dark:text-slate-400">
        Use every calculator for free
        without creating an account.
      </p>

    </div>

    <div className="
    bg-gradient-to-b
from-white
to-slate-50

dark:from-[#0f172a]
dark:to-[#111827]
dark:bg-[#0f172a]

border
border-slate-200
dark:border-white/5

    rounded-[40px]

    shadow-[0_10px_40px_rgba(15,23,42,0.08)]
dark:shadow-none

    p-10
    ">

      <Globe
        size={40}
        className="text-blue-500"
      />

      <h3 className="text-3xl font-black mt-6">
        Global Access
      </h3>

      <p className="mt-4 text-slate-600 dark:text-slate-400">
        Available anywhere with
        real-time financial tools.
      </p>

    </div>

  </div>

</section>

<section
  id="articles"
  className="max-w-7xl mx-auto px-6 py-24"
>

  <div className="mb-16">

    <p className="text-blue-500 font-semibold uppercase tracking-[0.2em]">
      Finance Guides
    </p>

    <h2 className="text-5xl md:text-6xl font-black mt-4">
      Learn Investing
      <br />
      The Right Way
    </h2>

  </div>

  <div className="grid lg:grid-cols-3 gap-8">

    {[
      {
        image: "/images/sip.jpg",
        title: "How SIP Builds Wealth",
        route: "/how-sip-builds-wealth",
      },
      {
        image: "/images/finance.jpg",
        title: "Financial Habits",
        route: "/best-financial-habits",
      },
      {
        image: "/images/retirement.jpg",
        title: "Retirement Planning",
        route: "/retirement-calculator",
      },
    ].map((article) => (

      <Link
        key={article.title}
        to={article.route}
        className="
        bg-gradient-to-b
from-white
to-slate-50

dark:from-[#0f172a]
dark:to-[#111827]
dark:bg-[#0f172a]

border
border-slate-200
dark:border-white/5

        rounded-[40px]

        overflow-hidden

        shadow-[0_10px_40px_rgba(15,23,42,0.08)]
dark:shadow-none
        "
      >

        <img
          src={article.image}
          alt={article.title}
          className="
          w-full
          h-64
          object-cover
          "
        />

        <div className="p-8">

          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {article.title}
          </h3>

          <p className="mt-4 text-blue-500 font-semibold">
            Read Article →
          </p>

        </div>

      </Link>

    ))}

  </div>

</section>





      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-32">

  <div className="
  bg-gradient-to-br

  from-blue-500
via-blue-600
to-indigo-700

  rounded-[56px]

  text-center

  px-10
  py-24

  text-white
  ">

    <p className="uppercase tracking-[0.2em] text-white/70">
      Start Today
    </p>

    <h2 className="
    text-6xl

    font-black

    mt-6
    ">
      Build Your Wealth
      <br />
      With Confidence
    </h2>

    <p className="
    max-w-2xl

    mx-auto

    mt-6

    text-white/80
    ">
      Free calculators, real-time markets,
      and practical investing tools.
    </p>

    <Link
      to="/sip-calculator"
      className="
      inline-flex

      mt-10

      bg-white

      text-blue-700

      px-8
      py-4

      rounded-2xl

      font-bold
      "
    >
      Start Planning →
    </Link>

  </div>

</section>

      {/* Footer */}
      <footer className="
border-t

border-slate-200
dark:border-white/10

py-12
">

  <div className="
  max-w-7xl
  mx-auto

  px-6

  flex
  flex-col
  md:flex-row

  justify-between

  gap-8
  ">

    <div>

      <h2 className="
      text-3xl

      font-black
      ">
        Wealth
        <span className="text-blue-500">
          Fluent
        </span>
      </h2>

      <p className="
      mt-3

      text-slate-500
      ">
        Smarter investing starts here.
      </p>

    </div>

    <div className="
    flex

    gap-6

    text-slate-500
    ">

      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
      <Link to="/privacy-policy">Privacy</Link>
      <Link to="/disclaimer">Disclaimer</Link>

    </div>

  </div>

</footer>
    </div>
    </div>
  );
}