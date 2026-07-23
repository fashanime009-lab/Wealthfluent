export default function WorkspaceHeader({
  title,
  subtitle,
  action,
  badge = "WORKSPACE",
}) {
  return (
    <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

      <div className="max-w-3xl">

        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
          {badge}
        </span>

        <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-500">
          {subtitle}
        </p>

      </div>

      {action && (
        <div className="flex shrink-0 items-center">
          {action}
        </div>
      )}

    </div>
  );
}