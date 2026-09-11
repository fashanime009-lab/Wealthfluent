import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ArrowRight } from "lucide-react";
import { searchIndex } from "../data/searchIndex";

const CATEGORY_STYLES = {
  Calculator: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  Verdict: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  Tool: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  Learn: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  Lesson: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  Page: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300",
};

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Nothing typed yet — surface a short, useful default list rather
      // than an empty panel.
      return searchIndex.filter((item) => item.category !== "Lesson").slice(0, 8);
    }
    return searchIndex
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      // Autofocus once the modal has actually mounted.
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
    setQuery("");
  }, [open]);

  const goTo = (path) => {
    navigate(path);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      goTo(results[activeIndex].path);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center bg-slate-950/50 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-white/10">
          <Search size={18} className="flex-shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search calculators, verdicts, lessons..."
            className="w-full bg-transparent text-[15px] font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex-shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-[13.5px] text-slate-400">
              No pages match "{query}".
            </p>
          ) : (
            results.map((item, i) => (
              <button
                key={item.path}
                type="button"
                onClick={() => goTo(item.path)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition ${
                  i === activeIndex
                    ? "bg-emerald-50 dark:bg-white/5"
                    : "hover:bg-slate-50 dark:hover:bg-white/5"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[14px] font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    <span
                      className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                        CATEGORY_STYLES[item.category] || CATEGORY_STYLES.Page
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[12.5px] text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
                <ArrowRight size={15} className="flex-shrink-0 text-slate-300 dark:text-slate-600" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
