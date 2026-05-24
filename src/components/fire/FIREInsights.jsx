import React from "react";

const FIREInsights = ({ results }) => {
  return (
    <div className="fire-card">

      <h2>AI Wealth Insights</h2>

      <ul className="fire-insights">

        <li>
          You may achieve financial freedom in{" "}
          <strong>{results.years} years</strong>.
        </li>

        <li>
          Your projected retirement corpus is approximately{" "}
          <strong>
            ₹{Math.round(results.totalWealth).toLocaleString()}
          </strong>.
        </li>

        <li>
          Your future monthly expenses after inflation could be around{" "}
          <strong>
            ₹{Math.round(results.inflatedExpenses).toLocaleString()}
          </strong>.
        </li>

      </ul>

    </div>
  );
};

export default FIREInsights;