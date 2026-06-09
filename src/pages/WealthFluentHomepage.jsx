import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import { useFinance } from "../context/FinanceContext";
import { useTheme } from "../context/ThemeContext";
import { BookOpen } from "lucide-react";

import {
  TrendingUp,
  Wallet,
  Landmark,
  Banknote,
  Receipt,
   Clock3,
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
  Users,
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
const [news, setNews] = useState([]);
const [newsLoading, setNewsLoading] = useState(true);
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
const fetchNews = async () => {
  try {
    const res = await axios.get(
      `https://newsdata.io/api/1/news?apikey=pub_3798230f728e4a6090ad3c705557970b&category=business&language=en`
    );

    setNews(res.data.results?.slice(0, 6) || []);
  } catch (err) {
    console.log(err);
  } finally {
    setNewsLoading(false);
  }
};

fetchNews();
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
const [selectedGoal, setSelectedGoal] = useState("1cr");
const applyGoal = (goal) => {
  setSelectedGoal(goal);

  if (goal === "1cr") {
    setSimulator({
      sip: 10000,
      years: 20,
      returnRate: 12,
    });
  }

  if (goal === "5cr") {
    setSimulator({
      sip: 25000,
      years: 25,
      returnRate: 12,
    });
  }

  if (goal === "fire") {
    setSimulator({
      sip: 50000,
      years: 30,
      returnRate: 14,
    });
  }
};
const displayData = {
  nifty: {
    price: marketData?.nifty?.price || 25120,
    change: marketData?.nifty?.change || 0.82,
  },

  sensex: {
    price: marketData?.sensex?.price || 82350,
    change: marketData?.sensex?.change || 0.71,
  },

  gold: {
    price: marketData?.gold?.price || 101250,
    change: marketData?.gold?.change || 0.32,
  },

  bitcoin: {
    price: marketData?.bitcoin?.price || 105320,
    change: marketData?.bitcoin?.change || 2.41,
  },

  fearGreed: {
    value: marketData?.fearGreed?.value || 72,
    text: marketData?.fearGreed?.text || "Greed",
  },
};
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
<header
  className="
  sticky
  top-0
  z-50

  border-b
  border-slate-200/80
  dark:border-white/10

  bg-white/80
  dark:bg-[#020617]/80

  backdrop-blur-xl
  "
>

  <div className="max-w-7xl mx-auto px-6">

    <div className="h-20 flex items-center justify-between">

      {/* Logo */}

      <Link
        to="/"
        className="flex items-center gap-3"
      >

        <div
          className="
          w-11
          h-11

          rounded-2xl

          bg-gradient-to-br
          from-blue-500
          to-cyan-500

          flex
          items-center
          justify-center

          text-white
          "
        >
          <TrendingUp size={20} />
        </div>

        <div>

          <h1
            className="
            text-2xl

            font-black

            tracking-tight

            text-slate-900
            dark:text-white
            "
          >
            Wealth
            <span className="text-blue-500">
              Fluent
            </span>
          </h1>

        </div>

      </Link>

      {/* Desktop Nav */}

      <nav
        className="
        hidden
        lg:flex

        items-center

        gap-8
        "
      >

        <a
          href="#calculators"
          className="
          text-slate-600
          dark:text-slate-300

          hover:text-blue-500

          transition
          "
        >
          Calculators
        </a>

        <a
          href="#articles"
          className="
          text-slate-600
          dark:text-slate-300

          hover:text-blue-500

          transition
          "
        >
          Guides
        </a>

        <Link
          to="/about"
          className="
          text-slate-600
          dark:text-slate-300

          hover:text-blue-500

          transition
          "
        >
          About
        </Link>

        <Link
          to="/contact"
          className="
          text-slate-600
          dark:text-slate-300

          hover:text-blue-500

          transition
          "
        >
          Contact
        </Link>

      </nav>

      {/* Right Side */}

      <div
        className="
        hidden
        lg:flex

        items-center

        gap-3
        "
      >

        {/* Theme Toggle */}

        <button
  onClick={() => setDarkMode(!darkMode)}
  className="
  w-12
  h-12

  rounded-2xl

  border
  border-slate-200
  dark:border-white/10

  bg-white
  dark:bg-white/5

  flex
  items-center
  justify-center

  transition-all
  "
>
  {darkMode ? "☀️" : "🌙"}
</button>

        {/* CTA */}

        <Link
          to="/sip-calculator"
          className="
          inline-flex

          items-center

          gap-2

          px-5
          py-3

          rounded-2xl

          bg-gradient-to-r
          from-blue-500
          to-cyan-500

          text-white

          font-semibold

          hover:scale-105

          transition-all
          "
        >
          Start Planning
          <ChevronRight size={18} />
        </Link>

      </div>

      {/* Mobile Button */}

      <button
        onClick={() => setMobileMenu(!mobileMenu)}
        className="
        lg:hidden

        w-12
        h-12

        rounded-2xl

        border
        border-slate-200
        dark:border-white/10

        bg-white
        dark:bg-white/5

        flex
        items-center
        justify-center

        text-slate-900
        dark:text-white
        "
      >
        {mobileMenu ? (
          <X size={22} />
        ) : (
          <Menu size={22} />
        )}
      </button>

    </div>

  </div>

  {/* Mobile Menu */}

  {mobileMenu && (

    <div
      className="
      lg:hidden

      border-t
      border-slate-200
      dark:border-white/10

      bg-white
      dark:bg-[#071120]
      "
    >

      <div className="px-6 py-6 flex flex-col gap-4">

        <a
          href="#calculators"
          onClick={() => setMobileMenu(false)}
          className="
          py-3

          text-slate-700
          dark:text-slate-300
          "
        >
          Calculators
        </a>

        <a
          href="#articles"
          onClick={() => setMobileMenu(false)}
          className="
          py-3

          text-slate-700
          dark:text-slate-300
          "
        >
          Guides
        </a>

        <Link
          to="/about"
          onClick={() => setMobileMenu(false)}
          className="
          py-3

          text-slate-700
          dark:text-slate-300
          "
        >
          About
        </Link>

        <Link
          to="/contact"
          onClick={() => setMobileMenu(false)}
          className="
          py-3

          text-slate-700
          dark:text-slate-300
          "
        >
          Contact
        </Link>

        <Link
          to="/sip-calculator"
          onClick={() => setMobileMenu(false)}
          className="
          mt-4

          bg-gradient-to-r
          from-blue-500
          to-cyan-500

          text-white

          text-center

          py-4

          rounded-2xl

          font-semibold
          "
        >
          Start Planning
        </Link>

      </div>

    </div>

  )}

</header>
<section className="relative overflow-hidden">

  {/* Background */}
  <div className="absolute inset-0 overflow-hidden">

    <div className="
    absolute
    top-0
    left-0
    w-[500px]
    h-[500px]
    bg-blue-500/10
    blur-[140px]
    rounded-full
    " />

    <div className="
    absolute
    bottom-0
    right-0
    w-[500px]
    h-[500px]
    bg-cyan-500/10
    blur-[140px]
    rounded-full
    " />

  </div>

  <div className="
  relative
  z-10

  max-w-7xl
  mx-auto

  px-6

  py-24
  ">

    <div className="
    grid
    lg:grid-cols-2

    gap-20

    items-center
    ">

      {/* LEFT */}
      <div>

        <div className="
        inline-flex
        items-center
        gap-2

        px-4
        py-2

        rounded-full

        bg-blue-500/10

        text-blue-500

        font-medium

        mb-8
        ">
          <Sparkles size={16} />
          Wealth Intelligence Platform
        </div>

        <h1 className="
        text-5xl
        md:text-7xl
        xl:text-8xl

        font-black

        leading-[0.9]

        tracking-tight
        ">

          Build Wealth

          <span className="
          block

          bg-gradient-to-r
          from-blue-500
          via-cyan-400
          to-blue-600

          bg-clip-text
          text-transparent
          ">
            Like The Top 1%
          </span>

        </h1>

        <p className="
        mt-8

        text-xl

        max-w-xl

        text-slate-600
        dark:text-slate-400
        ">
          Powerful calculators, wealth projections,
          portfolio insights and market intelligence
          designed for long-term investors.
        </p>

        <div className="
        flex
        flex-wrap

        gap-4

        mt-10
        ">

          <Link
            to="/sip-calculator"
            className="
            bg-blue-600
            hover:bg-blue-700

            text-white

            px-8
            py-4

            rounded-2xl

            font-semibold

            flex
            items-center
            gap-2

            transition
            "
          >
            Start Planning
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/tools"
            className="
            px-8
            py-4

            rounded-2xl

            border

            border-slate-300
            dark:border-white/10

            bg-white
            dark:bg-white/5

            font-semibold
            "
          >
            Explore Tools
          </Link>

        </div>

        {/* TRUST STATS */}

        <div className="
        grid
        grid-cols-3

        gap-8

        mt-16
        ">

          <div>
            <h3 className="
            text-3xl
            font-black
            ">
              100K+
            </h3>

            <p className="
            text-sm
            text-slate-500
            ">
              Investors
            </p>
          </div>

          <div>
            <h3 className="
            text-3xl
            font-black
            ">
              ₹500Cr+
            </h3>

            <p className="
            text-sm
            text-slate-500
            ">
              Simulated
            </p>
          </div>

          <div>
            <h3 className="
            text-3xl
            font-black
            ">
              24/7
            </h3>

            <p className="
            text-sm
            text-slate-500
            ">
              Available
            </p>
          </div>

        </div>

      </div>

      {/* RIGHT DASHBOARD */}

      <div className="relative hidden lg:block">

  <div
    className="
    bg-white
dark:bg-[#071120]

    border
    border-slate-200
    dark:border-white/10

    rounded-[40px]

    p-8

    shadow-[0_20px_80px_rgba(15,23,42,0.12)]
    dark:shadow-none
    "
  >
    {/* Header */}

    <div className="flex justify-between items-start">

      <div>

        <p className="text-slate-500 dark:text-slate-400">
          Projected Wealth
        </p>

        <h2
          className="
          text-5xl
          xl:text-6xl

          font-black

          mt-3

          text-slate-900
          dark:text-white
          "
        >
          ₹{Math.round(futureValue).toLocaleString()}
        </h2>

        <p className="mt-3 text-emerald-500 font-semibold">
          +{growthPercentage}% gain
        </p>

      </div>

      <div
        className="
        bg-emerald-500/10

        text-emerald-500

        px-4
        py-2

        rounded-2xl

        font-semibold
        "
      >
        Growing
      </div>

    </div>

    {/* Chart */}

    <div className="h-[260px] mt-10">

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>

          <defs>

            <linearGradient
              id="wealthGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#3b82f6"
                stopOpacity={0.4}
              />

              <stop
                offset="100%"
                stopColor="#3b82f6"
                stopOpacity={0}
              />
            </linearGradient>

          </defs>

          <Area
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={4}
            fill="url(#wealthGradient)"
          />

        </AreaChart>
      </ResponsiveContainer>

    </div>

    {/* Bottom Grid */}

    <div className="grid grid-cols-2 gap-8 mt-10">

      {/* Allocation */}

      <div>

        <h4 className="font-bold mb-5 text-slate-900 dark:text-white">
          Wealth Allocation
        </h4>

        <div className="space-y-5">

          <div>

            <div className="flex justify-between mb-2">

              <span className="text-slate-600 dark:text-slate-300">
                Invested
              </span>

              <span className="font-semibold text-slate-900 dark:text-white">
                {Math.round(
                  (invested / futureValue) * 100
                ) || 0}
                %
              </span>

            </div>

            <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{
                  width: `${Math.min(
                    (invested / futureValue) * 100,
                    100
                  )}%`,
                }}
              />
            </div>

          </div>

          <div>

            <div className="flex justify-between mb-2">

              <span className="text-slate-600 dark:text-slate-300">
                Profit
              </span>

              <span className="font-semibold text-slate-900 dark:text-white">
                {Math.round(
                  (profit / futureValue) * 100
                ) || 0}
                %
              </span>

            </div>

            <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full">

              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{
                  width: `${Math.min(
                    (profit / futureValue) * 100,
                    100
                  )}%`,
                }}
              />

            </div>

          </div>

          <div>

            <div className="flex justify-between mb-2">

              <span className="text-slate-600 dark:text-slate-300">
                Goal
              </span>

              <span className="font-semibold text-slate-900 dark:text-white">
                {progress.toFixed(0)}%
              </span>

            </div>

            <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full">

              <div
                className="h-full bg-cyan-500 rounded-full"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>

      {/* Metrics */}

      <div>

        <h4 className="font-bold mb-5 text-slate-900 dark:text-white">
          Wealth Snapshot
        </h4>

        <div className="space-y-6">

          <div className="flex justify-between">

            <span className="text-slate-600 dark:text-slate-300">
              Invested
            </span>

            <span className="font-bold text-slate-900 dark:text-white">
              ₹{Math.round(invested).toLocaleString()}
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-600 dark:text-slate-300">
              Wealth Gain
            </span>

            <span className="font-bold text-emerald-500">
              ₹{Math.round(profit).toLocaleString()}
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-600 dark:text-slate-300">
              Monthly Income
            </span>

            <span className="font-bold text-slate-900 dark:text-white">
              ₹{Math.round(
                passiveIncome
              ).toLocaleString()}
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-600 dark:text-slate-300">
              Wealth Multiple
            </span>

            <span className="font-bold text-blue-500">
              {wealthMultiplier}×
            </span>

          </div>

        </div>

      </div>

    </div>

  </div>

</div>

    </div>

  </div>

</section>
<section className="max-w-7xl mx-auto px-6 relative z-20 -mt-12">

  <div
    className="
    bg-white
    dark:bg-[#071120]

    border
    border-slate-200
    dark:border-white/10

    rounded-[40px]

    p-8

    shadow-[0_20px_60px_rgba(15,23,42,0.08)]
    dark:shadow-none
    "
  >

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

      {/* Card 1 */}
      <div className="relative">

        <div className="
        w-12
        h-12

        rounded-2xl

        bg-blue-500/10

        flex
        items-center
        justify-center

        mb-5
        ">
          <BarChart3
            size={22}
            className="text-blue-500"
          />
        </div>

        <h3 className="
        text-4xl
        font-black

        text-slate-900
        dark:text-white
        ">
          7+
        </h3>

        <p className="
        mt-2

        text-slate-500
        ">
          Financial Tools
        </p>

      </div>

      {/* Card 2 */}
      <div className="relative">

        <div className="
        w-12
        h-12

        rounded-2xl

        bg-emerald-500/10

        flex
        items-center
        justify-center

        mb-5
        ">
          <TrendingUp
            size={22}
            className="text-emerald-500"
          />
        </div>

        <h3 className="
        text-4xl
        font-black

        text-slate-900
        dark:text-white
        ">
          ₹500Cr+
        </h3>

        <p className="
        mt-2

        text-slate-500
        ">
          Wealth Simulated
        </p>

      </div>

      {/* Card 3 */}
      <div className="relative">

        <div className="
        w-12
        h-12

        rounded-2xl

        bg-cyan-500/10

        flex
        items-center
        justify-center

        mb-5
        ">
          <Globe
            size={22}
            className="text-cyan-500"
          />
        </div>

        <h3 className="
        text-4xl
        font-black

        text-slate-900
        dark:text-white
        ">
          24/7
        </h3>

        <p className="
        mt-2

        text-slate-500
        ">
          Live Access
        </p>

      </div>

      {/* Card 4 */}
      <div className="relative">

        <div className="
        w-12
        h-12

        rounded-2xl

        bg-violet-500/10

        flex
        items-center
        justify-center

        mb-5
        ">
          <Users
            size={22}
            className="text-violet-500"
          />
        </div>

        <h3 className="
        text-4xl
        font-black

        text-slate-900
        dark:text-white
        ">
          100K+
        </h3>

        <p className="
        mt-2

        text-slate-500
        ">
          Investors
        </p>

      </div>

    </div>

  </div>

</section>
<section className="max-w-7xl mx-auto px-6 py-28">

  <div className="mb-16">

    <div className="
      inline-flex
      items-center
      gap-2
      px-4
      py-2
      rounded-full
      bg-blue-500/10
      text-blue-500
      mb-6
    ">
      📰 AI News Hub
    </div>

    <h2 className="
      text-5xl
      md:text-7xl
      font-black
      tracking-tight
    ">
      Latest Market
      <span className="block text-blue-500">
        Intelligence
      </span>
    </h2>

    <p className="
      mt-6
      text-lg
      text-slate-600
      dark:text-slate-400
    ">
      Real-time financial news from global markets.
    </p>

  </div>

  {newsLoading ? (
    <div className="text-center py-20">
      Loading news...
    </div>
  ) : (

    <div className="grid lg:grid-cols-3 gap-6">

      {news.map((article, index) => (

        <a
          key={index}
          href={article.link}
          target="_blank"
          rel="noreferrer"
          className="
          bg-white
          dark:bg-[#071120]

          border
          border-slate-200
          dark:border-white/10

          rounded-[32px]

          overflow-hidden

          hover:-translate-y-1
          hover:shadow-xl

          transition-all
          "
        >

          <img
            src={
              article.image_url ||
              "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
            }
            alt={article.title}
            className="
            w-full
            h-56
            object-cover
            "
          />

          <div className="p-6">

            <p className="
            text-xs
            uppercase
            text-blue-500
            font-semibold
            ">
              {article.source_id}
            </p>

            <h3 className="
            mt-3
            text-xl
            font-bold
            line-clamp-2
            ">
              {article.title}
            </h3>

            <p className="
            mt-3
            text-slate-500
            dark:text-slate-400
            line-clamp-3
            ">
              {article.description}
            </p>

          </div>

        </a>

      ))}

    </div>

  )}

</section>
    {/* Wealth Dashboard Showcase */}
{/* Wealth Simulator */}
<section className="max-w-7xl mx-auto px-6 py-32">

  {/* Heading */}
  <div className="text-center mb-20">

    <div className="
    inline-flex
    items-center
    gap-2

    px-4
    py-2

    rounded-full

    bg-blue-500/10

    text-blue-500

    font-medium
    ">
      <Sparkles size={16} />
      Wealth Simulator
    </div>

    <h2 className="
    text-5xl
    md:text-7xl

    font-black

    tracking-tight

    mt-6
    ">
      Build Your
      <span className="block text-blue-500">
        First Crore
      </span>
    </h2>

    <p className="
    mt-6

    text-xl

    max-w-3xl

    mx-auto

    text-slate-600
    dark:text-slate-400
    ">
      Explore how small monthly investments
      compound into life-changing wealth.
      Adjust the sliders and instantly see
      your future financial freedom.
    </p>

  </div>

  <div className="
  grid
  lg:grid-cols-[1.5fr_0.8fr]

  gap-8
  ">

    {/* LEFT PANEL */}

  <div
className="
bg-white
dark:bg-[#071120]

border
border-slate-200
dark:border-white/10

rounded-[40px]

p-10

shadow-[0_20px_50px_rgba(15,23,42,0.06)]
dark:shadow-none
"
>

  <div className="
  flex
  items-center
  justify-between
  mb-8
  ">

    <div>

      <p className="
      text-slate-500
      dark:text-slate-400
      ">
        Future Wealth Projection
      </p>

      <h2 className="
      text-5xl
      md:text-7xl

      font-black

      tracking-tight

      mt-3

      text-slate-900
      dark:text-white
      ">
        ₹{Math.round(futureValue).toLocaleString()}
      </h2>

    </div>

    <div className="
    px-5
    py-3

    rounded-2xl

    bg-emerald-500/10

    text-emerald-600

    font-semibold
    ">
      +{growthPercentage}%
    </div>

  </div>

  <div className="
  bg-slate-50
  dark:bg-white/[0.03]

  rounded-3xl

  p-6
  mb-8
  ">

    <div className="
    flex
    justify-between

    mb-3
    ">

      <span className="
      text-slate-600
      dark:text-slate-400
      ">
        ₹1 Crore Goal
      </span>

      <span className="
      font-bold
      text-blue-500
      ">
        {progress.toFixed(1)}%
      </span>

    </div>

    <div className="
    h-3

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
      to-cyan-500
      "
      style={{
        width:`${progress}%`
      }}
      />

    </div>

  </div>

  <div className="
  grid
  grid-cols-2
  lg:grid-cols-4

  gap-4
  ">

    <div className="
    bg-slate-50
    dark:bg-white/[0.03]

    rounded-3xl

    p-5
    ">
      <p className="
      text-xs

      uppercase

      tracking-wider

      text-slate-500
      ">
        Invested
      </p>

      <h3 className="
      text-2xl
      font-black

      mt-2

      text-slate-900
      dark:text-white
      ">
        ₹{invested.toLocaleString()}
      </h3>
    </div>

    <div className="
    bg-emerald-500/10

    rounded-3xl

    p-5
    ">
      <p className="
      text-xs

      uppercase

      tracking-wider

      text-emerald-600
      ">
        Profit
      </p>

      <h3 className="
      text-2xl
      font-black

      mt-2

      text-emerald-500
      ">
        ₹{Math.round(profit).toLocaleString()}
      </h3>
    </div>

    <div className="
    bg-blue-500/10

    rounded-3xl

    p-5
    ">
      <p className="
      text-xs

      uppercase

      tracking-wider

      text-blue-600
      ">
        Income
      </p>

      <h3 className="
      text-2xl
      font-black

      mt-2

      text-blue-500
      ">
        ₹{Math.round(passiveIncome).toLocaleString()}
      </h3>
    </div>

    <div className="
    bg-violet-500/10

    rounded-3xl

    p-5
    ">
      <p className="
      text-xs

      uppercase

      tracking-wider

      text-violet-600
      ">
        Multiple
      </p>

      <h3 className="
      text-2xl
      font-black

      mt-2

      text-violet-500
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
  dark:bg-[#071120]

  border
  border-slate-200
  dark:border-white/10

  rounded-[40px]

  p-8

  shadow-[0_20px_50px_rgba(15,23,42,0.06)]
  dark:shadow-none
  "
>

  {/* HEADER */}

  <div className="mb-10">

    <div className="
    inline-flex
    items-center
    gap-2

    px-3
    py-2

    rounded-full

    bg-blue-500/10

    text-blue-500

    text-xs
    font-semibold
    uppercase
    tracking-wider
    ">
      Wealth Controls
    </div>

    <h3 className="
    text-3xl
    font-black

    mt-5

    text-slate-900
    dark:text-white
    ">
      Customize Projection
    </h3>

    <p className="
    mt-2

    text-slate-500
    dark:text-slate-400
    ">
      Adjust values and instantly see
      your future wealth potential.
    </p>

  </div>

  {/* SIP */}

  <div className="mb-8">

    <div className="flex justify-between mb-3">

      <span className="
      text-slate-600
      dark:text-slate-400
      ">
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

  <div className="mb-8">

    <div className="flex justify-between mb-3">

      <span className="
      text-slate-600
      dark:text-slate-400
      ">
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

    <div className="flex justify-between mb-3">

      <span className="
      text-slate-600
      dark:text-slate-400
      ">
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

  {/* QUICK GOALS */}

  <div className="mt-10">

    <p className="
    font-semibold
    mb-4

    text-slate-900
    dark:text-white
    ">
      Quick Goals
    </p>

    <div className="grid grid-cols-3 gap-3">

      <button
    onClick={() => applyGoal("1cr")}
    className={`
      py-3
      rounded-2xl
      font-semibold
      transition-all
      duration-300

      ${
        selectedGoal === "1cr"
          ? `
          bg-gradient-to-r
          from-blue-500
          to-cyan-500
          text-white
          shadow-lg
          shadow-blue-500/20
          `
          : `
          bg-slate-100
          dark:bg-white/[0.05]

          text-slate-700
          dark:text-slate-300

          hover:bg-slate-200
          dark:hover:bg-white/[0.08]
          `
      }
    `}
  >
    ₹1 Cr
  </button>

  <button
    onClick={() => applyGoal("5cr")}
    className={`
      py-3
      rounded-2xl
      font-semibold
      transition-all
      duration-300

      ${
        selectedGoal === "5cr"
          ? `
          bg-gradient-to-r
          from-blue-500
          to-cyan-500
          text-white
          shadow-lg
          shadow-blue-500/20
          `
          : `
          bg-slate-100
          dark:bg-white/[0.05]

          text-slate-700
          dark:text-slate-300

          hover:bg-slate-200
          dark:hover:bg-white/[0.08]
          `
      }
    `}
  >
    ₹5 Cr
  </button>

  <button
    onClick={() => applyGoal("fire")}
    className={`
      py-3
      rounded-2xl
      font-semibold
      transition-all
      duration-300

      ${
        selectedGoal === "fire"
          ? `
          bg-gradient-to-r
          from-orange-500
          to-red-500
          text-white
          shadow-lg
          shadow-orange-500/20
          `
          : `
          bg-slate-100
          dark:bg-white/[0.05]

          text-slate-700
          dark:text-slate-300

          hover:bg-slate-200
          dark:hover:bg-white/[0.08]
          `
      }
    `}
  >
    FIRE
  </button>
    </div>

  </div>

  {/* STRATEGY */}

  <div className="
  mt-8

  bg-slate-50
  dark:bg-white/[0.03]

  rounded-3xl

  p-5
  ">

    <p className="
    text-xs

    uppercase

    tracking-wider

    text-slate-500
    ">
      Suggested Strategy
    </p>

    <h4 className="
    text-xl

    font-bold

    text-slate-500
    mt-2
    ">
      Growth Portfolio
    </h4>

    <p className="
    mt-2

    text-sm

    text-slate-500
    ">
      Suitable for long-term wealth
      creation and retirement planning.
    </p>

  </div>

  {/* SUMMARY */}

  <div className="
  mt-8

  bg-gradient-to-br
  from-blue-500
  via-blue-600
  to-indigo-700

  rounded-[32px]

  p-8

  text-white
  ">

    <p className="text-white/70">
      Monthly Wealth Potential
    </p>

    <h3 className="
    text-5xl

    font-black

    mt-3
    ">
      ₹{Math.round(passiveIncome).toLocaleString()}
    </h3>

    <p className="
    mt-3

    text-white/80
    ">
      Estimated passive income using
      the 4% withdrawal rule.
    </p>

  </div>

</div>
</div>
</section>
{/* Market Overview */}
{/* Market Dashboard */}
<section className="max-w-7xl mx-auto px-6 py-28">

  {/* Header */}

  <div className="mb-16">

    <div
      className="
      inline-flex
      items-center
      gap-2

      bg-blue-500/10

      text-blue-500

      px-4
      py-2

      rounded-full

      mb-6
      "
    >
      <BarChart3 size={16} />
      Live Market Dashboard
    </div>

   <h2
className="
text-5xl
md:text-7xl

font-black

tracking-tight

text-slate-900
dark:text-white

"
>
Markets

<span
className="
block

bg-gradient-to-r
from-blue-500
to-cyan-500

bg-clip-text
text-transparent
"
>
At A Glance
</span>

</h2>

    <p
      className="
      mt-6

      text-lg

      text-slate-600
      dark:text-slate-400

      max-w-2xl
      "
    >
      Track major financial assets,
      investor sentiment and market momentum
      from one unified dashboard.
    </p>

  </div>

  {/* Top Cards */}

  <div
    className="
    grid

    lg:grid-cols-[1fr_1fr_1fr_1.4fr]

    gap-6
    "
  >

    {/* NIFTY */}

    <div className="
bg-white
dark:bg-[#071120]

border
border-slate-200
dark:border-white/10

rounded-[32px]

p-7

shadow-sm
hover:shadow-xl

transition-all
duration-300
">

  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5">
    <TrendingUp className="text-emerald-500" size={20} />
  </div>

  <p className="text-slate-500 dark:text-slate-400 text-sm">
    NIFTY 50
  </p>

  <h3 className="text-3xl font-black mt-2 text-slate-900 dark:text-white">
    {displayData.nifty.price.toLocaleString()}
  </h3>

  <p className="mt-3 font-semibold text-emerald-500">
    +{displayData.nifty.change}%
  </p>

</div>

    {/* SENSEX */}

    <div className="
bg-white
dark:bg-[#071120]

border
border-slate-200
dark:border-white/10

rounded-[32px]

p-7

shadow-sm
hover:shadow-xl

transition-all
duration-300
">

  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-5">
    <Landmark className="text-blue-500" size={20} />
  </div>

  <p className="text-slate-500 dark:text-slate-400 text-sm">
    SENSEX
  </p>

  <h3 className="text-3xl font-black mt-2 text-slate-900 dark:text-white">
    {displayData.sensex.price.toLocaleString()}
  </h3>

  <p className="mt-3 font-semibold text-blue-500">
    +{displayData.sensex.change}%
  </p>

</div>

    {/* GOLD */}

    <div className="
bg-white
dark:bg-[#071120]

border
border-slate-200
dark:border-white/10

rounded-[32px]

p-7

shadow-sm
hover:shadow-xl

transition-all
duration-300
">

  <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-5">
    <Wallet className="text-yellow-500" size={20} />
  </div>

  <p className="text-slate-500 dark:text-slate-400 text-sm">
    GOLD
  </p>

  <h3 className="text-3xl font-black mt-2 text-slate-900 dark:text-white">
    ₹{displayData.gold.price.toLocaleString()}
  </h3>

  <p className="mt-3 font-semibold text-yellow-500">
    +{displayData.gold.change}%
  </p>

</div>

    {/* FEATURED BITCOIN */}
    <div className="
bg-gradient-to-br
from-orange-500
via-orange-600
to-red-500

rounded-[32px]

p-8

text-white
">

  <div className="flex justify-between">

    <div>

      <p className="text-white/70">
        Bitcoin
      </p>

      <h3 className="text-5xl font-black mt-2">
        ${displayData.bitcoin.price.toLocaleString()}
      </h3>

    </div>

    <TrendingUp />
  </div>

  <p className="mt-5 text-2xl font-bold">
    +{displayData.bitcoin.change}%
  </p>

  <div className="mt-8 bg-white/10 rounded-3xl p-5">

    <p className="text-white/70 text-sm">
      Strong Momentum
    </p>

    <p className="font-semibold mt-1">
      Crypto Market Leader
    </p>

  </div>

</div>

  </div>

  {/* Bottom Row */}

  <div
    className="
    grid

    lg:grid-cols-[2fr_1fr]

    gap-6

    mt-8
    "
  >

    {/* Insight */}

    <div
      className="
      bg-gradient-to-br

      from-blue-500
      via-blue-600
      to-indigo-700

      rounded-[40px]

      p-10

      text-white
      "
    >

      <p className="text-white/70">
        Market Insight
      </p>

      <h3 className="text-4xl font-black mt-4">
        Today's Market Outlook
      </h3>

      <p className="mt-5 text-white/80 text-lg max-w-2xl">
        Consistent SIP investments,
        diversification and long-term discipline
        continue to outperform emotional investing.
      </p>

      <div className="flex flex-wrap gap-3 mt-6">

        <span className="px-3 py-2 rounded-full bg-white/10">
          SIP
        </span>

        <span className="px-3 py-2 rounded-full bg-white/10">
          Long Term
        </span>

        <span className="px-3 py-2 rounded-full bg-white/10">
          Diversification
        </span>

      </div>

    </div>

    {/* Fear & Greed */}

    <div className="
bg-white
dark:bg-[#071120]

border
border-slate-200
dark:border-white/10

rounded-[40px]

p-8

text-center
">

  <p className="text-slate-500 dark:text-slate-400">
    Market Sentiment
  </p>

  <div className="
  w-32
  h-32

  mx-auto
  mt-6

  rounded-full

  bg-blue-500/10

  flex
  items-center
  justify-center
  ">

    <span className="text-5xl font-black text-blue-500">
      {displayData.fearGreed.value}
    </span>

  </div>

  <p className="
  mt-6

  text-lg

  font-semibold

  text-slate-900
  dark:text-white
  ">
    {displayData.fearGreed.text}
  </p>

</div>

  </div>

</section>
      {/* Calculators */}
{/* Finance Tools */}
<section
  id="calculators"
  className="max-w-7xl mx-auto px-6 py-28"
>
  {/* Header */}

  <div className="text-center mb-20">

    <div
      className="
      inline-flex
      items-center
      gap-2

      bg-blue-500/10

      text-blue-500

      px-4
      py-2

      rounded-full

      mb-6
      "
    >
      <Wallet size={16} />
      WealthFluent Tools
    </div>

    <h2
      className="
      text-5xl
      md:text-7xl

      font-black

      tracking-tight

      text-slate-900
      dark:text-white
      "
    >
      Everything You Need
      <span className="block text-blue-500">
        To Manage Money
      </span>
    </h2>

    <p
      className="
      mt-6

      max-w-3xl

      mx-auto

      text-lg

      text-slate-600
      dark:text-slate-400
      "
    >
      Powerful calculators and planning tools
      designed to help you invest smarter,
      retire earlier and build lasting wealth.
    </p>

  </div>

  {/* Tools Grid */}

  <div className="grid lg:grid-cols-12 gap-6">

    {/* SIP CALCULATOR */}

    <Link
      to="/sip-calculator"
      className="
      lg:col-span-6

      bg-gradient-to-br
      from-blue-500
      via-blue-600
      to-indigo-700

      rounded-[40px]

      p-10

      text-white

      overflow-hidden

      relative

      group
      "
    >

      <div className="relative z-10">

        <div className="
        w-16
        h-16

        rounded-2xl

        bg-white/10

        flex
        items-center
        justify-center
        ">
          <TrendingUp size={32} />
        </div>

        <h3 className="
        text-4xl

        font-black

        mt-8
        ">
          SIP Calculator
        </h3>

        <p className="
        mt-4

        text-white/80

        max-w-md
        ">
          Project long-term wealth growth
          using systematic investment planning.
        </p>

        <div className="
        flex
        flex-wrap

        gap-3

        mt-8
        ">

          <span className="
          px-3
          py-2

          rounded-full

          bg-white/10

          text-sm
          ">
            Most Popular
          </span>

          <span className="
          px-3
          py-2

          rounded-full

          bg-white/10

          text-sm
          ">
            Long-Term Investing
          </span>

        </div>

        <div className="
        mt-8

        flex
        items-center

        gap-2

        font-semibold
        ">
          Open Tool
          <ChevronRight />
        </div>

      </div>

    </Link>

    {/* EMI CALCULATOR */}

    <Link
      to="/emi-calculator"
      className="
      lg:col-span-6

      bg-white
      dark:bg-[#071120]

      border
      border-slate-200
      dark:border-white/10

      rounded-[40px]

      p-10

      shadow-[0_10px_30px_rgba(15,23,42,0.05)]
      dark:shadow-none

      group

      hover:-translate-y-1
      hover:shadow-xl

      transition-all
      "
    >

      <div className="
      w-16
      h-16

      rounded-2xl

      bg-blue-500/10

      flex
      items-center
      justify-center
      ">
        <Landmark
          size={32}
          className="text-blue-500"
        />
      </div>

      <h3 className="
      text-4xl

      font-black

      mt-8

      text-slate-900
      dark:text-white
      ">
        EMI Calculator
      </h3>

      <p className="
      mt-4

      text-slate-600
      dark:text-slate-400
      ">
        Calculate monthly loan repayments
        instantly with accurate projections.
      </p>

      <div className="
      mt-8

      inline-flex

      items-center
      gap-2

      px-4
      py-2

      rounded-full

      bg-blue-500/10

      text-blue-500
      ">
        Home Loan
      </div>

      <div className="
      mt-8

      flex
      items-center

      gap-2

      text-blue-500

      font-semibold
      ">
        Open Tool
        <ChevronRight />
      </div>

    </Link>

    {/* SMALL CARDS */}

    {[
      {
        title: "FD Calculator",
        route: "/fd-calculator",
        icon: Banknote,
        color: "text-emerald-500",
      },
      {
        title: "GST Calculator",
        route: "/gst-calculator",
        icon: Receipt,
        color: "text-orange-500",
      },
      {
        title: "CAGR Calculator",
        route: "/cagr-calculator",
        icon: TrendingUp,
        color: "text-blue-500",
      },
      {
        title: "Retirement",
        route: "/retirement-calculator",
        icon: Target,
        color: "text-violet-500",
      },
      {
        title: "Wealth Age",
        route: "/wealth-age-calculator",
        icon: Clock3,
        color: "text-cyan-500",
      },
      {
        title: "All Tools",
        route: "/tools",
        icon: ArrowRight,
        color: "text-blue-500",
      },
    ].map((tool) => {
      const Icon = tool.icon;

      return (
        <Link
          key={tool.title}
          to={tool.route}
          className="
          lg:col-span-4

          bg-white
          dark:bg-[#071120]

          border
          border-slate-200
          dark:border-white/10

          rounded-[32px]

          p-8

          shadow-[0_10px_30px_rgba(15,23,42,0.05)]
          dark:shadow-none

          hover:-translate-y-1
          hover:shadow-xl

          transition-all

          group
          "
        >

          <div className={tool.color}>
            <Icon size={28} />
          </div>

          <h3
            className="
            text-2xl

            font-black

            mt-6

            text-slate-900
            dark:text-white
            "
          >
            {tool.title}
          </h3>

          <p
            className="
            mt-3

            text-slate-600
            dark:text-slate-400
            "
          >
            Open calculator
          </p>

          <div
            className="
            mt-6

            flex
            items-center

            gap-2

            text-blue-500

            font-semibold

            opacity-0
            group-hover:opacity-100

            transition-all
            "
          >
            Launch Tool
            <ChevronRight size={18} />
          </div>

        </Link>
      );
    })}

  </div>

</section>

     {/* Articles */}
<section className="max-w-7xl mx-auto px-6 py-28">

  {/* Header */}

 <div className="text-center mb-20">

  {/* Badge */}
  <div
    className="
    inline-flex
    items-center
    gap-2

    px-5 py-2

    rounded-full

    bg-blue-500/10
    dark:bg-blue-500/10

    border
    border-blue-500/20

    text-blue-500

    font-medium
    "
  >
    <ShieldCheck size={16} />
    Why WealthFluent
  </div>

  {/* Heading */}
  <div className="mt-8">

    <h2
      className="
      text-5xl
      md:text-7xl

      font-black

      tracking-tight

      text-slate-900
      dark:text-white
      "
    >
      Built For
    </h2>

    <h2
      className="
      text-6xl
      md:text-8xl

      font-black

      tracking-tight

      mt-2

      bg-gradient-to-r
      from-blue-500
      via-cyan-400
      to-blue-600

      bg-clip-text
      text-transparent
      "
    >
      Modern Investors
    </h2>

  </div>

  {/* Decorative Line */}
  <div
    className="
    w-32
    h-1

    mx-auto

    mt-8

    rounded-full

    bg-gradient-to-r
    from-blue-500
    via-cyan-400
    to-blue-600
    "
  />

  {/* Description */}
  <p
    className="
    mt-8

    max-w-3xl
    mx-auto

    text-lg
    md:text-xl

    leading-relaxed

    text-slate-600
    dark:text-slate-400
    "
  >
    Everything you need to plan, track, grow and manage
    wealth with confidence using powerful calculators,
    real-time insights and intelligent financial tools.
  </p>

</div>

  {/* Main Grid */}

  <div className="grid lg:grid-cols-12 gap-6">

    {/* Featured Trust Card */}

    <div
      className="
      lg:col-span-5

      bg-gradient-to-br
      from-blue-500
      via-blue-600
      to-indigo-700

      rounded-[40px]

      p-10

      text-white
      "
    >

      <div className="
      w-16
      h-16

      rounded-2xl

      bg-white/10

      flex
      items-center
      justify-center
      ">
        <TrendingUp size={32} />
      </div>

      <h3 className="
      text-4xl

      font-black

      mt-8
      ">
        Smart Wealth Planning
      </h3>

      <p className="
      mt-5

      text-white/80

      text-lg
      ">
        Simulate future wealth,
        retirement goals,
        passive income
        and investment growth instantly.
      </p>

      <div className="
      grid
      grid-cols-2

      gap-4

      mt-10
      ">

        <div>
          <h4 className="text-3xl font-black">
            7+
          </h4>
          <p className="text-white/70">
            Financial Tools
          </p>
        </div>

        <div>
          <h4 className="text-3xl font-black">
            24/7
          </h4>
          <p className="text-white/70">
            Available
          </p>
        </div>

      </div>

    </div>

    {/* Right Side */}

    <div className="lg:col-span-7 grid md:grid-cols-2 gap-6">

      {/* Card */}

      <div
        className="
        bg-white
        dark:bg-[#071120]

        border
        border-slate-200
        dark:border-white/10

        rounded-[32px]

        p-8

        hover:-translate-y-1
        hover:shadow-xl

        transition-all
        "
      >

        <div
          className="
          w-14
          h-14

          rounded-2xl

          bg-emerald-500/10

          flex
          items-center
          justify-center
          "
        >
          <ShieldCheck
            size={28}
            className="text-emerald-500"
          />
        </div>

        <h3
          className="
          text-2xl

          font-black

          mt-6

          text-slate-900
          dark:text-white
          "
        >
          No Signup Required
        </h3>

        <p
          className="
          mt-4

          text-slate-600
          dark:text-slate-400
          "
        >
          Access every calculator instantly.
          No account, no subscription,
          no hidden restrictions.
        </p>

      </div>

      {/* Card */}

      <div
        className="
        bg-white
        dark:bg-[#071120]

        border
        border-slate-200
        dark:border-white/10

        rounded-[32px]

        p-8

        hover:-translate-y-1
        hover:shadow-xl

        transition-all
        "
      >

        <div
          className="
          w-14
          h-14

          rounded-2xl

          bg-blue-500/10

          flex
          items-center
          justify-center
          "
        >
          <Globe
            size={28}
            className="text-blue-500"
          />
        </div>

        <h3
          className="
          text-2xl

          font-black

          mt-6

          text-slate-900
          dark:text-white
          "
        >
          Global Access
        </h3>

        <p
          className="
          mt-4

          text-slate-600
          dark:text-slate-400
          "
        >
          Use WealthFluent anywhere
          on desktop, tablet or mobile
          without limitations.
        </p>

      </div>

      {/* Card */}

      <div
        className="
        bg-white
        dark:bg-[#071120]

        border
        border-slate-200
        dark:border-white/10

        rounded-[32px]

        p-8

        hover:-translate-y-1
        hover:shadow-xl

        transition-all
        "
      >

        <div
          className="
          w-14
          h-14

          rounded-2xl

          bg-violet-500/10

          flex
          items-center
          justify-center
          "
        >
          <BarChart3
            size={28}
            className="text-violet-500"
          />
        </div>

        <h3
          className="
          text-2xl

          font-black

          mt-6

          text-slate-900
          dark:text-white
          "
        >
          Data Driven
        </h3>

        <p
          className="
          mt-4

          text-slate-600
          dark:text-slate-400
          "
        >
          Make informed financial
          decisions using intelligent
          projections and calculations.
        </p>

      </div>

      {/* Card */}

      <div
        className="
        bg-white
        dark:bg-[#071120]

        border
        border-slate-200
        dark:border-white/10

        rounded-[32px]

        p-8

        hover:-translate-y-1
        hover:shadow-xl

        transition-all
        "
      >

        <div
          className="
          w-14
          h-14

          rounded-2xl

          bg-cyan-500/10

          flex
          items-center
          justify-center
          "
        >
          <Clock3
            size={28}
            className="text-cyan-500"
          />
        </div>

        <h3
          className="
          text-2xl

          font-black

          mt-6

          text-slate-900
          dark:text-white
          "
        >
          Instant Results
        </h3>

        <p
          className="
          mt-4

          text-slate-600
          dark:text-slate-400
          "
        >
          Every calculation updates
          instantly as you adjust
          values and assumptions.
        </p>

      </div>

    </div>

  </div>

</section>

<section
  id="articles"
  className="max-w-7xl mx-auto px-6 py-28"
>

  {/* Header */}

  <div className="text-center mb-20">

    <div
      className="
      inline-flex
      items-center
      gap-2

      px-4
      py-2

      rounded-full

      bg-blue-500/10

      text-blue-500

      mb-6
      "
    >
      <BookOpen size={16} />
      Finance Academy
    </div>

    <h2
      className="
      text-5xl
      md:text-7xl

      font-black

      tracking-tight

      text-slate-900
      dark:text-white
      "
    >
      Learn Investing
      <span className="block text-blue-500">
        The Right Way
      </span>
    </h2>

    <p
      className="
      mt-6

      max-w-3xl

      mx-auto

      text-lg

      text-slate-600
      dark:text-slate-400
      "
    >
      Practical investing knowledge,
      wealth building strategies and
      financial education designed for
      long-term success.
    </p>

  </div>

  {/* Main Grid */}

  <div className="grid lg:grid-cols-12 gap-6">

    {/* Featured Article */}

    <Link
      to="/how-sip-builds-wealth"
      className="
      lg:col-span-7

      relative

      overflow-hidden

      rounded-[40px]

      min-h-[580px]

      group
      "
    >

      <img
        src="/images/sip.jpg"
        alt="How SIP Builds Wealth"
        className="
        absolute
        inset-0

        w-full
        h-full

        object-cover

        group-hover:scale-105

        transition-all
        duration-700
        "
      />

      <div
        className="
        absolute
        inset-0

        bg-gradient-to-t

        from-black
        via-black/50
        to-transparent
        "
      />

      <div
        className="
        absolute

        bottom-0

        p-10

        text-white
        "
      >

        <div
          className="
          inline-flex

          px-4
          py-2

          rounded-full

          bg-white/10

          backdrop-blur-md

          text-sm

          mb-5
          "
        >
          Featured Guide
        </div>

        <h3
          className="
          text-4xl
          md:text-5xl

          font-black
          "
        >
          How SIP Builds Wealth
        </h3>

        <p
          className="
          mt-4

          text-white/80

          max-w-xl
          "
        >
          Discover how disciplined investing
          and compounding can transform
          small monthly contributions into
          substantial long-term wealth.
        </p>

        <div
          className="
          mt-6

          flex
          items-center

          gap-6

          text-white/70

          text-sm
          "
        >
          <span>8 min read</span>
          <span>Beginner Friendly</span>
        </div>

      </div>

    </Link>

    {/* Side Articles */}

    <div className="lg:col-span-5 flex flex-col gap-6">

      {/* Card */}

      <Link
        to="/best-financial-habits"
        className="
        bg-white
        dark:bg-[#071120]

        border
        border-slate-200
        dark:border-white/10

        rounded-[32px]

        p-6

        flex

        gap-5

        hover:-translate-y-1
        hover:shadow-xl

        transition-all
        "
      >

        <img
          src="/images/finance.jpg"
          alt="Financial Habits"
          className="
          w-32
          h-32

          rounded-2xl

          object-cover
          "
        />

        <div>

          <div
            className="
            inline-flex

            px-3
            py-1

            rounded-full

            bg-blue-500/10

            text-blue-500

            text-xs

            mb-3
            "
          >
            Personal Finance
          </div>

          <h3
            className="
            text-2xl

            font-black

            text-slate-900
            dark:text-white
            "
          >
            Financial Habits
          </h3>

          <p
            className="
            mt-2

            text-slate-600
            dark:text-slate-400
            "
          >
            Daily habits that improve
            long-term financial health.
          </p>

        </div>

      </Link>

      {/* Card */}

      <Link
        to="/retirement-calculator"
        className="
        bg-white
        dark:bg-[#071120]

        border
        border-slate-200
        dark:border-white/10

        rounded-[32px]

        p-6

        flex

        gap-5

        hover:-translate-y-1
        hover:shadow-xl

        transition-all
        "
      >

        <img
          src="/images/retirement.jpg"
          alt="Retirement Planning"
          className="
          w-32
          h-32

          rounded-2xl

          object-cover
          "
        />

        <div>

          <div
            className="
            inline-flex

            px-3
            py-1

            rounded-full

            bg-emerald-500/10

            text-emerald-500

            text-xs

            mb-3
            "
          >
            Retirement
          </div>

          <h3
            className="
            text-2xl

            font-black

            text-slate-900
            dark:text-white
            "
          >
            Retirement Planning
          </h3>

          <p
            className="
            mt-2

            text-slate-600
            dark:text-slate-400
            "
          >
            Build a strategy for financial
            independence and retirement.
          </p>

        </div>

      </Link>

      {/* Bonus Card */}

      <div
        className="
        bg-gradient-to-br

        from-blue-500
        via-blue-600
        to-indigo-700

        rounded-[32px]

        p-8

        text-white
        "
      >

        <h3 className="text-3xl font-black">
          New Guides Weekly
        </h3>

        <p className="mt-4 text-white/80">
          Learn investing, wealth creation,
          retirement planning and financial
          freedom with practical guides.
        </p>

      </div>

    </div>

  </div>

</section>





      {/* CTA */}
     <section className="max-w-7xl mx-auto px-6 pb-32">

  <div
    className="
    relative

    overflow-hidden

    rounded-[56px]

    bg-gradient-to-br
    from-blue-500
    via-blue-600
    to-indigo-700

    px-10
    py-24

    text-white
    "
  >

    {/* Background Glow */}

    <div className="absolute inset-0">

      <div
        className="
        absolute

        top-0
        left-1/2

        -translate-x-1/2

        w-[700px]
        h-[700px]

        bg-white/10

        rounded-full

        blur-[150px]
        "
      />

    </div>

    {/* Content */}

    <div className="relative z-10 text-center">

      <div
        className="
        inline-flex

        items-center

        gap-2

        px-4
        py-2

        rounded-full

        bg-white/10

        backdrop-blur-md

        text-white/90

        mb-8
        "
      >
        <TrendingUp size={16} />
        Start Your Financial Journey
      </div>

      <h2
        className="
        text-5xl
        md:text-7xl

        font-black

        tracking-tight

        leading-none
        "
      >
        Build Wealth
        <span className="block">
          With Confidence
        </span>
      </h2>

      <p
        className="
        max-w-3xl

        mx-auto

        mt-8

        text-lg

        text-white/80
        "
      >
        Access powerful calculators,
        wealth projections, retirement planning,
        market insights and investing tools —
        completely free.
      </p>

      {/* Stats */}

      <div
        className="
        flex
        flex-wrap

        justify-center

        gap-8

        mt-12
        "
      >

        <div>
          <h3 className="text-3xl font-black">
            7+
          </h3>

          <p className="text-white/70 text-sm">
            Finance Tools
          </p>
        </div>

        <div>
          <h3 className="text-3xl font-black">
            24/7
          </h3>

          <p className="text-white/70 text-sm">
            Access
          </p>
        </div>

        <div>
          <h3 className="text-3xl font-black">
            Free
          </h3>

          <p className="text-white/70 text-sm">
            Forever
          </p>
        </div>

      </div>

      {/* Buttons */}

      <div
        className="
        flex
        flex-col
        sm:flex-row

        justify-center

        gap-4

        mt-12
        "
      >

        <Link
          to="/sip-calculator"
          className="
          inline-flex

          items-center
          justify-center

          gap-2

          bg-white

          text-blue-700

          px-8
          py-4

          rounded-2xl

          font-bold

          hover:scale-105

          transition-all
          "
        >
          Start Planning
          <ArrowRight size={18} />
        </Link>

        <Link
          to="/tools"
          className="
          inline-flex

          items-center
          justify-center

          gap-2

          bg-white/10

          backdrop-blur-md

          border
          border-white/20

          text-white

          px-8
          py-4

          rounded-2xl

          font-bold

          hover:bg-white/15

          transition-all
          "
        >
          Explore Tools
        </Link>

      </div>

    </div>

  </div>

</section>

      {/* Footer */}
     <footer
  className="
  relative

  border-t
  border-slate-200
  dark:border-white/10

  bg-slate-50
  dark:bg-[#020617]

  overflow-hidden
  "
>

  {/* Glow */}

  <div className="absolute inset-0 overflow-hidden">

    <div
      className="
      absolute

      bottom-0
      left-1/2

      -translate-x-1/2

      w-[700px]
      h-[400px]

      bg-blue-500/5

      blur-[120px]

      rounded-full
      "
    />

  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-6">

    {/* Top */}

    <div
      className="
      py-16

      grid

      lg:grid-cols-[1.5fr_1fr_1fr_1fr]

      gap-12
      "
    >

      {/* Brand */}

      <div>

        <h2
          className="
          text-4xl

          font-black

          text-slate-900
          dark:text-white
          "
        >
          Wealth
          <span className="text-blue-500">
            Fluent
          </span>
        </h2>

        <p
          className="
          mt-4

          max-w-sm

          text-slate-600
          dark:text-slate-400
          "
        >
          Smarter investing starts here.
          Plan wealth, explore markets,
          and make better financial decisions.
        </p>

        {/* Stats */}

        <div className="flex gap-8 mt-8">

          <div>
            <h4 className="
            text-2xl
            font-black

            text-slate-900
            dark:text-white
            ">
              7+
            </h4>

            <p className="
            text-sm

            text-slate-500
            dark:text-slate-400
            ">
              Tools
            </p>
          </div>

          <div>
            <h4 className="
            text-2xl
            font-black

            text-slate-900
            dark:text-white
            ">
              Free
            </h4>

            <p className="
            text-sm

            text-slate-500
            dark:text-slate-400
            ">
              Forever
            </p>
          </div>

          <div>
            <h4 className="
            text-2xl
            font-black

            text-slate-900
            dark:text-white
            ">
              24/7
            </h4>

            <p className="
            text-sm

            text-slate-500
            dark:text-slate-400
            ">
              Access
            </p>
          </div>

        </div>

      </div>

      {/* Product */}

      <div>

        <h3
          className="
          font-bold

          text-slate-900
          dark:text-white

          mb-5
          "
        >
          Tools
        </h3>

        <div className="flex flex-col gap-3">

          <Link
            to="/sip-calculator"
            className="
            text-slate-600
            dark:text-slate-400

            hover:text-blue-500

            transition
            "
          >
            SIP Calculator
          </Link>

          <Link
            to="/emi-calculator"
            className="
            text-slate-600
            dark:text-slate-400

            hover:text-blue-500

            transition
            "
          >
            EMI Calculator
          </Link>

          <Link
            to="/retirement-calculator"
            className="
            text-slate-600
            dark:text-slate-400

            hover:text-blue-500

            transition
            "
          >
            Retirement Planner
          </Link>

        </div>

      </div>

      {/* Company */}

      <div>

        <h3
          className="
          font-bold

          text-slate-900
          dark:text-white

          mb-5
          "
        >
          Company
        </h3>

        <div className="flex flex-col gap-3">

          <Link
            to="/about"
            className="
            text-slate-600
            dark:text-slate-400

            hover:text-blue-500

            transition
            "
          >
            About Us
          </Link>

          <Link
            to="/contact"
            className="
            text-slate-600
            dark:text-slate-400

            hover:text-blue-500

            transition
            "
          >
            Contact
          </Link>

          <Link
            to="/articles"
            className="
            text-slate-600
            dark:text-slate-400

            hover:text-blue-500

            transition
            "
          >
            Finance Guides
          </Link>

        </div>

      </div>

      {/* Legal */}

      <div>

        <h3
          className="
          font-bold

          text-slate-900
          dark:text-white

          mb-5
          "
        >
          Legal
        </h3>

        <div className="flex flex-col gap-3">

          <Link
            to="/privacy-policy"
            className="
            text-slate-600
            dark:text-slate-400

            hover:text-blue-500

            transition
            "
          >
            Privacy Policy
          </Link>

          <Link
            to="/terms"
            className="
            text-slate-600
            dark:text-slate-400

            hover:text-blue-500

            transition
            "
          >
            Terms of Service
          </Link>

          <Link
            to="/disclaimer"
            className="
            text-slate-600
            dark:text-slate-400

            hover:text-blue-500

            transition
            "
          >
            Disclaimer
          </Link>

        </div>

      </div>

    </div>

    {/* Bottom */}

    <div
      className="
      border-t
      border-slate-200
      dark:border-white/10

      py-6

      flex
      flex-col
      md:flex-row

      justify-between
      items-center

      gap-4
      "
    >

      <p
        className="
        text-sm

        text-slate-500
        dark:text-slate-400
        "
      >
        © {new Date().getFullYear()} WealthFluent.
        All rights reserved.
      </p>

      <div
        className="
        flex
        items-center

        gap-6

        text-sm

        text-slate-500
        dark:text-slate-400
        "
      >

        <span>Made for Modern Investors</span>

      </div>

    </div>

  </div>

</footer>
    </div>
    </div>
  );
}
