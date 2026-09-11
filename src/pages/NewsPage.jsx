import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Bot,
  Clock3,
  RefreshCw,
  Search,
} from "lucide-react";
import { DEFAULT_NEWS_QUERY, fetchNews, NEWS_REFRESH_INTERVAL } from "../services/newsService";
import AdSlot from "../components/ads/AdSlot";
import Seo from "../components/seo/Seo";
import { breadcrumbSchema } from "../components/seo/schema";

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

  const hasMore = articles.length >= 20;

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
     const data = await fetchNews({
    type: "news",
    category,
    query,
    page: nextPage,
    limit: reset ? 20 : articles.length + 20,
    force,
});
      if (requestId !== requestIdRef.current) return;

      setArticles((current) => (reset ? data.articles : [...current, ...data.articles]));
      setPageToken(data.nextPage || "load-more");
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
    <main className="min-h-screen bg-[#fbfdfc]">
      <Seo
        title="News — Live Finance & Market Headlines"
        description="Fresh finance, market, economy, and business stories from live news APIs — refreshed every minute."
        path="/news"
        keywords="finance news, stock market news, business news, economy news"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "News", path: "/news" },
        ])}
      />
      <section className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[12px] font-black text-emerald-800 ring-1 ring-emerald-100">
              <Bot size={13} /> Live News
            </span>
            <h1 className="mt-5 text-[38px] font-black leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-[48px]">
              View all news
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] font-medium leading-7 text-slate-500">
              Fresh finance, market, economy, and business stories from live news APIs — refreshed
              every minute.
            </p>
          </div>

          <form
            onSubmit={searchNews}
            className="flex min-w-0 max-w-xl flex-1 items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm focus-within:border-emerald-300"
          >
            <div className="grid w-12 flex-shrink-0 place-items-center text-slate-400">
              <Search size={18} />
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 py-3.5 pr-2 text-[13.5px] font-medium outline-none"
              placeholder="Search finance news..."
            />
            <button className="flex-shrink-0 bg-emerald-800 px-6 py-3.5 text-[13px] font-black text-white transition hover:bg-emerald-900">
              Search
            </button>
          </form>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-100/70 p-2 ring-1 ring-slate-200/70">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-xl px-4 py-2.5 text-[13px] font-black capitalize transition ${
                  category === item
                    ? "bg-white text-emerald-800 shadow-[0_6px_16px_rgba(15,23,42,.08)] ring-1 ring-slate-200/70"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            onClick={() => loadArticles({ reset: true })}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-[13px] font-black text-white transition hover:bg-slate-800"
          >
            <RefreshCw className={refreshing ? "animate-spin" : ""} size={15} />
            Refresh
          </button>
        </div>

        {error && (
          <p className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-[13.5px] font-semibold text-amber-700 ring-1 ring-amber-100">
            {error}
          </p>
        )}

        <div className="mt-8">
          <AdSlot slotId="insights_top" />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleArticles.map((article, index) => (
            <>
              {index === 6 && (
                <div key="insights-mid-ad" className="md:col-span-2 xl:col-span-3">
                  <AdSlot slotId="insights_mid" />
                </div>
              )}
              <a
                key={article.id}
                href={article.link}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_24px_60px_rgba(15,23,42,.08)]"
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
                  <div className={article.image ? "hidden flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#047857,transparent_35%),linear-gradient(135deg,#061225,#0f2d55)] text-2xl font-black text-white" : "flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#047857,transparent_35%),linear-gradient(135deg,#061225,#0f2d55)] text-2xl font-black text-white"}>
                    FinAI News
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-[11.5px] font-black text-emerald-700">
                    <span>{article.source}</span>
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Clock3 size={13} />
                      {timeAgo(article.publishedAt)}
                    </span>
                  </div>
                  <h2 className="mt-4 line-clamp-3 text-[18px] font-black leading-tight text-slate-950">{article.title}</h2>
                  <p className="mt-3 line-clamp-3 text-[13.5px] leading-6 text-slate-500">{article.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-black text-emerald-700">
                    Read full story
                    <ArrowUpRight size={15} />
                  </span>
                </div>
              </a>
            </>
          ))}
        </div>

        {loading && <p className="mt-8 text-center text-[13.5px] font-semibold text-slate-500">Loading live stories...</p>}

        {hasMore && (
          <div className="mt-10 text-center">
            <button
              onClick={() => loadArticles()}
              className="rounded-xl bg-emerald-800 px-8 py-3.5 text-[13px] font-black text-white shadow-[0_14px_30px_rgba(4,120,87,.22)] transition hover:-translate-y-0.5 hover:bg-emerald-900"
            >
              Load More News
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
