import { Link } from "react-router-dom";
import { ArrowRight, Check, MenuSquare } from "lucide-react";
function MiniChart() {
  return (
    <div className="mt-6 h-32 rounded-2xl bg-gradient-to-br from-emerald-400/10 to-transparent p-4">
      <svg
        viewBox="0 0 300 120"
        className="h-full w-full"
        fill="none"
      >
        <path
          d="M10 95 C40 90,55 65,85 70 C120 75,135 35,170 40 C210 45,225 20,290 28"
          stroke="currentColor"
          strokeWidth="4"
          className="text-emerald-300"
          strokeLinecap="round"
        />
      </svg>

      <div className="mt-2 flex justify-end">
        <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
          +18%
        </span>
      </div>
    </div>
  );
}
export default function WorkspacePanel() {
  return (
    <section className="mx-auto mt-8 grid max-w-[1660px] gap-7 rounded-[24px] bg-[radial-gradient(circle_at_82%_20%,rgba(16,185,129,.16),transparent_32%),linear-gradient(135deg,#052f24,#031b18)] p-7 text-white shadow-[0_24px_80px_rgba(2,44,34,.2)] lg:grid-cols-[.62fr_1.58fr] lg:p-9">
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="text-[30px] font-black leading-tight tracking-[-0.04em]">One workspace.<br />All your finances.</h2>
          <p className="mt-5 max-w-sm text-[14px] font-medium leading-7 text-emerald-50/90">
            Your goals, investments, net worth and planning tools stay connected in one calm workspace.
          </p>
          <div className="mt-6 space-y-3.5 text-[13px] font-bold text-emerald-50">
            {["Track everything in one place", "Get AI-powered insights", "Stay on top of your goals"].map((item) => (
              <div key={item} className="flex items-center gap-3"><Check size={18} className="text-emerald-300" />{item}</div>
            ))}
          </div>
        </div>
        <Link to="/WorkspacePage" className="mt-8 inline-flex h-[52px] w-fit items-center gap-3 rounded-xl bg-white px-7 text-[13px] font-black text-emerald-950">
          Open Your Workspace <ArrowRight size={17} />
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-[.42fr_1fr_.72fr_.7fr]">
        <div className="rounded-2xl bg-white/7 p-4 ring-1 ring-white/15">
          {["Overview", "Goals", "Calculators", "Insights", "Documents", "Settings"].map((item, index) => (
            <div key={item} className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-2.5 text-[11px] font-black ${index === 0 ? "bg-emerald-400/18 text-white" : "text-emerald-50/80"}`}>
              <MenuSquare size={15} />{item}
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-white/7 p-5 ring-1 ring-white/15">
          <h3 className="text-[13px] font-black">Planning Workspace</h3>
          <p className="mt-4 text-[23px] font-black tracking-[-0.03em]">Connect your goals</p>
          <p className="mt-3 text-[13px] font-medium leading-6 text-emerald-50/80">
            See your financial picture, goals and planning tools in a focused workspace.
          </p>
          <MiniChart />
        </div>
       <div className="rounded-2xl bg-white/7 p-5 ring-1 ring-white/15">
  <h3 className="text-[13px] font-black">
    Financial Snapshot
  </h3>

  <div className="mt-5 space-y-5">
    {[
      ["Goals", "Connected"],
      ["Investments", "Tracking"],
      ["Net Worth", "Monitoring"],
      ["AI Insights", "Ready"],
    ].map(([label, status]) => (
      <div
        key={label}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

          <span className="text-[13px] font-semibold text-emerald-50">
            {label}
          </span>
        </div>

        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-200">
          {status}
        </span>
      </div>
    ))}
  </div>
</div>
       <div className="rounded-2xl bg-white/7 p-5 ring-1 ring-white/15">
  <div className="flex items-center justify-between">
    <h3 className="text-[13px] font-black">
      AI Insight
    </h3>

    <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-semibold text-emerald-300">
      LIVE
    </span>
  </div>

  <div className="mt-5 rounded-xl bg-white/5 p-4">
    <p className="text-[12px] font-semibold uppercase tracking-wide text-emerald-300">
      Today's Recommendation
    </p>

    <p className="mt-3 text-[14px] leading-7 text-emerald-50/90">
      Increase your monthly SIP by
      <span className="font-bold text-white"> ₹2,000 </span>
      to reach your retirement goal nearly
      <span className="font-bold text-white"> 3 years earlier.</span>
    </p>
  </div>

  <div className="mt-5 flex items-center justify-between text-[12px] text-emerald-100/70">
    <span>Powered by FINAIW AI</span>

    <Link
      to="/WorkspacePage"
      className="font-semibold text-emerald-300 hover:text-white"
    >
      View Details →
    </Link>
  </div>
</div>
      </div>
    </section>
  );
}