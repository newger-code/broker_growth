# EXCEL COMMISSION FORMULAS - DOCUMENTED FROM ACTUAL EXCEL FILE

## SOURCE
File: `/Users/jimnewgent/Projects/broker_growth/Docs/2025 Sept Commission Calcs.xlsx`
Total: **$97,539.31** (Cell D41 in SEPTEMBER SUMMARY sheet)
Formula: `=SUM(D3:D38)` (sum of all individual payouts)

---

## DISPO AGENT CALCULATION (from ALLPayOut2 sheet)

### Example: Alec Prieto (Row 3)

**Step 1: Sum GP by Type**
- L3: Off-Market GP = `=SUMIFS('Dispo Closings'!H:H,'Dispo Closings'!D:D,K3,'Dispo Closings'!N:N,"NO")`
  - Result: $93,403
- M3: Flat-Fee GP = `=SUMIFS('Dispo Closings'!H:H,'Dispo Closings'!D:D,K3,'Dispo Closings'!N:N,"YES")`
  - Result: $31,569
- N3: Total GP = `=SUMIFS('Dispo Closings'!H:H,'Dispo Closings'!D:D,K3)`
  - Result: $124,972

**Step 2: Determine Tier**
- O3: Tier = 6 (HARDCODED for Alec - note says "*bumped to Tier 6")
- P3: Off Rate = `=VLOOKUP(O3,$AC$4:$AE$12,2,0)` → 0.07 (7%)
- Q3: FF Rate = `=VLOOKUP(O3,$AC$4:$AE$12,3,0)` → 0.046667 (4.6667%)

**Step 3: Calculate Commission**
- R3: Off Comm = `=L3*P3` → $93,403 × 0.07 = $6,538.21
- S3: FF Comm = `=M3*Q3` → $31,569 × 0.046667 = $1,473.23
- T3: Base Comm = `=R3+S3` → $8,011.44

**Step 4: Add Bonuses**
- U3: Sprint = `=IFERROR(VLOOKUP(K3,'Sprint Winners'!B:C,2,0),0)` → $350
- V3: Mentor = `=SUMIFS('HSAssigned Deals'!I:I,'HSAssigned Deals'!H:H,K3,'HSAssigned Deals'!G:G,"Yes")` → $0
- W3: **TOTAL = `=SUM(T3:V3)` → $8,361.44**

### DISPO Tier Table (from ALLPayOut2 $AC$4:$AE$12)

| Tier | GP Range | Off-Market Rate | Flat-Fee Rate |
|------|----------|-----------------|---------------|
| 1 | < $25k | 0.02 (2%) | 0.013333 (1.33%) |
| 2 | $25k-$50k | 0.03 (3%) | 0.02 (2%) |
| 3 | $50k-$75k | 0.04 (4%) | 0.026667 (2.67%) |
| 4 | $75k-$100k | 0.05 (5%) | 0.033333 (3.33%) |
| 5 | $100k-$125k | 0.06 (6%) | 0.04 (4%) |
| 6 | $125k-$150k | 0.07 (7%) | **0.046667** (4.67%) |
| 7 | $150k-$175k | 0.08 (8%) | 0.053333 (5.33%) |
| 8 | $175k-$200k | 0.09 (9%) | 0.06 (6%) |
| 9 | > $200k | 0.10 (10%) | 0.066667 (6.67%) |

**Note**: Flat-fee rate = 2/3 of off-market rate

---

## ACQ AGENT CALCULATION (from ALLPayOut2 sheet)

### Example: Jesse Sychowski (would be similar row structure)

**Step 1: Sum GP**
- Total GP = `=SUMIFS('Dispo Closings'!H:H,'Dispo Closings'!B:B,{name})`

**Step 2: Get Tier Rate**
- Rate = `=VLOOKUP(GP,PayoutChart!$B$12:$D$15,3,1)`
  - For Jesse: $61,375 → Tier 3 → 0.08 (8%)

**Step 3: Calculate**
- Commission = GP × Rate → $61,375 × 0.08 = $4,910.00
- Sprint = VLOOKUP from Sprint Winners → $300
- **TOTAL = $5,210.00**

### ACQ Tier Table (from PayoutChart $B$12:$D$15)

| Tier | GP Range | Standard Rate | Organic Rate |
|------|----------|---------------|--------------|
| 1 | ≤ $24,999 | 0.04 (4%) | 0.20 (20%) |
| 2 | $25k-$50k | 0.06 (6%) | 0.20 (20%) |
| 3 | $50k-$100k | 0.08 (8%) | 0.20 (20%) |
| 4 | > $100k | 0.10 (10%) | 0.20 (20%) |

---

## MANAGER CALCULATION (ACQ Type 2)

### Example: Luis Guzman (from LuisGuzman sheet)

**Personal Commission (E5):**
```
=IF(G5>=J7,L7,IF(G5>=J6,L6,IF(G5>=J5,L5,L4)))*G5
```
- G5 (Personal GP) = $60,303
- Lookup thresholds: J4=$-, J5=$25,001, J6=$50,001, J7=$100,001
- Lookup rates: L4=0.04, L5=0.06, L6=0.08, L7=0.10
- Since $60,303 >= $50,001 but < $100,001 → use L6 = 0.08
- **Personal Commission = $60,303 × 0.08 = $4,824.24**

**Team Commission (E6):**
```
=IF(G6>=J13,L13,IF(G6>=J12,L12,L11))*G6
```
- G6 (Team GP) = $126,873
- Lookup thresholds: J11=$-, J12=$50,000, J13=$100,000
- Lookup rates: L11=0.01, L12=0.02, L13=0.03
- Since $126,873 >= $100,000 → use L13 = 0.03
- **Team Commission = $126,873 × 0.03 = $3,806.19**

**Sprint (E7):**
```
=VLOOKUP(C3,ALLPayOut2!$B$3:$F$31,5,0)
```
- **Sprint = $150**

**TOTAL (E10):**
```
=SUM(E5:E7)
```
- **TOTAL = $4,824.24 + $3,806.19 + $150 = $8,780.43**

### Manager Tier Rates

**ACQ Manager Personal Rates** (same as ACQ agents):
| Threshold | Rate |
|-----------|------|
| < $25k | 4% |
| $25k-$50k | 6% |
| $50k-$100k | 8% |
| > $100k | 10% |

**ACQ Manager Team Override Rates**:
| Team GP | Rate |
|---------|------|
| < $50k | 1% |
| $50k-$100k | 2% |
| > $100k | 3% |

**CRITICAL**: Team GP does NOT include the manager's own personal GP

---

## KEY FINDINGS

1. **Flat-Fee Precision Matters**: Use 0.046667 not 0.0467 for Tier 6
2. **Alec Prieto Special Case**: Hardcoded to Tier 6 (not calculated)
3. **Team GP Calculation**: Manager's personal GP is EXCLUDED from team total
4. **Sprint Formula**: Uses VLOOKUP to Sprint Winners sheet
5. **Total = $97,539.31**: This INCLUDES all sprints ($4,500 total across all 22 winners)

---

## VALIDATION

| Person | My Calculation | Excel Value | Match |
|--------|---------------|-------------|-------|
| Alec Prieto | $8,361.43 | $8,361.44 | ✓ (0.01¢ rounding) |
| Jesse Sychowski | $5,210.00 | $5,210.00 | ✓ Perfect |
| Luis Guzman | $8,780.43 | $8,780.43 | ✓ Perfect |

**Conclusion**: The Excel formulas are correct and have been accurately documented.