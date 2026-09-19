// Debt snowball (smallest balance first) vs avalanche (highest rate
// first) — simulated month by month, not estimated. Every paid-off
// debt's minimum payment rolls into the pool applied to the next
// highest-priority debt still standing ("snowballing"), which is the
// actual mechanic both strategies rely on, not just a payoff ordering.
const MAX_MONTHS = 600; // 50-year safety cap against inputs where minimums never cover interest

function simulate(debts, extraMonthly, compareFn) {
  const working = debts.map((d) => ({ ...d, balance: d.balance }));
  const order = [...working].sort(compareFn).map((d) => d.id);

  let month = 0;
  let totalInterest = 0;
  const payoffMonth = {};

  while (working.some((d) => d.balance > 0.01) && month < MAX_MONTHS) {
    month += 1;

    for (const d of working) {
      if (d.balance <= 0) continue;
      const interest = d.balance * (d.rate / 100 / 12);
      d.balance += interest;
      totalInterest += interest;
    }

    // Extra pool = the amount set aside each month, plus every already
    // paid-off debt's minimum payment — that's what makes payoff
    // accelerate over time instead of staying flat.
    let pool = extraMonthly;
    for (const d of working) {
      if (d.balance <= 0) pool += d.minPayment;
    }

    for (const d of working) {
      if (d.balance <= 0) continue;
      const pay = Math.min(d.minPayment, d.balance);
      d.balance -= pay;
    }

    for (const id of order) {
      if (pool <= 0) break;
      const d = working.find((x) => x.id === id);
      if (!d || d.balance <= 0) continue;
      const pay = Math.min(pool, d.balance);
      d.balance -= pay;
      pool -= pay;
    }

    for (const d of working) {
      if (d.balance <= 0.01 && payoffMonth[d.id] === undefined) {
        payoffMonth[d.id] = month;
        d.balance = 0;
      }
    }
  }

  const neverPaidOff = month >= MAX_MONTHS && working.some((d) => d.balance > 0);

  return {
    months: neverPaidOff ? null : month,
    totalInterest: Math.round(totalInterest),
    payoffOrder: order,
    payoffMonth,
    neverPaidOff,
  };
}

export function compareDebtStrategies({ debts, extraMonthly }) {
  const validDebts = debts.filter((d) => d.balance > 0 && d.minPayment > 0);
  if (validDebts.length === 0) {
    return null;
  }

  const snowball = simulate(validDebts, extraMonthly, (a, b) => a.balance - b.balance);
  const avalanche = simulate(validDebts, extraMonthly, (a, b) => b.rate - a.rate);

  const totalMinPayments = validDebts.reduce((sum, d) => sum + d.minPayment, 0);
  const totalBalance = validDebts.reduce((sum, d) => sum + d.balance, 0);

  return {
    snowball,
    avalanche,
    interestSaved:
      snowball.neverPaidOff || avalanche.neverPaidOff
        ? null
        : Math.round(snowball.totalInterest - avalanche.totalInterest),
    monthsSaved: snowball.neverPaidOff || avalanche.neverPaidOff ? null : snowball.months - avalanche.months,
    totalMinPayments,
    totalBalance,
  };
}
