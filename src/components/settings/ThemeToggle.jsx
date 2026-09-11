import { Moon, Sun, MonitorSmartphone } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: MonitorSmartphone },
  ];

  return (
    <div className="flex flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="flex items-start gap-4 sm:items-center sm:gap-5">
        <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          <Moon size={22} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">Theme</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Light, Dark or System.</p>
        </div>
      </div>

      <div className="flex items-center gap-1 self-start rounded-xl bg-slate-100 p-1 dark:bg-white/5 sm:self-auto">
        {options.map((opt) => {
          const Icon = opt.icon;
          const active = theme === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              aria-pressed={active}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-bold transition ${
                active
                  ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-400"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
