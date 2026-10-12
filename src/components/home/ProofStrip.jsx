const POINTS = [
  "Your numbers stay on your device.",
  "Works across currencies and markets.",
  "Every calculator opens directly — no signup.",
];

export default function ProofStrip() {
  return (
    // Hidden below sm — see Hero.jsx's comment: the net-worth mini-tool
    // right after the hero needs to land near the top of a phone screen,
    // and trust copy below the hero's own CTA buttons is the lowest-value
    // thing to trim for that.
    <div className="mt-10 hidden flex-wrap gap-x-8 gap-y-2 sm:flex">
      {POINTS.map((point) => (
        <span key={point} className="text-[13px] text-[#111814]/60 dark:text-[#eef1ec]/55">
          {point}
        </span>
      ))}
    </div>
  );
}
