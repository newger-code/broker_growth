/**
 * Commission Intelligence Platform - Calculation Engine
 * All commission formulas for agents and managers
 */

const Calculations = {
  /**
   * Calculate Acq agent commission (blended rate)
   */
  calculateAcqCommission(gp) {
    const tier = this.getAcqTier(gp);
    return gp * tier.rate;
  },

  /**
   * Get Acq tier for given GP (blended rates)
   */
  getAcqTier(gp) {
    if (gp >= 100001) return { tier: 4, rate: 0.10, min: 100001, max: Infinity };
    if (gp >= 50001) return { tier: 3, rate: 0.08, min: 50001, max: 100000 };
    if (gp >= 25001) return { tier: 2, rate: 0.06, min: 25001, max: 50000 };
    return { tier: 1, rate: 0.04, min: 0, max: 25000 };
  },

  /**
   * Calculate Dispo agent commission (progressive tiers)
   */
  calculateDispoCommission(offMarketGP, flatFeeGP) {
    const tier = this.getDispoTier(offMarketGP + flatFeeGP);
    const offMarketRate = tier.offRate;
    const flatFeeRate = tier.ffRate;

    return (offMarketGP * offMarketRate) + (flatFeeGP * flatFeeRate);
  },

  /**
   * Get Dispo tier for given GP (progressive rates)
   */
  getDispoTier(totalGP) {
    if (totalGP >= 175000) return { tier: 9, offRate: 0.10, ffRate: 0.0667, min: 175000 };
    if (totalGP >= 150000) return { tier: 8, offRate: 0.09, ffRate: 0.06, min: 150000 };
    if (totalGP >= 125000) return { tier: 7, offRate: 0.08, ffRate: 0.0533, min: 125000 };
    if (totalGP >= 100000) return { tier: 6, offRate: 0.07, ffRate: 0.0467, min: 100000 };
    if (totalGP >= 75000) return { tier: 5, offRate: 0.06, ffRate: 0.04, min: 75000 };
    if (totalGP >= 60000) return { tier: 4, offRate: 0.05, ffRate: 0.0333, min: 60000 };
    if (totalGP >= 50000) return { tier: 3, offRate: 0.04, ffRate: 0.0267, min: 50000 };
    if (totalGP >= 25000) return { tier: 2, offRate: 0.03, ffRate: 0.02, min: 25000 };
    return { tier: 1, offRate: 0.02, ffRate: 0.0133, min: 0 };
  },

  /**
   * Calculate Type 1 manager commission (Company/ISA split)
   */
  calculateType1Manager(companyGP, companyTrx, isaGP, isaTrx, companyRates, isaRates, weights) {
    const companyPayout = (companyGP * companyRates.gp) + (companyTrx * companyRates.trx);
    const isaPayout = (isaGP * isaRates.gp) + (isaTrx * isaRates.trx);

    return (companyPayout * weights.company) + (isaPayout * weights.team);
  },

  /**
   * Calculate Type 2 manager commission (Agent + Team)
   * For Acq managers (blended rates)
   */
  calculateType2AcqManager(personalGP, teamGP) {
    const personalTier = this.getAcqTier(personalGP);
    const teamTier = this.getAcqTeamTier(teamGP);

    const personalCommission = personalGP * personalTier.rate;
    const teamCommission = teamGP * teamTier.rate;

    return personalCommission + teamCommission;
  },

  /**
   * Get Acq team override tier (lower rates)
   */
  getAcqTeamTier(teamGP) {
    if (teamGP >= 100000) return { tier: 3, rate: 0.03, min: 100000 };
    if (teamGP >= 50000) return { tier: 2, rate: 0.02, min: 50000 };
    return { tier: 1, rate: 0.01, min: 0 };
  },

  /**
   * Calculate Type 2 manager commission (Agent + Team)
   * For Dispo managers (progressive tiers)
   */
  calculateType2DispoManager(personalOffGP, personalFfGP, teamOffGP, teamFfGP) {
    // Personal commission uses regular dispo tiers
    const personalCommission = this.calculateDispoCommission(personalOffGP, personalFfGP);

    // Team override uses lower rates
    const teamTier = this.getDispoTeamTier(teamOffGP + teamFfGP);
    const teamCommission = (teamOffGP * teamTier.offRate) + (teamFfGP * teamTier.ffRate);

    return personalCommission + teamCommission;
  },

  /**
   * Get Dispo team override tier (lower rates)
   */
  getDispoTeamTier(teamGP) {
    if (teamGP >= 100000) return { tier: 3, offRate: 0.025, ffRate: 0.020, min: 100000 };
    if (teamGP >= 50000) return { tier: 2, offRate: 0.020, ffRate: 0.015, min: 50000 };
    return { tier: 1, offRate: 0.015, ffRate: 0.010, min: 0 };
  },

  /**
   * Calculate Type 3 manager commission (% of goal)
   */
  calculateType3Manager(actualTrx, targetTrx, actualGP, targetGP, bonusCap = 1250) {
    const trxBonus = (actualTrx / targetTrx) * bonusCap;
    const gpBonus = (actualGP / targetGP) * bonusCap;

    return trxBonus + gpBonus;
  }
};
