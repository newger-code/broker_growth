#!/usr/bin/env python3
"""
Check what tier Alec Prieto should get
"""

gp = 124972

# Tier boundaries
if gp < 25000: tier = 1
elif gp < 50000: tier = 2
elif gp < 75000: tier = 3
elif gp < 100000: tier = 4
elif gp < 125000: tier = 5
elif gp < 150000: tier = 6
elif gp < 175000: tier = 7
elif gp < 200000: tier = 8
else: tier = 9

print(f"Alec Prieto GP: ${gp:,}")
print(f"Natural tier for ${gp:,}: Tier {tier}")
print(f"Excel says: Hardcoded to Tier 6")
print(f"Calculator does: Natural tier ({tier}) + 1 = {tier + 1}")
print()
print("ISSUE: Calculator is giving him Tier 6 (150k-175k rates) when he should get Tier 6 (125k-150k rates)")
print()
print("Tier 6 rates: 7% off-market, 4.6667% flat-fee")
print("Tier 7 rates: 8% off-market, 5.3333% flat-fee")
print()
print("With Tier 6:")
off_gp = 93403
ff_gp = 31569
tier6_off = off_gp * 0.07
tier6_ff = ff_gp * 0.046667
tier6_total = tier6_off + tier6_ff
print(f"  Off-market: ${off_gp:,} × 7.00% = ${tier6_off:,.2f}")
print(f"  Flat-fee: ${ff_gp:,} × 4.6667% = ${tier6_ff:,.2f}")
print(f"  Base commission: ${tier6_total:,.2f}")
print(f"  With sprint: ${tier6_total + 350:,.2f}")
print()
print("With Tier 7 (what calculator is doing):")
tier7_off = off_gp * 0.08
tier7_ff = ff_gp * 0.053333
tier7_total = tier7_off + tier7_ff
print(f"  Off-market: ${off_gp:,} × 8.00% = ${tier7_off:,.2f}")
print(f"  Flat-fee: ${ff_gp:,} × 5.3333% = ${tier7_ff:,.2f}")
print(f"  Base commission: ${tier7_total:,.2f}")
print(f"  With sprint: ${tier7_total + 350:,.2f}")
print()
print(f"V2/Excel shows: $8,361.44")
print(f"Difference with Tier 7: ${tier7_total + 350 - 8361.44:.2f}")
