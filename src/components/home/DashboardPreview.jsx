import MiniChart from "./dashboard/MiniChart";
import SmallMetric from "./dashboard/SmallMetric";
import FinancialScoreCard from "./dashboard/FinancialScoreCard";
import UpcomingCard from "./dashboard/UpcomingCard";
import GoalRing from "./dashboard/GoalRing";
import RecentActivity from "./dashboard/RecentActivity";
import DashboardHeader from "./dashboard/DashboardHeader";
import { Link } from "react-router-dom";
import { useWorkspace } from "../../context/WorkspaceContext";
import { formatCurrency } from "../../utils/currency";
import { useSettings } from "../../context/SettingsContext";

import {
  TrendingUp,
  Wallet,
  ShieldCheck,
} from "lucide-react";


export default function DashboardPreview() {
  const { workspace } = useWorkspace();
  const { settings } = useSettings();
  
  return (
    <section className="relative z-10 rounded-[28px] bg-white/90 p-6 shadow-[0_26px_70px_rgba(15,23,42,.13)] ring-1 ring-slate-200/80 backdrop-blur-xl">
    <DashboardHeader />

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_.8fr_.7fr]">
        <div className="rounded-2xl bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,.05)] ring-1 ring-slate-200/70">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900">Net Worth</h3>
            <button type="button" className="rounded-xl border border-slate-200 px-3 py-1.5 text-[10px] font-black text-slate-600 transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50">This Month</button>
          </div>
          {workspace.dashboard.netWorth ? (
  <div className="mt-4 text-[28px] font-black tracking-[-0.035em] text-slate-950">
    {formatCurrency(
  workspace.dashboard.netWorth,
  settings.currency
)}
  </div>
) : (
  <div className="mt-4">
    <div className="text-lg font-bold text-slate-500">
      Not calculated yet
    </div>

    <Link
      to="/networth-calculator"
      className="mt-2 inline-flex items-center text-sm font-semibold text-emerald-700 transition-all duration-200 hover:translate-x-1 hover:text-emerald-800"
    >
      Calculate Net Worth →
    </Link>
  </div>
)}
         {workspace.dashboard.netWorth && (
  <div className="mt-1.5 text-[11px] font-black text-emerald-700">
    Last updated today
  </div>
)}
          <MiniChart />
        </div>
        <GoalRing />
        <UpcomingCard />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
     <SmallMetric
  icon={<TrendingUp size={18} className="text-emerald-600" />}
  label="Monthly Investment"
  value={
    workspace.dashboard.monthlyInvestment
      ? formatCurrency(
          workspace.dashboard.monthlyInvestment,
          settings.currency
        )
      : "Not set"
  }
  subtitle="Monthly SIP"
  change={
    workspace.dashboard.monthlyInvestment ? "Live" : undefined
  }
  empty={!workspace.dashboard.monthlyInvestment}
  action={
    !workspace.dashboard.monthlyInvestment
      ? "Start Investing"
      : "Manage"
  }
/>

     <SmallMetric
  icon={<Wallet size={18} className="text-violet-600" />}
  label="Passive Income"
  value={
    workspace.dashboard.passiveIncome
      ? `${formatCurrency(
          workspace.dashboard.passiveIncome,
          settings.currency
        )}\n/month`
      : "Not available"
  }
  subtitle="Passive Cash Flow"
  change={
    workspace.dashboard.passiveIncome
      ? "Updated Today"
      : undefined
  }
  empty={!workspace.dashboard.passiveIncome}
  action={
    !workspace.dashboard.passiveIncome
      ? "Create Plan"
      : "View Details"
  }
/>
      <SmallMetric
  icon={
    <ShieldCheck
      size={18}
      className="text-blue-600"
    />
  }
  accent="blue"
  label="Emergency Fund"
  value={
    workspace.dashboard.emergencyFund
      ? formatCurrency(
          workspace.dashboard.emergencyFund.currentAmount,
          settings.currency
        )
      : "Not set"
  }
  subtitle={
    workspace.dashboard.emergencyFund
      ? `${workspace.dashboard.emergencyFund.monthsCovered} Months Covered`
      : "Financial Safety"
  }
  progress={
    workspace.dashboard.emergencyFund
      ? workspace.dashboard.emergencyFund.progress
      : undefined
  }
  change={
    workspace.dashboard.emergencyFund
      ? "Building"
      : undefined
  }
  empty={!workspace.dashboard.emergencyFund}
  action={
    workspace.dashboard.emergencyFund
      ? "Continue Building"
      : "Create Fund"
  }
/>
       <FinancialScoreCard />
      </div>
      <RecentActivity />
    </section>
  );
}