export default function WorkspaceCard({
  children,
  className = "",
  hover = true,
  padding = "p-7",
}) {
  return (
    <div
      className={`
        relative
        overflow-hidden

        rounded-[28px]

        border
        border-[#E8EFEA]

        bg-white

        ${padding}

        shadow-[0_10px_35px_rgba(16,24,40,0.05)]

        transition-all
        duration-300

        ${
          hover
            ? "hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(16,24,40,0.10)]"
            : ""
        }

        ${className}
      `}
    >
      {children}
    </div>
  );
}