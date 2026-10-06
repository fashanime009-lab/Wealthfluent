import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchNews, DEFAULT_NEWS_QUERY } from "../../services/newsService";

// Real live headlines (same service /news already uses) instead of static
// placeholder text — keeps the homepage honest and funnels traffic into the
// ad-monetized News/Blog pages instead of dead-ending on the homepage.
export default function TrendingStrip() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchNews({ type: "news", category: "business", query: DEFAULT_NEWS_QUERY, limit: 4 })
      .then((data) => {
        if (!cancelled) setItems((data.articles || []).slice(0, 4));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8 lg:px-12">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[#111814]/60 dark:text-[#eef1ec]/50">Trending in finance</span>
        <Link to="/news" className="text-[13px] font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25">
          View all news
        </Link>
      </div>
      <div className="mt-4 divide-y divide-[#111814]/10 border-y border-[#111814]/10 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/10">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse py-4">
                <div className="h-4 w-2/3 rounded bg-[#111814]/8 dark:bg-[#eef1ec]/8" />
              </div>
            ))
          : items.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="flex items-baseline justify-between gap-4 py-4 transition-opacity hover:opacity-70"
              >
                <p className="min-w-0 truncate text-[13.5px] font-medium text-[#111814] dark:text-[#eef1ec]">{item.title}</p>
                <span className="flex-shrink-0 text-[12px] text-[#111814]/60 dark:text-[#eef1ec]/50">{item.source}</span>
              </a>
            ))}
      </div>
    </section>
  );
}
