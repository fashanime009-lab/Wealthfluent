import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { fetchNews, NEWS_REFRESH_INTERVAL } from "../services/newsService";

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Calculator,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Goal,
  Grid2X2,
  LineChart,
  Loader2,
  Mail,
  Menu,
  Newspaper,
  PieChart,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  X,
  XCircle,
} from "lucide-react";



const NEWSLETTER_ENDPOINT = import.meta.env.VITE_NEWSLETTER_ENDPOINT || "";
const SITE_URL =
  import.meta.env.VITE_SITE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "https://finaiw.com");

const calculators = [
  {
    title: "Net Worth Calculator",
    desc: "See what you own, what you owe, and where you stand.",
    icon: Wallet,
    color: "text-cyan-500",
    to: "/calculators?category=wealth",
  },
  {
    title: "Goal Planning",
    desc: "Work backwards from the life goal you care about.",
    icon: Target,
    color: "text-blue-500",
    to: "/calculators?category=goal",
  },
  {
    title: "Investment Calculators",
    desc: "Estimate how regular investing may grow over time.",
    icon: PieChart,
    color: "text-orange-500",
    to: "/calculators?category=investment",
  },
  {
    title: "Loan Calculators",
    desc: "Understand loans, deposits and returns.",
    icon: CircleDollarSign,
    color: "text-fuchsia-500",
    to: "/calculators?category=loan",
  },
  {
    title: "Retirement Planning",
    desc: "Build a practical retirement target and monthly plan.",
    icon: Goal,
    color: "text-rose-500",
    to: "/calculators?category=retirement",
  },
  {
    title: "All Calculators",
    desc: "Browse every calculator available on FINAIW.",
    icon: Grid2X2,
    color: "text-indigo-500",
    to: "/calculators",
  },
];

const tools = [
  {
    title: "Market Research",
    desc: "Research companies, sectors, and financial markets.",
    icon: TrendingUp,
    color: "text-emerald-500",
  },
  {
    title: "Stock Analysis",
    desc: "Analyze businesses using key financial metrics.",
    icon: BarChart3,
    color: "text-blue-500",
  },
  {
    title: "Portfolio Management",
    desc: "Track and organize your investment portfolio.",
    icon: BriefcaseBusiness,
    color: "text-orange-500",
  },
  {
    title: "Financial Toolkit",
    desc: "Explore upcoming FINAIW financial planning tools.",
    icon: Grid2X2,
    color: "text-violet-500",
  },
];



function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Latest";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function buildLiveQuiz(articles) {
  const usableArticles = articles.filter((article) => article.title && article.source);
  const article = usableArticles[0];
  if (!article) return null;

  const otherSources = Array.from(
    new Set(usableArticles.slice(1).map((item) => item.source).filter((source) => source !== article.source)),
  ).slice(0, 3);

  if (otherSources.length < 3) return null;

  return {
    question: `Which publisher reported “${article.title}”?`,
    answer: article.source,
    options: [article.source, ...otherSources].sort(() => Math.random() - 0.5),
    articleLink: article.link,
  };
}

function BrandMark({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`${compact ? "h-9 w-9" : "h-11 w-11"} grid place-items-center border border-blue-400/40 bg-blue-500/10 text-blue-400`}>
        <LineChart size={compact ? 20 : 24} strokeWidth={2.4} />
      </div>
      <div>
        <div className={`${compact ? "text-xl" : "text-2xl"} font-black leading-none text-white`}>
          FIN<span className="text-blue-400">AIW</span>
        </div>
        <div className="mt-1 text-[9px] font-semibold uppercase text-slate-400">
          Financial intelligence for real life
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <Icon size={24} strokeWidth={2.2} />
          <h2 className="text-2xl font-black text-slate-950">{title}</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

function NewsFallbackImage({ source }) {
  return (
    <div className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,#0b1b31,#163c71)] p-3 text-center text-xs font-black text-blue-100">
      {source || "FINAIW"}
    </div>
  );
}

function LiveNewsRow({ article }) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noreferrer"
      className="group grid grid-cols-[92px_minmax(0,1fr)] gap-4 border-b border-slate-200 py-4 first:pt-0 sm:grid-cols-[110px_minmax(0,1fr)_110px]"
    >
      <div className="h-[78px] overflow-hidden rounded-md bg-slate-200 sm:h-[84px]">
        {article.image ? (
          <img
            src={article.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        <div className={article.image ? "hidden h-full" : "h-full"}>
          <NewsFallbackImage source={article.source} />
        </div>
      </div>
      <div className="min-w-0 py-1">
        <h3 className="line-clamp-2 text-sm font-black leading-snug text-slate-900 transition group-hover:text-blue-600 sm:text-base">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500 sm:text-sm">{article.description}</p>
        <span className="mt-2 inline-block text-[11px] font-semibold text-blue-600 sm:hidden">{article.source}</span>
      </div>
      <div className="hidden items-center justify-end text-right sm:flex">
        <div>
          <div className="text-xs font-semibold text-slate-500">{formatDate(article.publishedAt)}</div>
          <div className="mt-2 text-[11px] text-blue-600">{article.source}</div>
        </div>
      </div>
    </a>
  );
}

function FeatureCard({ item, comingSoon = false }) {
  const Icon = item.icon;

  const Card = comingSoon ? "div" : Link;

return (
  <Card
    {...(!comingSoon ? { to: item.to } : {})}
    className="group flex min-h-[150px] flex-col justify-between rounded-md bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,.05)] ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,23,42,.1)]"
  >
      <div>
        <div className="grid h-9 w-9 place-items-center rounded-md bg-slate-50">
          <Icon className={item.color} size={21} />
        </div>
        <h3 className="mt-4 text-sm font-black text-slate-900">{item.title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">{item.desc}</p>
      </div>
      {comingSoon ? (
  <span className="text-xs font-bold text-slate-400">
    Coming Soon
  </span>
) : (
  <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition">
    Open →
  </span>
)}
    </Card>
  );
}

function DarkPanel({ children, className = "" }) {
  return (
    <aside className={`rounded-xl bg-[#061427] p-6 text-white shadow-[0_18px_42px_rgba(15,23,42,.12)] ${className}`}>
      {children}
    </aside>
  );
}

export default function WealthFluentHomepage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsError, setNewsError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState({ type: "", message: "" });
  const newsRequestRef = useRef(null);

  const loadNews = useCallback(async ({ force = false } = {}) => {
    if (newsRequestRef.current) return newsRequestRef.current;

    setLoading(true);

    const request = fetchNews({ category: "business", limit: 18, force })
      .then(({ articles: liveArticles, fetchedAt }) => {
        
        setArticles(liveArticles.slice(0, 18));
        setLastUpdated(new Date(fetchedAt));
        setNewsError("");
      })
      .catch((error) => {
        setArticles([]);
        setNewsError(error.message || "Live stories are unavailable right now. Please try again in a moment.");
      })
      .finally(() => {
        setLoading(false);
        newsRequestRef.current = null;
      });

    newsRequestRef.current = request;
    return request;
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(loadNews, 0);
    const interval = window.setInterval(() => loadNews({ force: true }), NEWS_REFRESH_INTERVAL);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [loadNews]);

  const quiz = useMemo(() => buildLiveQuiz(articles), [articles]);
  const newsRows = articles.slice(0, 8);
  const popularStories = articles.slice(0, 3);
  const isCorrect = quiz && selectedAnswer === quiz.answer;

  const submitQuiz = () => {
    if (!selectedAnswer) return;
    setQuizSubmitted(true);
  };

  const submitNewsletter = async (event) => {
    event.preventDefault();
    setNewsletterStatus({ type: "", message: "" });

    if (!email.trim() || !email.includes("@")) {
      setNewsletterStatus({ type: "error", message: "Enter a valid email address." });
      return;
    }

    if (!NEWSLETTER_ENDPOINT) {
      setNewsletterStatus({
        type: "error",
        message: "Newsletter signup is not connected yet. Add VITE_NEWSLETTER_ENDPOINT before launch.",
      });
      return;
    }

    try {
      const response = await fetch(NEWSLETTER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "FINAIW homepage" }),
      });

      if (!response.ok) throw new Error("Newsletter request failed");
      setNewsletterStatus({ type: "success", message: "You are on the list. Welcome to FINAIW." });
      setEmail("");
    } catch {
      setNewsletterStatus({ type: "error", message: "Signup failed. Please try again shortly." });
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "FINAIW",
        url: SITE_URL,
        description: "Practical financial news, calculators, quizzes, and planning tools.",
      },
      {
        "@type": "WebSite",
        name: "FINAIW",
        url: SITE_URL,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/news?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <div id="top" className="min-h-screen bg-[#f4f7fb] font-sans text-slate-950">
      <Helmet>
        <title>FINAIW | Financial News, Calculators and Practical Money Tools</title>
        <meta
          name="description"
          content="FINAIW brings together live financial news, useful calculators, finance quizzes, and practical tools for everyday money decisions."
        />
        <meta name="keywords" content="financial news, SIP calculator, retirement calculator, personal finance, investing, FINAIW" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE_URL}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="FINAIW | Financial intelligence for real life" />
        <meta
          property="og:description"
          content="Live finance stories, practical calculators, fresh quizzes, and useful planning tools."
        />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:site_name" content="FINAIW" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      

      <div className="border-b border-slate-200 bg-white/50 px-5 py-5 text-center text-sm text-slate-500">
        Trusted finance calculators, investment tools, live market news, and practical insights for smarter financial decisions.
      </div>

      <main className="mx-auto grid max-w-[1440px] gap-10 px-5 py-8 lg:grid-cols-[minmax(0,1.8fr)_430px] lg:px-8">
        <div className="min-w-0">
          <section aria-labelledby="news-heading">
            <SectionHeading
              icon={Newspaper}
              title="Financial News"
              description="Fresh finance, economy, investing, and business stories from live publishers."
              action={
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadNews({ force: true })}
                    className="grid h-10 w-10 place-items-center rounded-md border border-slate-300 bg-white text-slate-600 transition hover:border-blue-400 hover:text-blue-600"
                    aria-label="Refresh live news"
                  >
                    <RefreshCw className={loading ? "animate-spin" : ""} size={17} />
                  </button>
                  <Link
                    to="/news"
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-400 bg-white px-5 text-sm font-bold text-slate-800 transition hover:border-blue-500 hover:text-blue-600"
                  >
                    All News
                    <ArrowRight size={15} />
                  </Link>
                </div>
              }
            />

            <div className="mt-7">
              {loading && !articles.length && (
                <div className="flex min-h-64 items-center justify-center gap-3 text-sm font-semibold text-slate-500">
                  <Loader2 className="animate-spin" size={19} />
                  Loading live financial stories...
                </div>
              )}

              {newsError && !articles.length && (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-6 text-center">
                  <XCircle className="mx-auto text-amber-600" size={26} />
                  <p className="mt-3 text-sm font-semibold text-amber-800">{newsError}</p>
                  <button onClick={() => loadNews({ force: true })} className="mt-4 rounded-md bg-[#061427] px-5 py-2 text-sm font-bold text-white">
                    Try Again
                  </button>
                </div>
              )}

              {newsRows.map((article) => (
                <LiveNewsRow key={article.id} article={article} />
              ))}
            </div>

            {lastUpdated && (
              <p className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                <Clock3 size={13} />
                Live feed refreshed at {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </section>

          <section className="mt-12" aria-labelledby="calculators-heading">
            <SectionHeading
              icon={Calculator}
              title="Investment Calculators"
              description="Free finance calculators for investing, budgeting, retirement planning, loans, taxes, and wealth management."
            />
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {calculators.map((item) => (
                <FeatureCard key={item.title} item={item} />
              ))}
            </div>
          </section>

          <section className="mt-10" aria-labelledby="tools-heading">
            <SectionHeading
              icon={BriefcaseBusiness}
              title="Money Tools"
              description="Practical ways to research, organise, and review your financial plan."
            />
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {tools.map((item) => (
  <FeatureCard
    key={item.title}
    item={item}
    comingSoon={true}
  />
))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <DarkPanel>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black">Popular Stories</h2>
              <BookOpen className="text-blue-300" size={19} />
            </div>
            <div className="mt-6 space-y-5">
              {popularStories.length ? (
                popularStories.map((article, index) => (
                  <a
                    key={article.id}
                    href={article.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4"
                  >
                    <div
                      className={`grid h-14 w-14 shrink-0 place-items-center rounded-md ${
                        index === 0 ? "bg-sky-100 text-sky-600" : index === 1 ? "bg-orange-100 text-orange-600" : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      <Newspaper size={21} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-sm font-bold leading-snug transition group-hover:text-blue-300">{article.title}</h3>
                      <p className="mt-1 text-xs text-slate-400">{article.source}</p>
                    </div>
                  </a>
                ))
              ) : (
                <p className="text-sm text-slate-400">Popular stories will appear when the live feed connects.</p>
              )}
            </div>
            <Link to="/blogs" className="mt-7 flex items-center justify-end gap-2 text-sm font-bold text-blue-300">
              View All Blogs
              <ArrowRight size={15} />
            </Link>
          </DarkPanel>

          <DarkPanel>
            <div className="flex items-center gap-2">
              <Sparkles className="text-blue-300" size={19} />
              <h2 className="text-lg font-black">FinQuiz of the Day</h2>
            </div>

            {quiz ? (
              <>
                <p className="mt-6 text-sm font-bold leading-relaxed text-slate-100">{quiz.question}</p>
                <div className="mt-5 space-y-3">
                  {quiz.options.map((option, index) => {
                    const chosen = selectedAnswer === option;
                    const correct = quizSubmitted && option === quiz.answer;
                    const wrong = quizSubmitted && chosen && option !== quiz.answer;

                    return (
                      <label key={option} className="flex cursor-pointer items-start gap-3 text-sm text-slate-300">
                        <input
                          type="radio"
                          name="homepage-quiz"
                          value={option}
                          checked={chosen}
                          onChange={(event) => {
                            setSelectedAnswer(event.target.value);
                            setQuizSubmitted(false);
                          }}
                          className="sr-only"
                        />
                        <span
                          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                            correct
                              ? "border-emerald-400 bg-emerald-400"
                              : wrong
                                ? "border-red-400 bg-red-400"
                                : chosen
                                  ? "border-blue-400 bg-blue-500"
                                  : "border-slate-600"
                          }`}
                        >
                          {(correct || chosen) && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </span>
                        <span>{String.fromCharCode(65 + index)}. {option}</span>
                      </label>
                    );
                  })}
                </div>
                {quizSubmitted && (
                  <p className={`mt-4 flex items-center gap-2 text-sm font-semibold ${isCorrect ? "text-emerald-400" : "text-red-300"}`}>
                    {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    {isCorrect ? "Correct." : `The answer is ${quiz.answer}.`}
                  </p>
                )}
                <div className="mt-6 flex items-center justify-between gap-4">
                  <button
                    onClick={submitQuiz}
                    disabled={!selectedAnswer}
                    className="rounded-md bg-blue-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-700"
                  >
                    Submit Answer
                  </button>
                  <Link to="/quizzes" className="flex items-center gap-2 text-sm font-bold text-blue-300">
                    View All Quizzes
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </>
            ) : (
              <div className="mt-6 rounded-md bg-white/5 p-4 text-sm text-slate-400">
                The live quiz will appear after enough publishers are available in the news feed.
              </div>
            )}
          </DarkPanel>

          <div className="rounded-xl bg-[linear-gradient(145deg,#1387ff,#3238dd)] p-8 text-center text-white shadow-[0_18px_45px_rgba(37,99,235,.24)]">
            <p className="text-xs font-semibold text-blue-100">Useful tools for real decisions</p>
            <h2 className="mt-5 text-4xl font-black leading-tight">
              Build Wealth
              <br />
              With Confidence
            </h2>
            <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-blue-100">
              Plan a goal, test the numbers, and keep your financial life organised.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-3 text-sm">
              <span><strong className="block text-xl">7+</strong><small className="text-blue-100">Tools</small></span>
              <span><strong className="block text-xl">24/7</strong><small className="text-blue-100">Access</small></span>
              <span><strong className="block text-xl">Free</strong><small className="text-blue-100">To Start</small></span>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <Link to="/calculators" className="rounded-md bg-white px-5 py-3 text-sm font-bold text-blue-600">
                Get Started
              </Link>
              <Link to="/tools" className="rounded-md bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/20">
                Learn More
              </Link>
            </div>
          </div>

          <DarkPanel>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-black">Live Content Hub</h2>
                <p className="mt-2 text-xs text-slate-500">
                  {lastUpdated
                    ? `Updated ${lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
                    : "Waiting for the live feed"}
                </p>
              </div>
              <RefreshCw className={loading ? "animate-spin text-blue-300" : "text-blue-300"} size={18} />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <Link to="/news" className="rounded-md bg-white/5 px-3 py-4 ring-1 ring-white/10">
                <strong className="block text-2xl">{articles.length || "—"}</strong>
                <span className="mt-1 block text-xs text-slate-400">Stories</span>
              </Link>
              <Link to="/quizzes" className="rounded-md bg-white/5 px-3 py-4 ring-1 ring-white/10">
                <strong className="block text-2xl">∞</strong>
                <span className="mt-1 block text-xs text-slate-400">Quizzes</span>
              </Link>
              <Link to="/blogs" className="rounded-md bg-white/5 px-3 py-4 ring-1 ring-white/10">
                <strong className="block text-xl">Live</strong>
                <span className="mt-1 block text-xs text-slate-400">Blogs</span>
              </Link>
            </div>

            <div className="mt-5 space-y-3 text-xs">
              <div className="flex justify-between rounded-md bg-white/5 px-4 py-3">
                <span className="text-slate-400">News</span>
                <span className="font-bold text-slate-200">Publisher feeds</span>
              </div>
              <div className="flex justify-between rounded-md bg-white/5 px-4 py-3">
                <span className="text-slate-400">Quiz</span>
                <span className="font-bold text-slate-200">Generated from live stories</span>
              </div>
              <div className="flex justify-between rounded-md bg-white/5 px-4 py-3">
                <span className="text-slate-400">Refresh</span>
                <span className="font-bold text-slate-200">Every 60 seconds</span>
              </div>
            </div>
          </DarkPanel>
        </div>
      </main>

      
    </div>
    
  );
}
