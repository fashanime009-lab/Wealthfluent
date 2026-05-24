import React from "react";
import CountUp from "react-countup";

const FIREResults = ({ results }) => {
  return (
    <div className="fire-results-grid">

      <div className="fire-stat-card">
        <h3>Estimated Wealth</h3>

        <p>
          ₹
          <CountUp
            end={results.totalWealth}
            duration={2}
            separator=","
          />
        </p>
      </div>

      <div className="fire-stat-card">
        <h3>FIRE Number</h3>

        <p>
          ₹
          <CountUp
            end={results.fireNumber}
            duration={2}
            separator=","
          />
        </p>
      </div>

      <div className="fire-stat-card">
        <h3>Freedom Score</h3>

        <p>{results.freedomScore}%</p>
      </div>

    </div>
  );
};

export default FIREResults;