import {
  LayoutDashboard,
  Target,
  Calculator,
  Sparkles,
  GraduationCap,
  FolderOpen,
  Settings,
  ArrowUpRight,
} from "lucide-react";

const ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "goals", label: "Goals", icon: Target },
  { id: "planning", label: "Planning", icon: Calculator },
  { id: "insights", label: "Insights", icon: Sparkles },
  { id: "learning", label: "Learning", icon: GraduationCap },
  { id: "documents", label: "Documents", icon: FolderOpen },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function WorkspaceSidebar({
  activeView,
  onChange,
}) {
  return (
    <aside className="sticky top-24 h-fit rounded-[30px] border border-[#E8EFEA] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,.06)]">

      <div className="mb-8">

        <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
          Workspace
        </div>

        <h2 className="mt-4 text-3xl font-black text-slate-900">
          Financial OS
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Everything you need to plan, track and improve your financial life.
        </p>

      </div>

      <nav className="space-y-2">

        {ITEMS.map((item) => {

          const Icon = item.icon;

          const active = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`
                group
                flex
                w-full
                items-center
                justify-between
                rounded-2xl
                px-4
                py-4
                transition-all
                duration-300

                ${
                  active
                    ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"
                    : "text-slate-600 hover:bg-slate-50"
                }
              `}
            >

              <div className="flex items-center gap-4">

                <div
                  className={`
                    grid
                    h-11
                    w-11
                    place-items-center
                    rounded-xl

                    ${
                      active
                        ? "bg-white shadow-sm"
                        : "bg-slate-50 group-hover:bg-white"
                    }
                  `}
                >
                  <Icon size={20} />
                </div>

                <span className="font-semibold">
                  {item.label}
                </span>

              </div>

              {active && (
                <ArrowUpRight
                  size={18}
                  className="text-emerald-700"
                />
              )}

            </button>
          );

        })}

      </nav>

      <div className="mt-10 rounded-3xl bg-gradient-to-br from-emerald-50 to-white p-5 ring-1 ring-emerald-100">

        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          FINAIW AI
        </div>

        <h3 className="mt-3 text-lg font-bold text-slate-900">
          Smart Financial Guidance
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          AI-powered recommendations will appear here based on your financial journey.
        </p>

      </div>

    </aside>
  );
}