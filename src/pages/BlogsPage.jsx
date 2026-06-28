import { useEffect, useMemo, useState } from "react";
import { fetchNews } from "../services/newsService";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Clock3,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";



const defaultQuery = "personal finance OR investing OR mutual funds OR SIP OR tax OR retirement";



function timeAgo(date) {
  const publishedAt = new Date(date).getTime();
  if (!publishedAt) return "Live";
  const minutes = Math.max(1, Math.floor((Date.now() - publishedAt) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function fallbackBlogs(query) {
  return [
    {
      id: "fallback-blogs",
      title: "Open Live Personal Finance Articles",
      description: "The blog API is temporarily unavailable. Open live Google News results for finance articles.",
      link: `https://news.google.com/search?q=${encodeURIComponent(query || defaultQuery)}&hl=en-IN&gl=IN&ceid=IN%3Aen`,
      source: "Google News",
      publishedAt: new Date().toISOString(),
      image: "",
    },
  ];
}



export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [query, setQuery] = useState(defaultQuery);
  const [pageToken, setPageToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const featured = blogs[0];
  const rest = blogs.slice(1);

  const uniqueBlogs = useMemo(() => {
    const seen = new Set();
    return rest.filter((blog) => {
      if (!blog.link || seen.has(blog.link)) return false;
      seen.add(blog.link);
      return true;
    });
  }, [rest]);

  const loadBlogs = async ({ reset = false } = {}) => {
    if (reset) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
     const data = await fetchNews({
  type: "blogs",
  query,
  page: reset ? "" : pageToken,
  limit: reset ? 20 : blogs.length + 20,
  force: reset,
});

const nextBlogs = data.articles;

setBlogs((current) =>
  reset ? nextBlogs : [...current, ...nextBlogs]
);

setPageToken(data.nextPage || "load-more");
      setLastUpdated(new Date());
      setError("");
    } catch {
      setBlogs((current) => (current.length ? current : fallbackBlogs(query)));
      setPageToken("");
      setLastUpdated(new Date());
      setError("Live article API unavailable. Showing safe live-search fallback.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBlogs({ reset: true });
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => loadBlogs({ reset: true }), 180000);
    return () => window.clearInterval(interval);
  }, [query]);

  const searchBlogs = (event) => {
    event.preventDefault();
    loadBlogs({ reset: true });
  };

  return (
    <main className="min-h-screen bg-[#f3f7fc] text-slate-950">
      

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
              <BookOpen size={14} />
              Live Blogs
            </div>
            <h1 className="mt-5 text-5xl font-black tracking-tight">View All Blogs</h1>
            <p className="mt-3 max-w-2xl text-slate-500">
              Finance, investing, tax, retirement, and wealth-building reads refreshed from live article APIs.
            </p>
          </div>

          <form onSubmit={searchBlogs} className="flex min-w-0 max-w-xl flex-1 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-200">
            <div className="grid w-12 place-items-center text-slate-400">
              <Search size={18} />
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 px-2 py-4 text-sm outline-none"
              placeholder="Search blog topics..."
            />
            <button className="bg-blue-500 px-6 text-sm font-bold text-white">Search</button>
          </form>
        </div>

        {error && <p className="mt-5 rounded-md bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">{error}</p>}

        {featured && (
          <a
            href={featured.link}
            target="_blank"
            rel="noreferrer"
            className="mt-10 grid overflow-hidden rounded-xl bg-[#061225] text-white shadow-[0_18px_45px_rgba(15,23,42,.18)] lg:grid-cols-[1.1fr_.9fr]"
          >
            <div className="min-h-[360px] bg-[radial-gradient(circle_at_25%_20%,#2563eb,transparent_35%),linear-gradient(135deg,#061225,#173b70)]">
              {featured.image && <img src={featured.image} alt="" className="h-full w-full object-cover opacity-90" />}
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-10">
              <div className="flex items-center justify-between gap-4 text-sm text-blue-200">
                <span>{featured.source}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock3 size={14} />
                  {timeAgo(featured.publishedAt)}
                </span>
              </div>
              <h2 className="mt-6 text-4xl font-black leading-tight">{featured.title}</h2>
              <p className="mt-5 text-base leading-relaxed text-slate-300">{featured.description}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-blue-200">
                Read featured article
                <ArrowUpRight size={17} />
              </span>
            </div>
          </a>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {uniqueBlogs.map((blog) => (
            <a
              key={blog.id}
              href={blog.link}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,.08)] ring-1 ring-slate-100 transition hover:-translate-y-1"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>{blog.source}</span>
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <Clock3 size={13} />
                  {timeAgo(blog.publishedAt)}
                </span>
              </div>
              <h2 className="mt-4 line-clamp-3 text-xl font-black leading-tight">{blog.title}</h2>
              <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-slate-500">{blog.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                Read article
                <ArrowUpRight size={16} />
              </span>
            </a>
          ))}
        </div>

        {loading && (
          <div className="mt-10 flex items-center justify-center gap-3 text-sm font-semibold text-slate-500">
            <Loader2 className="animate-spin" size={18} />
            Loading live articles...
          </div>
        )}

        {blogs.length >= 20 && (
          <div className="mt-10 text-center">
            <button onClick={() => loadBlogs()} className="rounded-md bg-blue-500 px-8 py-3 text-sm font-bold text-white">
              Load More Blogs
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
