import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";

import Button from "../../ui/Button";

export default function HeroGreeting() {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 shadow-sm">

      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />
      <div className="absolute -bottom-16 left-0 h-56 w-56 rounded-full bg-indigo-200/20 blur-3xl" />

      <div className="relative z-10">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
          <Clock size={16} />
          Personal Finance Operating System
        </div>

        {/* Greeting */}
        <p className="mt-8 text-lg font-semibold text-slate-600">
          {greeting} 👋
        </p>

        {/* Main Heading */}
        <h1 className="mt-3 text-5xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl">

          PLAN TODAY.

          <br />

          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            BUILD WEALTH.
          </span>

        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Every smart financial decision you make today compounds into
          long-term wealth. Build better habits, track meaningful
          progress, and move confidently toward financial freedom.
        </p>

        {/* CTA */}
        <div className="mt-8 flex flex-wrap gap-4">

          <Button>
            Continue Journey
          </Button>

          <Button variant="secondary" rightIcon={<ArrowRight size={18} />}>
            Explore Tools
          </Button>

        </div>

        {/* Trust Indicators */}

        <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">

          <div className="flex items-center gap-2">
            <ShieldCheck
              size={18}
              className="text-emerald-500"
            />
            Privacy First
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2
              size={18}
              className="text-emerald-500"
            />
            100% Free
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2
              size={18}
              className="text-emerald-500"
            />
            Works Offline
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2
              size={18}
              className="text-emerald-500"
            />
            No Sign Up Required
          </div>

        </div>

      </div>

    </div>
  );
}