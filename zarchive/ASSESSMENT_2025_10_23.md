# Calculator Assessment - October 23, 2025

## Executive Summary
**YES - I have a clear path to accuracy.**

The calculator has all the necessary people and data. The issues are:
1. **3 people in wrong categories** (easy fix - move deal data)
2. **Sprint amounts in code are wrong** (easy fix - update hardcoded values)
3. **Manager calculations need verification** (need to trace Excel formulas)

## Current Status

### Goal
Excel SEPTEMBER SUMMARY D41 = **$97,539.31**

### People Count
- **Excel has**: 36 people
- **Calculator has**: 37 people (includes Scott Pennebaker who has $0 in Excel)
- **Missing from calculator**: 0 people with payouts (all 36 are in the calculator)

### Key Issues Found

#### Issue 1: Wrong Category Assignments
These 3 people are in **acqData** but Excel shows them as **DISPO**:

| Name | Currently | Should Be | Excel Payout | Impact |
|------|-----------|-----------|--------------|--------|
| Christian Flasch | ACQ | DISPO | $1,769.00 | High |
| Jack Webster | ACQ | DISPO | $937.26 | High |
| Yoseph Israel | ACQ | DISPO | $232.00 | Medium |

**Fix**: Move their deal arrays from `acqData` to `dispoData` in lines 1038-1045, 1063-1065, 1114-1116.

#### Issue 2: Wrong Sprint Amounts
Sprint bonuses are hardcoded but have wrong values. From Excel Sprint Winners sheet:

| Name | Calculator Has | Excel Shows | Line to Fix |
|------|----------------|-------------|-------------|
| Warren Smith | ? | $100 | Need to check sprint object |
| Christian Flasch | ? | $100 | Need to check sprint object |
| Dominick Mazliah | ? | $0 | Need to check sprint object |
| Jack Webster | ? | $0 | Need to check sprint object |
| Andrew Caceres | ? | $0 | Need to check sprint object |
| Yoseph Israel | ? | $0 | Need to check sprint object |
| Jarod Weaver | ? | $100 | Need to check sprint object |
| Kayla Watkins | ? | $100 | Need to check sprint object |
| Kirk Schaafsma | ? | $100 | Need to check sprint object |

**Note**: Need to find where sprints are hardcoded in calculator.

#### Issue 3: Kyle Singer Manual Adjustment
- Excel shows: $7,368.16
- Formula would give: $7,208.16
- Difference: $160 (one-time catch-up from last month)
- **Action**: DO NOT add this to calculator - it's a manual Excel adjustment only

## Path to Accuracy

### Step 1: Fix Category Assignments (15 minutes)
Move Christian Flasch, Jack Webster, Yoseph Israel from acqData to dispoData.

**Christian Flasch deals** (currently lines 1038-1045 in acqData):
- Need to verify these are his DISPO deals, not ACQ deals
- If wrong deals, need to look up correct DISPO deals from CSV

**Jack Webster** (currently line 1063-1065):
- $41,863 single deal marked as flat-fee
- Need to verify this is correct

**Yoseph Israel** (currently line 1114-1116):
- $11,600 single deal
- Need to verify this is correct

### Step 2: Find and Fix Sprint Amounts (10 minutes)
1. Search calculator for sprint bonus object/array
2. Update values to match Excel Sprint Winners sheet exactly
3. Verify total sprints = $4,500

### Step 3: Verify Manager Calculations (30 minutes)
Calculator has manager data at lines 1225+. Need to:
1. Read Excel formulas for each manager type
2. Verify calculator logic matches Excel
3. Specific concerns:
   - Patrick Solomon: Type 1, $6,043.56
   - Rob Gorski: Type 1, $3,672.31
   - Luis Guzman: Type 2, $8,780.43
   - Shon Yoshida: Type 2, $7,513.40
   - Devin Buford: Type 2, $1,900.30
   - Joe Haupt: Type 2, $8,452.81
   - Maegan Grace: Type 2 or 3?, $3,260.74

### Step 4: Test and Validate (15 minutes)
1. Open calculator in browser
2. Select all agents
3. Compare line-by-line to Excel
4. Verify total = $97,539.31

## Confidence Level
**High (8/10)**

The issues are well-defined and fixable. The main risk is:
1. **Deal data accuracy**: If Christian/Jack/Yoseph have wrong deal amounts, need to look up correct data from CSV
2. **Manager formula complexity**: Manager calculations may have nuances not yet discovered

## Next Actions
1. Locate sprint bonus code in calculator
2. Read Christian Flasch, Jack Webster, Yoseph Israel deals from CSV to verify GP amounts
3. Begin Step 1 fixes once verified
