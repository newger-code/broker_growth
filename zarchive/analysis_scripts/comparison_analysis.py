#!/usr/bin/env python3
"""
COMPARISON: My Excel calculations vs Calculator vs V2
"""

print("=" * 80)
print("COMPARISON OF ALL THREE SOURCES")
print("=" * 80)

# My calculations from Excel formulas
my_calcs = {
    'Alec Prieto': 8361.43,
    'Ex Rebuilt': 220.00,
    'Jesse Sychowski': 5210.00,
    'Kyle Singer': 7208.16,
    'Luis Guzman': 10307.16,
    'Joe Haupt': 10643.65
}

# What the calculator shows (from managerData hardcoded values)
calculator_values = {
    'Luis Guzman': 8780.43,  # From managerData.total
    'Joe Haupt': 8452.81,    # From managerData.total
}

# What V2 dashboard shows (from the JSON data)
v2_values = {
    'Jesse Sychowski': 5210.00,  # actual_payout from V2
    'Kyle Singer': 7368.16,      # actual_payout from V2 (includes $160 adjustment)
    'Luis Guzman': 8780.43,      # actual_payout from V2
    'Joe Haupt': 8452.81,        # actual_payout from V2
}

# Excel spot check values mentioned
excel_targets = {
    'Alec Prieto': 8361,  # With sprint
    'Jesse Sychowski': 5210,  # With sprint
}

print("\nAGENT COMPARISONS:")
print("-" * 60)
print(f"{'Agent':<20} | {'My Calc':<12} | {'V2 Shows':<12} | {'Excel Target':<12}")
print("-" * 60)

for agent in ['Alec Prieto', 'Jesse Sychowski', 'Kyle Singer']:
    my = my_calcs.get(agent, 0)
    v2 = v2_values.get(agent, 'N/A')
    excel = excel_targets.get(agent, 'N/A')

    print(f"{agent:<20} | ${my:<11.2f} | ", end="")
    if v2 != 'N/A':
        print(f"${v2:<11.2f} | ", end="")
    else:
        print(f"{'N/A':<12} | ", end="")
    if excel != 'N/A':
        print(f"${excel:<11}")
    else:
        print(f"{'N/A':<12}")

print("\nMANAGER COMPARISONS:")
print("-" * 60)
print(f"{'Manager':<20} | {'My Calc':<12} | {'Calculator':<12} | {'V2 Shows':<12}")
print("-" * 60)

for manager in ['Luis Guzman', 'Joe Haupt']:
    my = my_calcs.get(manager, 0)
    calc = calculator_values.get(manager, 'N/A')
    v2 = v2_values.get(manager, 'N/A')

    print(f"{manager:<20} | ${my:<11.2f} | ${calc:<11.2f} | ${v2:<11.2f}")

print("\n" + "=" * 80)
print("DISCREPANCY ANALYSIS")
print("=" * 80)

print("\n1. ALEC PRIETO:")
print(f"   My calculation: ${my_calcs['Alec Prieto']:.2f}")
print(f"   Excel target: $8,361")
print(f"   Difference: ${my_calcs['Alec Prieto'] - 8361:.2f}")
print("   → My calc is $0.43 higher (likely due to flat-fee precision)")

print("\n2. JESSE SYCHOWSKI:")
print(f"   My calculation: ${my_calcs['Jesse Sychowski']:.2f}")
print(f"   V2/Excel: $5,210")
print(f"   Difference: ${my_calcs['Jesse Sychowski'] - 5210:.2f}")
print("   → Perfect match!")

print("\n3. KYLE SINGER:")
print(f"   My calculation: ${my_calcs['Kyle Singer']:.2f}")
print(f"   V2 shows: $7,368.16 (includes $160 adjustment)")
print(f"   Base should be: $7,208.16")
print(f"   Difference: ${my_calcs['Kyle Singer'] - 7208.16:.2f}")
print("   → My base calc matches before adjustment")

print("\n4. LUIS GUZMAN (Manager):")
print(f"   My calculation: ${my_calcs['Luis Guzman']:.2f}")
print(f"   Calculator/V2: $8,780.43")
print(f"   Difference: ${my_calcs['Luis Guzman'] - 8780.43:.2f}")
print("   → I'm calculating $1,526.73 MORE")
print("   ISSUE: My team GP calculation may be wrong")

print("\n5. JOE HAUPT (Manager):")
print(f"   My calculation: ${my_calcs['Joe Haupt']:.2f}")
print(f"   Calculator/V2: $8,452.81")
print(f"   Difference: ${my_calcs['Joe Haupt'] - 8452.81:.2f}")
print("   → I'm calculating $2,190.84 MORE")
print("   ISSUE: Either tier rates or GP split is wrong")

print("\n" + "=" * 80)
print("KEY FINDINGS")
print("=" * 80)

print("\n✓ AGENT CALCULATIONS MATCH (within rounding)")
print("  - Jesse Sychowski: Perfect match at $5,210")
print("  - Kyle Singer: Base matches at $7,208.16")
print("  - Alec Prieto: Within $0.43 of target")

print("\n✗ MANAGER CALCULATIONS DON'T MATCH")
print("  - Luis Guzman: Off by -$1,527")
print("  - Joe Haupt: Off by -$2,191")
print("  → Need to investigate manager formula differences")

print("\nPOSSIBLE ISSUES WITH MANAGER CALCS:")
print("1. Team GP calculation method")
print("2. Override tier rates")
print("3. Off-market/flat-fee split for team deals")
print("4. Whether manager's own GP is included in team total")