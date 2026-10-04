// scope: "global" (default) or "india" — every calculator should say which
// it is, not leave a visitor to guess from the ₹ symbol in the examples.
// "global" is the default because it's true for most of the site's
// calculators (SIP, EMI, CAGR, FD and the rest are plain formulas that
// work in any currency via Settings); only the handful tied to an actual
// Indian scheme or tax rule (GST, RD, PPF, HRA, Gratuity) pass "india".
export default function CalcHeader({ category, title, description, scope = "global" }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">{category}</span>
        {scope === "india" ? (
          <span className="border border-[#111814]/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#111814]/55 dark:border-[#eef1ec]/15 dark:text-[#eef1ec]/50">
            India only
          </span>
        ) : (
          <span className="border border-[#047857]/20 bg-[#047857]/5 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#047857] dark:border-[#34d399]/20 dark:bg-[#34d399]/5 dark:text-[#34d399]">
            Works worldwide
          </span>
        )}
      </div>
      <h1 className="font-display mt-2 text-[32px] font-extrabold leading-tight tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[40px]">
        {title}
      </h1>
      <p className="mt-3 max-w-[56ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">{description}</p>
    </div>
  );
}
