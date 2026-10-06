export default function SettingsSection({ title, description, children }) {
  return (
    <section className="border border-[#111814]/12 bg-[#ffffff] dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
      <div className="border-b border-[#111814]/10 px-6 py-5 dark:border-[#eef1ec]/10 sm:px-8">
        <h2 className="font-display text-[17px] font-bold text-[#111814] dark:text-[#eef1ec]">{title}</h2>
        {description && (
          <p className="mt-1 text-[13px] text-[#111814]/60 dark:text-[#eef1ec]/55">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}
