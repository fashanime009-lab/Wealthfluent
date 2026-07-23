import { useState, useRef } from "react";

export default function HoverCard({
  trigger,
  children,
  align = "right",
  width = "18rem",
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);

  const show = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const hide = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 120);
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {trigger}

      <div
        className={`absolute right-0 top-full mt-2 z-[100] transition-all duration-200 ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        } ${
          align === "right"
            ? "right-0"
            : align === "left"
            ? "left-0"
            : "left-1/2 -translate-x-1/2"
        }`}
        style={{ width }}
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}