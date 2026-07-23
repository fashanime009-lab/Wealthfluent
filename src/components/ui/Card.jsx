import { cn } from "../../utils/cn";

export default function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
  ...props
}) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
  <div
    className={cn(
      "rounded-3xl border border-slate-200/60 bg-white shadow-sm transition-all duration-300",

      hover &&
        "hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_50px_rgba(16,185,129,0.08)]",

      paddings[padding],

      className
    )}
    {...props}
  >
    {children}
  </div>
);
}