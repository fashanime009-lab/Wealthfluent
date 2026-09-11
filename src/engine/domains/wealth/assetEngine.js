import { getProfile } from "@/store/profileStore";

export function buildAssets() {
  const assets = getProfile().assets;

  const total =
  assets.cash +
  assets.savings +
  assets.investments +
  assets.retirement +
  assets.property +
  assets.vehicle +
  assets.business +
  assets.other;

  return {
    data: {
      ...assets,
      total,
    },

    insights: [],

    recommendations: [],

    alerts: [],

    score: null,

    metadata: {
      lastUpdated: null,
    },
  };
}