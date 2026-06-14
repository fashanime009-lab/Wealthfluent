import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Goal,
  Globe2,
  Grid2X2,
  LineChart,
  Loader2,
  Mail,
  MessageCircle,
  PieChart,
  RefreshCw,
  Send,
  Share2,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { useFinance } from "../context/FinanceContext";

const NEWS_RSS =
  "https://news.google.com/rss/search?q=finance%20OR%20stock%20market%20OR%20economy%20when:1d&hl=en-IN&gl=IN&ceid=IN:en";

const NEWSDATA_API_KEY =
  import.meta.env.VITE_NEWSDATA_API_KEY || "pub_3798230f728e4a6090ad3c705557970b";

const NEWSDATA_URL = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&category=business&language=en&country=in,us`;

const fallbackNews = [
  {
    category: "Crypto",
    time: "Backup",
    title: "Open Live Finance News",
    desc: "The live provider is temporarily unavailable. Open Google Finance news for the latest market headlines.",
    link: "https://news.google.com/search?q=crypto%20finance%20market&hl=en-IN&gl=IN&ceid=IN%3Aen",
    source: "Google News",
    image: "crypto",
  },
  {
    category: "Markets",
    time: "Backup",
    title: "Open Live Stock Market News",
    desc: "The live provider is temporarily unavailable. Open the market news feed for current articles.",
    link: "https://news.google.com/search?q=stock%20market%20finance&hl=en-IN&gl=IN&ceid=IN%3Aen",
    source: "Google News",
    image: "markets",
  },
  {
    category: "Economy",
    time: "Backup",
    title: "Open Live Economy News",
    desc: "The live provider is temporarily unavailable. Open the economy news feed for current updates.",
    link: "https://news.google.com/search?q=india%20economy%20rbi%20finance&hl=en-IN&gl=IN&ceid=IN%3Aen",
    source: "Google News",
    image: "rbi",
  },
];

const calculators = [
  {
    title: "Net Worth Calculator",
    desc: "Calculate your total net worth",
    icon: LineChart,
    color: "text-emerald-500",
    to: "/wealth-dashboard",
  },
  {
    title: "Financial Goal Planner",
    desc: "Plan and achieve your goals",
    icon: Target,
    color: "text-blue-500",
    to: "/sip-calculator",
  },
  {
    title: "Mutual Fund Calculator",
    desc: "Calculate MF returns",
    icon: PieChart,
    color: "text-orange-500",
    to: "/sip-calculator",
  },
  {
    title: "Interest Calculator",
    desc: "Calculate interest easily",
    icon: CircleDollarSign,
    color: "text-purple-500",
    to: "/fd-calculator",
  },
  {
    title: "Retirement Planning",
    desc: "Plan your retirement",
    icon: Goal,
    color: "text-orange-400",
    to: "/retirement-calculator",
  },
  {
    title: "All Calculators",
    desc: "Explore all calculators",
    icon: Grid2X2,
    color: "text-blue-500",
    to: "/calculators",
  },
];

const tools = [
  {
    title: "Market Tools",
    desc: "Real-time market data & insights",
    icon: TrendingUp,
    color: "text-emerald-500",
    to: "/tools",
  },
  {
    title: "Stock Analysis",
    desc: "Analyze stocks in depth",
    icon: BarChart3,
    color: "text-blue-500",
    to: "/tools",
  },
  {
    title: "Portfolio Tools",
    desc: "Track & optimize portfolio",
    icon: BriefcaseBusiness,
    color: "text-orange-500",
    to: "/portfolio-tracker",
  },
];

const quizAnswers = [
  "Electronic Trading Fund",
  "Exchange Traded Fund",
  "Equity Traded Fund",
  "Easy Transfer Fund",
];

function proxyUrl(url) {
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function stripHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function timeAgo(date) {
  const publishedAt = new Date(date).getTime();
  if (!publishedAt) return "Live";

  const minutes = Math.max(1, Math.floor((Date.now() - publishedAt) / 60000));
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
}

function normalizeNewsDataArticle(article, index) {
  const title = article.title || fallbackNews[index % 3].title;
  const desc = stripHtml(article.description || article.content || fallbackNews[index % 3].desc);
  const category = article.category?.[0] || (index === 0 ? "Markets" : index === 1 ? "Economy" : "Finance");

  return {
    category: category.charAt(0).toUpperCase() + category.slice(1),
    time: timeAgo(article.pubDate),
    title,
    desc: desc.slice(0, 118) || fallbackNews[index % 3].desc,
    link: article.link,
    source: article.source_name || "NewsData",
    image: index === 0 ? "markets" : index === 1 ? "rbi" : "crypto",
  };
}

async function fetchNewsDataArticles() {
  const response = await fetch(NEWSDATA_URL);
  if (!response.ok) throw new Error("NewsData request failed");

  const data = await response.json();
  const articles = data?.results || [];

  return articles
    .filter((article) => article.title && article.link)
    .slice(0, 12)
    .map(normalizeNewsDataArticle);
}

async function fetchRssArticles() {
  const response = await fetch(proxyUrl(NEWS_RSS));
  if (!response.ok) throw new Error("News request failed");

  const xml = await response.text();
  const doc = new DOMParser().parseFromString(xml, "text/xml");

  return Array.from(doc.querySelectorAll("item"))
    .slice(0, 12)
    .map((item, index) => {
      const title = item.querySelector("title")?.textContent?.replace(/\s-\s[^-]+$/, "") || fallbackNews[index % 3].title;
      const desc = stripHtml(item.querySelector("description")?.textContent || fallbackNews[index % 3].desc);
      const link =
        item.querySelector("link")?.textContent ||
        "https://news.google.com/search?q=finance%20markets&hl=en-IN&gl=IN&ceid=IN%3Aen";
      const publishedAt = item.querySelector("pubDate")?.textContent;

      return {
        category: index === 0 ? "Markets" : index === 1 ? "Economy" : "Finance",
        time: timeAgo(publishedAt),
        title,
        desc: desc.slice(0, 118) || fallbackNews[index % 3].desc,
        link,
        source: "Google News",
        image: fallbackNews[index % 3].image,
      };
    });
}

async function fetchFinanceNews() {
  try {
    const apiArticles = await fetchNewsDataArticles();

    const uniqueArticles = Array.from(
      new Map(
        apiArticles.map(article => [article.link, article])
      ).values()
    );

    if (uniqueArticles.length) return uniqueArticles;
  } catch {
    // RSS backup keeps the homepage useful if the API quota or CORS provider fails.
  }

  const rssArticles = await fetchRssArticles();
  if (rssArticles.length) return rssArticles;

  return fallbackNews;
}

function buildAssistantReply(question) {
  const query = question.toLowerCase();

  if (query.includes("sip")) {
    return "For SIP planning, start with a monthly amount, expected return, and timeline. Use the SIP Calculator to compare conservative and optimistic outcomes.";
  }

  if (query.includes("tax")) {
    return "For taxes, separate capital gains, salary income, and deductions first. For final filing decisions, confirm with a qualified tax professional.";
  }

  if (query.includes("stock") || query.includes("market")) {
    return "Check index trend, company earnings, valuation, debt, and cash flow before investing. Avoid acting on a single headline.";
  }

  if (query.includes("mutual")) {
    return "Compare mutual funds by category, expense ratio, rolling returns, downside protection, and fund manager consistency.";
  }

  return "I can help with SIPs, mutual funds, taxes, portfolio planning, and market basics. Ask a specific question and I will guide you to the right tool.";
}

function SectionLabel({ icon: Icon, children }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
      <Icon size={14} />
      {children}
    </div>
  );
}

function NewsImage({ type }) {
  if (type === "crypto") {
    return (
      <div className="relative h-44 overflow-hidden bg-[#071329]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,#32d3ff_0,#1558ff_26%,transparent_48%),linear-gradient(135deg,#021126,#0b3b9f_48%,#031126)]" />
        <div className="absolute left-7 top-8 h-20 w-20 rotate-45 border-4 border-cyan-200 bg-blue-500/20 shadow-[0_0_35px_rgba(59,130,246,.85)]" />
        <div className="absolute right-5 top-9 -rotate-6 text-3xl font-black italic text-white drop-shadow-lg">
          CRYPTO
          <br />
          NEWS
        </div>
        <div className="absolute bottom-0 h-16 w-full bg-gradient-to-t from-[#071329] to-transparent" />
      </div>
    );
  }

  if (type === "markets") {
    return (
      <div className="relative h-44 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,#c9a48c_0,#8d685d_24%,#0b1020_62%)]" />
        <div className="absolute left-1/2 top-7 h-24 w-24 -translate-x-1/2 rounded-full bg-[#d6b9a8]" />
        <div className="absolute left-[42%] top-28 h-16 w-20 -translate-x-1/2 rounded-t-[32px] bg-[#22283a]" />
        <div className="absolute left-[58%] top-28 h-16 w-20 -translate-x-1/2 rounded-t-[32px] bg-[#161b2b]" />
        <div className="absolute bottom-0 h-16 w-full bg-gradient-to-t from-[#071329] to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative flex h-44 items-center justify-center overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle,#ffffff_0,#f4f8ff_55%,#dbe7f7_100%)]" />
      <div className="relative grid h-28 w-28 place-items-center rounded-full border-[10px] border-emerald-200 bg-white text-center text-[10px] font-black uppercase text-emerald-700 shadow-inner">
        Reserve
        <br />
        Bank
        <br />
        of India
      </div>
    </div>
  );
}

function MiniCard({ item }) {
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      className="group flex min-h-40 flex-col justify-between rounded-md bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,.06)] ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,.1)]"
    >
      <div>
        <Icon className={item.color} size={32} strokeWidth={2.1} />
        <h3 className="mt-5 text-base font-bold text-slate-900">{item.title}</h3>
        <p className="mt-2 text-sm text-slate-500">{item.desc}</p>
      </div>
      <ArrowRight className="mt-6 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" size={16} />
    </Link>
  );
}

function DarkPanel({ children, className = "", id }) {
  return (
    <aside id={id} className={`rounded-xl bg-[#061225] p-6 text-white shadow-[0_20px_45px_rgba(15,23,42,.16)] ${className}`}>
      {children}
    </aside>
  );
}

export default function WealthFluentHomepage() {
  const { sipData } = useFinance();
  const [news, setNews] = useState(fallbackNews);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsUpdatedAt, setNewsUpdatedAt] = useState(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState("");
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [question, setQuestion] = useState("");
  const [assistantReply, setAssistantReply] = useState("Hi! I'm FinAI. How can I help you today?");

  const investedValue = useMemo(() => {
    return Number(sipData?.monthlyInvestment || 0) * Number(sipData?.years || 0) * 12 || 7424000;
  }, [sipData]);

  const currentValue = Number(sipData?.futureValue || 9991479);
  const gain = Math.max(currentValue - investedValue, 0);
  const growth = investedValue > 0 ? (gain / investedValue) * 100 : 0;
  const todayChange = Math.max(currentValue * 0.0125, 0);

  const portfolioData = useMemo(() => {
    const start = Math.max(investedValue * 0.58, 1);
    const step = (currentValue - start) / 9;

    return Array.from({ length: 10 }, (_, index) => ({
      value: Math.max(start + step * index + (index % 3) * currentValue * 0.012, 1),
    }));
  }, [currentValue, investedValue]);

  const loadNews = async () => {
    setNewsLoading(true);

    try {
      const items = await fetchFinanceNews();
      if (items.length) setNews(items);
    } catch {
      setNews(fallbackNews);
    } finally {
      setNewsUpdatedAt(new Date());
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadMountedNews = async () => {
      setNewsLoading(true);

      try {
        const items = await fetchFinanceNews();
        if (mounted && items.length) setNews(items);
      } catch {
        if (mounted) setNews(fallbackNews);
      } finally {
        if (mounted) {
          setNewsUpdatedAt(new Date());
          setNewsLoading(false);
        }
      }
    };

    loadMountedNews();
    const interval = window.setInterval(loadMountedNews, 60000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const submitQuiz = () => {
    if (!selectedQuizAnswer) return;
    setQuizSubmitted(true);
  };

  const subscribe = (event) => {
    event.preventDefault();
    if (!email.includes("@")) return;

    const subscribers = JSON.parse(window.localStorage.getItem("finaiSubscribers") || "[]");
    window.localStorage.setItem("finaiSubscribers", JSON.stringify([...new Set([...subscribers, email])]));
    setSubscribed(true);
    setEmail("");
  };

  const askFinAI = (event) => {
    event.preventDefault();
    if (!question.trim()) return;

    setAssistantReply(buildAssistantReply(question));
    setQuestion("");
  };

  const isCorrectAnswer = selectedQuizAnswer === "Exchange Traded Fund";
  const visibleNews = news.slice(0, 6);
  const blogNews = news.slice(0, 3);

  return (
    <div id="top" className="min-h-screen bg-[#f3f7fc] font-sans text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#061225] text-white shadow-sm">
        <div className="mx-auto flex h-[70px] max-w-[1518px] items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-500 shadow-[inset_0_0_0_4px_rgba(255,255,255,.14)]">
              <Bot size={22} />
            </div>
            <div>
              <div className="text-2xl font-black leading-none tracking-tight">FinAI</div>
              <div className="mt-1 text-xs text-slate-300">AI-Powered Financial Intelligence</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-12 text-sm font-medium text-slate-100 md:flex">
            <Link to="/calculators" className="hover:text-blue-300">Calculators</Link>
            <Link to="/tools" className="hover:text-blue-300">Tools</Link>
            <Link to="/quizzes" className="hover:text-blue-300">FinQuiz</Link>
            <Link to="/blogs" className="hover:text-blue-300">Blogs</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/wealth-dashboard" className="hidden rounded-md border border-slate-600 px-7 py-3 text-sm font-semibold text-white transition hover:border-blue-400 sm:block">
              Login
            </Link>
            <Link to="/sip-calculator" className="rounded-md bg-blue-500 px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,.35)] transition hover:bg-blue-600">
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1518px] gap-9 px-6 pb-10 pt-4 lg:grid-cols-[minmax(0,1fr)_486px]">
        <div className="text-center text-sm text-slate-500 lg:col-span-2">
          We help you make smarter financial decisions.
        </div>

        <section className="min-w-0">
          <div className="flex items-center justify-between">
            <SectionLabel icon={Bot}>AI News</SectionLabel>
            <span className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
              {newsLoading ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} className="text-emerald-500" />}
              {newsLoading ? "Loading live news" : "Live finance feed"}
            </span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-5xl font-black leading-[.98] tracking-tight text-slate-950 md:text-6xl">
              AI-Powered
              <br />
              <span className="text-blue-600">Financial News</span>
            </h1>
            <p className="mt-5 text-base text-slate-500">
              Stay ahead with real-time updates, AI summaries, and translations.
            </p>
            <Link
              to="/news"
              className="mt-7 inline-flex rounded-md bg-blue-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_rgba(59,130,246,.28)] hover:bg-blue-600"
            >
              View All News
            </Link>
          </div>

          <div className="mt-7 grid gap-6 md:grid-cols-3">
            {visibleNews.map((card) => {
              return (
                <a
                  key={card.link}
                  href={card.link}
                  target="_blank"
                  rel="noreferrer"
                  className="overflow-hidden rounded-xl bg-[#061225] text-white shadow-[0_18px_35px_rgba(15,23,42,.14)]"
                >
                  <NewsImage type={card.image} />
                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-blue-300">
                      <span>{card.category}</span>
                      <span className="text-slate-400">{card.time}</span>
                    </div>
                    <h2 className="mt-4 min-h-[58px] text-base font-bold leading-snug">{card.title}</h2>
                    <p className="mt-3 min-h-[64px] text-sm leading-relaxed text-slate-400">{card.desc}</p>
                  <div className="mt-5 flex gap-3 text-xs text-slate-400">
                      <span>English</span>
                      <span>हिंदी</span>
                      <span>{card.source}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-7 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="h-2.5 w-7 rounded-full bg-[#0d3675]" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            </div>
            <div className="flex gap-2">
              <button className="grid h-7 w-7 place-items-center rounded-full bg-white text-slate-400 shadow-sm" aria-label="Previous news">
                <ChevronLeft size={16} />
              </button>
              <button className="grid h-7 w-7 place-items-center rounded-full bg-white text-slate-400 shadow-sm" aria-label="Next news">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <section id="calculators" className="mt-16">
            <SectionLabel icon={Calculator}>Calculators</SectionLabel>
            <h2 className="text-4xl font-black tracking-tight">Financial Calculators</h2>
            <p className="mt-3 text-sm text-slate-500">Powerful calculators to help you plan, analyze and grow your wealth.</p>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {calculators.map((item) => (
                <MiniCard key={item.title} item={item} />
              ))}
            </div>
          </section>

          <section className="mt-16">
            <SectionLabel icon={BriefcaseBusiness}>Tools</SectionLabel>
            <h2 className="text-4xl font-black tracking-tight">Financial Tools</h2>
            <p className="mt-3 text-sm text-slate-500">Smart tools and insights to make better financial decisions.</p>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {tools.map((item) => (
                <MiniCard key={item.title} item={item} />
              ))}
            </div>
            <Link
              to="/tools"
              className="mt-8 flex min-h-28 items-center justify-between rounded-md bg-white px-7 shadow-[0_10px_30px_rgba(15,23,42,.06)] ring-1 ring-slate-100"
            >
              <div className="flex items-center gap-5">
                <Grid2X2 className="text-purple-500" size={32} />
                <div>
                  <h3 className="text-base font-bold">All Tools</h3>
                  <p className="mt-2 text-sm text-slate-500">Explore all tools</p>
                </div>
              </div>
              <ArrowRight className="text-slate-500" size={18} />
            </Link>
          </section>

          <section className="mt-9 grid gap-8 lg:grid-cols-[300px_1fr]">
            <div className="rounded-md bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,.06)] ring-1 ring-slate-100">
              <h3 className="mb-6 text-base font-black">Why Choose FinAI?</h3>
              {[
                ["AI-Powered Insights", "Smart analysis for better decisions", Bot],
                ["Real-Time Data", "Live market updates and news", Clock3],
                ["Secure & Private", "Your data stays on your device", ShieldCheck],
                ["Trusted Tools", "Built for everyday investors", Wallet],
              ].map(([title, desc, Icon]) => (
                <div key={title} className="mb-5 flex items-start gap-4 last:mb-0">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-500 text-white">
                    <Icon size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">{title}</div>
                    <div className="mt-1 text-xs text-slate-500">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex min-h-[245px] flex-col items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 p-8 text-center text-white shadow-[0_18px_45px_rgba(37,99,235,.28)]">
              <div className="text-xs font-semibold text-blue-100">Live tools for modern investors</div>
              <h3 className="mt-5 text-5xl font-black leading-tight tracking-tight">
                Build Wealth
                <br />
                With Confidence
              </h3>
              <p className="mt-4 text-sm text-blue-100">Smart calculators, market data, finance news and more</p>
              <div className="mt-7 flex gap-12 text-sm">
                <span><strong className="block text-lg">7+</strong>Tools</span>
                <span><strong className="block text-lg">24/7</strong>Access</span>
                <span><strong className="block text-lg">Free</strong>To Start</span>
              </div>
              <div className="mt-7 flex gap-4">
                <Link to="/sip-calculator" className="rounded-md bg-white px-7 py-3 text-sm font-bold text-blue-600">Get Started</Link>
                <Link to="/tools" className="rounded-md bg-white/10 px-7 py-3 text-sm font-bold text-white ring-1 ring-white/20">Learn More</Link>
              </div>
            </div>
          </section>
        </section>

        <section className="space-y-9">
          <DarkPanel className="min-h-[780px]">
            <div className="text-base font-bold">My Portfolio <span className="text-slate-500">⌾</span></div>
            <div className="mt-5 text-5xl font-black tracking-tight">{formatCurrency(currentValue)}</div>
            <div className="mt-2 text-sm font-semibold text-emerald-400">+{growth.toFixed(2)}% (Projected)</div>
            <div className="mt-20 h-56 min-w-0">
  <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={portfolioData}>
                  <defs>
                    <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.65} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <Area dataKey="value" type="monotone" stroke="#2f7df6" strokeWidth={3} fill="url(#portfolioFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-y-8 text-sm">
              <div className="text-slate-400">Invested Value<br /><strong className="mt-2 block text-lg text-white">{formatCurrency(investedValue)}</strong></div>
              <div className="text-slate-400">Current Value<br /><strong className="mt-2 block text-lg text-white">{formatCurrency(currentValue)}</strong></div>
              <div className="text-slate-400">Total Returns<br /><strong className="mt-2 block text-lg text-emerald-400">+{formatCurrency(gain)} <span className="text-sm">(+{growth.toFixed(2)}%)</span></strong></div>
              <div className="text-slate-400">Today's Change<br /><strong className="mt-2 block text-lg text-emerald-400">+{formatCurrency(todayChange)} <span className="text-sm">(+1.25%)</span></strong></div>
            </div>
            <div className="mt-9 space-y-5 text-sm">
              {[["Equity", "70%", "bg-emerald-400"], ["Debt", "20%", "bg-cyan-400"], ["Cash", "10%", "bg-yellow-400"]].map(([label, value, color]) => (
                <div key={label}>
                  <div className="mb-2 flex justify-between"><span>{label}</span><span>{value}</span></div>
                  <div className="h-1.5 rounded-full bg-slate-700"><div className={`h-full rounded-full ${color}`} style={{ width: value }} /></div>
                </div>
              ))}
            </div>
          </DarkPanel>

          <form onSubmit={askFinAI} className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 p-6 text-white shadow-[0_18px_45px_rgba(37,99,235,.25)]">
            <div className="flex gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-blue-500">
                <Bot size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black">Ask FinAI</h3>
                <p className="text-sm text-blue-100">Your AI Financial Assistant</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-blue-50">{assistantReply}</p>
            <div className="mt-6 flex h-12 items-center rounded-md bg-white/10 pl-5 ring-1 ring-white/10">
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-blue-100"
                placeholder="Type your question..."
              />
              <button type="submit" className="grid h-12 w-12 place-items-center text-sky-300" aria-label="Ask FinAI">
                <Send size={20} />
              </button>
            </div>
          </form>

          <DarkPanel>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-black">Live Content Hub</h3>
                <p className="mt-2 text-xs text-slate-500">
                  {newsUpdatedAt ? `News refreshed ${newsUpdatedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : "Connecting live feeds"}
                </p>
              </div>
              <button onClick={loadNews} className="grid h-9 w-9 place-items-center rounded-md bg-white/5 text-blue-300 ring-1 ring-white/10" aria-label="Refresh live content">
                <RefreshCw className={newsLoading ? "animate-spin" : ""} size={16} />
              </button>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <Link to="/news" className="rounded-md bg-white/5 px-3 py-4 ring-1 ring-white/10">
                <span className="block text-2xl font-black">{news.length}</span>
                <span className="mt-1 block text-xs text-slate-400">News</span>
              </Link>
              <Link to="/quizzes" className="rounded-md bg-white/5 px-3 py-4 ring-1 ring-white/10">
                <span className="block text-2xl font-black">∞</span>
                <span className="mt-1 block text-xs text-slate-400">Quizzes</span>
              </Link>
              <Link to="/blogs" className="rounded-md bg-white/5 px-3 py-4 ring-1 ring-white/10">
                <span className="block text-2xl font-black">Live</span>
                <span className="mt-1 block text-xs text-slate-400">Blogs</span>
              </Link>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-md bg-white/5 px-4 py-3">
                <span>News provider</span>
                <span className="font-bold text-blue-300">NewsData + RSS backup</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-white/5 px-4 py-3">
                <span>Quiz source</span>
                <span className="font-bold text-blue-300">Live article API</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-white/5 px-4 py-3">
                <span>Refresh cycle</span>
                <span className="font-bold text-blue-300">Every 60 sec</span>
              </div>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-slate-500">
              Market index numbers were removed from this panel to avoid showing estimated or fallback prices as financial data.
            </p>
          </DarkPanel>

          <DarkPanel id="finquiz">
            <h3 className="text-lg font-black">FinQuiz of the Day</h3>
            <p className="mt-6 font-semibold text-blue-100">What is the full form of ETF?</p>
            <div className="mt-6 space-y-5 text-sm text-slate-300">
              {quizAnswers.map((answer, index) => (
                <label key={answer} className="flex cursor-pointer items-center gap-4">
                  <input
                    type="radio"
                    name="finquiz"
                    value={answer}
                    checked={selectedQuizAnswer === answer}
                    onChange={(event) => {
                      setSelectedQuizAnswer(event.target.value);
                      setQuizSubmitted(false);
                    }}
                    className="sr-only"
                  />
                  <span className={`h-5 w-5 rounded-full border ${selectedQuizAnswer === answer ? "border-blue-400 bg-blue-500" : "border-slate-600"}`} />
                  {String.fromCharCode(65 + index)}. {answer}
                </label>
              ))}
            </div>
            {quizSubmitted && (
              <p className={`mt-5 text-sm font-semibold ${isCorrectAnswer ? "text-emerald-400" : "text-red-300"}`}>
                {isCorrectAnswer ? "Correct. ETF means Exchange Traded Fund." : "Not quite. The correct answer is Exchange Traded Fund."}
              </p>
            )}
            <div className="mt-7 flex items-center justify-between">
              <button onClick={submitQuiz} className="rounded-md bg-blue-500 px-6 py-3 text-sm font-bold">Submit Answer</button>
              <Link to="/quizzes" className="flex items-center gap-2 text-sm text-blue-300">View All Quizzes <ArrowRight size={14} /></Link>
            </div>
          </DarkPanel>

          <DarkPanel>
            <h3 className="text-lg font-black">Popular Blogs</h3>
            <div className="mt-6 space-y-5">
              {blogNews.map((item, index) => {
                return (
                  <a
                    key={item.link}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4"
                  >
                    <div className={`h-16 w-16 rounded-md ${index === 1 ? "bg-orange-200" : "bg-emerald-100"}`}>
                      <div className="h-full w-full rounded-md bg-[linear-gradient(135deg,rgba(6,18,37,.05),rgba(6,18,37,.3))]" />
                    </div>
                    <div>
                      <h4 className="font-bold leading-snug">{item.title}</h4>
                      <p className="mt-2 text-xs text-slate-400">{item.time}</p>
                    </div>
                  </a>
                );
              })}
            </div>
            <Link to="/blogs" className="mt-7 flex items-center justify-end gap-2 text-sm text-blue-300">View All Blogs <ArrowRight size={14} /></Link>
          </DarkPanel>
        </section>
      </main>

      <footer className="bg-[#061225] px-6 py-8 text-white">
        <div className="mx-auto grid max-w-[1518px] gap-8 md:grid-cols-[280px_1fr_1fr_300px]">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-500"><Bot size={21} /></div>
              <div>
                <div className="text-2xl font-black leading-none">FinAI</div>
                <div className="mt-1 text-xs text-slate-400">AI-Powered Financial Intelligence</div>
              </div>
            </Link>
            <p className="mt-8 text-sm">© 2026 FinAI.</p>
            <p className="mt-3 text-sm">All rights reserved.</p>
            <div className="mt-7 flex gap-4">
              <MessageCircle className="text-slate-200" size={22} />
              <Globe2 className="text-slate-200" size={22} />
              <Users className="text-slate-200" size={22} />
              <Share2 className="text-slate-200" size={22} />
            </div>
          </div>

          <div>
            <h4 className="font-bold">Trending Topics</h4>
            <Link to="/news" className="mt-3 block text-sm text-slate-300">Live Finance News</Link>
            <Link to="/blogs" className="mt-3 block text-sm text-slate-300">Investing Blogs</Link>
            <Link to="/quizzes" className="mt-3 block text-sm text-slate-300">FinQuiz</Link>
            <Link to="/portfolio-tracker" className="mt-3 block text-sm text-slate-300">Portfolio Tracker</Link>
            <Link to="/fire-calculator" className="mt-3 block text-sm text-slate-300">FIRE Planning</Link>
          </div>

          <div>
            <h4 className="font-bold">About Us</h4>
            {[
              ["Data Disclaimer", "/disclaimer"],
              ["Help", "/contact"],
              ["Feedback", "/contact"],
              ["Sitemap", "/"],
              ["What's New", "/news"],
              ["About Our Ads", "/privacy-policy"],
              ["Terms and Privacy Policy", "/privacy-policy"],
              ["Privacy Dashboard", "/privacy-policy"],
              ["Contact Us", "/contact"],
            ].map(([label, to]) => (
              <Link key={label} to={to} className="mt-3 block text-sm text-slate-300">{label}</Link>
            ))}
          </div>

          <div>
            <form onSubmit={subscribe} className="rounded-md bg-white/5 p-5 ring-1 ring-white/10">
              <h4 className="font-bold">Subscribe to Newsletter</h4>
              <p className="mt-2 text-sm text-slate-300">
                {subscribed ? "You're subscribed. We'll keep you posted." : "Get the latest financial news and insights in your inbox."}
              </p>
              <label className="mt-5 flex h-12 items-center rounded-md bg-white/5 px-4 text-sm text-slate-400 ring-1 ring-white/10">
                <Mail size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="ml-3 h-full min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-slate-400"
                  placeholder="Enter your email"
                />
              </label>
              <button type="submit" className="mt-4 w-full rounded-md bg-blue-500 py-3 text-sm font-bold">Subscribe</button>
            </form>
            <Link to="/privacy-policy" className="mt-5 block w-full rounded-md border border-white/20 py-3 text-center text-sm font-semibold text-slate-200">
              Privacy Dashboard
            </Link>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-28 right-8 hidden w-52 rounded-md bg-white p-4 text-xs text-slate-700 shadow-[0_15px_35px_rgba(15,23,42,.18)] ring-1 ring-slate-200 md:block">
        <div className="flex items-center justify-between font-bold text-slate-900">
          FinAI Assistant
          <span className="text-slate-400">×</span>
        </div>
        <p className="mt-3">{assistantReply}</p>
      </div>
      <a href="#top" className="fixed bottom-8 right-10 grid h-16 w-16 place-items-center rounded-full bg-blue-500 text-white shadow-[0_12px_30px_rgba(37,99,235,.45)]" aria-label="Back to top">
        <Bot size={30} />
      </a>
    </div>
  );
}
