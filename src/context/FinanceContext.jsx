import { createContext, useContext, useState } from "react";

const FinanceContext = createContext();

export function FinanceProvider({ children }) {

  const [sipData, setSipData] = useState({
    monthlyInvestment: 10000,
    annualReturn: 12,
    years: 20,
    futureValue: 9991479,
  });

  return (
    <FinanceContext.Provider
      value={{
        sipData,
        setSipData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}