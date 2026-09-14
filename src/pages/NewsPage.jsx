import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { DEFAULT_NEWS_QUERY, fetchNews, NEWS_REFRESH_INTERVAL } from "../services/newsService";
import useVisibleInterval from "../hooks/useVisibleInterval";
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

  useVisibleInterval(() => loadArticlesRef.current?.({ reset: true, force: true }), NEWS_REFRESH_INTERVAL);

  const searchNews = (event) => {
    event.preventDefault();
    loadArticles({ reset: true, force: true });
  };

  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
      <Seo
        title="News — Live Finance & Market Headlines"
        description="Fresh finance, market, economy, and business stories — refreshed every minute."
        path="/news"
        keywords="finance news, stock market news, business news, economy news"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "News", path: "/news" },
        ])}
      />
      <div className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Live news</span>
            <h1 className="font-display mt-2 max-w-lg text-[34px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[42px]">
              View all news
            </h1>
            <p className="mt-4 max-w-[58ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
              Fresh finance, market, economy, and business stories — refreshed
              every minute.
            </p>
          </div>

          <form
            onSubmit={searchNews}
            className="flex min-w-0 max-w-md flex-1 items-center border border-[#111814]/15 bg-[#ffffff] focus-within:border-[#047857] dark:border-[#eef1ec]/15 dark:bg-[#0b1210] dark:focus-within:border-[#34d399]"
          >
            <Search size={16} className="ml-3.5 flex-shrink-0 text-[#111814]/40 dark:text-[#eef1ec]/40" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent py-3 pl-2.5 pr-2 text-[13.5px] text-[#111814] outline-none dark:text-[#eef1ec]"
              placeholder="Search finance news..."
            />
            <button className="flex-shrink-0 border-l border-[#111814]/15 px-5 py-3 text-[13px] font-semibold text-[#111814] transition hover:opacity-70 dark:border-[#eef1ec]/15 dark:text-[#eef1ec]">
              Search
            </button>
          </form>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-b border-[#111814]/10 pb-4 dark:border-[#eef1ec]/10">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`text-[14px] font-semibold capitalize transition ${
                  category === item
                    ? "text-[#111814] dark:text-[#eef1ec]"
                    : "text-[#111814]/40 hover:text-[#111814]/70 dark:text-[#eef1ec]/40 dark:hover:text-[#eef1ec]/70"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            onClick={() => loadArticles({ reset: true })}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#111814]/60 transition hover:text-[#111814] dark:text-[#eef1ec]/60 dark:hover:text-[#eef1ec]"
          >
            <RefreshCw className={refreshing ? "animate-spin" : ""} size={14} />
            Refresh
          </button>
        </div>

        {error && (
          <p className="mt-6 border border-[#111814]/12 px-4 py-3 text-[13.5px] font-medium text-amber-700 dark:border-[#eef1ec]/12 dark:text-amber-400">
            {error}
          </p>
        )}

        <div className="mt-8">
          <AdSlot slotId="insights_top" />
        </div>

        <div className="mt-4 divide-y divide-[#111814]/10 border-y border-[#111814]/10 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/10">
          {visibleArticles.map((article, index) => (
            <>
              {index === 6 && (
                <div key="insights-mid-ad" className="py-2">
                  <AdSlot slotId="insights_mid" />
                </div>
              )}
              <a
                key={article.id}
                href={article.link}
                target="_blank"
                rel="noreferrer"
                className="grid gap-2 py-6 transition-opacity hover:opacity-70"
              >
                <div className="flex flex-wrap items-baseline gap-x-2.5">
                  <span className="text-[12.5px] font-semibold text-[#047857] dark:text-[#34d399]">{article.source}</span>
                  <span className="font-mono-tech text-[11.5px] tabular-nums text-[#111814]/40 dark:text-[#eef1ec]/40">
                    {timeAgo(article.publishedAt)}
                  </span>
                </div>
                <h2 className="font-display text-[17px] font-bold leading-snug text-[#111814] dark:text-[#eef1ec]">
                  {article.title}
                </h2>
                {article.description && (
                  <p className="max-w-[68ch] text-[13.5px] leading-6 text-[#111814]/55 dark:text-[#eef1ec]/55">
                    {article.description}
                  </p>
                )}
              </a>
            </>
          ))}
        </div>

        {loading && (
          <p className="mt-8 text-center text-[13px] font-medium text-[#111814]/45 dark:text-[#eef1ec]/45">
            Loading live stories...
          </p>
        )}

        {hasMore && (
          <div className="mt-10 text-center">
            <button
              onClick={() => loadArticles()}
              className="text-[13px] font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25"
            >
              Load more news
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
