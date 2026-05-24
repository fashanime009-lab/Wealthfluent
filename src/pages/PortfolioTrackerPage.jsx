import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PortfolioTrackerPage() {

  const [assets, setAssets] = useState([
    {
      name: "Stocks",
      invested: 300000,
      current: 420000,
      color: "#22d3ee",
    },
    {
      name: "Mutual Funds",
      invested: 200000,
      current: 280000,
      color: "#818cf8",
    },
    {
      name: "Crypto",
      invested: 100000,
      current: 70000,
      color: "#f59e0b",
    },
    {
      name: "Gold",
      invested: 150000,
      current: 180000,
      color: "#10b981",
    },
  ]);

  const [newAsset, setNewAsset] = useState({
    name: "",
    invested: "",
    current: "",
  });

  const portfolioData = useMemo(() => {

    const totalInvested = assets.reduce(
      (acc, asset) => acc + asset.invested,
      0
    );

    const totalCurrent = assets.reduce(
      (acc, asset) => acc + asset.current,
      0
    );

    const profitLoss =
      totalCurrent - totalInvested;

    const returnPercentage =
      ((profitLoss / totalInvested) * 100).toFixed(1);

    let health = "Balanced";

    if (returnPercentage > 20)
      health = "Strong Growth";

    else if (returnPercentage > 10)
      health = "Healthy";

    else if (returnPercentage < 0)
      health = "Needs Attention";

    return {
      totalInvested,
      totalCurrent,
      profitLoss,
      returnPercentage,
      health,
    };

  }, [assets]);

  const addAsset = () => {

    if (
      !newAsset.name ||
      !newAsset.invested ||
      !newAsset.current
    ) return;

    const colors = [
      "#22d3ee",
      "#818cf8",
      "#10b981",
      "#f59e0b",
      "#f43f5e",
      "#8b5cf6",
    ];

    setAssets([
      ...assets,
      {
        ...newAsset,
        invested: Number(newAsset.invested),
        current: Number(newAsset.current),
        color:
          colors[
            Math.floor(Math.random() * colors.length)
          ],
      },
    ]);

    setNewAsset({
      name: "",
      invested: "",
      current: "",
    });

  };

  return (

    <div className="min-h-screen bg-[#07111f] text-white overflow-hidden">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/80 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">

          <Link to="/">
            <h1 className="text-2xl md:text-3xl font-black">
              Wealth
              <span className="text-cyan-400">
                Fluent
              </span>
            </h1>
          </Link>

          <div className="flex items-center gap-4">

            <Link
              to="/tools"
              className="text-slate-300 hover:text-white transition"
            >
              Tools
            </Link>

            <Link
              to="/"
              className="bg-cyan-500 hover:bg-cyan-400 transition px-5 py-3 rounded-2xl text-black font-bold"
            >
              Home
            </Link>

          </div>

        </div>

      </header>

      {/* HERO */}

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-20">

        <div className="text-center mb-16">

          <p className="text-cyan-400 uppercase tracking-[4px] text-sm font-semibold mb-5">
            AI Portfolio Intelligence
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-6">

            Portfolio

            <span className="block text-cyan-400">
              Tracker
            </span>

          </h1>

          <p className="text-slate-400 max-w-3xl mx-auto text-base md:text-xl leading-relaxed">
            Track your investments, portfolio allocation,
            and wealth growth using an advanced
            portfolio management dashboard.
          </p>

        </div>

        {/* TOP STATS */}

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <div className="rounded-[32px] p-7 bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-400/20">

            <p className="text-slate-300 mb-3">
              Total Invested
            </p>

            <h2 className="text-3xl font-black">
              ₹{portfolioData.totalInvested.toLocaleString()}
            </h2>

          </div>

          <div className="rounded-[32px] p-7 bg-white/5 border border-white/10">

            <p className="text-slate-300 mb-3">
              Current Value
            </p>

            <h2 className="text-3xl font-black">
              ₹{portfolioData.totalCurrent.toLocaleString()}
            </h2>

          </div>

          <div className="rounded-[32px] p-7 bg-white/5 border border-white/10">

            <p className="text-slate-300 mb-3">
              Profit / Loss
            </p>

            <h2 className={`text-3xl font-black ${
              portfolioData.profitLoss >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}>

              ₹{portfolioData.profitLoss.toLocaleString()}

            </h2>

          </div>

          <div className="rounded-[32px] p-7 bg-white/5 border border-white/10">

            <p className="text-slate-300 mb-3">
              Portfolio Health
            </p>

            <h2 className="text-3xl font-black text-cyan-400">
              {portfolioData.health}
            </h2>

          </div>

        </div>

        {/* MAIN GRID */}

        <div className="grid xl:grid-cols-[420px_1fr] gap-8">

          {/* LEFT PANEL */}

          <div className="space-y-8">

            {/* ADD ASSET */}

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-7">

              <h2 className="text-3xl font-black mb-8">
                Add Asset
              </h2>

              <div className="space-y-5">

                <input
                  type="text"
                  placeholder="Asset Name"
                  value={newAsset.name}
                  onChange={(e) =>
                    setNewAsset({
                      ...newAsset,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
                />

                <input
                  type="number"
                  placeholder="Invested Amount"
                  value={newAsset.invested}
                  onChange={(e) =>
                    setNewAsset({
                      ...newAsset,
                      invested: e.target.value,
                    })
                  }
                  className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
                />

                <input
                  type="number"
                  placeholder="Current Value"
                  value={newAsset.current}
                  onChange={(e) =>
                    setNewAsset({
                      ...newAsset,
                      current: e.target.value,
                    })
                  }
                  className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
                />

                <button
                  onClick={addAsset}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 transition rounded-2xl py-4 text-black font-bold"
                >
                  Add Portfolio Asset
                </button>

              </div>

            </div>

            {/* AI INSIGHTS */}

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-7">

              <h2 className="text-3xl font-black mb-8">
                AI Insights
              </h2>

              <div className="space-y-5">

                <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-5">

                  <h3 className="text-cyan-400 font-bold text-lg mb-3">
                    Portfolio Diversification
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    Your investments are spread across
                    multiple asset classes which helps
                    reduce long-term financial risk.
                  </p>

                </div>

                <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-5">

                  <h3 className="text-cyan-400 font-bold text-lg mb-3">
                    Growth Analysis
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    Your current portfolio performance
                    indicates a {portfolioData.health.toLowerCase()}
                    investment trajectory.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT PANEL */}

          <div className="space-y-8">

            {/* PIE CHART */}

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-7">

              <div className="mb-10">

                <p className="text-cyan-400 uppercase tracking-[3px] text-sm font-semibold mb-3">
                  Asset Allocation
                </p>

                <h2 className="text-4xl font-black">
                  Portfolio Distribution
                </h2>

              </div>

              <div className="w-full h-[420px]">

                <ResponsiveContainer width="100%" height="100%">

                  <PieChart>

                    <Pie
                      data={assets}
                      dataKey="current"
                      nameKey="name"
                      outerRadius={140}
                    >

                      {assets.map((asset, index) => (

                        <Cell
                          key={index}
                          fill={asset.color}
                        />

                      ))}

                    </Pie>

                    <Tooltip />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* ASSET LIST */}

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-7">

              <div className="mb-8">

                <p className="text-cyan-400 uppercase tracking-[3px] text-sm font-semibold mb-3">
                  Holdings
                </p>

                <h2 className="text-4xl font-black">
                  Portfolio Assets
                </h2>

              </div>

              <div className="space-y-5">

                {assets.map((asset, index) => {

                  const gain =
                    asset.current - asset.invested;

                  const positive = gain >= 0;

                  return (

                    <div
                      key={index}
                      className="bg-[#0f172a] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
                    >

                      <div className="flex items-center gap-5">

                        <div
                          className="w-5 h-5 rounded-full"
                          style={{
                            background: asset.color,
                          }}
                        />

                        <div>

                          <h3 className="text-2xl font-bold">
                            {asset.name}
                          </h3>

                          <p className="text-slate-400">
                            Invested:
                            ₹{asset.invested.toLocaleString()}
                          </p>

                        </div>

                      </div>

                      <div className="text-left md:text-right">

                        <h3 className="text-2xl font-bold">
                          ₹{asset.current.toLocaleString()}
                        </h3>

                        <p className={`font-semibold ${
                          positive
                            ? "text-green-400"
                            : "text-red-400"
                        }`}>

                          {positive ? "+" : "-"}
                          ₹{Math.abs(gain).toLocaleString()}

                        </p>

                      </div>

                    </div>

                  );

                })}

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>

  );

}