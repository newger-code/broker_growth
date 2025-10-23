# CALCULATOR FIXES NEEDED TO MATCH EXCEL

## Current Status
- Calculator Total: $63,120.40
- Excel Total: $56,741.20
- **Difference: $6,379.20 too high**

Note: This comparison only includes the 17 people currently in the calculator. The Excel has 38 people total.

---

## ISSUE 1: Wrong Agent Categories

These agents are in ACQ in the calculator but should be DISPO:

### Christian Flasch
- **Current**: ACQ agent with $54,396 GP
- **Should be**: DISPO agent
- **Calculator shows**: $4,701.68 ($4,351.68 base + $350 sprint)
- **Excel shows**: $1,769.00
- **Impact**: Calculator is $2,932.68 too high

### Jack Webster
- **Current**: ACQ agent with $41,863 GP
- **Should be**: DISPO agent
- **Calculator shows**: $2,861.78 ($2,511.78 base + $350 sprint)
- **Excel shows**: $937.26
- **Impact**: Calculator is $1,924.52 too high

### Yoseph Israel
- **Current**: ACQ agent with $11,600 GP
- **Should be**: DISPO agent
- **Calculator shows**: $814.00 ($464.00 base + $350 sprint)
- **Excel shows**: $232.00
- **Impact**: Calculator is $582.00 too high

**Total impact from wrong categories**: $5,439.20 too high

---

## ISSUE 2: Wrong Sprint Amounts

| Name | Calculator Sprint | Correct Sprint | Difference |
|------|------------------|----------------|------------|
| Warren Smith | $200 | $100 | -$100 |
| Christian Flasch | $350 | $100 | -$250 |
| Dominick Mazliah | $300 | $0 | -$300 |
| Jack Webster | $350 | $0 | -$350 |
| Andrew Caceres | $150 | $0 | -$150 |
| Yoseph Israel | $350 | $0 | -$350 |
| Jarod Weaver | $350 | $100 | -$250 |
| Kayla Watkins | $250 | $100 | -$150 |
| Kirk Schaafsma | $250 | $100 | -$150 |

**Total impact from wrong sprints**: $2,050 too high

Note: Some of these overlap with Issue 1 (e.g., Christian Flasch's sprint will be corrected when moved to DISPO)

---

## ISSUE 3: Missing People

The calculator only has 17 people. Excel SEPTEMBER SUMMARY has 38 people total:

### Missing ACQ Agents:
- Ashley Preston: $4,959.84
- Chris Chambers: $1,753.50
- Ian Ross: $420.00
- Garrett Paschal: $329.40
- Steve Shelburne: $240.00

### Missing ACQ Managers:
- Shon Yoshida: $7,513.40
- Patrick Solomon: $6,043.56
- Devin Buford: $1,900.30

### Missing DISPO Agents:
- Devin Cooper: $2,175.94
- Vincent Gnapi: $1,943.56
- Miguel Aguilar: $1,762.07
- Leland Boyd: $1,117.32
- Brittany Taylor: $1,096.78
- Tamara Humbolt: $940.00
- Mel Grant: $180.00
- Devin Hoffman: $143.13

### Missing DISPO Managers:
- Rob Gorski: $3,672.31
- Maegan Grace: $3,260.74

### Missing UW:
- Dustin Hepburn: $1,346.26

**Total missing commissions**: $40,798.11

---

## ISSUE 4: Manual Adjustments

Kyle Singer:
- Calculator shows: $7,208.16
- Excel shows: $7,368.16
- Difference: $160.00 (this is a manual adjustment in Excel, shown in orange)

---

## SUMMARY

| Issue | Impact |
|-------|--------|
| Wrong categories (Christian, Jack, Yoseph) | +$5,439.20 |
| Wrong sprint amounts | +$2,050.00 |
| Missing Kyle Singer adjustment | -$160.00 |
| **Net for 17 people** | **+$6,379.20** |
| Missing 21 people | +$40,798.11 |
| **Total to reach $97,539.31** | **+$34,418.91** |

---

## NEXT STEPS

1. **Fix agent categories** - Move Christian Flasch, Jack Webster, Yoseph Israel from acqData to dispoData
2. **Fix sprint amounts** - Update sprint values to match Sprint Winners sheet exactly
3. **Add missing people** - Need to add 21 more people with their deal data
4. **Add manual adjustments** - Add Kyle Singer's $160 adjustment (and check if others have adjustments)
