export function buildTimeline(workspace) {
  const timeline = [];

  const history = workspace?.history || {};

  // Net Worth
  (history.netWorth || []).forEach((item) => {
    timeline.push({
      id: `networth-${item.date}`,
      date: item.date,
      icon: "💰",
      title: "Net Worth Updated",
      description: item.summary || "",
      value: item.value,
    });
  });

  // Monthly Investment
  (history.monthlyInvestment || []).forEach((item) => {
    timeline.push({
      id: `sip-${item.date}`,
      date: item.date,
      icon: "📈",
      title: "Monthly Investment Updated",
      description: item.summary || "",
      value: item.value,
    });
  });

  // Financial Score
  (history.financialScore || []).forEach((item) => {
    timeline.push({
      id: `score-${item.date}`,
      date: item.date,
      icon: "🏆",
      title: "Financial Score Updated",
      description: item.summary || "",
      value: item.value,
    });
  });

  timeline.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return timeline.slice(0, 8);
}