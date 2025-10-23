#!/usr/bin/env python3
"""
Check Warren Smith and Jack Webster discrepancies
"""

print("=" * 80)
print("WARREN SMITH ANALYSIS")
print("=" * 80)

warren_gp = 33715
print(f"Warren Smith GP: ${warren_gp:,}")
print(f"Natural tier: 2 (25k-50k) → 6% rate")
print(f"My calculation: ${warren_gp:,} × 6% = ${warren_gp * 0.06:,.2f}")
print(f"Sprint: $200")
print(f"My total: ${warren_gp * 0.06 + 200:,.2f}")
print(f"V2 shows: $2,894.00")
print(f"Difference: ${(warren_gp * 0.06 + 200) - 2894.00:,.2f}")
print()
print("Looking at the deal list from calculator code:")
warren_deals = [
    {'addr': '164 Mcconnells Trce, Lexington', 'gp': 10000},
    {'addr': '1777 Old Frankfort Rd, Lawrenc', 'gp': 7500},
    {'addr': '410 Wellington Way, Winchester', 'gp': 13500},
    {'addr': '33 Bon Haven Ave, Winchester', 'gp': 2715}
]
total = sum(d['gp'] for d in warren_deals)
print(f"Deal 1: ${warren_deals[0]['gp']:,}")
print(f"Deal 2: ${warren_deals[1]['gp']:,}")
print(f"Deal 3: ${warren_deals[2]['gp']:,}")
print(f"Deal 4: ${warren_deals[3]['gp']:,}")
print(f"Total GP: ${total:,}")
print()
print("Is there organic GP involved?")
print("If some deals are organic (20% rate), calculation would be different")
print()

print("=" * 80)
print("JACK WEBSTER ANALYSIS")
print("=" * 80)

jack_gp = 41863
print(f"Jack Webster GP: ${jack_gp:,}")
print(f"Natural tier: 2 (25k-50k) → 6% rate")
print(f"My calculation: ${jack_gp:,} × 6% = ${jack_gp * 0.06:,.2f}")
print(f"Sprint: $350")
print(f"My total: ${jack_gp * 0.06 + 350:,.2f}")
print(f"V2 shows: $3,699.04")
print(f"Difference: ${(jack_gp * 0.06 + 350) - 3699.04:,.2f}")
print()

print("=" * 80)
print("CHRISTIAN FLASCH ANALYSIS")
print("=" * 80)

chris_gp = 54396
print(f"Christian Flasch GP: ${chris_gp:,}")
print(f"Natural tier: 3 (50k-100k) → 8% rate")
print(f"My calculation: ${chris_gp:,} × 8% = ${chris_gp * 0.08:,.2f}")
print(f"Sprint: $350")
print(f"My total: ${chris_gp * 0.08 + 350:,.2f}")
print(f"V2 shows: $4,526.96")
print(f"Difference: ${(chris_gp * 0.08 + 350) - 4526.96:,.2f}")
print()

print("=" * 80)
print("KEY INSIGHT")
print("=" * 80)
print("Warren, Jack, and Christian all showing higher V2 values than my standard calc")
print("This suggests they might have:")
print("1. Organic deals (20% rate instead of standard tier rate)")
print("2. Manual adjustments like Kyle Singer's $160")
print("3. Different GP totals than what I'm using")
