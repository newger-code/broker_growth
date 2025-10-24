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

target = 968

# Try to find combinations that sum to 968
print(f"Looking for sprint combinations that sum to ${target}...")
print("=" * 60)

# Check if any obvious patterns
# First, who are the top sprint earners?
sorted_sprints = sorted(sprints.items(), key=lambda x: x[1], reverse=True)
print("Top sprint earners:")
for name, amount in sorted_sprints[:10]:
    print(f"  {name}: ${amount}")

print("\n" + "=" * 60)

# Maybe it's only agents with commissions > 0 and not managers?
# Let's see what reasonable combinations could be

# Agents we know have deals (from the HTML data)
agents_with_deals_dispo = ['Alec Prieto', 'Brittany Taylor', 'Christian Flasch', 'Devin Cooper',
                           'Devin Hoffman', 'Ex Rebuilt', 'Jack Webster', 'Joe Haupt',
                           'Leland Boyd', 'Maegan Grace', 'Mel Grant', 'Miguel Aguilar',
                           'Tamara Humbolt', 'Vincent Gnapi', 'Yoseph Israel']

agents_with_deals_acq = ['Andrew Caceres', 'Ashley Preston', 'Chris Chambers', 'Devin Buford',
                         'Dominick Mazliah', 'Ex Rebuilt', 'Garrett Paschal', 'Ian Ross',
                         'Jesse Sychowski', 'Kyle Singer', 'Luis Guzman', 'Scott Pennebaker',
                         'Shon Yoshida', 'Steve Shelburne', 'Warren Smith']

# Combine and dedupe
all_agents_with_deals = set(agents_with_deals_dispo + agents_with_deals_acq)

# Manager agents to exclude
manager_agents = {'Luis Guzman', 'Shon Yoshida', 'Devin Buford', 'Joe Haupt', 'Maegan Grace'}

# Non-manager agents with deals
non_manager_with_deals = all_agents_with_deals - manager_agents

# Calculate sprint total for non-manager agents with deals
sprint_total_non_managers = sum(sprints.get(name, 0) for name in non_manager_with_deals)
print(f"\nSprints for non-manager agents with deals: ${sprint_total_non_managers}")

# List them
print("\nNon-manager agents with deals and sprints:")
for name in sorted(non_manager_with_deals):
    if name in sprints:
        print(f"  {name}: ${sprints[name]}")

# Check if this is close to $968
print(f"\nDifference from target: ${abs(sprint_total_non_managers - target)}")

# Alternative: Maybe only certain specific agents?
# Let's try the exact $968 if we can find it
print("\n" + "=" * 60)
print("Checking if $968 could be a specific subset...")

# Try just a few specific high-value agents
test_agents = ['Kyle Singer', 'Alec Prieto']
test_total = sum(sprints.get(name, 0) for name in test_agents)
print(f"\n{test_agents}: ${test_total}")

test_agents = ['Brittany Taylor', 'Alec Prieto', 'Christian Flasch']
test_total = sum(sprints.get(name, 0) for name in test_agents)
print(f"{test_agents[:2]}: ${test_total}")

# Actually, $968 is very close to $1000
print(f"\n$968 is very close to $1,000 (difference: ${1000 - 968})")
print("Could this be a rounding or entry error?")