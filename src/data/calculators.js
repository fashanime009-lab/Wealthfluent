import {
  LineChart,
  Home,
  BriefcaseBusiness,
  Target,
  ShieldCheck,
  Calculator,
} from "lucide-react";

export const calculators = [
 {
  title: "SIP Calculator",
  description:
    "Start investing consistently with a disciplined monthly investment plan.",
  bestFor: "First-time Investors",
  outcome: "Estimate your future wealth",
  featured: true,
  icon: LineChart,
  iconTone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  to: "/sip-calculator",
},
  {
  title: "EMI Calculator",
  description:
    "Know your monthly loan payments before making a borrowing decision.",
  bestFor: "Home Buyers",
  outcome: "Estimate your monthly EMI",
  featured: false,
  icon: Home,
  iconTone: "bg-sky-50 text-sky-700 ring-sky-100",
  to: "/emi-calculator",
},
  {
  title: "Retirement Planner",
  description:
    "Build a realistic retirement plan based on your financial goals.",
  bestFor: "Long-term Planning",
  outcome: "Estimate retirement corpus",
  featured: false,
  icon: BriefcaseBusiness,
  iconTone: "bg-orange-50 text-orange-700 ring-orange-100",
  to: "/retirement-calculator",
},
  {
  title: "FIRE Calculator",
  description:
    "Calculate when you can achieve financial independence and retire early.",
  bestFor: "Financial Independence",
  outcome: "Know your FIRE target",
  featured: false,
  icon: Target,
  iconTone: "bg-violet-50 text-violet-700 ring-violet-100",
  to: "/fire-calculator",
},
 {
  title: "FD Calculator",
  description:
    "Estimate guaranteed returns from your fixed deposit investment.",
  bestFor: "Safe Savings",
  outcome: "Estimate maturity value",
  featured: false,
  icon: ShieldCheck,
  iconTone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  to: "/fd-calculator",
},
 {
  title: "GST Calculator",
  description:
    "Calculate GST quickly for invoices, products and services.",
  bestFor: "Businesses & Freelancers",
  outcome: "Calculate GST instantly",
  featured: false,
  icon: Calculator,
  iconTone: "bg-purple-50 text-purple-700 ring-purple-100",
  to: "/gst-calculator",
},
];