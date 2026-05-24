import React from "react";

const FIREInputs = ({ inputs, setInputs }) => {

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: Number(e.target.value),
    });
  };

  const fields = [
    ["Current Age", "currentAge"],
    ["Retirement Age", "retirementAge"],
    ["Monthly Expenses", "monthlyExpenses"],
    ["Current Savings", "currentSavings"],
    ["Monthly Investment", "monthlyInvestment"],
    ["Expected Return %", "expectedReturn"],
    ["Inflation Rate %", "inflationRate"],
  ];

  return (
    <div className="fire-card">

      <h2>Financial Inputs</h2>

      {fields.map(([label, key]) => (
        <div className="fire-input-group" key={key}>
          <label>{label}</label>

          <input
            type="number"
            name={key}
            value={inputs[key]}
            onChange={handleChange}
          />
        </div>
      ))}

    </div>
  );
};

export default FIREInputs;