// Investment Risk Analyzer — a real two-sided risk-profiling engine, not a
// single quiz score. Real financial planning practice separates two things
// that a simple "how much risk do you want" quiz conflates:
//
//   WILLINGNESS — how much volatility you say you're comfortable with
//   CAPACITY    — how much volatility your actual finances can absorb
//
// The final profile is the more conservative of the two. Someone with no
// emergency fund and high debt shouldn't get an aggressive recommendation
// just because they clicked "I'd buy more" on a market-drop question —
// they may not have the buffer to survive being wrong. This reconciliation
// (not the quiz itself) is the actual "intelligence" in this tool.

import { computeFinancialHealth } from "@/engine/financialProfile";

// Each question is scored 1-5 (low → high willingness to take risk).
// `weight` lets a few questions (loss reaction, time horizon) count for
// more than situational ones (liquidity needs) without a separate pass.
export const RISK_QUESTIONS = [
  {
    id: "horizon",
    question: "When will you actually need this money?",
    weight: 1.4,
    options: [
      { label: "Within 3 years", score: 1 },
      { label: "3–7 years", score: 2 },
      { label: "7–15 years", score: 4 },
      { label: "15+ years", score: 5 },
    ],
  },
  {
    id: "reaction",
    question: "Your portfolio drops 20% in a month. What do you actually do?",
    weight: 1.6,
    options: [
      { label: "Sell everything to stop the bleeding", score: 1 },
      { label: "Sell some, move to safer assets", score: 2 },
      { label: "Do nothing, wait it out", score: 4 },
      { label: "Buy more while it's down", score: 5 },
    ],
  },
  {
    id: "goal",
    question: "What's the primary job of this money?",
    weight: 1.2,
    options: [
      { label: "Preserve exactly what I have", score: 1 },
      { label: "Steady, dependable growth", score: 2 },
      { label: "Balanced growth with some ups and downs", score: 3 },
      { label: "Maximum long-term growth", score: 5 },
    ],
  },
  {
    id: "experience",
    question: "How much investing experience do you have?",
    weight: 0.8,
    options: [
      { label: "None — this would be new to me", score: 1 },
      { label: "Some — a few funds or stocks", score: 3 },
      { label: "Experienced — I've been through a downturn before", score: 4 },
      { label: "Very experienced — I actively manage a portfolio", score: 5 },
    ],
  },
  {
    id: "income",
    question: "How stable is your income?",
    weight: 1,
    options: [
      { label: "Unpredictable — freelance or commission-based", score: 1 },
      { label: "Stable, single source", score: 3 },
      { label: "Stable, multiple sources", score: 4 },
      { label: "Very stable and high relative to expenses", score: 5 },
    ],
  },
  {
    id: "dependents",
    question: "How many people financially depend on you?",
    weight: 1,
    options: [
      { label: "Several — I'm the main provider", score: 1 },
      { label: "A few", score: 2 },
      { label: "One or none, but shared expenses", score: 4 },
      { label: "None", score: 5 },
    ],
  },
  {
    id: "liquidity",
    question: "How likely are you to need to withdraw a large chunk in the next 2 years?",
    weight: 0.9,
    options: [
      { label: "Very likely — I have a known upcoming expense", score: 1 },
      { label: "Possible", score: 2 },
      { label: "Unlikely", score: 4 },
      { label: "Very unlikely", score: 5 },
    ],
  },
  {
    id: "temperament",
    question: "Which statement feels truer for you?",
    weight: 1.1,
    options: [
      { label: "I'd rather earn less and sleep well", score: 1 },
      { label: "A little uncertainty is fine for better returns", score: 3 },
      { label: "I can tolerate real swings for real growth", score: 4 },
      { label: "Volatility doesn't bother me at all", score: 5 },
    ],
  },
];

const TOTAL_WEIGHT = RISK_QUESTIONS.reduce((sum, q) => sum + q.weight, 0);

// answers: { [questionId]: score (1-5) }
export function scoreWillingness(answers) {
  const weightedSum = RISK_QUESTIONS.reduce((sum, q) => {
    const score = answers[q.id] ?? 3;
    return sum + score * q.weight;
  }, 0);
  // Normalize 1-5 weighted average to 0-100.
  const avg = weightedSum / TOTAL_WEIGHT;
  return Math.round(((avg - 1) / 4) * 100);
}

// Derives a 0-100 capacity score by reusing the site's real financial
// health rubric (see financialProfile.js) directly — real debt load and a
// thin emergency fund reduce how much risk someone can actually afford to
// take, independent of how they feel about it. Same score shown on the
// homepage's Financial Status widget, not a second parallel formula.
export function scoreCapacity(profile) {
  const health = computeFinancialHealth(profile);
  return health ? health.score : null;
}

const RISK_CATEGORIES = [
  { id: "conservative", label: "Conservative", min: 0 },
  { id: "moderate", label: "Moderate", min: 30 },
  { id: "balanced", label: "Balanced", min: 50 },
  { id: "growth", label: "Growth", min: 68 },
  { id: "aggressive", label: "Aggressive", min: 84 },
];

export function categoryForScore(score) {
  return [...RISK_CATEGORIES].reverse().find((c) => score >= c.min) ?? RISK_CATEGORIES[0];
}

// Illustrative model allocations — a static, documented mapping, not
// personalized advice. Percentages are round numbers by design; this is
// meant to show the shape of a sensible portfolio at each risk level; not
// to be a precise instruction.
export const ALLOCATION_MODELS = {
  conservative: { equity: 20, debt: 60, gold: 10, cash: 10, expectedReturn: "6–8%" },
  moderate: { equity: 40, debt: 45, gold: 10, cash: 5, expectedReturn: "8–10%" },
  balanced: { equity: 60, debt: 30, gold: 7, cash: 3, expectedReturn: "10–12%" },
  growth: { equity: 75, debt: 18, gold: 5, cash: 2, expectedReturn: "12–14%" },
  aggressive: { equity: 90, debt: 5, gold: 3, cash: 2, expectedReturn: "13–16%" },
};

// The actual reconciliation: never recommend more risk than capacity
// allows, even if willingness scores higher. If there's no financial
// profile to compute capacity from, willingness alone decides — clearly
// flagged as such in the result, not silently assumed.
export function computeRiskProfile({ answers, profile }) {
  const willingness = scoreWillingness(answers);
  const capacity = profile ? scoreCapacity(profile) : null;

  const willingnessCategory = categoryForScore(willingness);
  const capacityCategory = capacity !== null ? categoryForScore(capacity) : null;

  const finalScore = capacity !== null ? Math.min(willingness, capacity) : willingness;
  const finalCategory = categoryForScore(finalScore);

  const wasCapped = capacityCategory !== null && capacity < willingness;

  return {
    willingness,
    capacity,
    willingnessCategory,
    capacityCategory,
    finalScore,
    finalCategory,
    wasCapped,
    allocation: ALLOCATION_MODELS[finalCategory.id],
  };
}
