#!/usr/bin/env python3
"""
FINAL LINE-BY-LINE COMPARISON
Calculator calculations vs ACTUAL Excel SEPTEMBER SUMMARY values
"""

# Excel SEPTEMBER SUMMARY values (the GOLD STANDARD)
excel_payouts = {
    # ACQ Agents
    'Kyle Singer': 7368.16,
    'Dominick Mazliah': 6222.96,
    'Andrew Caceres': 6164.24,
    'Jesse Sychowski': 5210.00,
    'Ashley Preston': 4959.84,
    'Warren Smith': 2122.90,
    'Chris Chambers': 1753.50,
    'Ian Ross': 420.00,
    'Terrell Johnson': 400.00,
    'Garrett Paschal': 329.40,
    'Steve Shelburne': 240.00,
    'Steven Stack': 200.00,
    'Jarod Weaver': 100.00,
    # ACQ Managers
    'Luis Guzman': 8780.43,
    'Shon Yoshida': 7513.40,
    'Patrick Solomon': 6043.56,
    'Devin Buford': 1900.30,
    # DISPO Agents
    'Alec Prieto': 8361.44,
    'Devin Cooper': 2175.94,
    'Vincent Gnapi': 1943.56,
    'Christian Flasch': 1769.00,
    'Miguel Aguilar': 1762.07,
    'Leland Boyd': 1117.32,
    'Brittany Taylor': 1096.78,
    'Jack Webster': 937.26,
    'Tamara Humbolt': 940.00,
    'Yoseph Israel': 232.00,
    'Ex Rebuilt': 220.00,
    'Mel Grant': 180.00,
    'Devin Hoffman': 143.13,
    'Kayla Watkins': 100.00,
    'Kirk Schaafsma': 100.00,
    # DISPO Managers
    'Joe Haupt': 8452.81,
    'Rob Gorski': 3672.31,
    'Maegan Grace': 3260.74,
    # UW
    'Dustin Hepburn': 1346.26
}

# People in calculator
calculator_people = [
    # DISPO
    'Alec Prieto', 'Ex Rebuilt',
    # ACQ
    'Jesse Sychowski', 'Kyle Singer', 'Warren Smith', 'Christian Flasch',
    'Dominick Mazliah', 'Jack Webster', 'Andrew Caceres', 'Yoseph Israel',
    # Sprint-only
    'Terrell Johnson', 'Steven Stack', 'Jarod Weaver', 'Kayla Watkins', 'Kirk Schaafsma',
    # Managers
    'Luis Guzman', 'Joe Haupt'
]

# DISPO tier function
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

# ACQ tier function
def get_acq_tier(gp):
    if gp < 25000: return {'tier': 1, 'rate': 0.04}
    if gp < 50000: return {'tier': 2, 'rate': 0.06}
    if gp < 100000: return {'tier': 3, 'rate': 0.08}
    return {'tier': 4, 'rate': 0.10}

# Sprint bonuses
sprints = {
    'Alec Prieto': 350, 'Jesse Sychowski': 300, 'Kyle Singer': 550, 'Warren Smith': 200,
    'Christian Flasch': 350, 'Dominick Mazliah': 300, 'Jack Webster': 350, 'Andrew Caceres': 150,
    'Yoseph Israel': 350, 'Joe Haupt': 300, 'Luis Guzman': 150, 'Terrell Johnson': 400,
    'Steven Stack': 200, 'Jarod Weaver': 350, 'Kayla Watkins': 250, 'Kirk Schaafsma': 250
}

# Agent GP data (from calculator code)
agents = {
    # DISPO
    'Alec Prieto': {'type': 'dispo', 'off_gp': 93403, 'ff_gp': 31569, 'total_gp': 124972, 'override': 'tier6'},
    'Ex Rebuilt': {'type': 'dispo', 'off_gp': 0, 'ff_gp': 16500, 'total_gp': 16500, 'override': 'tier1'},
    # ACQ
    'Jesse Sychowski': {'type': 'acq', 'gp': 61375},
    'Kyle Singer': {'type': 'acq', 'gp': 83227},
    'Warren Smith': {'type': 'acq', 'gp': 33715},
    'Christian Flasch': {'type': 'acq', 'gp': 54396},
    'Dominick Mazliah': {'type': 'acq', 'gp': 77787},
    'Jack Webster': {'type': 'acq', 'gp': 41863},
    'Andrew Caceres': {'type': 'acq', 'gp': 77053},
    'Yoseph Israel': {'type': 'acq', 'gp': 11600},
    # Sprint-only
    'Terrell Johnson': {'type': 'sprint_only'},
    'Steven Stack': {'type': 'sprint_only'},
    'Jarod Weaver': {'type': 'sprint_only'},
    'Kayla Watkins': {'type': 'sprint_only'},
    'Kirk Schaafsma': {'type': 'sprint_only'},
    # Managers
    'Luis Guzman': {'type': 'manager', 'personal': 4824.24, 'team': 3806.19, 'sprint': 150},
    'Joe Haupt': {'type': 'manager', 'personal': 5856.72, 'team': 2296.09, 'sprint': 300}
}

print("=" * 110)
print("FINAL COMPARISON: Calculator vs Excel SEPTEMBER SUMMARY")
print("=" * 110)

print(f"\n{'Name':<20} | {'Type':<12} | {'GP':<12} | {'Tier/Rate':<12} | {'Base Comm':<12} | {'Sprint':<8} | {'Calc Total':<12} | {'Excel':<12} | {'Diff':<10}")
print("-" * 110)

calc_total = 0
excel_total = 0

for name in calculator_people:
    if name not in agents:
        continue

    data = agents[name]
    agent_type = data['type']
    sprint = sprints.get(name, 0)
    excel_val = excel_payouts.get(name, 0)

    if agent_type == 'dispo':
        off_gp = data['off_gp']
        ff_gp = data['ff_gp']
        total_gp = data['total_gp']

        # Handle overrides
        if data.get('override') == 'tier6':
            tier = {'tier': 6, 'off': 0.07, 'ff': 0.046667}
        elif data.get('override') == 'tier1':
            tier = {'tier': 1, 'off': 0.02, 'ff': 0.013333}
        else:
            tier = get_dispo_tier(total_gp)

        base = off_gp * tier['off'] + ff_gp * tier['ff']
        calc_val = base + sprint

        print(f"{name:<20} | {'DISPO':<12} | ${total_gp:<11,} | T{tier['tier']:<11} | ${base:<11.2f} | ${sprint:<7} | ${calc_val:<11.2f} | ${excel_val:<11.2f} | ${calc_val-excel_val:>9.2f}")

    elif agent_type == 'acq':
        gp = data['gp']
        tier = get_acq_tier(gp)
        base = gp * tier['rate']
        calc_val = base + sprint

        print(f"{name:<20} | {'ACQ':<12} | ${gp:<11,} | T{tier['tier']} {tier['rate']:.0%}{'':6} | ${base:<11.2f} | ${sprint:<7} | ${calc_val:<11.2f} | ${excel_val:<11.2f} | ${calc_val-excel_val:>9.2f}")

    elif agent_type == 'sprint_only':
        calc_val = sprint
        print(f"{name:<20} | {'Sprint Only':<12} | ${'0':<11} | {'-':<12} | ${0.0:<11.2f} | ${sprint:<7} | ${calc_val:<11.2f} | ${excel_val:<11.2f} | ${calc_val-excel_val:>9.2f}")

    elif agent_type == 'manager':
        personal = data['personal']
        team = data['team']
        mgr_sprint = data['sprint']
        calc_val = personal + team + mgr_sprint

        print(f"{name:<20} | {'Manager':<12} | {'-':<12} | {'-':<12} | ${personal+team:<11.2f} | ${mgr_sprint:<7} | ${calc_val:<11.2f} | ${excel_val:<11.2f} | ${calc_val-excel_val:>9.2f}")

    calc_total += calc_val
    excel_total += excel_val

print("-" * 110)
print(f"{'TOTALS':<20} | {'':<12} | {'':<12} | {'':<12} | {'':<12} | {'':<8} | ${calc_total:<11.2f} | ${excel_total:<11.2f} | ${calc_total-excel_total:>9.2f}")

print("\n" + "=" * 110)
print("DISCREPANCY ANALYSIS")
print("=" * 110)

# Find all non-zero differences
diffs = []
for name in calculator_people:
    if name not in agents:
        continue
    data = agents[name]
    agent_type = data['type']
    sprint = sprints.get(name, 0)
    excel_val = excel_payouts.get(name, 0)

    if agent_type == 'dispo':
        off_gp = data['off_gp']
        ff_gp = data['ff_gp']
        total_gp = data['total_gp']
        if data.get('override') == 'tier6':
            tier = {'tier': 6, 'off': 0.07, 'ff': 0.046667}
        elif data.get('override') == 'tier1':
            tier = {'tier': 1, 'off': 0.02, 'ff': 0.013333}
        else:
            tier = get_dispo_tier(total_gp)
        calc_val = off_gp * tier['off'] + ff_gp * tier['ff'] + sprint
    elif agent_type == 'acq':
        gp = data['gp']
        tier = get_acq_tier(gp)
        calc_val = gp * tier['rate'] + sprint
    elif agent_type == 'sprint_only':
        calc_val = sprint
    else:  # manager
        calc_val = data['personal'] + data['team'] + data['sprint']

    diff = calc_val - excel_val
    if abs(diff) > 0.02:  # More than 2 cents
        diffs.append((name, diff, agent_type))

if diffs:
    print("\nPeople with differences > $0.02:")
    for name, diff, atype in sorted(diffs, key=lambda x: abs(x[1]), reverse=True):
        print(f"  {name:<20} {atype:<12} ${diff:>10.2f}")
else:
    print("\n✓ All calculations match Excel within rounding!")
