#!/usr/bin/env python3
"""
Verify commission calculations - EXCLUDING manager-agents from agent lists
Manager-agents (Luis, Shon, Devin, Joe Haupt, Maegan) should only be in manager calculations
"""

# Disposition tier structure (progressive)
def get_dispo_tier(total_gp):
    if total_gp >= 175000:
        return {'tier': 9, 'offRate': 0.10, 'ffRate': 0.0667}
    elif total_gp >= 150000:
        return {'tier': 8, 'offRate': 0.09, 'ffRate': 0.06}
    elif total_gp >= 125000:
        return {'tier': 7, 'offRate': 0.08, 'ffRate': 0.0533}
    elif total_gp >= 100000:
        return {'tier': 6, 'offRate': 0.07, 'ffRate': 0.0467}
    elif total_gp >= 75000:
        return {'tier': 5, 'offRate': 0.06, 'ffRate': 0.04}
    elif total_gp >= 60000:
        return {'tier': 4, 'offRate': 0.05, 'ffRate': 0.0333}
    elif total_gp >= 50000:
        return {'tier': 3, 'offRate': 0.04, 'ffRate': 0.0267}
    elif total_gp >= 25000:
        return {'tier': 2, 'offRate': 0.03, 'ffRate': 0.02}
    else:
        return {'tier': 1, 'offRate': 0.02, 'ffRate': 0.0133}

# Acquisition tier structure (blended)
def get_acq_tier(total_gp):
    if total_gp >= 100001:
        return {'tier': 4, 'rate': 0.10}
    elif total_gp >= 50001:
        return {'tier': 3, 'rate': 0.08}
    elif total_gp >= 25001:
        return {'tier': 2, 'rate': 0.06}
    else:
        return {'tier': 1, 'rate': 0.04}

# REAL Disposition data - EXCLUDING manager-agents (Joe Haupt, Maegan Grace)
dispoData = {
    'Alec Prieto': [
        {'gp': 18370, 'ff': True},
        {'gp': 15000, 'ff': False},
        {'gp': 23450, 'ff': False},
        {'gp': 25460, 'ff': True},
        {'gp': 18370, 'ff': True},
        {'gp': 9322, 'ff': True},
        {'gp': 15000, 'ff': True}
    ],
    'Devin Cooper': [
        {'gp': 13725, 'ff': False},
        {'gp': 15000, 'ff': False},
        {'gp': 6500, 'ff': True},
        {'gp': 10760, 'ff': True},
        {'gp': 15000, 'ff': True}
    ],
    'Vincent Gnapi': [
        {'gp': 26500, 'ff': False},
        {'gp': 15625, 'ff': True},
        {'gp': 8007, 'ff': True}
    ],
    'Christian Flasch': [
        {'gp': 17082, 'ff': False},
        {'gp': 23450, 'ff': False},
        {'gp': 9214, 'ff': True},
        {'gp': 4550, 'ff': True}
    ],
    'Miguel Aguilar': [
        {'gp': 33069, 'ff': False},
        {'gp': 15000, 'ff': True}
    ],
    'Leland Boyd': [
        {'gp': 13500, 'ff': False},
        {'gp': 8744, 'ff': True},
        {'gp': 15000, 'ff': True}
    ],
    'Brittany Taylor': [
        {'gp': 9866, 'ff': True},
        {'gp': 15000, 'ff': True}
    ],
    'Tamara Humbolt': [
        {'gp': 5753, 'ff': True},
        {'gp': 10700, 'ff': True},
        {'gp': 15000, 'ff': True}
    ],
    'Jack Webster': [
        {'gp': 26863, 'ff': True}
    ],
    'William Sondergard': [
        {'gp': 14090, 'ff': True}
    ],
    'Daniel Simoni': [
        {'gp': 3910, 'ff': True}
    ],
    'Tom Coutts': [
        {'gp': 23450, 'ff': False}
    ]
}

# REAL Acquisition data - EXCLUDING manager-agents (Luis Guzman, Shon Yoshida, Devin Buford)
acqData = {
    'Andrew Caceres': [
        {'gp': 22125, 'ff': True},
        {'gp': 15000, 'ff': False},
        {'gp': 10760, 'ff': True},
        {'gp': 9168, 'ff': True},
        {'gp': 20000, 'ff': True}
    ],
    'Ashley Preston': [
        {'gp': 18260, 'ff': True},
        {'gp': 41863, 'ff': True}
    ],
    'Chris Chambers': [
        {'gp': 9214, 'ff': True},
        {'gp': 20011, 'ff': True}
    ],
    'Dominick Mazliah': [
        {'gp': 72080, 'ff': False},
        {'gp': 5707, 'ff': True}
    ],
    'Garrett Paschal': [
        {'gp': 3235, 'ff': True}
    ],
    'Ian Ross': [
        {'gp': 3000, 'ff': True}
    ],
    'Jesse Sychowski': [
        {'gp': 21500, 'ff': False},
        {'gp': 23450, 'ff': False},
        {'gp': 16425, 'ff': True}
    ],
    'Kyle Singer': [
        {'gp': 18370, 'ff': True},
        {'gp': 25460, 'ff': True},
        {'gp': 18370, 'ff': True},
        {'gp': 6027, 'ff': True},
        {'gp': 15000, 'ff': True}
    ],
    'Warren Smith': [
        {'gp': 13500, 'ff': False},
        {'gp': 20215, 'ff': True}
    ]
}

print("=" * 80)
print("DISPOSITION AGENTS - EXCLUDING MANAGER-AGENTS")
print("=" * 80)

dispo_total_commission = 0
dispo_total_gp = 0

for agent, deals in dispoData.items():
    off_market_gp = sum(d['gp'] for d in deals if not d['ff'])
    flat_fee_gp = sum(d['gp'] for d in deals if d['ff'])
    total_gp = off_market_gp + flat_fee_gp

    tier = get_dispo_tier(total_gp)
    commission = (off_market_gp * tier['offRate']) + (flat_fee_gp * tier['ffRate'])

    dispo_total_commission += commission
    dispo_total_gp += total_gp

    print(f"{agent:25} GP: ${total_gp:>8,.0f} (Off: ${off_market_gp:>8,.0f}, FF: ${flat_fee_gp:>8,.0f}) "
          f"Tier {tier['tier']} → ${commission:>8,.2f}")

print(f"\n{'TOTAL DISPO':25} GP: ${dispo_total_gp:>8,.0f} → Commission: ${dispo_total_commission:>8,.2f}")

print("\n" + "=" * 80)
print("ACQUISITION AGENTS - EXCLUDING MANAGER-AGENTS")
print("=" * 80)

acq_total_commission = 0
acq_total_gp = 0

for agent, deals in acqData.items():
    total_gp = sum(d['gp'] for d in deals)

    tier = get_acq_tier(total_gp)
    commission = total_gp * tier['rate']

    acq_total_commission += commission
    acq_total_gp += total_gp

    print(f"{agent:25} GP: ${total_gp:>8,.0f} Tier {tier['tier']} → ${commission:>8,.2f}")

print(f"\n{'TOTAL ACQ':25} GP: ${acq_total_gp:>8,.0f} → Commission: ${acq_total_commission:>8,.2f}")

print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)
print(f"Agent Commissions (excluding manager-agents): ${acq_total_commission + dispo_total_commission:,.2f}")
print(f"  - Acq Agents:    ${acq_total_commission:,.2f}")
print(f"  - Dispo Agents:  ${dispo_total_commission:,.2f}")
print(f"\nManager Commissions (from v2, includes manager-agent personal GP): $40,969.81")
print(f"TOTAL CALCULATED: ${acq_total_commission + dispo_total_commission + 40969.81:,.2f}")
print(f"\nv2 Target Total: $97,539.66")
print(f"Difference: ${abs((acq_total_commission + dispo_total_commission + 40969.81) - 97539.66):,.2f}")
print("=" * 80)
print("\nv2 Targets:")
print(f"  - Acq Agents:    $35,491.00 (calculated: ${acq_total_commission:,.2f}, diff: ${abs(acq_total_commission - 35491):,.2f})")
print(f"  - Dispo Agents:  $21,078.85 (calculated: ${dispo_total_commission:,.2f}, diff: ${abs(dispo_total_commission - 21078.85):,.2f})")
print("=" * 80)
