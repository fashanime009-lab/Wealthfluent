import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";

export default function ActionMenu({
  items = [],
  align = "right",
}) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-[var(--bg-secondary)]"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div
          className={`absolute z-50 mt-2 min-w-[210px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-xl ${
            align === "right"
              ? "right-0"
              : "left-0"
          }`}
        >
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setOpen(false);
                item.onClick?.();
              }}
              className={`flex w-full items-center rounded-xl px-4 py-3 text-left text-sm transition hover:bg-[var(--bg-secondary)] ${
                item.danger
                  ? "text-red-600"
                  : "text-[var(--text)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}