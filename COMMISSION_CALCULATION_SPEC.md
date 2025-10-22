# Commission Calculation Specification
## Extracted from 2025 Sept Commission Calcs.xlsx

### Data Source
- **Excel File**: `2025 Sept Commission Calcs.xlsx`
- **Main Calculation Sheet**: `ALLPayOut2`
- **Deal Data Sheet**: `Dispo Closings`
- **Rate Tables**: `PayoutChart` (ACQ) and `ALLPayOut2` columns AA-AE (DISPO)

---

## ACQUISITION AGENTS

### Formula Structure (from ALLPayOut2, Column B-G)
```
GP = SUMIFS('Dispo Closings'!H:H, 'Dispo Closings'!B:B, AgentName)
Split Rate = VLOOKUP(GP, PayoutChart!$B$12:$D$15, 3, 1)
Commission = GP × Split Rate
Sprints = VLOOKUP(AgentName, 'Sprint Winners'!B:C, 2, 0) [if exists]
Total Payout = Commission + Sprints [+ bonuses if applicable]
```

### ACQ Commission Rate Table (PayoutChart B12:D15)
| Min GP    | Max GP      | Commission Rate |
|-----------|-------------|-----------------|
| $0        | $24,999     | 4.0%            |
| $25,000   | $50,000     | 6.0%            |
| $50,001   | $100,000    | 8.0%            |
| $100,001  | $1,000,000  | 10.0%           |

### Notes
- GP calculated from column H (Gross Profit) in 'Dispo Closings'
- VLOOKUP uses approximate match (4th parameter = 1), so finds highest tier ≤ GP
- Manager-agents (Luis Guzman, Shon Yoshida, Devin Buford) appear in agent list BUT their commissions go to manager sheets

---

## DISPOSITION AGENTS

### Formula Structure (from ALLPayOut2, Column K-T)
```
GP_OffMarket = SUMIFS('Dispo Closings'!H:H, 'Dispo Closings'!D:D, AgentName, 'Dispo Closings'!N:N, "NO")
GP_FlatFee = SUMIFS('Dispo Closings'!H:H, 'Dispo Closings'!D:D, AgentName, 'Dispo Closings'!N:N, "YES")
GP_Total = SUMIFS('Dispo Closings'!H:H, 'Dispo Closings'!D:D, AgentName)

Tier = VLOOKUP(GP_Total, $AA$4:$AC$12, 3, 1)
OffMarket_Rate = VLOOKUP(Tier, $AC$4:$AE$12, 2, 0)
FlatFee_Rate = VLOOKUP(Tier, $AC$4:$AE$12, 3, 0)

Commission_OffMarket = GP_OffMarket × OffMarket_Rate
Commission_FlatFee = GP_FlatFee × FlatFee_Rate
Total_Commission = Commission_OffMarket + Commission_FlatFee
```

### DISPO Tier Table (ALLPayOut2 $AA$4:$AC$12)
| Tier | Min GP    | Max GP    |
|------|-----------|-----------|
| 1    | $0        | $24,999   |
| 2    | $25,000   | $49,999   |
| 3    | $50,000   | $74,999   |
| 4    | $75,000   | $99,999   |
| 5    | $100,000  | $124,999  |
| 6    | $125,000  | $149,999  |
| 7    | $150,000  | $174,999  |
| 8    | $175,000  | $199,999  |
| 9    | $200,000  | $999,999  |

### DISPO Rate Table (ALLPayOut2 $AC$4:$AE$12)
| Tier | Off-Market Rate | Flat-Fee Rate |
|------|-----------------|---------------|
| 1    | 2.00%           | 1.33%         |
| 2    | 3.00%           | 2.00%         |
| 3    | 4.00%           | 2.67%         |
| 4    | 5.00%           | 3.33%         |
| 5    | 6.00%           | 4.00%         |
| 6    | 7.00%           | 4.67%         |
| 7    | 8.00%           | 5.33%         |
| 8    | 9.00%           | 6.00%         |
| 9    | 10.00%          | 6.67%         |

### Special Cases
- **Alec Prieto**: Tier is HARDCODED as 6 (special deal), not calculated from GP
  - GP_Total: $124,972 (would normally be Tier 5)
  - Actual Tier: 6 (one tier higher)
  - Commission: $93,403 × 7% + $31,569 × 4.67% = $8,361.44

### Notes
- Manager-agents (Joe Haupt, Maegan Grace) appear in agent list BUT their commissions go to manager sheets
- Column N ('Dispo Closings') contains "YES"/"NO" for flat-fee designation

---

## MANAGER COMMISSIONS

### Manager Types

#### Type 1: Company/ISA Split (Patrick Solomon, Rob Gorski)
- Fixed percentage of total company GP and transactions
- Calculated monthly with declining rates
- Solomon: 0.5% GP + $34.72/trx (September rates)
- Gorski: 0.5% ISA GP (September rate)

#### Type 2: Personal + Team Override (Luis, Shon, Devin, Joe Haupt, Maegan)
**Structure**:
```
Personal Commission = Calculated like regular agent (using tier tables)
Team Commission = Override on team member deals
Total Manager Payout = Personal Commission + Team Commission
```

**September 2025 Values** (from individual manager sheets):
- **Shon Yoshida**: Personal $5,724.16 (GP $71,552) + Team $1,789.24 = $7,513.40
- **Luis Guzman**: Personal $4,824.24 (GP $60,303) + Team $3,806.19 = $8,630.43
- **Devin Buford**: Personal $1,740.30 (GP $29,005) + Team $60.00 = $1,800.30
- **Joe Haupt**: Personal $5,856.72 (GP $117,323) + Team $2,296.09 = $8,152.81
- **Maegan Grace**: Personal $2,111.73 (GP $59,965) + Team $1,149.00 = $3,260.73

#### Type 3: % of Goal (Dustin Hepburn)
- Based on transaction and GP goal attainment
- Separate calculation methodology

---

## SEPTEMBER 2025 TARGET TOTALS (from v2/js/data.js)

```
Total Commission Paid: $97,539.66

Breakdown:
- Acq Agents: $35,491.00 (15 agents)
- Dispo Agents: $21,078.85 (17 agents)
- Managers: $40,969.81 (8 managers)
```

### Key Insight
**Manager-agents are EXCLUDED from agent totals and ONLY counted in manager total.**

This means:
- Acq agent list excludes Luis, Shon, Devin → Only 12 agents counted
- Dispo agent list excludes Joe Haupt, Maegan → Only 15 agents counted (not 17)
- Manager total ($40,969.81) includes their personal + team commissions

---

## IMPLEMENTATION NOTES

1. **Tier Lookups**: Use VLOOKUP with approximate match (finds highest tier ≤ GP)
2. **Special Cases**: Alec Prieto tier override must be handled
3. **Manager-Agent Handling**: Their GP appears in deal data, but commission goes to manager calculations
4. **Data Structure**:
   - Read from 'Dispo Closings' sheet for raw deal data
   - Apply tier/rate lookups from tables
   - Calculate split commissions for dispo (off-market vs flat-fee)

---

## VALIDATION SAMPLES

### Sample 1: Alec Prieto (Dispo)
- Off-Market GP: $93,403
- Flat-Fee GP: $31,569
- Total GP: $124,972
- **Tier: 6 (HARDCODED, would be 5 based on GP)**
- Off-Market Commission: $93,403 × 7% = $6,538.21
- Flat-Fee Commission: $31,569 × 4.67% = $1,474.27
- **Total: $8,012.48** ← This should match calculator

### Sample 2: Kyle Singer (Acq)
- Total GP: $83,227
- Tier: 3 ($50,001-$100,000)
- Rate: 8%
- Commission: $83,227 × 8% = $6,658.16
- Sprints: $550
- **Total Payout: $7,208.16** (before $160 bonus)

### Sample 3: Joe Haupt (Manager Type 2)
- Personal GP (Dispo): $117,323
  - Off-Market: $58,190
  - Flat-Fee: $59,133
  - Tier: 5
  - Personal Commission: $58,190 × 6% + $59,133 × 4% = $5,856.72
- Team GP: $107,759
  - Team Commission: $2,296.09
- **Total Manager Payout: $8,152.81**

---

**Generated**: 2025-10-22
**Source**: 2025 Sept Commission Calcs.xlsx
