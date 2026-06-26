import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Bot,
  Clock3,
  RefreshCw,
  Search,
} from "lucide-react";
import { DEFAULT_NEWS_QUERY, fetchNews, NEWS_REFRESH_INTERVAL } from "../services/newsService";

const categories = ["business", "technology", "top"];

function timeAgo(date) {
  const publishedAt = new Date(date).getTime();
  if (!publishedAt) return "Live";
  const minutes = Math.max(1, Math.floor((Date.now() - publishedAt) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("business");
  const [query, setQuery] = useState(DEFAULT_NEWS_QUERY);
  const [pageToken, setPageToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const activeRequestRef = useRef("");
  const loadArticlesRef = useRef(null);
  const requestIdRef = useRef(0);

  const hasMore = Boolean(pageToken);

  const visibleArticles = useMemo(() => {
    const seen = new Set();
    return articles.filter((article) => {
      if (!article.link || seen.has(article.link)) return false;
      seen.add(article.link);
      return true;
    });
  }, [articles]);

  const loadArticles = useCallback(async ({ reset = false, force = false } = {}) => {
    const nextPage = reset ? "" : pageToken;
    const requestKey = JSON.stringify({ category, query, page: nextPage });

    if (activeRequestRef.current === requestKey) return;

    activeRequestRef.current = requestKey;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    if (reset) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await fetchNews({ category, query, page: nextPage, limit: 20, force });
      if (requestId !== requestIdRef.current) return;

      setArticles((current) => (reset ? data.articles : [...current, ...data.articles]));
      setPageToken(data.nextPage);
      setError("");
    } catch (newsError) {
      if (requestId !== requestIdRef.current) return;
      setPageToken("");
      setError(newsError.message || "Live news is unavailable right now. Please try again shortly.");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
      activeRequestRef.current = "";
    }
  }, [category, pageToken, query]);

  useEffect(() => {
    loadArticlesRef.current = loadArticles;
  }, [loadArticles]);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => loadArticlesRef.current?.({ reset: true }), 0);
    return () => window.clearTimeout(initialLoad);
  }, [category]);

  useEffect(() => {
    const interval = window.setInterval(() => loadArticlesRef.current?.({ reset: true, force: true }), NEWS_REFRESH_INTERVAL);
    return () => window.clearInterval(interval);
  }, [category, query]);

  const searchNews = (event) => {
    event.preventDefault();
    loadArticles({ reset: true, force: true });
  };

  return (
    <main className="min-h-screen bg-[#f3f7fc] text-slate-950">
     

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
                  <img
                    src={article.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      event.currentTarget.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <div className={article.image ? "hidden flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#2563eb,transparent_35%),linear-gradient(135deg,#061225,#0f2d55)] text-2xl font-black text-white" : "flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#2563eb,transparent_35%),linear-gradient(135deg,#061225,#0f2d55)] text-2xl font-black text-white"}>
                  FinAI News
                </div>
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
