export default function CalcBenefitGrid({ items }) {
  return (
    <div className="mt-2 grid gap-6 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.title}>
          <h3 className="text-[14.5px] font-bold text-[#111814] dark:text-[#eef1ec]">{item.title}</h3>
          <p className="mt-1.5 text-[13.5px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/60">{item.text}</p>
        </div>
      ))}
    </div>
  );
}
