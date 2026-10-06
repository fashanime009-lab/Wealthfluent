// A plain prose block — "What is X", "How is it calculated", "Benefits" —
// separated by a hairline rule instead of a bordered card, matching the
// verdict pages' "how this verdict is calculated" section.
export default function CalcSection({ title, children }) {
  return (
    <div className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10">
      <h2 className="font-display text-[22px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec]">
        {title}
      </h2>
      <div className="mt-3 max-w-[68ch] space-y-4 text-[14px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
        {children}
      </div>
    </div>
  );
}
