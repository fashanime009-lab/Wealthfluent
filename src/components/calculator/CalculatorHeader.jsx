export default function CalculatorHeader({
  badge,
  title,
  description,
  children,
}) {
  return (
    <div className="mb-10">
      {badge && (
        <span className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          {badge}
        </span>
      )}

      <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
        {title}
      </h1>

      {description && (
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-500">
          {description}
        </p>
      )}

      {children}
    </div>
  );
}