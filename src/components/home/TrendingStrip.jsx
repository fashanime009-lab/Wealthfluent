import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, TrendingUp } from "lucide-react";
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
    <section className="mx-auto mt-8 max-w-[1660px] px-5 sm:px-8 lg:px-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] font-black text-slate-900">
          <TrendingUp size={16} className="text-emerald-700" />
          Trending in Finance
        </div>
        <Link to="/news" className="text-[12px] font-black text-emerald-800">
          View all news
        </Link>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
            ))
          : items.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,.05)] ring-1 ring-slate-100 transition hover:-translate-y-0.5"
              >
                <span className="text-[10px] font-black uppercase tracking-wide text-emerald-700">
                  {item.source}
                </span>
                <p className="mt-1.5 line-clamp-2 text-[13px] font-bold leading-5 text-slate-800">
                  {item.title}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-black text-slate-400">
                  Read <ArrowUpRight size={11} />
                </span>
              </a>
            ))}
      </div>
    </section>
  );
}
