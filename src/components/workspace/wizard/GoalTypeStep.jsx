import {
  Briefcase,
  Car,
  GraduationCap,
  Heart,
  Home,
  Plane,
  Target,
} from "lucide-react";

const GOAL_TYPES = [
  {
    type: "retirement",
    title: "Retirement",
    category: "Retirement",
    icon: Briefcase,
  },
  {
    type: "emergency",
    title: "Emergency Fund",
    category: "Emergency",
    icon: Heart,
  },
  {
    type: "house",
    title: "Buy a House",
    category: "Housing",
    icon: Home,
  },
  {
    type: "car",
    title: "Buy a Car",
    category: "Vehicle",
    icon: Car,
  },
  {
    type: "education",
    title: "Education",
    category: "Education",
    icon: GraduationCap,
  },
  {
    type: "travel",
    title: "Travel",
    category: "Travel",
    icon: Plane,
  },
  {
    type: "custom",
    title: "Custom Goal",
    category: "General",
    icon: Target,
  },
];

export default function GoalTypeStep({
  goal,
  updateGoal,
  next,
  onClose,
}) {
  return (
    <>
      <div className="mb-8">

        <h2 className="text-3xl font-bold text-[var(--text)]">
          Create a Goal
        </h2>

        <p className="mt-2 text-[var(--text-secondary)]">
          Choose the financial journey you want to begin.
        </p>

      </div>

      <div className="grid gap-4 md:grid-cols-2">

        {GOAL_TYPES.map((item) => {
          const Icon = item.icon;

          const active = goal.type === item.type;

          return (
            <button
              key={item.type}
              onClick={() =>
                updateGoal({
                  type: item.type,
                  title: item.title,
                  category: item.category,
                })
              }
              className={`rounded-3xl border p-6 text-left transition-all duration-200 ${
                active
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-[var(--border)] hover:border-blue-400"
              }`}
            >
              <Icon className="mb-5 h-8 w-8 text-blue-600" />

              <h3 className="text-lg font-semibold text-[var(--text)]">
                {item.title}
              </h3>

              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {item.category}
              </p>
            </button>
          );
        })}

      </div>

      <div className="mt-10 flex justify-between">

        <button
          onClick={onClose}
          className="rounded-xl border border-[var(--border)] px-5 py-3"
        >
          Cancel
        </button>

        <button
          disabled={!goal.type}
          onClick={next}
          className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>

      </div>
    </>
  );
}