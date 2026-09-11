export const SCORE_LEVELS = [
  {
    min: 0,
    max: 20,
    level: "Poor",
    color: "red",
    description: "Your financial foundation needs immediate attention.",
  },
  {
    min: 21,
    max: 40,
    level: "Needs Attention",
    color: "orange",
    description: "You're making progress, but several key areas need improvement.",
  },
  {
    min: 41,
    max: 60,
    level: "Fair",
    color: "yellow",
    description: "You have a decent financial foundation with room to grow.",
  },
  {
    min: 61,
    max: 80,
    level: "Good",
    color: "blue",
    description: "Your finances are healthy and moving in the right direction.",
  },
  {
    min: 81,
    max: 100,
    level: "Excellent",
    color: "emerald",
    description: "You have built a strong and well-balanced financial foundation.",
  },
];

export function getScoreLevel(score) {
  return (
    SCORE_LEVELS.find(
      (level) => score >= level.min && score <= level.max
    ) || SCORE_LEVELS[0]
  );
}