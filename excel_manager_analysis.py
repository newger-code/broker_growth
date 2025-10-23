#!/usr/bin/env python3
"""
EXCEL MANAGER FORMULA ANALYSIS
Working from Excel tier tables and formulas
"""

print("=" * 80)
print("MANAGER COMMISSION STRUCTURES FROM EXCEL")
print("=" * 80)

# Manager Type 2 - Team Override Tiers
print("\nACQ MANAGER TEAM OVERRIDE TIERS:")
print("Team GP Range    | Override Rate")
print("-----------------|---------------")
print("< $50,000        | 1.00%")
print("$50k - $100k     | 2.00%")
print("> $100k          | 3.00%")

print("\nDISPO MANAGER TEAM OVERRIDE TIERS:")
print("Team GP Range    | Off-Market | Flat-Fee")
print("-----------------|------------|----------")
print("< $50,000        | 1.50%      | 1.00%")
print("$50k - $100k     | 2.00%      | 1.50%")
print("> $100k          | 2.50%      | 2.00%")

print("\n" + "=" * 80)
print("MANAGER CALCULATIONS")
print("=" * 80)

# Manager 1: Luis Guzman (ACQ Manager Type 2)
print("\n1. LUIS GUZMAN (ACQ Manager - Type 2)")
print("-" * 40)

# Luis's personal deals
luis_personal_deals = [
    {'addr': '118 Cedar Pl', 'gp': 13199},
    {'addr': '202 W White Horse Pike', 'gp': 15475},
    {'addr': '1846 Lyons St', 'gp': 20000},
    {'addr': '518 N Indiana St', 'gp': 7000},
    {'addr': '504 Peach St', 'gp': 4629}
]

luis_personal_gp = sum(d['gp'] for d in luis_personal_deals)
print(f"Personal GP: ${luis_personal_gp:,}")

# Luis's team members and their GP
luis_team = {
    'Kyle Singer': 83227,
    'Dominick Mazliah': 77787,
    'Andrew Caceres': 77053
}
# Subtract Luis's own GP from team total since he's also in ACQ
luis_team_gp = sum(luis_team.values()) - luis_personal_gp
print(f"Team GP (excluding Luis): ${luis_team_gp:,}")

# Personal commission - Luis gets Tier 3 (50k-100k)
print(f"\nPersonal tier for ${luis_personal_gp:,}: Tier 3 (8.00%)")
luis_personal_comm = luis_personal_gp * 0.08

# Team override - check tier
if luis_team_gp > 100000:
    team_rate = 0.03
    tier_name = "Tier 3"
elif luis_team_gp >= 50000:
    team_rate = 0.02
    tier_name = "Tier 2"
else:
    team_rate = 0.01
    tier_name = "Tier 1"

print(f"Team override tier for ${luis_team_gp:,}: {tier_name} ({team_rate*100:.1f}%)")
luis_team_comm = luis_team_gp * team_rate

luis_sprint = 150

print(f"\nPersonal: ${luis_personal_gp:,} × 8.00% = ${luis_personal_comm:,.2f}")
print(f"Team Override: ${luis_team_gp:,} × {team_rate*100:.1f}% = ${luis_team_comm:,.2f}")
print(f"Sprint: ${luis_sprint}")
print(f"TOTAL: ${luis_personal_comm + luis_team_comm + luis_sprint:,.2f}")

# Manager 2: Joe Haupt (DISPO Manager Type 2)
print("\n2. JOE HAUPT (DISPO Manager - Type 2)")
print("-" * 40)

# Joe's personal deals
joe_personal_deals = [
    {'addr': '1311 E Garfield Ave', 'gp': 4978, 'ff': 'NO'},
    {'addr': '926 Morton St', 'gp': 15900, 'ff': 'YES'},
    {'addr': '514 S College St', 'gp': 14186, 'ff': 'YES'},
    {'addr': '291 Pinewood Dr', 'gp': 4687, 'ff': 'YES'},
    {'addr': '509 West St N', 'gp': 8885, 'ff': 'YES'},
    {'addr': '202 W White Horse Pike', 'gp': 15475, 'ff': 'YES'},
    {'addr': '1011 Massengill St', 'gp': 53212, 'ff': 'NO'}
]

joe_personal_gp = sum(d['gp'] for d in joe_personal_deals)
joe_personal_off = sum(d['gp'] for d in joe_personal_deals if d['ff'] == 'NO')
joe_personal_ff = sum(d['gp'] for d in joe_personal_deals if d['ff'] == 'YES')

print(f"Personal Total GP: ${joe_personal_gp:,}")
print(f"Personal Off-Market: ${joe_personal_off:,}")
print(f"Personal Flat-Fee: ${joe_personal_ff:,}")

# Joe's team members
joe_team = {
    'Christian Flasch': 54396,
    'Jack Webster': 41863,
    'Yoseph Israel': 11600
}
joe_team_gp = sum(joe_team.values())
# Assuming 70% off-market, 30% flat-fee for team
joe_team_off = joe_team_gp * 0.7
joe_team_ff = joe_team_gp * 0.3

print(f"\nTeam GP: ${joe_team_gp:,}")
print(f"Team Off-Market (est 70%): ${joe_team_off:,.0f}")
print(f"Team Flat-Fee (est 30%): ${joe_team_ff:,.0f}")

# Personal commission - Joe gets Tier 7 (150k-175k)
print(f"\nPersonal tier for ${joe_personal_gp:,}: Tier 7")
print("Tier 7 rates: 8.00% off-market, 5.33% flat-fee")
joe_personal_off_comm = joe_personal_off * 0.08
joe_personal_ff_comm = joe_personal_ff * 0.05333333
joe_personal_comm = joe_personal_off_comm + joe_personal_ff_comm

# Team override
if joe_team_gp > 100000:
    team_off_rate = 0.025
    team_ff_rate = 0.02
    tier_name = "Tier 3"
elif joe_team_gp >= 50000:
    team_off_rate = 0.02
    team_ff_rate = 0.015
    tier_name = "Tier 2"
else:
    team_off_rate = 0.015
    team_ff_rate = 0.01
    tier_name = "Tier 1"

print(f"Team override tier for ${joe_team_gp:,}: {tier_name}")
print(f"Team rates: {team_off_rate*100:.1f}% off-market, {team_ff_rate*100:.1f}% flat-fee")

joe_team_off_comm = joe_team_off * team_off_rate
joe_team_ff_comm = joe_team_ff * team_ff_rate
joe_team_comm = joe_team_off_comm + joe_team_ff_comm

joe_sprint = 300

print(f"\nPersonal Off-Market: ${joe_personal_off:,} × 8.00% = ${joe_personal_off_comm:,.2f}")
print(f"Personal Flat-Fee: ${joe_personal_ff:,} × 5.33% = ${joe_personal_ff_comm:,.2f}")
print(f"Personal Total: ${joe_personal_comm:,.2f}")
print(f"\nTeam Off-Market: ${joe_team_off:,.0f} × {team_off_rate*100:.1f}% = ${joe_team_off_comm:,.2f}")
print(f"Team Flat-Fee: ${joe_team_ff:,.0f} × {team_ff_rate*100:.1f}% = ${joe_team_ff_comm:,.2f}")
print(f"Team Total: ${joe_team_comm:,.2f}")
print(f"\nSprint: ${joe_sprint}")
print(f"TOTAL: ${joe_personal_comm + joe_team_comm + joe_sprint:,.2f}")

print("\n" + "=" * 80)
print("SUMMARY OF MY MANAGER CALCULATIONS")
print("=" * 80)
print(f"Luis Guzman: ${luis_personal_comm + luis_team_comm + luis_sprint:,.2f}")
print(f"Joe Haupt: ${joe_personal_comm + joe_team_comm + joe_sprint:,.2f}")