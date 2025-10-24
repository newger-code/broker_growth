#!/usr/bin/env python3
"""
EXCEL FORMULA ANALYSIS - Starting from Excel, not calculator
Based on the tier tables and rules from Excel
"""

print("=" * 80)
print("EXCEL FORMULA ANALYSIS - TIER TABLES")
print("=" * 80)

# DISPO TIERS from Excel ALLPayOut2 sheet $AA$4:$AE$12
# These are the EXACT rates from Excel (not /100)
print("\nDISPO TIER TABLE (from ALLPayOut2 sheet):")
print("Tier | GP Range        | Off-Market Rate | Flat-Fee Rate")
print("-----|-----------------|-----------------|---------------")
print("  1  | < $25,000       | 2.00%           | 1.33%")
print("  2  | $25k - $50k     | 3.00%           | 2.00%")
print("  3  | $50k - $75k     | 4.00%           | 2.67%")
print("  4  | $75k - $100k    | 5.00%           | 3.33%")
print("  5  | $100k - $125k   | 6.00%           | 4.00%")
print("  6  | $125k - $150k   | 7.00%           | 4.67%")
print("  7  | $150k - $175k   | 8.00%           | 5.33%")
print("  8  | $175k - $200k   | 9.00%           | 6.00%")
print("  9  | > $200k         | 10.00%          | 6.67%")

# ACQ TIERS from Excel PayoutChart sheet $B$12:$D$15
print("\nACQ TIER TABLE (from PayoutChart sheet):")
print("Tier | GP Range        | Standard Rate | Organic Rate")
print("-----|-----------------|---------------|-------------")
print("  1  | ≤ $24,999       | 4.00%         | 20.00%")
print("  2  | $25k - $50k     | 6.00%         | 20.00%")
print("  3  | $50k - $100k    | 8.00%         | 20.00%")
print("  4  | > $100k         | 10.00%        | 20.00%")

print("\n" + "=" * 80)
print("SAMPLE CALCULATIONS - 2 DISPO AGENTS")
print("=" * 80)

# DISPO Agent 1: Alec Prieto
print("\n1. ALEC PRIETO (DISPO)")
print("-" * 40)
alec_deals = [
    {'addr': '514 N Madison Ave', 'gp': 18370, 'ff': 'YES'},
    {'addr': '108 Independence St', 'gp': 3000, 'ff': 'NO'},
    {'addr': '32 Jenkins Dr', 'gp': 26021, 'ff': 'NO'},
    {'addr': '118 Cedar Pl', 'gp': 13199, 'ff': 'YES'},
    {'addr': '164 Mcconnells Trce #1', 'gp': 10000, 'ff': 'NO'},
    {'addr': '164 Mcconnells Trce #2', 'gp': 10000, 'ff': 'NO'},
    {'addr': '1339 Howard Ave', 'gp': 44382, 'ff': 'NO'}
]

alec_total_gp = sum(d['gp'] for d in alec_deals)
alec_off_market_gp = sum(d['gp'] for d in alec_deals if d['ff'] == 'NO')
alec_flat_fee_gp = sum(d['gp'] for d in alec_deals if d['ff'] == 'YES')

print(f"Total GP: ${alec_total_gp:,}")
print(f"Off-Market GP: ${alec_off_market_gp:,}")
print(f"Flat-Fee GP: ${alec_flat_fee_gp:,}")

# Alec gets Tier 6 BY DEFAULT (special case)
print("\nSPECIAL RULE: Alec gets +1 tier bonus")
print(f"Normal tier for ${alec_total_gp:,} would be Tier 5 (100k-125k)")
print("But Alec gets Tier 6 by default (125k-150k)")
print("Tier 6 rates: 7.00% off-market, 4.67% flat-fee")

# Use exact decimal for flat-fee
alec_off_comm = alec_off_market_gp * 0.07
alec_ff_comm = alec_flat_fee_gp * 0.04666667  # More precise
alec_base_comm = alec_off_comm + alec_ff_comm
alec_sprint = 350

print(f"\nOff-Market: ${alec_off_market_gp:,} × 7.00% = ${alec_off_comm:,.2f}")
print(f"Flat-Fee: ${alec_flat_fee_gp:,} × 4.6667% = ${alec_ff_comm:,.2f}")
print(f"Base Commission: ${alec_base_comm:,.2f}")
print(f"Sprint: ${alec_sprint}")
print(f"TOTAL: ${alec_base_comm + alec_sprint:,.2f}")

# DISPO Agent 2: Ex Rebuilt
print("\n2. EX REBUILT (DISPO)")
print("-" * 40)
ex_deals = [
    {'addr': '480 Sam Cunningham Rd', 'gp': 2500, 'ff': 'NO'},
    {'addr': '110 Mildred St', 'gp': 1500, 'ff': 'YES'},
    {'addr': '1777 Old Frankfort Rd', 'gp': 7500, 'ff': 'NO'}
]

ex_total_gp = sum(d['gp'] for d in ex_deals)
ex_off_market_gp = sum(d['gp'] for d in ex_deals if d['ff'] == 'NO')
ex_flat_fee_gp = sum(d['gp'] for d in ex_deals if d['ff'] == 'YES')

print(f"Total GP: ${ex_total_gp:,}")
print(f"Off-Market GP: ${ex_off_market_gp:,}")
print(f"Flat-Fee GP: ${ex_flat_fee_gp:,}")

print("\nSPECIAL RULE: Ex Rebuilt always gets Tier 1")
print("Tier 1 rates: 2.00% off-market, 1.33% flat-fee")

ex_off_comm = ex_off_market_gp * 0.02
ex_ff_comm = ex_flat_fee_gp * 0.01333333  # More precise
ex_base_comm = ex_off_comm + ex_ff_comm
ex_sprint = 0  # Ex Rebuilt has no sprint

print(f"\nOff-Market: ${ex_off_market_gp:,} × 2.00% = ${ex_off_comm:,.2f}")
print(f"Flat-Fee: ${ex_flat_fee_gp:,} × 1.3333% = ${ex_ff_comm:,.2f}")
print(f"Base Commission: ${ex_base_comm:,.2f}")
print(f"Sprint: ${ex_sprint}")
print(f"TOTAL: ${ex_base_comm + ex_sprint:,.2f}")

print("\n" + "=" * 80)
print("SAMPLE CALCULATIONS - 2 ACQ AGENTS")
print("=" * 80)

# ACQ Agent 1: Jesse Sychowski
print("\n3. JESSE SYCHOWSKI (ACQ)")
print("-" * 40)
jesse_deals = [
    {'addr': '110 Mildred St', 'gp': 1500, 'organic': False},
    {'addr': '291 Pinewood Dr', 'gp': 4687, 'organic': False},
    {'addr': '509 West St N', 'gp': 8885, 'organic': False},
    {'addr': '7406 Park Ave #1', 'gp': 4000, 'organic': False},
    {'addr': '7406 Park Ave #2', 'gp': 2500, 'organic': False},
    {'addr': '920 4th Ct W', 'gp': 12300, 'organic': False},
    {'addr': '1013 4th Ave N', 'gp': 5000, 'organic': False},
    {'addr': '504 Clark St', 'gp': 5000, 'organic': False},
    {'addr': '1436 W Spencer Ave', 'gp': 3000, 'organic': False},
    {'addr': '2724 N Dover St', 'gp': 14503, 'organic': False}
]

jesse_total_gp = sum(d['gp'] for d in jesse_deals)
jesse_organic_gp = sum(d['gp'] for d in jesse_deals if d['organic'])
jesse_standard_gp = sum(d['gp'] for d in jesse_deals if not d['organic'])

print(f"Total GP: ${jesse_total_gp:,}")
print(f"Standard GP: ${jesse_standard_gp:,}")
print(f"Organic GP: ${jesse_organic_gp:,}")

print(f"\nTier for ${jesse_total_gp:,}: Tier 3 (50k-100k)")
print("Tier 3 rates: 8.00% standard, 20.00% organic")

jesse_standard_comm = jesse_standard_gp * 0.08
jesse_organic_comm = jesse_organic_gp * 0.20
jesse_base_comm = jesse_standard_comm + jesse_organic_comm
jesse_sprint = 300

print(f"\nStandard: ${jesse_standard_gp:,} × 8.00% = ${jesse_standard_comm:,.2f}")
print(f"Organic: ${jesse_organic_gp:,} × 20.00% = ${jesse_organic_comm:,.2f}")
print(f"Base Commission: ${jesse_base_comm:,.2f}")
print(f"Sprint: ${jesse_sprint}")
print(f"TOTAL: ${jesse_base_comm + jesse_sprint:,.2f}")

# ACQ Agent 2: Kyle Singer
print("\n4. KYLE SINGER (ACQ)")
print("-" * 40)
kyle_deals = [
    {'addr': '1339 Howard Ave', 'gp': 44382, 'organic': False},
    {'addr': '893 York St', 'gp': 11117, 'organic': False},
    {'addr': '612 31e Hwy Old', 'gp': 5000, 'organic': False},
    {'addr': '1735 Parklane Dr', 'gp': 2000, 'organic': False},
    {'addr': '17 N Water St', 'gp': 9128, 'organic': False},
    {'addr': '202 Jackson St', 'gp': 11600, 'organic': False}
]

kyle_total_gp = sum(d['gp'] for d in kyle_deals)
kyle_organic_gp = sum(d['gp'] for d in kyle_deals if d['organic'])
kyle_standard_gp = sum(d['gp'] for d in kyle_deals if not d['organic'])

print(f"Total GP: ${kyle_total_gp:,}")
print(f"Standard GP: ${kyle_standard_gp:,}")
print(f"Organic GP: ${kyle_organic_gp:,}")

print(f"\nTier for ${kyle_total_gp:,}: Tier 3 (50k-100k)")
print("Tier 3 rates: 8.00% standard, 20.00% organic")

kyle_standard_comm = kyle_standard_gp * 0.08
kyle_organic_comm = kyle_organic_gp * 0.20
kyle_base_comm = kyle_standard_comm + kyle_organic_comm
kyle_sprint = 550

print(f"\nStandard: ${kyle_standard_gp:,} × 8.00% = ${kyle_standard_comm:,.2f}")
print(f"Organic: ${kyle_organic_gp:,} × 20.00% = ${kyle_organic_comm:,.2f}")
print(f"Base Commission: ${kyle_base_comm:,.2f}")
print(f"Sprint: ${kyle_sprint}")
print(f"TOTAL: ${kyle_base_comm + kyle_sprint:,.2f}")

print("\n" + "=" * 80)
print("SUMMARY OF MY CALCULATIONS (from Excel formulas)")
print("=" * 80)
print(f"Alec Prieto: ${alec_base_comm + alec_sprint:,.2f}")
print(f"Ex Rebuilt: ${ex_base_comm + ex_sprint:,.2f}")
print(f"Jesse Sychowski: ${jesse_base_comm + jesse_sprint:,.2f}")
print(f"Kyle Singer: ${kyle_base_comm + kyle_sprint:,.2f}")