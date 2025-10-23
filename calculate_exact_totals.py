#!/usr/bin/env python3

# Sprint data
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

# Manager-agents who should be excluded from agent totals
manager_agents = ['Luis Guzman', 'Shon Yoshida', 'Devin Buford', 'Joe Haupt', 'Maegan Grace']

# Agents with sprints but no deals
sprint_only_agents = ['Terrell Johnson', 'Steven Stack', 'Jarod Weaver', 'Kayla Watkins', 'Kirk Schaafsma']

# Calculate different sprint scenarios
all_sprints = sum(sprints.values())
manager_sprints = sum(sprints.get(name, 0) for name in manager_agents)
sprint_only_total = sum(sprints.get(name, 0) for name in sprint_only_agents)

print("=" * 60)
print("SPRINT ANALYSIS")
print("=" * 60)
print(f"All sprints (22 agents): ${all_sprints:,}")
print(f"Manager-agent sprints: ${manager_sprints}")
print(f"Sprint-only agents: ${sprint_only_total}")
print(f"Excluding managers only: ${all_sprints - manager_sprints:,}")
print(f"Excluding managers + sprint-only: ${all_sprints - manager_sprints - sprint_only_total:,}")

print("\n" + "=" * 60)
print("COMMISSION SCENARIOS")
print("=" * 60)

# V2 Dashboard totals
agent_comm = 55601
manager_comm = 40970

print("\n--- Scenario 1: V2 Dashboard (sprint = $3,050) ---")
total_1 = agent_comm + manager_comm + 3050
print(f"Agent Commission: ${agent_comm:,}")
print(f"Manager Commission: ${manager_comm:,}")
print(f"Sprints: $3,050")
print(f"TOTAL: ${total_1:,}")

print("\n--- Scenario 2: All Sprints (sprint = $4,500) ---")
total_2 = agent_comm + manager_comm + 4500
print(f"Agent Commission: ${agent_comm:,}")
print(f"Manager Commission: ${manager_comm:,}")
print(f"Sprints: $4,500")
print(f"TOTAL: ${total_2:,}")

print("\n--- Scenario 3: Excel Target Match ---")
excel_target = 97539
diff_from_v2 = total_1 - excel_target
print(f"Excel Target: ${excel_target:,}")
print(f"V2 Total: ${total_1:,}")
print(f"Difference: ${diff_from_v2:,}")

# Work backwards to find what sprint total would match Excel
needed_sprint = excel_target - agent_comm - manager_comm
print(f"\nTo match Excel, sprints would need to be: ${needed_sprint:,}")

# Check if that's a valid subset
if needed_sprint == all_sprints - manager_sprints - sprint_only_total - 900:
    print("This would mean excluding managers + sprint-only + $900 more")
elif needed_sprint < 0:
    print("ERROR: This implies agent or manager commissions are too high!")
    print(f"Agent + Manager = ${agent_comm + manager_comm:,}")
    print(f"But Excel total is only ${excel_target:,}")
    print(f"This means commissions are ${agent_comm + manager_comm - excel_target:,} too high")

print("\n" + "=" * 60)
print("CONCLUSION")
print("=" * 60)
if agent_comm + manager_comm > excel_target:
    print("❌ The agent and/or manager commissions in V2 are TOO HIGH")
    print("   They alone exceed the Excel total of $97,539")
    print("   Need to recalculate agent and/or manager commissions")
else:
    print("✓ Agent and manager commissions could be correct")
    print(f"  But sprint total would need to be ${needed_sprint:,}")