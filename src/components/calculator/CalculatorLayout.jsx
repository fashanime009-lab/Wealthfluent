export default function CalculatorLayout({
  children,
  className = "",
}) {
  return (
    <div className="min-h-screen bg-[#f3f7fc] text-slate-800">
      <section
        className={`mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 md:py-16 ${className}`}
      >
        {children}
      </section>
    </div>
  );
}