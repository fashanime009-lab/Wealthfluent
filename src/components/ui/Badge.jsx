import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-blue-100 text-blue-700",

  success:
    "bg-emerald-100 text-emerald-700",

  warning:
    "bg-amber-100 text-amber-700",

  danger:
    "bg-red-100 text-red-700",

  purple:
    "bg-violet-100 text-violet-700",

  neutral:
    "bg-slate-100 text-slate-700",
};

const sizes = {
  sm: "px-2 py-1 text-xs",

  md: "px-3 py-1.5 text-sm",
};

export default function Badge({
  children,
  variant = "primary",
  size = "sm",
  rounded = true,
  className = "",
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-colors",
        rounded ? "rounded-full" : "rounded-lg",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}