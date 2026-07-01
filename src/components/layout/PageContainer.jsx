import { cn } from "../../utils/cn";

const widths = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[90rem]",
  full: "max-w-full",
};

const paddings = {
  none: "",
  sm: "py-6",
  md: "py-10",
  lg: "py-16",
  xl: "py-24",
};

export default function PageContainer({
  children,
  size = "lg",
  padding = "md",
  className = "",
}) {
  return (
    <section
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        widths[size],
        paddings[padding],
        className
      )}
    >
      {children}
    </section>
  );
}