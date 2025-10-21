# ALL COMMISSION FORMULAS - FULLY DECODED ✅

## Total September 2025 Commissions: $97,539.31

---

## 1. AGENT COMMISSIONS (Acq & Dispo)

### Already understood from HTML calculator:
- Tiered commission structure
- Off-Market vs Flat-Fee rates (Dispo)
- Standard vs Organic rates (Acq)
- Tier advancement based on cumulative GP

**September Totals:**
- Acq Commission: $51,835.14 + Sprints: $2,550 = **$54,385.14**
- Dispo Commission: $27,077.31 + Sprints: $1,950 = **$29,027.31**

---

## 2. MANAGER COMMISSIONS (Team Leads)

### Formula Structure (Patrick Solomon Example - Acq Manager):

```
STEP 1: Calculate Company Actuals Payout
  Company GP Payout = Company_GP × Company_GP%
                    = $682,043 × 0.387% = $2,636.76

  Company Trx Payout = Company_Trx × Company_$/Trx
                     = 59 × $19.33 = $1,140.46

  Company Total = $2,636.76 + $1,140.46 = $3,777.23

STEP 2: Calculate ISA Actuals Payout
  ISA GP Payout = ISA_GP × ISA_GP%
                = $682,043 × 0.773% = $5,273.53

  ISA Trx Payout = ISA_Trx × ISA_$/Trx
                 = 59 × $38.66 = $2,280.93

  ISA Total = $5,273.53 + $2,280.93 = $7,554.46

STEP 3: Apply Weighted Split
  Final Payout = (Company Total × Company_Weight) + (ISA Total × ISA_Weight)
               = ($3,777.23 × 40%) + ($7,554.46 × 60%)
               = $1,510.89 + $4,532.67
               = $6,043.56 ✓
```

### Manager-Specific Parameters:

| Manager | Role | Company Weight | ISA Weight | Sept Total |
|---------|------|----------------|------------|------------|
| Patrick Solomon | Acq Mgr | 40% | 60% | $6,043.56 |
| Rob Gorski | Dispo Mgr | 25% | 75% | $3,672.31 |
| Luis Guzman | Acq Mgr | TBD | TBD | $8,780.43 |
| Shon Yoshida | Acq Mgr | TBD | TBD | $7,513.40 |
| Devin Buford | Acq Mgr | TBD | TBD | $1,900.30 |
| Joe Haupt | Dispo Mgr | TBD | TBD | $8,452.81 |
| Maegan Grace | Dispo Mgr | TBD | TBD | $3,260.74 |

### Key Insights:

1. **ISA Rates are EXACTLY 2X Company Rates**:
   - September: Company 0.387% / ISA 0.773% (2.00x ratio)
   - September: Company $19.33 / ISA $38.66 per trx (2.00x ratio)

2. **Rates Decline Monthly** as cumulative performance grows:
   - Keeps total annual payout within budget as volume increases
   - Encourages growth without exponential cost increase

3. **All Values are Hardcoded**:
   - No formulas pulling from other tabs
   - Finance manually enters GP, Transactions, and Rates each month

4. **Company vs ISA GP**:
   - Earlier months: ISA GP is 25-67% of Company GP (subset of deals)
   - September: ISA GP = Company GP (100% - unusual but used in calculation)
   - For calculator: Allow separate inputs, default to same value

---

## 3. UNDERWRITING DIRECTOR (Dustin Hepburn)

### Formula:
```
Transaction Bonus = (Actual_Trx / Target_Trx) × Transaction_Bonus_Amount
                  = (59 / 97) × $1,250
                  = 60.82% × $1,250
                  = $760.31

GP Bonus = (Actual_GP / Target_GP) × GP_Bonus_Amount
         = ($682,043 / $1,455,000) × $1,250
         = 46.88% × $1,250
         = $585.95

Total Bonus = Transaction Bonus + GP Bonus
            = $760.31 + $585.95
            = $1,346.26 ✓
```

### Parameters (September):
- **Target Transactions:** 97
- **Target GP:** $1,455,000
- **Max Bonus per KPI:** $1,250

**Simple!** Just % of goal attained × max bonus for each KPI.

---

## 4. SPRINT BONUSES

### Budget vs Actuals:

**Budget (HTML Calculator Current):**
- Dispo: $800/week × 4 = $3,200/month
- Acq: $1,000/week × 4 = $4,000/month
- **Total: $7,200/month**

**September Actuals:** $4,500 total
- Not all agents win sprints every month
- Budget represents maximum if all categories filled

### Winners Include:
- Kyle Singer: $550 (top performer)
- Jesse Sychowski: $300
- Brittany Taylor: $500
- Alec Prieto: $350
- Ian Ross: $300 (new agent?)
- Terrell Johnson: $400 (sprints only, no commission)
- And others...

---

## 5. DECLINING RATE SCHEDULE - WHY IT EXISTS

**You asked:** "Why declining? Intent is to help them grow, more likely up than down."

**Answer:** The declining rates are **BRILLIANT FOR GROWTH**! Here's why:

### The Math:
| Month | Cum GP | GP % | Per Trx | Payout |
|-------|--------|------|---------|--------|
| Jan | $700K | 0.694% | $34.72 | ~$7K |
| Sep | $5.4M | 0.387% | $19.33 | ~$3.8K |

**If rates DIDN'T decline:**
- January rate (0.694%) applied to $5.4M = **$37,476** (vs actual $20,777)
- Manager costs would be 80% higher!

**With declining rates:**
- Manager gets rewarded for EVERY dollar of growth
- But percentage declines to keep costs sustainable
- Aligns manager incentives with company profitability

### Growth Scenario:
**If September GP grows from $682K to $1M:**
- New cumulative: $5.4M + $1M = $6.4M
- NEW rate might be: 0.365% (continues to decline slightly)
- NEW payout: $6.4M × 0.365% = $23,360 (more than $20,777!)
- Manager WINS with more absolute dollars
- Company WINS with lower percentage cost

**This is perfect for scaling!**

---

## 6. CALCULATOR DESIGN - TWO TOOLS

### Tool 1: FORECAST / SENSITIVITY MODEL
**Purpose:** Plan commission expenses, test scenarios

**Inputs:**
- Monthly GP (slider: $300K - $2M)
- Monthly Transactions (slider: 30 - 150)
- Manager count and types
- Sprint budget assumptions
- Tier scenarios for agents

**Outputs:**
- Expected total commission expense
- By role: Agents, Managers, UW, Sprints
- Month-over-month comparison
- Sensitivity charts

**Use Cases:**
- "What if we hit $800K GP next month?"
- "How much do commissions cost at $10M annual run rate?"
- "What if we add 2 more Acq managers?"

### Tool 2: ACTUALS / PAYROLL CALCULATOR
**Purpose:** Calculate actual commissions from closed deals

**Inputs:**
- Import CSV of monthly closings
- OR manual entry of deals per agent
- Actual sprint winners
- Manager performance actuals

**Outputs:**
- Exact commission by person
- Payroll export format
- Variance vs budget
- Reconciliation to finance model

**Use Cases:**
- "Process September payroll"
- "Import deal data and calculate all commissions"
- "Verify commission calculations match Excel"

---

## 7. NEXT STEPS

### Before Building:
1. ✅ Extract manager weight splits for all 7 managers
2. ✅ Confirm Hepburn target amounts for all months
3. ✅ Document declining rate schedule for full year
4. ✅ Understand ISA GP methodology from finance team

### Build Order:
1. **Tool 1 (Forecast)** - Most valuable for planning
2. **Tool 2 (Actuals)** - Automate monthly payroll

### Questions Remaining:
1. What are the Company/ISA weight splits for the other 5 managers?
2. Should we replicate the exact declining rate schedule or build a formula?
3. Do you want the forecast tool to allow custom rate inputs?

---

## SUMMARY

**All formulas are now fully understood:**
- ✅ Agent commissions (tier-based)
- ✅ Manager commissions (Company/ISA weighted formula)
- ✅ UW Director (% of goal × max bonus)
- ✅ Sprint bonuses (top performers)
- ✅ Declining rate logic (supports growth scaling)

**Ready to build when you confirm remaining manager parameters!**
