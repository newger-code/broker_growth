#!/usr/bin/env python3
"""
Debug manager calculations - find the discrepancy
"""

print("=" * 80)
print("MANAGER CALCULATION DEBUGGING")
print("=" * 80)

# From V2 Dashboard JSON data (lines 566-606 from commission_dashboard.html)
print("\nLUIS GUZMAN - V2 Dashboard Data:")
print("-" * 40)
print("personal_gp: $60,303")
print("personal_rate: 8% (0.08)")
print("personal_commission: $4,824.24")
print("team_gp: $126,873")  # This is different from my calc!
print("team_rate: 3% (0.03)")
print("team_commission: $3,806.19")
print("sprint: $150")
print("actual_payout: $8,780.43")
print()
print("V2 Calculation: $4,824.24 + $3,806.19 + $150 = $8,780.43 ✓")

print("\nMY CALCULATION:")
print("-" * 40)
print("I calculated team GP as: $177,764")
print("V2 shows team GP as: $126,873")
print(f"Difference: ${177_764 - 126_873:,} = ${50_891:,}")
print()
print("This $50,891 difference is close to Luis's own GP of $60,303")
print("→ V2 likely EXCLUDES manager's own GP from team total")

print("\n" + "=" * 80)

print("\nJOE HAUPT - V2 Dashboard Data:")
print("-" * 40)
print("personal_off_gp: $58,190")
print("personal_ff_gp: $59,133")
print("personal_commission: $5,856.72")
print("team_off_gp: $28,182")  # Much lower than my estimate
print("team_ff_gp: $79,577")   # Much higher than my estimate
print("team_off_rate: 2.5% (0.025)")
print("team_ff_rate: 2.0% (0.02)")
print("team_commission: $2,296.09")
print("sprint: $300")
print("actual_payout: $8,452.81")

print("\nV2 Calculation:")
print(f"Personal: $5,856.72")
print(f"Team: ${28_182 * 0.025:.2f} + ${79_577 * 0.02:.2f} = ${28_182 * 0.025 + 79_577 * 0.02:.2f}")
print(f"Sprint: $300")
print(f"Total: $5,856.72 + $2,296.09 + $300 = $8,452.81 ✓")

print("\nMY CALCULATION ISSUES:")
print("-" * 40)
print("1. I estimated 70/30 split for team deals - WRONG")
print("   Actual: $28,182 off-market, $79,577 flat-fee")
print("   That's more like 26% off-market, 74% flat-fee")
print()
print("2. My personal commission was $7,808.96 vs V2's $5,856.72")
print("   Difference: $1,952.24")
print("   → I may have wrong tier or rates")

print("\n" + "=" * 80)
print("CORRECTIONS NEEDED")
print("=" * 80)

print("\n1. LUIS GUZMAN FIX:")
print("   Team GP should be $126,873 (not include Luis's own GP)")
print("   Team commission: $126,873 × 3% = $3,806.19")
print("   Total: $4,824.24 + $3,806.19 + $150 = $8,780.43 ✓")

print("\n2. JOE HAUPT FIX:")
print("   Need actual off-market/flat-fee split for team deals")
print("   Personal commission calculation may use different tier")
print("   V2 shows $5,856.72 for personal (I calculated $7,808.96)")

print("\n3. KEY INSIGHT:")
print("   → Manager's own GP is NOT included in their team GP")
print("   → Need actual deal-level data to get correct off/flat splits")
print("   → Personal tier calculation may differ from my assumption")