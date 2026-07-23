export default function WorkspaceGrid({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        grid
        gap-6
        lg:grid-cols-2
        ${className}
      `}
    >
      {children}
    </div>
  );
}