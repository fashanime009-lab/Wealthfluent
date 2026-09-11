export default function HeroLandscape() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[230px] overflow-hidden rounded-b-[34px]">
      <div className="absolute bottom-0 left-[-8%] h-40 w-[42%] rounded-[50%] bg-emerald-900/10 blur-[1px]" />
      <div className="absolute bottom-[-30px] left-[9%] h-44 w-[38%] rounded-[50%] bg-emerald-700/16" />
      <div className="absolute bottom-[-42px] left-[28%] h-52 w-[45%] rounded-[50%] bg-emerald-900/12" />
      <div className="absolute bottom-[-22px] right-[-10%] h-56 w-[55%] rounded-[50%] bg-emerald-800/10" />
      <div className="absolute bottom-[-4px] left-[18%] h-32 w-[35%] -rotate-12 rounded-[50%] bg-white/80" />
      <div className="absolute bottom-[-40px] left-[26%] h-44 w-[34%] -rotate-12 rounded-[50%] bg-[#f7f6ef]" />
      <div className="absolute bottom-[86px] right-[20%] h-24 w-24 rounded-full bg-amber-200/40" />
    </div>
  );
}