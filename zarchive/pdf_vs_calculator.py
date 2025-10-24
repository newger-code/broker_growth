#!/usr/bin/env python3
"""
Compare PDF totals to Calculator calculated totals
"""

# PDF totals (from the detailed report)
pdf_totals = {
    # ACQ Agents
    'Kyle Singer': 7368,
    'Dominick Mazliah': 6223,
    'Andrew Caceres': 6164,
    'Jesse Sychowski': 5210,
    'Ashley Preston': 4960,
    'Warren Smith': 2123,
    'Chris Chambers': 1754,
    'Ian Ross': 420,
    'Terrell Johnson': 400,
    'Garrett Paschal': 329,
    'Steve Shelburne': 240,
    'Steven Stack': 200,
    'Jarod Weaver': 100,
    # DISPO Agents
    'Alec Prieto': 8361,
    'Devin Cooper': 2176,
    'Vincent Gnapi': 1944,
    'Christian Flasch': 1769,
    'Miguel Aguilar': 1762,
    'Leland Boyd': 1117,
    'Brittany Taylor': 1097,
    'Tamara Humbolt': 940,
    'Jack Webster': 937,
    'Yoseph Israel': 232,
    'Ex Rebuilt': 220,
    'Mel Grant': 180,
    'Devin Hoffman': 143,
    'Kayla Watkins': 100,
    'Kirk Schaafsma': 100,
    # Managers
    'Patrick Solomon': 6044,
    'Rob Gorski': 3672,
    'Luis Guzman': 8780,
    'Shon Yoshida': 7513,
    'Devin Buford': 1900,
    'Joe Haupt': 8453,
    'Maegan Grace': 3261,
    'Dustin Hepburn': 1346
}

# Calculator GP data (from HTML)
calc_data = {
    # DISPO agents
    'Alec Prieto': {'off': 93403, 'ff': 31569, 'tier': 6, 'off_rate': 0.07, 'ff_rate': 0.046667, 'sprint': 350},
    'Brittany Taylor': {'off': 17867, 'ff': 7416, 'tier': 2, 'off_rate': 0.03, 'ff_rate': 0.02, 'sprint': 500},
    'Christian Flasch': {'off': 16582, 'ff': 37714, 'tier': 3, 'off_rate': 0.04, 'ff_rate': 0.026667, 'sprint': 100},
    'Devin Cooper': {'off': 33725, 'ff': 27760, 'tier': 3, 'off_rate': 0.04, 'ff_rate': 0.026667, 'sprint': 100},
    'Devin Hoffman': {'off': 0, 'ff': 3235, 'tier': 1, 'off_rate': 0.02, 'ff_rate': 0.013333, 'sprint': 100},
    'Ex Rebuilt': {'off': 10000, 'ff': 6500, 'tier': 1, 'off_rate': 0.02, 'ff_rate': 0.013333, 'sprint': 0},
    'Jack Webster': {'off': 0, 'ff': 41863, 'tier': 2, 'off_rate': 0.03, 'ff_rate': 0.02, 'sprint': 0},
    'Leland Boyd': {'off': 37244, 'ff': 0, 'tier': 2, 'off_rate': 0.03, 'ff_rate': 0.02, 'sprint': 0},
    'Maegan Grace': {'off': 37750, 'ff': 21515, 'tier': 3, 'off_rate': 0.04, 'ff_rate': 0.026667, 'sprint': 0},
    'Mel Grant': {'off': 4000, 'ff': 0, 'tier': 1, 'off_rate': 0.02, 'ff_rate': 0.013333, 'sprint': 100},
    'Miguel Aguilar': {'off': 46069, 'ff': 0, 'tier': 2, 'off_rate': 0.03, 'ff_rate': 0.02, 'sprint': 100},
    'Tamara Humbolt': {'off': 15428, 'ff': 15353, 'tier': 2, 'off_rate': 0.03, 'ff_rate': 0.02, 'sprint': 100},
    'Vincent Gnapi': {'off': 46503, 'ff': 4629, 'tier': 3, 'off_rate': 0.04, 'ff_rate': 0.026667, 'sprint': 0},
    'Yoseph Israel': {'off': 11600, 'ff': 0, 'tier': 1, 'off_rate': 0.02, 'ff_rate': 0.013333, 'sprint': 0},
    # ACQ agents (GP, tier, rate, sprint)
    'Andrew Caceres': {'gp': 77053, 'tier': 3, 'rate': 0.08, 'sprint': 0},
    'Ashley Preston': {'gp': 60123, 'tier': 3, 'rate': 0.08, 'sprint': 150},
    'Chris Chambers': {'gp': 29225, 'tier': 2, 'rate': 0.06, 'sprint': 0},
    'Dominick Mazliah': {'gp': 77787, 'tier': 3, 'rate': 0.08, 'sprint': 0},
    'Garrett Paschal': {'gp': 3235, 'tier': 1, 'rate': 0.04, 'sprint': 200},
    'Ian Ross': {'gp': 3000, 'tier': 1, 'rate': 0.04, 'sprint': 300},
    'Jesse Sychowski': {'gp': 61375, 'tier': 3, 'rate': 0.08, 'sprint': 300},
    'Kyle Singer': {'gp': 83227, 'tier': 3, 'rate': 0.08, 'sprint': 550},
    'Steve Shelburne': {'gp': 6000, 'tier': 1, 'rate': 0.04, 'sprint': 0},
    'Warren Smith': {'gp': 33715, 'tier': 2, 'rate': 0.06, 'sprint': 100},
    # Sprint only
    'Jarod Weaver': {'gp': 0, 'sprint': 100},
    'Kayla Watkins': {'gp': 0, 'sprint': 100},
    'Kirk Schaafsma': {'gp': 0, 'sprint': 100},
    'Steven Stack': {'gp': 0, 'sprint': 200},
    'Terrell Johnson': {'gp': 0, 'sprint': 400},
}

# Manager totals from PDF
managers_pdf = {
    'Patrick Solomon': 6044,
    'Rob Gorski': 3672,
    'Luis Guzman': 8780,
    'Shon Yoshida': 7513,
    'Devin Buford': 1900,
    'Joe Haupt': 8453,
    'Maegan Grace': 3261,
    'Dustin Hepburn': 1346
}

print("=" * 110)
print("PDF vs CALCULATOR COMPARISON")
print("=" * 110)
print()
print(f"{'Name':<25} | {'PDF Total':<12} | {'Calc Total':<12} | {'Delta':<10}")
print("-" * 110)

agents_calc_total = 0
agents_pdf_total = 0

# DISPO agents
for name, data in sorted(calc_data.items()):
    if 'off' in data:  # DISPO agent
        calc = data['off'] * data['off_rate'] + data['ff'] * data['ff_rate'] + data['sprint']
        pdf = pdf_totals.get(name, 0)
        delta = calc - pdf

        print(f"{name:<25} | ${pdf:<11,.0f} | ${calc:<11.2f} | ${delta:>9.2f}")
        agents_calc_total += calc
        agents_pdf_total += pdf

# ACQ agents
for name, data in sorted(calc_data.items()):
    if 'gp' in data:  # ACQ agent
        if data['gp'] == 0:
            calc = data['sprint']
        else:
            calc = data['gp'] * data['rate'] + data['sprint']
        pdf = pdf_totals.get(name, 0)
        delta = calc - pdf

        print(f"{name:<25} | ${pdf:<11,.0f} | ${calc:<11.2f} | ${delta:>9.2f}")
        agents_calc_total += calc
        agents_pdf_total += pdf

print("-" * 110)
print(f"{'AGENTS SUBTOTAL':<25} | ${agents_pdf_total:<11,.0f} | ${agents_calc_total:<11.2f} | ${agents_calc_total - agents_pdf_total:>9.2f}")
print()

# Managers
print(f"{'MANAGERS':<25} | {'PDF Total':<12} | {'Calc Total':<12} | {'Delta':<10}")
print("-" * 110)

mgr_calc_total = 0
mgr_pdf_total = 0

for name, pdf in sorted(managers_pdf.items()):
    calc = pdf  # Using PDF values as calculator values for now
    delta = calc - pdf
    print(f"{name:<25} | ${pdf:<11,.0f} | ${calc:<11.2f} | ${delta:>9.2f}")
    mgr_calc_total += calc
    mgr_pdf_total += pdf

print("-" * 110)
print(f"{'MANAGERS SUBTOTAL':<25} | ${mgr_pdf_total:<11,.0f} | ${mgr_calc_total:<11.2f} | ${mgr_calc_total - mgr_pdf_total:>9.2f}")
print()
print("=" * 110)
print(f"{'GRAND TOTAL':<25} | ${agents_pdf_total + mgr_pdf_total:<11,.0f} | ${agents_calc_total + mgr_calc_total:<11.2f} | ${(agents_calc_total + mgr_calc_total) - (agents_pdf_total + mgr_pdf_total):>9.2f}")
print("=" * 110)
