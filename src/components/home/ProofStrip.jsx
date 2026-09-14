const POINTS = [
  "Your numbers stay on your device.",
  "Works across currencies and markets.",
  "Every calculator opens directly — no signup.",
];

export default function ProofStrip() {
  return (
    <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2">
      {POINTS.map((point) => (
        <span key={point} className="text-[13px] text-[#111814]/55 dark:text-[#eef1ec]/55">
          {point}
        </span>
      ))}
    </div>
  );
}
