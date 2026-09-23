const STEPS = [
  {
    title: "Pick a calculator or a decision",
    text: "Eighteen calculators for loans, investments, retirement and wealth — or a verdict tool if you're actually stuck between two options.",
  },
  {
    title: "Enter your real numbers",
    text: "Your loan amount, income, or expenses — not a demo. Every field has a sensible starting value, but the answer is only useful once it's yours.",
  },
  {
    title: "Get the number, not a guess",
    text: "A computed result with the formula shown, or — for a verdict — a simulation of both paths and which one wins, month by month.",
  },
];

export default function HowItWorks() {
  return (
    // Full-bleed pale violet room — a quiet break between the calculators'
    // warm paper and the learning section's pale gold.
    <section className="bg-[#f5f1fa] py-14 dark:bg-[#0b1210]">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
      <h2 className="font-display text-[20px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[22px]">
        How it works
      </h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <div key={step.title}>
            <span className="font-mono-tech text-[13px] text-[#047857] dark:text-[#34d399]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display mt-2 text-[16px] font-bold text-[#111814] dark:text-[#eef1ec]">
              {step.title}
            </h3>
            <p className="mt-2 text-[13.5px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/60">{step.text}</p>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
