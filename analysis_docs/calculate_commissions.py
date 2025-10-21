#!/usr/bin/env python3
"""
Calculate September 2025 commissions from the detailed transaction data
Target: $97,539
"""

import csv
from collections import defaultdict
from decimal import Decimal

# Tier structures
DISPO_TIERS = [
    (0, 25000, 2.0, 1.33),
    (25000, 50000, 3.0, 2.00),
    (50000, 75000, 4.0, 2.67),
    (75000, 100000, 5.0, 3.33),
    (100000, 125000, 6.0, 4.00),
    (125000, 150000, 7.0, 4.67),
    (150000, 175000, 8.0, 5.33),
    (175000, 200000, 9.0, 6.00),
    (200000, float('inf'), 10.0, 6.67),
]

ACQ_TIERS = [
    (0, 25000, 4.0, 20.0),
    (25000, 50000, 6.0, 20.0),
    (50000, 100000, 8.0, 20.0),
    (100000, float('inf'), 10.0, 20.0),
]

def parse_currency(value):
    """Parse currency string to Decimal"""
    if not value or value.strip() == '':
        return Decimal('0')
    # Remove $, commas, and spaces
    cleaned = value.replace('$', '').replace(',', '').strip()
    return Decimal(cleaned)

def get_dispo_tier(total_gp):
    """Get dispo tier info based on total GP"""
    # Ex-Rebuilt agents always get tier 1
    for min_gp, max_gp, off_rate, ff_rate in DISPO_TIERS:
        if min_gp <= total_gp < max_gp:
            return off_rate, ff_rate
    return DISPO_TIERS[-1][2], DISPO_TIERS[-1][3]  # Highest tier

def get_acq_tier(total_gp):
    """Get acq tier info based on total GP"""
    for min_gp, max_gp, std_rate, org_rate in ACQ_TIERS:
        if min_gp <= total_gp < max_gp:
            return std_rate, org_rate
    return ACQ_TIERS[-1][2], ACQ_TIERS[-1][3]  # Highest tier

def main():
    # Read the CSV file
    dispo_agents = defaultdict(lambda: {'deals': [], 'total_gp': Decimal('0'), 'ff_gp': Decimal('0'), 'off_gp': Decimal('0')})
    acq_agents = defaultdict(lambda: {'deals': [], 'total_gp': Decimal('0'), 'organic_gp': Decimal('0'), 'std_gp': Decimal('0')})

    with open('/Users/jimnewgent/Projects/broker_growth/Docs/2025 Sept Commission Calcs.csv', 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)

        for row in reader:
            # Skip empty rows
            if not row.get('Property Address'):
                continue

            # Skip non-transactions (Trx # = 0)
            trx_num = row.get('Trx #', '0').strip()
            if trx_num == '0':
                continue

            property_addr = row['Property Address']
            dispo_agent = row.get('Dispo Agent', '').strip()
            acq_agent = row.get('Acq Agent', '').strip()
            gp_str = row.get(' Gross Profit ', '').strip()
            gp = parse_currency(gp_str)
            ff_status = row.get('FlatFee Listed', '').strip().upper()

            # Determine if flat-fee
            is_flatfee = 'YES' in ff_status or 'CLOSED AS FF' in ff_status.upper()

            # Track dispo agent (including Ex Rebuilt)
            if dispo_agent:
                dispo_agents[dispo_agent]['deals'].append({
                    'address': property_addr,
                    'gp': gp,
                    'is_flatfee': is_flatfee,
                    'ff_status': ff_status
                })
                dispo_agents[dispo_agent]['total_gp'] += gp
                if is_flatfee:
                    dispo_agents[dispo_agent]['ff_gp'] += gp
                else:
                    dispo_agents[dispo_agent]['off_gp'] += gp

            # Track acq agent (including Ex Rebuilt)
            if acq_agent:
                # For now, treat all as standard (non-organic)
                # We'd need to check the original data for organic designation
                acq_agents[acq_agent]['deals'].append({
                    'address': property_addr,
                    'gp': gp,
                    'is_organic': False  # Default to non-organic
                })
                acq_agents[acq_agent]['total_gp'] += gp
                acq_agents[acq_agent]['std_gp'] += gp

    # Calculate dispo commissions
    print("=" * 80)
    print("DISPOSITION AGENT COMMISSIONS")
    print("=" * 80)

    total_dispo_comm = Decimal('0')

    for agent in sorted(dispo_agents.keys()):
        data = dispo_agents[agent]
        total_gp = data['total_gp']
        ff_gp = data['ff_gp']
        off_gp = data['off_gp']

        # Get tier (Ex Rebuilt always gets Tier 1)
        if 'Ex Rebuilt' in agent:
            off_rate, ff_rate = 2.0, 1.33
        else:
            off_rate, ff_rate = get_dispo_tier(float(total_gp))

        # Calculate commission
        off_comm = off_gp * Decimal(str(off_rate / 100))
        ff_comm = ff_gp * Decimal(str(ff_rate / 100))
        total_comm = off_comm + ff_comm

        total_dispo_comm += total_comm

        # Determine tier number
        tier_num = 1
        for i, (min_gp, max_gp, _, _) in enumerate(DISPO_TIERS):
            if min_gp <= float(total_gp) < max_gp:
                tier_num = i + 1
                break

        print(f"\n{agent}")
        print(f"  Deals: {len(data['deals'])}")
        print(f"  Total GP: ${total_gp:,.2f}")
        print(f"  Tier {tier_num}: Off-Market {off_rate}% | Flat-Fee {ff_rate}%")
        print(f"  Off-Market GP: ${off_gp:,.2f} x {off_rate}% = ${off_comm:,.2f}")
        print(f"  Flat-Fee GP: ${ff_gp:,.2f} x {ff_rate}% = ${ff_comm:,.2f}")
        print(f"  TOTAL COMMISSION: ${total_comm:,.2f}")

    print(f"\n{'=' * 80}")
    print(f"TOTAL DISPO COMMISSIONS: ${total_dispo_comm:,.2f}")
    print(f"{'=' * 80}")

    # Calculate acq commissions
    print("\n\n" + "=" * 80)
    print("ACQUISITION AGENT COMMISSIONS")
    print("=" * 80)

    total_acq_comm = Decimal('0')

    for agent in sorted(acq_agents.keys()):
        data = acq_agents[agent]
        total_gp = data['total_gp']
        std_gp = data['std_gp']
        org_gp = data['organic_gp']

        # Get tier (Ex Rebuilt always gets Tier 1)
        if 'Ex Rebuilt' in agent:
            std_rate, org_rate = 4.0, 20.0
        else:
            std_rate, org_rate = get_acq_tier(float(total_gp))

        # Calculate commission
        std_comm = std_gp * Decimal(str(std_rate / 100))
        org_comm = org_gp * Decimal(str(org_rate / 100))
        total_comm = std_comm + org_comm

        total_acq_comm += total_comm

        # Determine tier number
        tier_num = 1
        for i, (min_gp, max_gp, _, _) in enumerate(ACQ_TIERS):
            if min_gp <= float(total_gp) < max_gp:
                tier_num = i + 1
                break

        print(f"\n{agent}")
        print(f"  Deals: {len(data['deals'])}")
        print(f"  Total GP: ${total_gp:,.2f}")
        print(f"  Tier {tier_num}: Standard {std_rate}% | Organic {org_rate}%")
        print(f"  Standard GP: ${std_gp:,.2f} x {std_rate}% = ${std_comm:,.2f}")
        print(f"  Organic GP: ${org_gp:,.2f} x {org_rate}% = ${org_comm:,.2f}")
        print(f"  TOTAL COMMISSION: ${total_comm:,.2f}")

    print(f"\n{'=' * 80}")
    print(f"TOTAL ACQ COMMISSIONS: ${total_acq_comm:,.2f}")
    print(f"{'=' * 80}")

    # Grand total
    grand_total = total_dispo_comm + total_acq_comm
    print(f"\n\n{'=' * 80}")
    print(f"GRAND TOTAL COMMISSIONS")
    print(f"{'=' * 80}")
    print(f"  Dispo Commissions: ${total_dispo_comm:,.2f}")
    print(f"  Acq Commissions:   ${total_acq_comm:,.2f}")
    print(f"  {'=' * 60}")
    print(f"  TOTAL:             ${grand_total:,.2f}")
    print(f"\n  TARGET:            $97,539.00")
    print(f"  DIFFERENCE:        ${grand_total - Decimal('97539.00'):,.2f}")
    print(f"{'=' * 80}")

if __name__ == '__main__':
    main()
