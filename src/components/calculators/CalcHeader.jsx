export default function CalcHeader({ category, title, description }) {
  return (
    <div>
      <span className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">{category}</span>
      <h1 className="font-display mt-2 text-[32px] font-extrabold leading-tight tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[40px]">
        {title}
      </h1>
      <p className="mt-3 max-w-[56ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">{description}</p>
    </div>
  );
}
