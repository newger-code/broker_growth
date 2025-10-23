#!/usr/bin/env python3

# V2 Dashboard values
agent_comm = 55601
manager_comm = 40970
total_without_sprints = agent_comm + manager_comm

# Excel target
excel_target = 97539

print("=" * 60)
print("HYPOTHESIS: Excel $97,539 might not include sprints")
print("=" * 60)

print(f"\nAgent Commission: ${agent_comm:,}")
print(f"Manager Commission: ${manager_comm:,}")
print(f"Total (no sprints): ${total_without_sprints:,}")
print(f"Excel Target: ${excel_target:,}")
print(f"Difference: ${excel_target - total_without_sprints:,}")

print("\n" + "=" * 60)
print("ANALYSIS")
print("=" * 60)

if excel_target - total_without_sprints == 968:
    print("✓ The difference is exactly $968")
    print("  This is suspiciously close to $1,000")
    print("  Could be a rounding difference or minor calculation variance")
elif excel_target - total_without_sprints > 0:
    print(f"✓ Excel is ${excel_target - total_without_sprints:,} higher than commissions alone")
    print("  This could be a partial sprint amount or other bonus")
else:
    print("✗ Excel target is LOWER than agent + manager commissions")
    print("  This means the commission calculations themselves are different")

print("\n" + "=" * 60)
print("RECOMMENDATION")
print("=" * 60)
print("1. The Excel likely shows commissions WITHOUT sprints")
print("2. The $968 difference could be:")
print("   - A specific subset of sprints")
print("   - Rounding/precision differences accumulating")
print("   - A different bonus/adjustment we're not aware of")
print("\n3. Need to verify in Excel:")
print("   - Is $97,539 the commission total WITH or WITHOUT sprints?")
print("   - Are the agent/manager calculations exactly as shown in calculator?")
print("   - Any other adjustments or exclusions?")