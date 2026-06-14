import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";

const NEWSDATA_API_KEY =
  import.meta.env.VITE_NEWSDATA_API_KEY || "pub_3798230f728e4a6090ad3c705557970b";

const categories = ["business", "technology", "top"];

function newsUrl({ category = "business", query = "", page = "" }) {
  const params = new URLSearchParams({
    apikey: NEWSDATA_API_KEY,
    language: "en",
    country: "in,us",
    category,
  });

  if (query.trim()) params.set("q", query.trim());
  if (page) params.set("page", page);

  return `https://newsdata.io/api/1/news?${params.toString()}`;
}

function fallbackArticles(query = "finance") {
  return [
    {
      id: "fallback-finance",
      title: "Open Live Finance News",
      description: "The API is temporarily unavailable. Open a live finance news search for current headlines.",
      link: `https://news.google.com/search?q=${encodeURIComponent(query || "finance market")}&hl=en-IN&gl=IN&ceid=IN%3Aen`,
      source: "Google News",
      publishedAt: new Date().toISOString(),
    },
  ];
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

function normalizeArticle(article, index) {
  return {
    id: article.article_id || article.link || `${article.title}-${index}`,
    title: article.title || "Untitled finance update",
    description: article.description || article.content || "Open the full story for details.",
    link: article.link,
    source: article.source_name || "NewsData",
    publishedAt: article.pubDate || new Date().toISOString(),
    image: article.image_url,
  };
}

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("business");
  const [query, setQuery] = useState("finance OR stock market OR economy");
  const [pageToken, setPageToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const hasMore = Boolean(pageToken);

  const visibleArticles = useMemo(() => {
    const seen = new Set();
    return articles.filter((article) => {
      if (!article.link || seen.has(article.link)) return false;
      seen.add(article.link);
      return true;
    });
  }, [articles]);

  const loadArticles = async ({ reset = false } = {}) => {
    if (reset) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch(newsUrl({ category, query, page: reset ? "" : pageToken }));
      if (!response.ok) throw new Error("News API request failed");

      const data = await response.json();
      const nextArticles = (data.results || []).filter((item) => item.title && item.link).map(normalizeArticle);

      setArticles((current) => (reset ? nextArticles : [...current, ...nextArticles]));
      setPageToken(data.nextPage || "");
      setLastUpdated(new Date());
      setError("");
    } catch {
      setArticles((current) => (current.length ? current : fallbackArticles(query)));
      setPageToken("");
      setLastUpdated(new Date());
      setError("Live API unavailable. Showing safe live-search fallback.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadArticles({ reset: true });
  }, [category]);

  useEffect(() => {
    const interval = window.setInterval(() => loadArticles({ reset: true }), 60000);
    return () => window.clearInterval(interval);
  }, [category, query]);

  const searchNews = (event) => {
    event.preventDefault();
    loadArticles({ reset: true });
  };

  return (
    <main className="min-h-screen bg-[#f3f7fc] text-slate-950">
      <header className="bg-[#061225] px-6 py-5 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-sm font-semibold text-blue-200">
            <ArrowLeft size={18} />
            Back Home
          </Link>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            {refreshing ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 className="text-emerald-400" size={16} />}
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : "Connecting live feed"}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
              <Bot size={14} />
              Live News
            </div>
            <h1 className="mt-5 text-5xl font-black tracking-tight">View All News</h1>
            <p className="mt-3 max-w-2xl text-slate-500">
              Fresh finance, market, economy, and business stories from live news APIs. The page refreshes every minute.
            </p>
          </div>

          <form onSubmit={searchNews} className="flex min-w-0 max-w-xl flex-1 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-200">
            <div className="grid w-12 place-items-center text-slate-400">
              <Search size={18} />
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 px-2 py-4 text-sm outline-none"
              placeholder="Search finance news..."
            />
            <button className="bg-blue-500 px-6 text-sm font-bold text-white">Search</button>
          </form>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-md px-5 py-2 text-sm font-bold capitalize ${category === item ? "bg-blue-500 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}
            >
              {item}
            </button>
          ))}
          <button
            onClick={() => loadArticles({ reset: true })}
            className="ml-auto inline-flex items-center gap-2 rounded-md bg-[#061225] px-5 py-2 text-sm font-bold text-white"
          >
            <RefreshCw className={refreshing ? "animate-spin" : ""} size={16} />
            Refresh
          </button>
        </div>

        {error && <p className="mt-5 rounded-md bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">{error}</p>}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleArticles.map((article) => (
            <a
              key={article.id}
              href={article.link}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-xl bg-white shadow-[0_14px_35px_rgba(15,23,42,.08)] ring-1 ring-slate-100 transition hover:-translate-y-1"
            >
              <div className="relative h-48 bg-[#061225]">
                {article.image ? (
                  <img src={article.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#2563eb,transparent_35%),linear-gradient(135deg,#061225,#0f2d55)] text-2xl font-black text-white">
                    FinAI News
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>{article.source}</span>
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <Clock3 size={13} />
                    {timeAgo(article.publishedAt)}
                  </span>
                </div>
                <h2 className="mt-4 line-clamp-3 text-xl font-black leading-tight">{article.title}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-500">{article.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                  Read full story
                  <ArrowUpRight size={16} />
                </span>
              </div>
            </a>
          ))}
        </div>

        {loading && <p className="mt-8 text-center text-sm font-semibold text-slate-500">Loading live stories...</p>}

        {hasMore && (
          <div className="mt-10 text-center">
            <button onClick={() => loadArticles()} className="rounded-md bg-blue-500 px-8 py-3 text-sm font-bold text-white">
              Load More News
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
