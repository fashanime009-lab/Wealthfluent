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
        "rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300",
        hover &&
          "hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60",
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}