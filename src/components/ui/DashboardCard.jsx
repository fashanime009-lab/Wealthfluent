import { ChevronRight } from "lucide-react";

export default function DashboardCard({
  title,
  subtitle,
  icon,
  action,
  children,
  className = "",
}) {
  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-[var(--border)]
        bg-[var(--card)]
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        ${className}
      `}
    >
      {/* subtle gradient glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {(title || icon || action) && (
        <div className="relative mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                {icon}
              </div>
            )}

            <div>
              {title && (
                <h3 className="text-lg font-semibold text-[var(--text)]">
                  {title}
                </h3>
              )}

              {subtitle && (
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {action ? (
            action
          ) : (
            <ChevronRight
              size={18}
              className="text-[var(--text-secondary)] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
            />
          )}
        </div>
      )}

      <div className="relative">
        {children}
      </div>
    </div>
  );
}