import HeroGreeting from "./HeroGreeting";
import HeroMission from "./HeroMission";
import HeroSummary from "./HeroSummary";

export default function HeroSection() {
  return (
    <section className="relative mb-16 overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 shadow-xl">

      {/* Background Decoration */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-indigo-100/40 blur-3xl" />

      <div className="relative z-10 grid gap-12 p-8 lg:grid-cols-[1.35fr_0.9fr] lg:p-12">

        {/* LEFT COLUMN */}

        <div className="space-y-8">

          <HeroGreeting />

          <HeroMission />

        </div>

        {/* RIGHT COLUMN */}

        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 backdrop-blur">

          <div className="mb-6">

            <h2 className="text-xl font-bold text-slate-900">
              Your Progress
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              A quick overview of your current financial journey.
            </p>

          </div>

          <HeroSummary />

        </div>

      </div>

    </section>
  );
}