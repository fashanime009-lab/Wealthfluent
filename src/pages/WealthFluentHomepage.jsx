import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import SectionTitle from "../components/home/SectionTitle";
import LessonCard from "../components/home/LessonCard";
import LearningSection from "../components/home/LearningSection";
import TrustBanner from "../components/home/TrustBanner";
import Hero from "../components/home/Hero";
import CalculatorsSection from "../components/home/calculators/CalculatorsSection";
import WorkspacePanel from "../components/home/WorkspacePanel";
import {
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Calculator,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Crown,
  Globe2,
  Home,
  LineChart,
  MenuSquare,
  Moon,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
} from "lucide-react";
import logo from "../assets/logo.webp";

const SITE_URL =
  import.meta.env.VITE_SITE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "https://finaiw.com");

const navItems = [
  { label: "Home", to: "/" },
  { label: "Calculators", to: "/calculators" },
  { label: "Goals", to: "/goal-planner" },
  { label: "Workspace", to: "/WorkspacePage" },
  { label: "Learn", to: "/blogs" },
  { label: "Insights", to: "/news" },
  { label: "Tools", to: "/tools" },
];

const sideItems = [
  { label: "Home", icon: Home, to: "/" },
  { label: "Workspace", icon: BriefcaseBusiness, to: "/WorkspacePage" },
  { label: "Calculators", icon: Calculator, to: "/calculators" },
  { label: "Goals", icon: ShieldCheck, to: "/goal-planner" },
  { label: "Learn", icon: BookOpen, to: "/blogs" },
  { label: "Insights", icon: Sparkles, to: "/news" },
  { label: "Tools", icon: Target, to: "/tools" },
];

const proofItems = [
  { title: "Secure", text: "Privacy-minded tools", icon: ShieldCheck },
  { title: "Global", text: "Works across markets", icon: Globe2 },
  { title: "Simple", text: "No clutter, no noise", icon: Sparkles },
  { title: "Useful", text: "Calculators open directly", icon: Calculator },
];

const calculators = [
  {
    title: "SIP Calculator",
    text: "Plan recurring investments with clear long-term projections.",
    tag: "Investing",
    tone: "bg-emerald-50 text-emerald-700",
    icon: LineChart,
    iconTone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    to: "/sip-calculator",
  },
  {
    title: "EMI Calculator",
    text: "Estimate loan payments before making a borrowing decision.",
    tag: "Loans",
    tone: "bg-sky-50 text-sky-700",
    icon: Home,
    iconTone: "bg-sky-50 text-sky-700 ring-sky-100",
    to: "/emi-calculator",
  },
  {
    title: "Retirement Planner",
    text: "Build a retirement target around your own assumptions.",
    tag: "Planning",
    tone: "bg-orange-50 text-orange-700",
    icon: BriefcaseBusiness,
    iconTone: "bg-orange-50 text-orange-700 ring-orange-100",
    to: "/retirement-calculator",
  },
  {
    title: "FIRE Calculator",
    text: "Find your financial independence number and timeline.",
    tag: "Advanced",
    tone: "bg-violet-50 text-violet-700",
    icon: Target,
    iconTone: "bg-violet-50 text-violet-700 ring-violet-100",
    to: "/fire-calculator",
  },
  {
    title: "FD Calculator",
    text: "Compare fixed-income returns and maturity values.",
    tag: "Savings",
    tone: "bg-emerald-50 text-emerald-700",
    icon: ShieldCheck,
    iconTone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    to: "/fd-calculator",
  },
  {
    title: "GST Calculator",
    text: "Calculate tax values for invoices and purchases.",
    tag: "Business",
    tone: "bg-purple-50 text-purple-700",
    icon: Calculator,
    iconTone: "bg-purple-50 text-purple-700 ring-purple-100",
    to: "/gst-calculator",
  },
];

const lessons = [
  {
    title: "Compound Interest",
    text: "Understand how time, consistency and returns interact.",
    icon: LineChart,
    tag: "Core Skill",
    tone: "from-emerald-50 to-white",
  },
  {
    title: "Investment Basics",
    text: "Learn the foundations before choosing financial products.",
    icon: LineChart,
    tag: "Beginner",
    tone: "from-sky-50 to-white",
  },
  {
    title: "Retirement Planning",
    text: "Turn a distant goal into a practical savings system.",
    icon: BriefcaseBusiness,
    tag: "Planning",
    tone: "from-violet-50 to-white",
  },
  {
    title: "Risk Management",
    text: "Balance growth, liquidity and downside protection.",
    icon: ShieldCheck,
    tag: "Guide",
    tone: "from-orange-50 to-white",
  },
  {
    title: "Market Basics",
    text: "Read financial headlines with better context.",
    icon: Globe2,
    tag: "Markets",
    tone: "from-blue-50 to-white",
  },
];

const footerColumns = [
  { title: "Product", links: ["Calculators", "Workspace", "Goals", "Insights", "Tools", "AI Assistant"] },
  { title: "Learn", links: ["Courses", "Lessons", "Quizzes", "Guides", "Glossary"] },
  { title: "Company", links: ["About Us", "Careers", "Contact Us", "Privacy Policy", "Terms of Use"] },
];


function SideRail() {
  return (
    <aside className="fixed left-0 top-0 z-[70] hidden h-screen w-[92px] flex-col items-center border-r border-slate-200/70 bg-white/88 px-3 py-4 backdrop-blur-xl lg:flex">
      <Link to="/" className="grid h-14 w-14 place-items-center rounded-2xl">
        <img src={logo} alt="FINAIW" className="h-9 w-9 object-contain" />
      </Link>
      <nav className="mt-8 flex w-full flex-1 flex-col items-center gap-2 rounded-[18px] bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,.06)] ring-1 ring-slate-100">
        {sideItems.map((item, index) => {
          const Icon = item.icon;
          const active = index === 0;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex w-full flex-col items-center rounded-2xl px-2 py-3 text-[10px] font-black transition ${
                active ? "bg-emerald-50 text-emerald-800" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon size={18} strokeWidth={2.1} />
              <span className="mt-2">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <Link
        to="/tools"
        className="mt-4 flex w-full flex-col items-center rounded-2xl bg-gradient-to-b from-amber-50 to-white px-2 py-4 text-[10px] font-black text-slate-900 shadow-[0_18px_42px_rgba(15,23,42,.06)] ring-1 ring-amber-100"
      >
        <Crown size={19} className="text-amber-500" />
        <span className="mt-2">Upgrade</span>
        <span>Tools</span>
      </Link>
    </aside>
  );
}

function CalculatorCard({ item }) {
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      className="group flex min-h-[218px] flex-col justify-between rounded-2xl bg-white p-5 shadow-[0_16px_38px_rgba(15,23,42,.055)] ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,23,42,.09)]"
    >
      <div>
        <div className="grid h-20 place-items-center">
          <span className={`grid h-14 w-14 place-items-center rounded-2xl ring-1 ${item.iconTone}`}>
            <Icon size={28} strokeWidth={1.9} />
          </span>
        </div>
        <h3 className="mt-4 text-[15px] font-black text-slate-950">{item.title}</h3>
        <p className="mt-3 text-[13px] font-semibold leading-5 text-slate-600">{item.text}</p>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className={`rounded-lg px-3 py-1.5 text-[10px] font-black ${item.tone}`}>{item.tag}</span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-slate-950 shadow-[0_10px_22px_rgba(15,23,42,.08)] ring-1 ring-slate-200 transition group-hover:bg-emerald-800 group-hover:text-white">
          <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}

function FooterSection() {
  return (
    <footer className="mt-8 border-t border-slate-200 bg-white px-5 py-9 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1660px] gap-9 lg:grid-cols-[1.15fr_1.85fr_1.1fr]">
       <Link to="/" className="flex items-center gap-3">
  <img
    src={logo}
    alt="FINAIW"
    className="h-10 w-10 object-contain"
  />

  <div>
    <h2 className="text-xl font-black text-slate-950">
      FINAIW
    </h2>

    <p className="text-xs text-slate-500">
      Financial Intelligence with AI
    </p>
  </div>
</Link>
        <div className="grid gap-8 sm:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[14px] font-black text-slate-950">{column.title}</h3>
              <div className="mt-4 space-y-3">
                {column.links.map((link) => <Link key={link} to="/" className="block text-[13px] font-semibold text-slate-600 hover:text-emerald-800">{link}</Link>)}
              </div>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-[14px] font-black text-slate-950">Stay updated</h3>
          <p className="mt-4 text-[13px] font-semibold leading-6 text-slate-600">Weekly financial insights, tools and tips delivered to your inbox.</p>
          <form className="mt-5 flex overflow-hidden rounded-xl bg-white shadow-[0_12px_30px_rgba(15,23,42,.06)] ring-1 ring-slate-200">
            <input className="min-w-0 flex-1 px-4 py-4 text-[13px] font-semibold outline-none" placeholder="Enter your email" />
            <button type="submit" className="grid w-14 place-items-center bg-emerald-800 text-white"><ArrowRight size={18} /></button>
          </form>
          <p className="mt-4 text-[12px] font-bold text-slate-500">Made with <span className="text-rose-500">♥</span> in India</p>
        </div>
      </div>
    </footer>
  );
}

export default function WealthFluentHomepage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FINAIW",
    url: SITE_URL,
    description: "A personal financial operating system for calculators, learning, workspace tools and planning guidance.",
  };

  return (
    <div className="finaiw-home-screen min-h-screen bg-[#fbfdfc] text-slate-950">
      <Helmet>
        <title>FINAIW | Personal Finance Calculators, Workspace and Learning</title>
        <meta
          name="description"
          content="FINAIW brings elegant financial calculators, planning tools, learning and workspace features into one personal finance operating system."
        />
        <link rel="canonical" href={`${SITE_URL}/`} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <style>{`
          body:has(.finaiw-home-screen) > #root > header,
          body:has(.finaiw-home-screen) > #root > footer {
            display: none !important;
          }
          body:has(.finaiw-home-screen) {
            background: #fbfdfc;
          }
        `}</style>
      </Helmet>

      <SideRail />
      <div className="lg:pl-[92px]">
        
        <Hero />
        <CalculatorsSection />
        <WorkspacePanel />
        <LearningSection />
        <TrustBanner />
        <FooterSection />
      </div>
    </div>
  );
}
