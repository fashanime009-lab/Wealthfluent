import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-emerald-700 text-white shadow-sm hover:bg-emerald-800 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(6,95,70,.18)]",

  secondary:
    "bg-white border border-slate-200/60 text-slate-800 hover:border-emerald-300 hover:text-emerald-700 hover:-translate-y-0.5",

  outline:
    "border border-emerald-700 text-emerald-700 bg-transparent hover:bg-emerald-50 hover:-translate-y-0.5",

  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100",

  success:
    "bg-emerald-600 text-white hover:bg-emerald-700",

  danger:
    "bg-red-600 text-white hover:bg-red-700",
};

const sizes = {
  sm: "h-10 px-4 text-sm",

  md: "h-12 px-6 text-sm",

  lg: "h-14 px-8 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-300 ease-out active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        leftIcon
      )}

      <span>{children}</span>

      {!loading && rightIcon}
    </button>
  );
}