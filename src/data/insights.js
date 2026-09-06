// Each card's numbers are computed with the reader's own currency setting
// (via the `fmt` formatter passed in from InsightsPage) rather than being
// hardcoded — a visitor anywhere in the world sees amounts in their own
// currency, not a fixed one baked into the copy.
export const INSIGHT_CARDS = [
  {
    id: "early-sip",
    stat: () => "3.4x",
    headline: () => "Starting a SIP at 25 instead of 35 can mean 3.4x more by retirement",
    detail: (fmt) =>
      `${fmt(200)}/month at 12% annual return, invested from age 25 to 60, grows to roughly ${fmt(
        1_040_000
      )}. Start the same amount at 35 instead, and you reach 60 with about ${fmt(
        304_000
      )} — less than a third, despite investing for just 10 fewer years.`,
    tool: { label: "Try it with your numbers", to: "/sip-calculator" },
  },
  {
    id: "rule-of-72",
    stat: () => "72 ÷ rate",
    headline: () => "The Rule of 72 estimates how fast your money doubles",
    detail: () =>
      "Divide 72 by your expected annual return to estimate the years to double your investment. At 12% annual return, money roughly doubles every 6 years. At 6%, it takes about 12 years. It's a rough estimate, not exact — but useful for quick mental math.",
    tool: { label: "Try the SIP Calculator", to: "/sip-calculator" },
  },
  {
    id: "inflation-erosion",
    stat: (fmt) => fmt(558),
    headline: (fmt) => `${fmt(1000)} today is worth about ${fmt(558)} in 10 years, after 6% inflation`,
    detail: () =>
      "Inflation doesn't reduce the number in your account — it reduces what that number can buy. Cash and low-interest savings quietly lose real value every year they sit idle, which is the core argument for keeping long-term savings in inflation-beating investments.",
    tool: { label: "Try the Retirement Calculator", to: "/retirement-calculator" },
  },
  {
    id: "debt-crossover",
    stat: () => "12–15%",
    headline: () => "If your debt rate beats your realistic investment return, pay the debt first",
    detail: () =>
      "Paying off debt is a guaranteed return equal to its interest rate. Investing is not guaranteed. Above roughly 12–15% interest, debt payoff usually beats investing on pure expected value — which is why high-interest card debt should almost always be paid off before investing elsewhere.",
    tool: { label: "Run your own numbers", to: "/verdict/debt-vs-invest" },
  },
  {
    id: "emergency-fund-gap",
    stat: () => "3–6 months",
    headline: () => "Most financial plans fail from cash-flow shocks, not bad investments",
    detail: () =>
      "A job loss or medical emergency without a cash buffer often forces selling investments at the worst possible time — exactly when markets tend to be down too. An emergency fund isn't about returns; it's what keeps a single bad month from becoming a multi-year setback.",
    tool: { label: "Check your coverage", to: "/emergency-fund-calculator" },
  },
  {
    id: "rent-vs-buy-yield",
    stat: () => "Rental yield",
    headline: () => "Low rental yields often quietly favor renting and investing the difference",
    detail: () =>
      "In many major cities worldwide, annual rent is well under 3–4% of a home's purchase price — meaning owning ties up capital that could otherwise be invested at a meaningfully higher return. Whether buying still wins depends on local appreciation and your time horizon — worth actually running the numbers rather than assuming.",
    tool: { label: "Run the Rent vs Buy verdict", to: "/verdict/rent-vs-buy" },
  },
];
