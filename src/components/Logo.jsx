// FINAIW's brand mark — plain text, nothing else. No icon, no badge, no
// gradient square (the previous version had one and it read as a generic
// AI-generated startup logo, which is exactly the look to avoid). Just a
// confident, tightly-tracked wordmark with a two-tone split ("FIN" in the
// page's ink color, "AIW" in brand emerald) and an optional tagline
// underneath. Used everywhere the old raster logo.webp appeared.
export default function Logo({
  size = "md", // "sm" | "md" | "lg"
  onDark = false, // true when the surrounding surface is always dark (e.g. the Footer)
  tagline = true, // show the "Financial Intelligence, AI for Wealth" line
  taglineVisibility = "sm-up", // "always" | "sm-up" — matches each surface's original behavior
}) {
  const wordSize = size === "lg" ? "text-[30px]" : size === "sm" ? "text-[18px]" : "text-[23px]";

  const finColor = onDark ? "text-white" : "text-slate-950 dark:text-white";
  const aiwColor = onDark ? "text-emerald-400" : "text-emerald-700 dark:text-emerald-400";
  const taglineColor = onDark ? "text-slate-500" : "text-slate-400";
  const taglineDisplay = taglineVisibility === "always" ? "block" : "hidden sm:block";

  return (
    <span className="leading-tight">
      <span className={`block ${wordSize} font-black tracking-[-0.045em]`}>
        <span className={finColor}>FIN</span>
        <span className={aiwColor}>AIW</span>
      </span>
      {tagline && (
        <span
          className={`${taglineDisplay} text-[10.5px] font-semibold uppercase tracking-[0.08em] ${taglineColor}`}
        >
          Financial Intelligence, AI for Wealth
        </span>
      )}
    </span>
  );
}
