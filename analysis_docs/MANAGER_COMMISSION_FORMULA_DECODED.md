# Manager Commission Formula - DECODED

## Patrick Solomon (Acq Manager) - September 2025

### Final Payout: **$6,043.56**

---

## FORMULA BREAKDOWN (Working Backwards from Final Total)

### **Step 1: Final Calculation**
```
AB14 = Z14 + AA14
$6,043.56 = $1,510.89 + $4,532.67
```

### **Step 2: Company vs ISA Split**
```
Z14 (Company Component) = K14 × X14
$1,510.89 = $3,777.23 × 40%

AA14 (ISA Component) = V14 × Y14
$4,532.67 = $7,554.46 × 60%
```

**Key Finding:** Patrick gets 40% weight on Company deals, 60% weight on ISA deals

---

### **Step 3: Company Total (before split)**
```
K14 = I14 + J14
$3,777.23 = $2,636.76 + $1,140.46
```

Where:
- **I14 (GP Payout)** = C14 × F14 = $682,043 × 0.387% = $2,636.76
- **J14 (Trx Payout)** = D14 × G14 = 59 × $19.33 = $1,140.46

---

### **Step 4: ISA Total (before split)**
```
V14 = T14 + U14
$7,554.46 = $5,273.53 + $2,280.93
```

Where:
- **T14 (GP Payout)** = N14 × Q14 = $682,043 × 0.773% = $5,273.53
- **U14 (Trx Payout)** = O14 × R14 = 59 × $38.66 = $2,280.93

---

## THE DECLINING RATE MYSTERY - SOLVED! 🎯

### **Pattern Discovery:**

The GP% and Per Trx rates **decline each month** because they're based on **CUMULATIVE performance**:

| Month | Cumulative GP | GP % | Implied Target | Cumulative Trx | Per Trx | Implied Target |
|-------|--------------|------|----------------|----------------|---------|----------------|
| Jan | $701,242 | 0.694% | $4,870 | 64 | $34.72 | $2,222 |
| Feb | $1,417,570 | 0.670% | $9,493 | 123 | $33.48 | $4,118 |
| Mar | $2,068,648 | 0.605% | $12,512 | 177 | $30.24 | $5,353 |
| Apr | $2,630,981 | 0.536% | $14,095 | 235 | $26.79 | $6,295 |
| May | $3,129,449 | 0.487% | $15,241 | 290 | $24.35 | $7,062 |
| Jun | $3,735,578 | 0.452% | $16,878 | 343 | $22.59 | $7,748 |
| Jul | $4,295,347 | 0.426% | $18,304 | 397 | $21.31 | $8,459 |
| Aug | $4,692,356 | 0.403% | $18,921 | 440 | $20.16 | $8,871 |
| **Sep** | **$5,374,399** | **0.387%** | **$20,777** | **499** | **$19.33** | **$9,646** |

### **Hypothesis:**
The rates appear to divide a **FIXED ANNUAL TARGET** by the **cumulative actual performance**:

```
GP % = (Annual GP Target) / (Year-to-Date Cumulative GP)
Per Trx = (Annual Trx Target $) / (Year-to-Date Cumulative Transactions)
```

### **Evidence:**
Looking at the "implied targets" column:
- GP Target grows from $4,870 (Jan) → $20,777 (Sep)
- This suggests a **declining rate schedule** that keeps total payout within budget as the year progresses

---

## ISA CALCULATION

The ISA rates are **EXACTLY 2X** the Company rates:

| Component | Company Rate | ISA Rate | Ratio |
|-----------|--------------|----------|-------|
| GP % (Sept) | 0.387% | 0.773% | 2.00x |
| Per Trx (Sept) | $19.33 | $38.66 | 2.00x |

**Conclusion:** ISA deals are valued at 2x for commission purposes

---

## OTHER MANAGERS

### **Rob Gorski (Dispo Manager)**
- Company/ISA Split: **25% / 75%**
- Same declining rate structure
- September Total: $3,672.31

### **Luis Guzman, Shon Yoshida, Devin Buford**
- Need to check their individual tabs for splits
- Expected Total from SEPTEMBER SUMMARY:
  - Luis Guzman: $8,780.43
  - Shon Yoshida: $7,513.40
  - Devin Buford: $1,900.30

### **Joe Haupt, Maegan Grace (Dispo Mgrs)**
- Need to check their tabs
- Expected Totals:
  - Joe Haupt: $8,452.81
  - Maegan Grace: $3,260.74

### **Dustin Hepburn (UW Director)**
- Different structure (% of goal obtained)
- From Hepburn tab: Uses monthly budget targets
- September Total: $1,346.26

---

## STILL NEED TO UNDERSTAND:

1. **What determines the annual target amounts?**
   - Is there a fixed budget for manager commissions?
   - Or is it based on company performance goals?

2. **What's the GP and Transaction count in columns N14/O14 (ISA)?**
   - Same $682,043 as Company GP?
   - Or different subset of deals?

3. **Company vs ISA Split percentages:**
   - Patrick: 40/60
   - Gorski: 25/75
   - What determines these?

4. **Why 2X rate for ISA deals?**
   - Is this because ISA sourcing is more valuable?
   - Or different commission structure?

---

## NEXT STEPS FOR CALCULATOR:

1. **Extract the rate schedule logic** from each manager tab
2. **Understand if rates are:**
   - Hardcoded month by month?
   - Calculated from a formula?
   - Based on actual vs target performance?
3. **Determine if we need to:**
   - Build a declining rate calculator
   - Use fixed annual targets
   - Import actuals month by month
