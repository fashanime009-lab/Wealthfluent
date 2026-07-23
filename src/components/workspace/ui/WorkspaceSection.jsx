export default function WorkspaceSection({
  title,
  description,
  action,
  children,
}) {
  return (
    <section className="space-y-6">

      <div className="flex items-start justify-between">

        <div>

          <h2 className="text-2xl font-bold text-[var(--text)]">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-[var(--text-secondary)]">
              {description}
            </p>
          )}

        </div>

        {action}

      </div>

      {children}

    </section>
  );
}