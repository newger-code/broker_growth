#!/usr/bin/env python3
import csv

print('Ex Rebuilt Deals (Trx # = 1):')
print('=' * 80)
with open('/Users/jimnewgent/Projects/broker_growth/Docs/2025 Sept Commission Calcs.csv', 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    ex_rebuilt_gp = 0
    for row in reader:
        if row.get('Trx #', '').strip() != '1':
            continue
        acq = row.get('Acq Agent', '').strip()
        dispo = row.get('Dispo Agent', '').strip()
        if 'Ex Rebuilt' in acq or 'Ex Rebuilt' in dispo:
            addr = row['Property Address']
            gp_str = row.get(' Gross Profit ', '').strip()
            gp = float(gp_str.replace('$', '').replace(',', ''))
            ex_rebuilt_gp += gp
            print(f'{addr[:50]:50s} | Acq: {acq:15s} | Dispo: {dispo:15s} | GP: ${gp:,.2f}')

print(f'\nTotal GP for Ex Rebuilt deals: ${ex_rebuilt_gp:,.2f}')
