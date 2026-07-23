export default function DashboardCard({
  title,
  icon,
  badge,
  children,
  className = "",
}) {
  return (
    <div
      className={`group flex h-[305px] flex-col rounded-2xl bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,.05)] ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}
    >
      {(title || icon || badge) && (
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-200">
                {icon}
              </div>
            )}

            <div>
              <h3 className="text-[13px] font-bold text-slate-800">
                {title}
              </h3>
            </div>
          </div>

          {badge}
        </div>
      )}

      <div className="mt-5 flex flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}