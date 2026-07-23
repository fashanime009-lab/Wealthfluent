import CalculatorCard from "./CalculatorCard";
import { calculators } from "@/data/calculators";

export default function CalculatorGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      {calculators.map((item) => (
        <CalculatorCard
          key={item.title}
          item={item}
        />
      ))}
    </div>
  );
}