#!/usr/bin/env python3

sprints = {
    'Brittany Taylor': 500,
    'Terrell Johnson': 400,
    'Alec Prieto': 350,
    'Kyle Singer': 550,
    'Ian Ross': 300,
    'Jesse Sychowski': 300,
    'Joe Haupt': 300,
    'Garrett Paschal': 200,
    'Steven Stack': 200,
    'Ashley Preston': 150,
    'Luis Guzman': 150,
    'Christian Flasch': 100,
    'Devin Buford': 100,
    'Devin Cooper': 100,
    'Devin Hoffman': 100,
    'Jarod Weaver': 100,
    'Kayla Watkins': 100,
    'Kirk Schaafsma': 100,
    'Mel Grant': 100,
    'Miguel Aguilar': 100,
    'Tamara Humbolt': 100,
    'Warren Smith': 100
}

# Total
total = sum(sprints.values())
print(f'Total all sprints: ${total:,}')

# Manager-agents from the calculator code
manager_agents = ['Luis Guzman', 'Devin Buford', 'Joe Haupt', 'Shon Yoshida', 'Maegan Grace']
manager_sprint_total = sum(sprints.get(name, 0) for name in manager_agents)
print(f'\nManager-agent sprints: ${manager_sprint_total}')
print(f'Without manager-agents: ${total - manager_sprint_total:,}')

# Check if we reach target
target = 3050
need_to_exclude = total - target
print(f'\nNeed to exclude ${need_to_exclude} total to reach ${target}')

# Exclude manager-agents + agents with no deals
no_deals = ['Terrell Johnson', 'Steven Stack', 'Jarod Weaver', 'Kayla Watkins', 'Kirk Schaafsma']
no_deals_total = sum(sprints.get(name, 0) for name in no_deals)
print(f'\nAgents with sprint but no deals: ${no_deals_total}')
print(f'Manager-agents + no-deal agents: ${manager_sprint_total + no_deals_total}')
print(f'Remaining after exclusions: ${total - manager_sprint_total - no_deals_total}')

# Check if this matches
if total - manager_sprint_total - no_deals_total == target:
    print('\n✓ MATCH FOUND!')
    print('Exclude from sprint total:')
    print('  Manager-agents:', manager_agents)
    print('  Sprint-only agents:', no_deals)
else:
    print(f'\n✗ Still off by ${abs((total - manager_sprint_total - no_deals_total) - target)}')