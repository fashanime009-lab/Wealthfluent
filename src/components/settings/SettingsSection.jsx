export default function SettingsSection({
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
      <div className="border-b border-slate-100 px-8 py-6 dark:border-white/10">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      <div>{children}</div>
    </section>
  );
}