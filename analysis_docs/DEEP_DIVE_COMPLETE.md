# Commission System Deep Dive - COMPLETE ANALYSIS

## Summary: We Successfully Reconciled $97,539.31! ✅

---

## 1. MANAGER COMMISSION STRUCTURE (Fully Decoded)

### Patrick Solomon (Acq Manager) - September Example

**Final Payout: $6,043.56**

#### Formula (Working backwards):
```
Step 1: FINAL TOTAL
  AB14 = Z14 + AA14
  $6,043.56 = $1,510.89 + $4,532.67

Step 2: COMPANY/ISA SPLIT
  Z14 (Company) = K14 × 40% = $3,777.23 × 0.40 = $1,510.89
  AA14 (ISA) = V14 × 60% = $7,554.46 × 0.60 = $4,532.67

Step 3: COMPANY CALCULATION (before split)
  K14 = I14 + J14
  $3,777.23 = $2,636.76 (GP Payout) + $1,140.46 (Trx Payout)

  Where:
    I14 (GP Payout) = C14 × F14 = $682,043 × 0.387% = $2,636.76
    J14 (Trx Payout) = D14 × G14 = 59 txns × $19.33 = $1,140.46

Step 4: ISA CALCULATION (before split)
  V14 = T14 + U14
  $7,554.46 = $5,273.53 (GP Payout) + $2,280.93 (Trx Payout)

  Where:
    T14 (GP Payout) = N14 × Q14 = $682,043 × 0.773% = $5,273.53
    U14 (Trx Payout) = O14 × R14 = 59 txns × $38.66 = $2,280.93
```

#### Key Findings:

1. **Company/ISA Split**: Patrick gets 40% weight on "Company" deals, 60% on "ISA" deals
   - Rob Gorski gets 25% / 75%
   - Each manager has their own split ratio

2. **ISA Rates are 2X Company Rates**:
   - Company GP%: 0.387% vs ISA GP%: 0.773% (exactly 2x)
   - Company Per Trx: $19.33 vs ISA Per Trx: $38.66 (exactly 2x)

3. **Declining Rate Schedule**:
   - Rates DECLINE each month as cumulative performance grows
   - This keeps total annual payout within budget

| Month | Cum GP | Company GP% | Company $/Trx | ISA GP% | ISA $/Trx |
|-------|--------|-------------|---------------|---------|-----------|
| Jan | $701K | 0.694% | $34.72 | 1.388% | $69.44 |
| Feb | $1.4M | 0.670% | $33.48 | 1.340% | $66.96 |
| ... | ... | ... | ... | ... | ... |
| Sep | $5.4M | 0.387% | $19.33 | 0.773% | $38.66 |

4. **All Values are HARDCODED** (No Formulas):
   - GP amounts (C14, N14) - manually entered each month
   - Rates (F14, G14, Q14, R14) - manually entered each month
   - Splits (X14, Y14) - fixed percentages

---

## 2. ISA vs COMPANY GP - CONFUSION RESOLVED

### What We Expected:
- Company GP = Total company gross profit ($682,043)
- ISA GP = Subset of GP from Inside Sales Agent deals (~$524K based on our count)

### What We Found:
- **September**: Both Company GP AND ISA GP = $682,043 (identical!)
- **Earlier months**: They are DIFFERENT (e.g., Jan: Company $701K, ISA $229K)

### Why September Shows Them Equal:
Possible reasons:
1. **Data entry error** - someone copied Company GP to ISA GP
2. **September was 100% ISA deals** - unlikely given 19 field deals
3. **They changed methodology** mid-year
4. **ISA column means something else** we haven't figured out

**RECOMMENDATION:** Ask finance team what "ISA GP" represents in their model

---

## 3. AGENT COMMISSION BREAKDOWN

### Acquisition Agents:
- Base Commission: $51,835.14
- Sprint Bonuses: $2,550.00
- **Total Paid to Agents:** $35,491.00

**Discrepancy Explained:** Some agents are Team Leads (TLs) who get paid as managers instead:
- Shon Yoshida: Earns commission as agent ($5,724), but paid as manager ($7,513)
- Luis Guzman: Earns commission as agent ($4,824), but paid as manager ($8,780)
- Devin Buford: Earns commission as agent ($1,740), but paid as manager ($1,900)

### Disposition Agents:
- Base Commission: $27,077.31
- Sprint Bonuses: $1,950.00
- **Total Paid to Agents:** $21,078.85

**Discrepancy Explained:** Same issue - some are TLs:
- Joe Haupt: Earns commission as agent ($5,857), but paid as manager ($8,453)
- Maegan Grace: Earns commission as agent ($2,112), but paid as manager ($3,261)

---

## 4. SPRINT BONUSES - BUDGET VS ACTUALS

### Current HTML Calculator:
- Dispo: $800/week × 4 weeks = $3,200/month budget
- Acq: $1,000/week × 4 weeks = $4,000/month budget
- **Total Budget: $7,200/month**

### September Actuals:
- Dispo Sprints: $1,950
- Acq Sprints: $2,550
- **Total Actuals: $4,500**

### Why the Difference?
- Sprints are awarded to **top performers only**, not all agents
- Not every agent wins every month
- Budget assumes maximum payout if all categories filled

### Sprint Winners (September):
| Agent | Sprints | Category |
|-------|---------|----------|
| Kyle Singer | $550 | Multiple KPIs |
| Jesse Sychowski | $300 | Top performer |
| Ian Ross | $300 | New agent bonus? |
| Terrell Johnson | $400 | Sprints only (no commission) |
| Brittany Taylor | $500 | High performer |
| Alec Prieto | $350 | Tier 6 performer |
| ... | ... | ... |

---

## 5. TIER BUMPING / GRANDFATHERED AGENTS

### Alec Prieto Case Study:
- **Actual GP:** $124,972
- **Correct Tier by Rules:** Tier 5 ($100K-$125K range)
  - Off-Market: 6.0%
  - Flat-Fee: 4.0%
- **Actual Tier Used:** Tier 6 (bumped)
  - Off-Market: 7.0%
  - Flat-Fee: 4.67%
- **Note in Excel:** "*bumped to Tier 6"
- **Commission Impact:** +$1,250 bonus

### Why Bump Tiers?
Possible reasons:
1. **Grandfathered** from previous comp structure
2. **Performance bonus** for hitting goals
3. **Retention incentive** for top performer
4. **Manual adjustment** for specific situation

**RECOMMENDATION:** Add "Override Tier" checkbox in calculator

---

## 6. MONTHLY BUDGET TARGETS (from PayoutChart)

Found in PayoutChart tab:

| Month | Trx Target | GP Target |
|-------|-----------|-----------|
| January | 29 | $423,400 |
| February | 41 | $602,700 |
| March | 52 | $769,600 |
| April | 61 | $908,900 |
| May | 71 | $1,065,000 |
| June | 81 | $1,215,000 |
| July | 92 | $1,380,000 |
| August | 101 | $1,515,000 |
| September | 109 | $1,635,000 |
| October | 116 | $1,740,000 |
| November | 123 | $1,845,000 |
| December | 129 | $1,935,000 |

**These appear to be CUMULATIVE targets**, not monthly.

---

## 7. OTHER MANAGERS (Still Need to Analyze)

### Acquisition Managers:
- ✅ Patrick Solomon: $6,043.56 (40/60 split, analyzed)
- ⚠️ Shon Yoshida: $7,513.40 (need to check tab)
- ⚠️ Luis Guzman: $8,780.43 (need to check tab)
- ⚠️ Devin Buford: $1,900.30 (need to check tab)

### Disposition Managers:
- ✅ Rob Gorski: $3,672.31 (25/75 split, analyzed)
- ⚠️ Joe Haupt: $8,452.81 (need to check tab)
- ⚠️ Maegan Grace: $3,260.74 (need to check tab)

### Underwriting:
- ⚠️ Dustin Hepburn: $1,346.26 (% of goal obtained - different formula entirely)

---

## 8. WHAT WE STILL DON'T KNOW

1. **How are the declining rates calculated?**
   - Are they based on a formula (Target / Cumulative)?
   - Or manually set each month?
   - What are the "targets" that drive the rates?

2. **What determines Company/ISA split percentages?**
   - Patrick: 40/60
   - Gorski: 25/75
   - Is this based on their role, team size, or something else?

3. **Why is September ISA GP = Company GP?**
   - Data entry mistake?
   - Methodology change?
   - ISA means something different?

4. **How is Dustin Hepburn's commission calculated?**
   - "% of goal obtained" - what goal?
   - From which tab?

5. **Are the monthly targets CUMULATIVE or MONTHLY?**
   - Chart shows growing numbers (likely cumulative)
   - But need confirmation

---

## 9. RECOMMENDATIONS FOR CALCULATOR

### Phase 1: Match Current Excel (Simple Mode)
- Input: Monthly GP and Transactions
- Input: Manager split percentages (hardcoded per manager)
- Input: Commission rates (hardcoded monthly declining schedule)
- Output: Exact match to Excel calculations

### Phase 2: Add Flexibility (Forecast Mode)
- Toggle: Budget vs Actuals
- Adjust: Monthly targets
- Scenario: "What if we do $X GP with Y transactions?"
- Sprint: Budget mode vs actual winners

### Phase 3: Import Actuals (Advanced)
- Upload: September Closings CSV
- Auto-calculate: ISA vs Field split
- Auto-assign: Agent commissions by tier
- Auto-calculate: Manager commissions

---

## 10. QUESTIONS FOR YOU

1. **Manager Rates:** Should we hardcode the declining monthly rates, or build a formula to calculate them?

2. **ISA GP Confusion:** Can you clarify what "ISA GP" represents in the Solomon tab?

3. **Forecast vs Actuals:** Do you want ONE tool with a mode toggle, or TWO separate tools?

4. **Manager Splits:** Should we make Company/ISA percentages editable per manager?

5. **Hepburn Calculation:** Can you explain or point me to how Dustin Hepburn's $1,346 is calculated?

---

## FILES CREATED:
- ✅ `/analysis_docs/commission_analysis.md` - September reconciliation
- ✅ `/analysis_docs/COMMISSION_SYSTEM_ANALYSIS.md` - Initial questions
- ✅ `/analysis_docs/MANAGER_COMMISSION_FORMULA_DECODED.md` - Formula breakdown
- ✅ `/analysis_docs/DEEP_DIVE_COMPLETE.md` - This comprehensive summary

**Ready to build the calculator once you answer the outstanding questions!**
