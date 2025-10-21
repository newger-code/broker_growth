/**
 * Commission Intelligence Platform - Tier Structures
 * Reference data for all commission tiers
 */

const TierStructures = {
  acq: {
    personal: [
      { tier: 1, min: 0, max: 25000, rate: 0.04 },
      { tier: 2, min: 25001, max: 50000, rate: 0.06 },
      { tier: 3, min: 50001, max: 100000, rate: 0.08 },
      { tier: 4, min: 100001, max: Infinity, rate: 0.10 }
    ],
    team: [
      { tier: 1, min: 0, max: 50000, rate: 0.01 },
      { tier: 2, min: 50000, max: 100000, rate: 0.02 },
      { tier: 3, min: 100000, max: Infinity, rate: 0.03 }
    ]
  },

  dispo: {
    personal: [
      { tier: 1, min: 0, max: 25000, offRate: 0.02, ffRate: 0.0133 },
      { tier: 2, min: 25000, max: 50000, offRate: 0.03, ffRate: 0.02 },
      { tier: 3, min: 50000, max: 60000, offRate: 0.04, ffRate: 0.0267 },
      { tier: 4, min: 60000, max: 75000, offRate: 0.05, ffRate: 0.0333 },
      { tier: 5, min: 75000, max: 100000, offRate: 0.06, ffRate: 0.04 },
      { tier: 6, min: 100000, max: 125000, offRate: 0.07, ffRate: 0.0467 },
      { tier: 7, min: 125000, max: 150000, offRate: 0.08, ffRate: 0.0533 },
      { tier: 8, min: 150000, max: 175000, offRate: 0.09, ffRate: 0.06 },
      { tier: 9, min: 175000, max: Infinity, offRate: 0.10, ffRate: 0.0667 }
    ],
    team: [
      { tier: 1, min: 0, max: 50000, offRate: 0.015, ffRate: 0.010 },
      { tier: 2, min: 50000, max: 100000, offRate: 0.020, ffRate: 0.015 },
      { tier: 3, min: 100000, max: Infinity, offRate: 0.025, ffRate: 0.020 }
    ]
  }
};
