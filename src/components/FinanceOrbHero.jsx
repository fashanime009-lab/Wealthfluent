import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import {
  ArrowUpRight,
  Sparkles,
  Activity,
} from "lucide-react";

const tickers = [
  { sym: "BTC", chg: "+2.4%", up: true },
  { sym: "ETH", chg: "+1.8%", up: true },
  { sym: "NIFTY", chg: "+1.2%", up: true },
  { sym: "NASDAQ", chg: "+3.8%", up: true },
  { sym: "AAPL", chg: "+4.1%", up: true },
  { sym: "TSLA", chg: "-0.6%", up: false },
  { sym: "NVDA", chg: "+5.2%", up: true },
  { sym: "GOLD", chg: "+0.4%", up: true },
];

const stats = [
  { title: "₹240Cr+", sub: "Assets Managed" },
  { title: "18.2%", sub: "Avg Annual Yield" },
  { title: "24/7", sub: "AI Monitoring" },
];

export default function FinanceOrbHero() {
  const { darkMode } = useTheme();
  return (
    <section
  className={`
  relative
  min-h-screen
  overflow-hidden
  transition-all
  duration-500
  ${
    darkMode
      ? "bg-[#030712] text-white"
      : "bg-white text-slate-900"
  }
`}
>
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        {/* grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
        style={{
  backgroundImage: `
  linear-gradient(
    to right,
    ${
      darkMode
        ? "rgba(255,255,255,0.08)"
        : "rgba(15,23,42,0.06)"
    } 1px,
    transparent 1px
  ),
  linear-gradient(
    to bottom,
    ${
      darkMode
        ? "rgba(255,255,255,0.08)"
        : "rgba(15,23,42,0.06)"
    } 1px,
    transparent 1px
  )
`,
}}
        />

        {/* glow */}
        {darkMode && (
  <div className="absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-cyan-500/20 blur-[140px]" />
)}
{darkMode && (
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[140px]" />
     )}
        </div>

      {/* HERO */}
      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-20 px-6 py-16 lg:grid-cols-2 lg:px-10">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.08] px-4 py-2 backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
            </span>

            <Sparkles className="h-4 w-4 text-cyan-200" />

            <span
  className={`text-sm font-medium ${
    darkMode
      ? "text-cyan-100"
      : "text-cyan-700"
  }`}
>
              AI-Powered Financial Intelligence
            </span>
          </div>

          {/* heading */}
          <h1 className="text-[clamp(3.5rem,8vw,7rem)] font-black leading-[0.92] tracking-tight">
            Build{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-cyan-200 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                Wealth
              </span>

              {/* underline */}
              <svg
                className="absolute -bottom-4 left-0 w-full"
                viewBox="0 0 300 14"
                fill="none"
              >
                <path
                  d="M2 9 C 80 2, 160 12, 298 5"
                  stroke="url(#u)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                <defs>
                  <linearGradient id="u" x1="0" x2="1">
                    <stop offset="0" stopColor="#22d3ee" />
                    <stop offset="1" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </span>

            <br />

            <span
  className={
    darkMode
      ? "text-white/30"
      : "text-slate-300"
  }
>
  Smarter.
</span>
          </h1>

          {/* description */}
          <p
  className={`mt-10 max-w-xl text-lg leading-relaxed ${
    darkMode
      ? "text-white/55"
      : "text-slate-600"
  }`}
>
            An AI-driven finance platform that tracks assets, automates growth
            strategies, and optimizes portfolios in real time — so your capital
            never sleeps.
          </p>

          {/* buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <button className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-300 to-blue-500 px-8 py-4 font-bold text-black shadow-[0_15px_60px_-10px_rgba(34,211,238,0.5)] transition duration-300 hover:scale-[1.02]">
              <span className="relative flex items-center gap-2">
                Start Investing
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
            </button>

           <button
  className={`
    inline-flex items-center gap-2 rounded-2xl
    ${
      darkMode
        ? "border border-white/10 bg-white/[0.04]"
        : "border border-slate-200 bg-slate-50"
    }
    px-8 py-4
    font-medium
    backdrop-blur-xl
  `}
>
              <Activity className="h-4 w-4 text-cyan-300" />
              View Live Analytics
            </button>
          </div>

          {/* ticker */}
          <div className="relative mt-12 overflow-hidden">
            <div
  className={`pointer-events-none absolute left-0 top-0 z-10 h-full w-20 ${
    darkMode
      ? "bg-gradient-to-r from-[#030712] to-transparent"
      : "bg-gradient-to-r from-white to-transparent"
  }`}
/>
            <div
  className={`pointer-events-none absolute right-0 top-0 z-10 h-full w-20 ${
    darkMode
      ? "bg-gradient-to-l from-[#030712] to-transparent"
      : "bg-gradient-to-l from-white to-transparent"
  }`}
/>

            <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-3">
              {[...tickers, ...tickers].map((t, i) => (
                <div
                  key={i}
                className={`
inline-flex items-center gap-2 rounded-full

${
  darkMode
    ? "border border-white/10 bg-white/[0.03]"
    : "border border-slate-200 bg-slate-50"
}

px-4 py-2 text-sm
`} 
                >
                  <span
  className={`font-semibold ${
    darkMode
      ? "text-white/90"
      : "text-slate-800"
  }`}
>
  {t.sym}
</span>

                  <span
                    className={
                      t.up ? "text-cyan-300" : "text-rose-400"
                    }
                  >
                    {t.chg}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* stats */}
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.title}
              className={`
rounded-3xl p-6

${
  darkMode
    ? "border border-white/10 bg-white/[0.03]"
    : "border border-slate-200 bg-white shadow-sm"
}
`} 
              >
                <h3 className="text-3xl font-black tracking-tight">
                  {s.title}
                </h3>

                <p
  className={`mt-2 text-sm ${
    darkMode
      ? "text-white/45"
      : "text-slate-500"
  }`}
>
  {s.sub}
</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT SIDE GRAPH */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative hidden lg:flex items-center justify-center"
        >
          {/* glow */}
          {darkMode && (
  <div className="absolute h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[120px]" />
)}

          {/* graph wrapper */}
          <div className="relative w-full max-w-[620px]">
            {/* portfolio card */}
            <div
  className={`
    absolute
    left-0
    top-10
    z-20
    rounded-2xl
    px-5
    py-4
    backdrop-blur-2xl
    border border-cyan-400/20
    ${
      darkMode
        ? "bg-[#07111f]/80"
        : "bg-white shadow-lg"
    }
  `}
>
              <p
  className={`text-xs uppercase tracking-widest ${
    darkMode
      ? "text-white/40"
      : "text-slate-500"
  }`}
>
  Portfolio
</p>

              <h3
  className={`mt-1 text-3xl font-black ${
    darkMode
      ? "text-white"
      : "text-slate-900"
  }`}
>
                ₹12.8L
              </h3>

              <p className="mt-1 text-sm text-cyan-300">
                +28% this month
              </p>
            </div>

            {/* AI signal */}
            <div className="absolute right-0 top-28 z-20 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 backdrop-blur-2xl">
              <p
  className={`text-xs uppercase tracking-widest ${
    darkMode
      ? "text-white/40"
      : "text-slate-500"
  }`}
>
                AI Signal
              </p>

              <h3 className="mt-1 text-lg font-bold text-cyan-300">
                Strong Bullish
              </h3>
            </div>

            {/* graph */}
            <div className={`
relative h-[420px]
overflow-hidden
rounded-[40px]
backdrop-blur-3xl

${
  darkMode
    ? "border border-white/10 bg-gradient-to-b from-cyan-500/[0.08] to-transparent"
    : "border border-slate-200 bg-white shadow-xl"
}
`}>
              {/* grid */}
              <div
  className="absolute inset-0 opacity-[0.08]"
  style={{
    backgroundImage: darkMode
      ? `
        linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)
      `
      : `
        linear-gradient(to right, rgba(15,23,42,0.15) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(15,23,42,0.15) 1px, transparent 1px)
      `,
    backgroundSize: "70px 70px",
  }}
/>

              {/* graph glow */}
              <div className="absolute bottom-0 left-1/2 h-[220px] w-[400px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[100px]" />

              {/* graph */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 700 400"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="line" x1="0" x2="1">
                    <stop offset="0%" stopColor="#67e8f9" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>

                  <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="#22d3ee"
                      stopOpacity="0.45"
                    />
                    <stop
                      offset="100%"
                      stopColor="#22d3ee"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                {/* area */}
                <path
                  d="M0 340 
                    C100 300 140 240 220 220
                    C300 200 340 120 430 130
                    C520 140 560 60 700 20
                    L700 400 
                    L0 400 Z"
                  fill="url(#fill)"
                />

                {/* line */}
                <motion.path
                  d="M0 340 
                    C100 300 140 240 220 220
                    C300 200 340 120 430 130
                    C520 140 560 60 700 20"
                  fill="none"
                  stroke="url(#line)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                />

                {/* dot */}
                <circle cx="700" cy="20" r="7" fill="#67e8f9" />

                <circle
                  cx="700"
                  cy="20"
                  r="18"
                  fill="#67e8f9"
                  opacity="0.3"
                />
              </svg>

              {/* months */}
              <div
  className={`absolute bottom-5 left-6 right-6 flex justify-between text-xs ${
    darkMode
      ? "text-white/30"
      : "text-slate-500"
  }`}
>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* marquee animation */}
      <style>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}