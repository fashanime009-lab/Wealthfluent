const STATS = [
  { value: "18", label: "calculators" },
  { value: "4", label: "verdict tools" },
  { value: "25+", label: "learning guides" },
  { value: "0", label: "data leaves your device" },
];

export default function StatsStrip() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8 lg:px-12">
      <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-[#111814]/10 py-8 dark:border-[#eef1ec]/10 sm:grid-cols-4 sm:gap-x-12">
        {STATS.map((stat) => (
          <div key={stat.label} className="min-w-0">
            <span className="font-mono-tech text-[26px] font-medium tabular-nums text-[#047857] dark:text-[#34d399]">
              {stat.value}
            </span>
            <span className="ml-2.5 text-[13px] text-[#111814]/55 dark:text-[#eef1ec]/55">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
