# Commission System Analysis - Questions & Recommendations

## Executive Summary
Total September 2025 commissions: **$97,539.31**
- Agent commissions: $56,569.85 (58%)
- Manager commissions: $40,969.46 (42%)

---

## CRITICAL QUESTIONS TO ANSWER

### 1. **Sprint Bonuses** ✅ (PARTIALLY RESOLVED)
**Your Question:** "we had sprints in there just at 1000/week and 800/week already"

**What I Found:**
- HTML calculator shows: Dispo $800/week, Acq $1,000/week (4x per month = $3,200 + $4,000 = $7,200/month)
- Excel ACTUAL sprints for September: $1,950 (Dispo) + $2,550 (Acq) = **$4,500 total**

**Discrepancy:** The HTML calculator would show $7,200 if all agents got sprints, but actuals show $4,500.

**Questions Needed:**
- Are sprints awarded only to TOP performers (not all agents)?
- What are the criteria for winning sprints?
- Should the calculator show:
  - **Budget mode**: $7,200 (assumes all agents eligible)
  - **Actuals mode**: Enter actual sprint winners and amounts

---

### 2. **Tier Bumping / Grandfathered Agents** ⚠️ (NEEDS CLARIFICATION)
**Your Question:** "there might be a grandfathered older agent that gets paid different is also possible (Tier 6)"

**What I Found:**
- **Alec Prieto**: $124,972 GP = Should be Tier 5 (6% / 4%), but **bumped to Tier 6 (7% / 4.67%)**
- Excel note: "*bumped to Tier 6"
- This increased his commission by ~$1,250

**Questions Needed:**
- Is Alec grandfathered permanently at Tier 6?
- Are there other agents with special tier arrangements?
- Do we need a "manual tier override" feature in the calculator?

**Recommendation:**
Add a checkbox per agent: `☐ Override to Tier [dropdown]` with a note field

---

### 3. **Manager Commission Calculations** ⚠️ (COMPLEX - NEEDS EXPLANATION)

**What I Found:**
Manager payouts are calculated using **TWO components**:

#### **Component 1: Company Actuals**
- Based on TOTAL company GP and transactions
- Formula: `(GP × GP%) + (Transactions × Per-Trx Rate)`

Example - Patrick Solomon September:
- GP Payout: $682,043 × 0.39% = $2,636.76
- Trx Payout: 59 × $19.33 = $1,140.46
- **Subtotal: $3,777.23**

#### **Component 2: ISA Actuals**
- Based on a DIFFERENT GP and transaction count (unclear what this represents)
- Same formula but different rates (roughly 2x higher)

Example - Patrick Solomon September:
- GP: $682,043 (same number but might represent something different?)
- GP Payout: $682,043 × 0.77% = $5,273.53
- Trx Payout: 59 × $38.66 = $2,280.93
- **Subtotal: $7,554.46**

#### **Total Expected:** $3,777.23 + $7,554.46 = $11,331.69
#### **Actual in SEPTEMBER SUMMARY:** $6,043.56

**❓ CRITICAL QUESTIONS:**
1. **What is "ISA Actuals"?** Is this Inside Sales Agent-related deals?
2. **Why doesn't it sum?** The two components ($11,331) don't equal the summary ($6,043)
3. **What's the "Company: 0.25" note?** Does this mean some multiplier?
4. **Are manager rates declining each month?** (GP% goes from 0.69% in Jan to 0.39% in Sept)
   - Is this intentional (declining with volume)?
   - Or is it a percentage of something that changes?

**What We Need:**
- Clear explanation of manager commission formula
- Understand if it's:
  - Flat fee per month?
  - % of team GP?
  - % of team commissions?
  - % of company GP?
  - Combination of above?

---

### 4. **UI Improvements** ⚠️ (NEEDS DESIGN)
**Your Question:** "think the names need to be in a dropdown as multi-select instead of all visible all the time?"

**Current Design:**
- All agent names shown as checkboxes (14 Dispo + 13 Acq = 27 visible checkboxes)
- Good for: Quick overview, easy to select/deselect
- Bad for: Takes up lots of space, overwhelming with many agents

**Recommendation Options:**

**Option A: Keep Checkboxes BUT Collapsible**
```
▼ Dispo Agents (12 selected)  [Select All] [None]
  ☑ Alec Prieto (6 deals, $124K GP)
  ☑ Joe Haupt (7 deals, $117K GP)
  ☐ Ex-Rebuilt (1 deal, $7.5K GP)
  ...
```

**Option B: Multi-Select Dropdown**
```
Dispo Agents: [Alec Prieto, Joe Haupt, Devin Cooper... ▼] (12 selected)
```

**Option C: Tabs/Filters**
```
View: ○ All  ● Selected Only  ○ Top Performers

[Search agents...🔍]
```

**My Recommendation:** **Option A** - collapsible sections
- Keeps visibility of deal counts and GP
- Easy to scan and compare
- Can be collapsed when not needed

---

### 5. **Forecasting vs Actuals Mode** ⚠️ (NEEDS ARCHITECTURE DESIGN)
**Your Question:** "figure out how we apply this to future adjusting of the numbers and make forecasts on expenses. But also be able to use actuals as we get them in."

**Two Distinct Modes Needed:**

#### **MODE 1: FORECAST / BUDGET**
Purpose: Plan next month's expected commission expenses

**Inputs:**
- Forecasted GP (total or per agent)
- Forecasted # of deals
- Assumed tier levels (based on historical performance)
- Budget for sprints ($7,200? or actual expected?)
- Manager commission %

**Outputs:**
- Expected total commission expense
- By agent, by manager, by team

**Use Case:**
- "What will October commissions cost if we do $700K GP with 60 deals?"
- "What happens if Alec hits Tier 7?"

#### **MODE 2: ACTUALS**
Purpose: Calculate actual commissions owed based on real closed deals

**Inputs:**
- Import from CSV or manual entry
- Actual deals per agent
- Actual GP per deal
- Actual FF vs Off-Market designation
- Actual sprint winners
- Actual manager metrics

**Outputs:**
- Exact commission to pay each person
- Match to the Excel file results

**Use Case:**
- "It's October 1st, process September payroll"
- "Import September closings CSV and calculate commissions"

---

## RECOMMENDED NEXT STEPS

### **BEFORE CODING:**

1. **Clarify Manager Commissions** (HIGHEST PRIORITY)
   - Request detailed explanation of manager commission formula
   - Or give me access to one of the manager tab formulas (Excel formula text, not just values)
   - Without this, we can't build an accurate calculator

2. **Document Tier Exceptions**
   - List any agents with grandfathered/special tier arrangements
   - Decide if these should be configurable in the UI

3. **Define Sprint Logic**
   - Clarify sprint award criteria
   - Budget vs actual sprint amounts

4. **Choose Mode Strategy**
   - Do you want ONE tool with a toggle (Forecast/Actuals)?
   - Or TWO separate tools?
   - Or tabs within one tool?

### **AFTER DECISIONS:**

1. **Phase 1: Fix Current Calculator**
   - Add manager commission section (once formula is understood)
   - Add tier override capability
   - Add sprint actuals vs budget toggle

2. **Phase 2: Add Forecast Mode**
   - Sensitivity sliders for GP and deal count
   - Scenario comparison

3. **Phase 3: Import Actuals**
   - CSV import functionality
   - Auto-calculate from deal data

---

## QUESTIONS FOR YOU TO ANSWER:

1. **Manager Commissions:**
   - Can you explain in words how Patrick Solomon's $6,043.56 is calculated?
   - Or share the Excel formula from cell V14 in the Solomon tab?

2. **Sprints:**
   - Are sprints for top performers only, or budget for all?
   - What are the KPI categories that win sprints?

3. **Tier Bumping:**
   - Is Alec's Tier 6 permanent or just for September?
   - Any other special arrangements?

4. **Tool Design:**
   - Do you prefer collapsible checkboxes or dropdown multi-select?
   - One tool with modes, or separate forecast vs actuals tools?

5. **Data Entry:**
   - For actuals mode, will you always have a CSV to import?
   - Or do you need manual deal entry UI?

---

## FILES CREATED:
- ✅ `commission_calculator_BACKUP_20251020.html` - Backup of current version
- ✅ `commission_analysis.md` - Detailed breakdown of September actuals
- ✅ `COMMISSION_SYSTEM_ANALYSIS.md` - This file (questions & recommendations)

**DO NOT MODIFY CODE UNTIL QUESTIONS ANSWERED**
