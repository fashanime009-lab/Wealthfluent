import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { searchIndex } from "../data/searchIndex";

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
      className="fixed inset-0 z-[200] flex items-start justify-center bg-[#111814]/50 px-4 pt-[12vh]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl border border-[#111814]/12 bg-[#eef1ec] dark:border-[#eef1ec]/12 dark:bg-[#0b1210]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-[#111814]/10 px-5 py-4 dark:border-[#eef1ec]/10">
          <Search size={18} className="flex-shrink-0 text-[#111814]/40 dark:text-[#eef1ec]/40" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search calculators, verdicts, lessons..."
            className="w-full bg-transparent text-[14.5px] text-[#111814] outline-none placeholder:text-[#111814]/40 dark:text-[#eef1ec] dark:placeholder:text-[#eef1ec]/40"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex-shrink-0 text-[#111814]/40 transition hover:text-[#111814] dark:text-[#eef1ec]/40 dark:hover:text-[#eef1ec]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13.5px] text-[#111814]/45 dark:text-[#eef1ec]/45">
              No pages match "{query}".
            </p>
          ) : (
            <div className="divide-y divide-[#111814]/10 dark:divide-[#eef1ec]/10">
              {results.map((item, i) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => goTo(item.path)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`block w-full px-5 py-3.5 text-left transition ${
                    i === activeIndex ? "bg-[#047857]/8 dark:bg-[#34d399]/8" : ""
                  }`}
                >
                  <div className="flex min-w-0 items-baseline gap-2">
                    <span className="font-display truncate text-[14px] font-bold text-[#111814] dark:text-[#eef1ec]">
                      {item.title}
                    </span>
                    <span className="flex-shrink-0 text-[11.5px] text-[#111814]/40 dark:text-[#eef1ec]/40">
                      {item.category}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[12.5px] text-[#111814]/55 dark:text-[#eef1ec]/55">
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
