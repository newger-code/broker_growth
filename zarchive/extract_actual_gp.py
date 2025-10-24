#!/usr/bin/env python3
"""
Extract ACTUAL GP from calculator HTML for Christian, Jack, Yoseph
"""

import re

with open('commission_calculator.html', 'r') as f:
    content = f.read()

# Find Christian Flasch in dispoData
christian_section = re.search(r"'Christian Flasch': \[(.*?)\]", content, re.DOTALL)
if christian_section:
    deals = re.findall(r"gp: (\d+), ff: '(YES|NO)'", christian_section.group(1))
    off_gp = sum(int(gp) for gp, ff in deals if ff == 'NO')
    ff_gp = sum(int(gp) for gp, ff in deals if ff == 'YES')
    print(f"Christian Flasch:")
    print(f"  Off GP: ${off_gp:,}")
    print(f"  FF GP: ${ff_gp:,}")
    print(f"  Total: ${off_gp + ff_gp:,}")
    print(f"  Tier 3: 4% off, 2.6667% ff")
    comm = off_gp * 0.04 + ff_gp * 0.026667 + 100
    print(f"  Commission: ${comm:,.2f}")
    print()

# Find Jack Webster
jack_section = re.search(r"'Jack Webster': \[(.*?)\]", content, re.DOTALL)
if jack_section:
    deals = re.findall(r"gp: (\d+), ff: '(YES|NO)'", jack_section.group(1))
    off_gp = sum(int(gp) for gp, ff in deals if ff == 'NO')
    ff_gp = sum(int(gp) for gp, ff in deals if ff == 'YES')
    print(f"Jack Webster:")
    print(f"  Off GP: ${off_gp:,}")
    print(f"  FF GP: ${ff_gp:,}")
    print(f"  Total: ${off_gp + ff_gp:,}")
    total_gp = off_gp + ff_gp
    if total_gp < 25000:
        tier, off_rate, ff_rate = 1, 0.02, 0.013333
    elif total_gp < 50000:
        tier, off_rate, ff_rate = 2, 0.03, 0.02
    else:
        tier, off_rate, ff_rate = 3, 0.04, 0.026667
    print(f"  Tier {tier}: {off_rate:.1%} off, {ff_rate:.5f} ff")
    comm = off_gp * off_rate + ff_gp * ff_rate
    print(f"  Commission: ${comm:,.2f}")
    print()

# Find Yoseph Israel
yoseph_section = re.search(r"'Yoseph Israel': \[(.*?)\]", content, re.DOTALL)
if yoseph_section:
    deals = re.findall(r"gp: (\d+), ff: '(YES|NO)'", yoseph_section.group(1))
    off_gp = sum(int(gp) for gp, ff in deals if ff == 'NO')
    ff_gp = sum(int(gp) for gp, ff in deals if ff == 'YES')
    print(f"Yoseph Israel:")
    print(f"  Off GP: ${off_gp:,}")
    print(f"  FF GP: ${ff_gp:,}")
    print(f"  Total: ${off_gp + ff_gp:,}")
    print(f"  Tier 1: 2% off, 1.3333% ff")
    comm = off_gp * 0.02 + ff_gp * 0.013333
    print(f"  Commission: ${comm:,.2f}")
