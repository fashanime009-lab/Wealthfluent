// Median net worth of Canadian families by age of the main income earner,
// constant 2023 dollars.
//
// Source: Statistics Canada, Survey of Financial Security 2023, The Daily,
// 29 October 2024, Table 1 ("Total and median net worth by age of main
// income earner and family type").
// https://www150.statcan.gc.ca/n1/daily-quotidien/241029/t001a-eng.htm
//
// The survey runs every few years. When a new one is published, update the
// figures and SURVEY_YEAR together, and the guide page's tables with them.
export const CANADA_NET_WORTH_BY_AGE = {
  SURVEY_YEAR: 2023,
  allFamilies: 519_700,
  groups: [
    { id: "under-35", label: "Under 35", median: 159_100 },
    { id: "35-44", label: "35–44", median: 409_300 },
    { id: "45-54", label: "45–54", median: 675_800 },
    { id: "55-64", label: "55–64", median: 873_400 },
    { id: "65-plus", label: "65+", median: 738_900 },
  ],
};

/**
 * How a family's net worth (CAD) compares with the median for its age
 * group. Returns null for an unknown group or a non-numeric net worth.
 * Only medians are published, so no percentile is given. A negative net
 * worth has no meaningful ratio, so `times` is null then.
 */
export function compareWithCanadianMedian(groupId, netWorth) {
  const group = CANADA_NET_WORTH_BY_AGE.groups.find((g) => g.id === groupId);
  if (!group || !Number.isFinite(netWorth)) return null;
  const diff = netWorth - group.median;
  return {
    group,
    position: diff === 0 ? "at" : diff > 0 ? "above" : "below",
    difference: Math.abs(diff),
    times: netWorth < 0 ? null : netWorth / group.median,
  };
}
