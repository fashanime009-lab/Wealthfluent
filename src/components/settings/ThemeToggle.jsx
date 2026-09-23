import { useTheme } from "@/context/ThemeContext";

const OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const DESCRIPTIONS = {
  auto: "Light by day, dark by night — based on your device's own clock, checked every few minutes.",
  light: "Always light.",
  dark: "Always dark.",
  system: "Matches your OS's own light/dark setting.",
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <h3 className="text-[14px] font-semibold text-[#111814] dark:text-[#eef1ec]">Theme</h3>
        <p className="mt-1 max-w-xs text-[13px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/55">
          {DESCRIPTIONS[theme]}
        </p>
      </div>

      <div className="flex flex-shrink-0 flex-wrap gap-5">
        {OPTIONS.map((opt) => {
          const active = theme === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              aria-pressed={active}
              className={`text-[13.5px] font-semibold transition ${
                active
                  ? "text-[#111814] dark:text-[#eef1ec]"
                  : "text-[#111814]/60 hover:text-[#111814]/70 dark:text-[#eef1ec]/50 dark:hover:text-[#eef1ec]/70"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
