export default function WorkspaceMetric({
  label,
  value,
}) {
  return (
    <div>

      <p className="text-sm text-[var(--text-secondary)]">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold text-[var(--text)]">
        {value}
      </p>

    </div>
  );
}