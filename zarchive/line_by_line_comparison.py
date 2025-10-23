#!/usr/bin/env python3
"""
LINE-BY-LINE COMPARISON: Calculator Formulas vs V2 Screenshots
Calculating what the calculator SHOULD produce based on its code
"""

# DISPO Tier Rates (from calculator code lines 1310-1320)
def get_dispo_tier(gp):
    if gp < 25000: return {'tier': 1, 'off': 0.02, 'ff': 0.013333}
    if gp < 50000: return {'tier': 2, 'off': 0.03, 'ff': 0.02}
    if gp < 75000: return {'tier': 3, 'off': 0.04, 'ff': 0.026667}
    if gp < 100000: return {'tier': 4, 'off': 0.05, 'ff': 0.033333}
    if gp < 125000: return {'tier': 5, 'off': 0.06, 'ff': 0.04}
    if gp < 150000: return {'tier': 6, 'off': 0.07, 'ff': 0.046667}
    if gp < 175000: return {'tier': 7, 'off': 0.08, 'ff': 0.053333}
    if gp < 200000: return {'tier': 8, 'off': 0.09, 'ff': 0.06}
    return {'tier': 9, 'off': 0.10, 'ff': 0.066667}

# ACQ Tier Rates (from calculator code)
def get_acq_tier(gp):
    if gp < 25000: return {'tier': 1, 'rate': 0.04}
    if gp < 50000: return {'tier': 2, 'rate': 0.06}
    if gp < 100000: return {'tier': 3, 'rate': 0.08}
    return {'tier': 4, 'rate': 0.10}

# Sprint bonuses (from Sprint Winners sheet)
sprints = {
    'Alec Prieto': 350,
    'Jesse Sychowski': 300,
    'Kyle Singer': 550,
    'Warren Smith': 200,
    'Christian Flasch': 350,
    'Dominick Mazliah': 300,
    'Jack Webster': 350,
    'Andrew Caceres': 150,
    'Yoseph Israel': 350,
    'Joe Haupt': 300,
    'Luis Guzman': 150,
    'Terrell Johnson': 400,
    'Steven Stack': 200,
    'Jarod Weaver': 350,
    'Kayla Watkins': 250,
    'Kirk Schaafsma': 250,
    'David Baer': 250,
    'Mark Schomaker': 50,
    'Brad Willen': 100,
    'Scott Schomaker': 50
}

# DISPO AGENTS - calculated from deal data
dispo_agents = {
    'Alec Prieto': {'off_gp': 93403, 'ff_gp': 31569, 'total_gp': 124972, 'override_tier': 6},
    'Ex Rebuilt': {'off_gp': 0, 'ff_gp': 16500, 'total_gp': 16500, 'override_tier': 1},
}

# ACQ AGENTS - calculated from deal data
acq_agents = {
    'Jesse Sychowski': {'gp': 61375},
    'Kyle Singer': {'gp': 83227},
    'Warren Smith': {'gp': 33715},
    'Christian Flasch': {'gp': 54396},
    'Dominick Mazliah': {'gp': 77787},
    'Jack Webster': {'gp': 41863},
    'Andrew Caceres': {'gp': 77053},
    'Yoseph Israel': {'gp': 11600},
}

# MANAGERS (from V2 dashboard JSON data)
managers = {
    'Luis Guzman': {
        'type': 'ACQ Type 2',
        'personal_gp': 60303,
        'personal_rate': 0.08,
        'personal_comm': 4824.24,
        'team_gp': 126873,
        'team_rate': 0.03,
        'team_comm': 3806.19,
        'sprint': 150,
        'v2_total': 8780.43
    },
    'Joe Haupt': {
        'type': 'DISPO Type 2',
        'personal_off_gp': 58190,
        'personal_ff_gp': 59133,
        'personal_comm': 5856.72,
        'team_off_gp': 28182,
        'team_ff_gp': 79577,
        'team_off_rate': 0.025,
        'team_ff_rate': 0.02,
        'team_comm': 2296.09,
        'sprint': 300,
        'v2_total': 8452.81
    }
}

# Sprint-only agents
sprint_only = ['Terrell Johnson', 'Steven Stack', 'Jarod Weaver', 'Kayla Watkins', 'Kirk Schaafsma']

print("=" * 100)
print("LINE-BY-LINE COMPARISON: Calculator Formula Results vs V2 Dashboard")
print("=" * 100)

print("\n" + "=" * 100)
print("DISPO AGENTS")
print("=" * 100)
print(f"{'Agent':<20} | {'GP Total':<12} | {'Off GP':<12} | {'FF GP':<12} | {'Tier':<6} | {'Calc Comm':<12} | {'Sprint':<8} | {'Calc Total':<12} | {'V2 Total':<12} | {'Diff':<10}")
print("-" * 100)

dispo_calc_total = 0
for name, data in dispo_agents.items():
    total_gp = data['total_gp']
    off_gp = data['off_gp']
    ff_gp = data['ff_gp']

    # Special case overrides
    if name == 'Alec Prieto':
        tier = get_dispo_tier(150000)  # Hardcoded to tier 6
    elif name == 'Ex Rebuilt':
        tier = get_dispo_tier(0)  # Always tier 1
    else:
        tier = get_dispo_tier(total_gp)

    off_comm = off_gp * tier['off']
    ff_comm = ff_gp * tier['ff']
    base_comm = off_comm + ff_comm
    sprint = sprints.get(name, 0)
    calc_total = base_comm + sprint

    # V2 values from screenshots/Excel
    v2_values = {
        'Alec Prieto': 8361.44,
        'Ex Rebuilt': 220.00
    }
    v2_total = v2_values.get(name, 0)
    diff = calc_total - v2_total

    print(f"{name:<20} | ${total_gp:<11,} | ${off_gp:<11,} | ${ff_gp:<11,} | {tier['tier']:<6} | ${base_comm:<11.2f} | ${sprint:<7} | ${calc_total:<11.2f} | ${v2_total:<11.2f} | ${diff:<9.2f}")
    dispo_calc_total += calc_total

print("\n" + "=" * 100)
print("ACQ AGENTS")
print("=" * 100)
print(f"{'Agent':<20} | {'GP':<12} | {'Tier':<6} | {'Rate':<8} | {'Calc Comm':<12} | {'Sprint':<8} | {'Calc Total':<12} | {'V2 Total':<12} | {'Diff':<10}")
print("-" * 100)

acq_calc_total = 0
for name, data in acq_agents.items():
    gp = data['gp']
    tier = get_acq_tier(gp)
    base_comm = gp * tier['rate']
    sprint = sprints.get(name, 0)
    calc_total = base_comm + sprint

    # V2 values from screenshots/Excel
    v2_values = {
        'Jesse Sychowski': 5210.00,
        'Kyle Singer': 7368.16,  # Includes $160 manual adjustment
        'Warren Smith': 2894.00,
        'Christian Flasch': 4526.96,
        'Dominick Mazliah': 6522.96,
        'Jack Webster': 3699.04,
        'Andrew Caceres': 6314.24,
        'Yoseph Israel': 814.00
    }
    v2_total = v2_values.get(name, 0)
    diff = calc_total - v2_total

    print(f"{name:<20} | ${gp:<11,} | {tier['tier']:<6} | {tier['rate']:<8.2%} | ${base_comm:<11.2f} | ${sprint:<7} | ${calc_total:<11.2f} | ${v2_total:<11.2f} | ${diff:<9.2f}")
    acq_calc_total += calc_total

print("\n" + "=" * 100)
print("SPRINT-ONLY AGENTS (No Deals)")
print("=" * 100)
print(f"{'Agent':<20} | {'Sprint':<8} | {'Calc Total':<12} | {'V2 Total':<12} | {'Diff':<10}")
print("-" * 100)

sprint_calc_total = 0
for name in sprint_only:
    sprint = sprints.get(name, 0)
    calc_total = sprint

    # V2 values
    v2_values = {
        'Terrell Johnson': 400.00,
        'Steven Stack': 200.00,
        'Jarod Weaver': 350.00,
        'Kayla Watkins': 250.00,
        'Kirk Schaafsma': 250.00
    }
    v2_total = v2_values.get(name, 0)
    diff = calc_total - v2_total

    print(f"{name:<20} | ${sprint:<7} | ${calc_total:<11.2f} | ${v2_total:<11.2f} | ${diff:<9.2f}")
    sprint_calc_total += calc_total

print("\n" + "=" * 100)
print("MANAGERS")
print("=" * 100)
print(f"{'Manager':<20} | {'Type':<15} | {'Personal':<12} | {'Team':<12} | {'Sprint':<8} | {'Calc Total':<12} | {'V2 Total':<12} | {'Diff':<10}")
print("-" * 100)

manager_calc_total = 0
for name, data in managers.items():
    personal = data['personal_comm']
    team = data['team_comm']
    sprint = data['sprint']
    calc_total = personal + team + sprint
    v2_total = data['v2_total']
    diff = calc_total - v2_total

    print(f"{name:<20} | {data['type']:<15} | ${personal:<11.2f} | ${team:<11.2f} | ${sprint:<7} | ${calc_total:<11.2f} | ${v2_total:<11.2f} | ${diff:<9.2f}")
    manager_calc_total += calc_total

print("\n" + "=" * 100)
print("TOTALS")
print("=" * 100)

total_calc = dispo_calc_total + acq_calc_total + sprint_calc_total + manager_calc_total
total_v2 = 8361.44 + 220.00 + 5210.00 + 7368.16 + 2894.00 + 4526.96 + 6522.96 + 3699.04 + 6314.24 + 814.00 + 400.00 + 200.00 + 350.00 + 250.00 + 250.00 + 8780.43 + 8452.81

print(f"{'Category':<20} | {'Calculator Total':<15} | {'V2 Total':<15}")
print("-" * 60)
print(f"{'DISPO Agents':<20} | ${dispo_calc_total:<14.2f} | ${'TBD':<14}")
print(f"{'ACQ Agents':<20} | ${acq_calc_total:<14.2f} | ${'TBD':<14}")
print(f"{'Sprint-Only':<20} | ${sprint_calc_total:<14.2f} | ${1450.00:<14.2f}")
print(f"{'Managers':<20} | ${manager_calc_total:<14.2f} | ${17233.24:<14.2f}")
print("-" * 60)
print(f"{'GRAND TOTAL':<20} | ${total_calc:<14.2f} | ${total_v2:<14.2f}")
print(f"{'Difference':<20} | ${total_calc - total_v2:<14.2f}")
print()
print(f"Excel Target: $97,539.31")
print(f"Calculator vs Excel: ${total_calc - 97539.31:.2f}")
