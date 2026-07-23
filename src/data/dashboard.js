import {
  Bell,
  Calculator,
  LineChart,
  ShieldCheck,
} from "lucide-react";

export const previewDashboard = {
  netWorth: null,

  monthlyChange: null,

  financialScore: null,

  metrics: [
    {
      label: "Monthly Investment",
      value: null,
      change: null,
    },
    {
      label: "Passive Income",
      value: null,
      change: null,
    },
    {
      label: "Emergency Fund",
      value: null,
      change: null,
    },
    {
      label: "Financial Score",
      value: null,
      change: null,
    },
  ],

  upcomingEvents: [
    {
      title: "Create your first financial goal",
      detail: "Start planning today",
      icon: Bell,
      action: "/goals",
    },
    {
      title: "Try the EMI Calculator",
      detail: "Estimate your monthly payment",
      icon: Calculator,
      action: "/emi-calculator",
    },
    {
      title: "Track your investments",
      detail: "Monitor long-term growth",
      icon: LineChart,
      action: "/workspace",
    },
  ],

  recentActivity: [],

  goalSummary: {
    onTrack: 0,
    behind: 0,
    atRisk: 0,
  },
};