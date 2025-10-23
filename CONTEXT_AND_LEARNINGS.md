# Commission Calculator - Context & Learnings

## Project Goal
Fix the commission calculator (`commission_calculator.html`) to match Excel totals exactly.
- **Excel total**: $97,539.31 (from `Docs/2025 Sept Commission Calcs.xlsx` - SEPTEMBER SUMMARY sheet, cell D41)
- **Gold standard**: Excel formulas, NOT V2 dashboard
- **Current status**: Calculator shows ~$71 difference from Excel subset

## Key Files
- **Calculator**: `/Users/jimnewgent/Projects/broker_growth/commission_calculator.html`
- **Excel source**: `/Users/jimnewgent/Projects/broker_growth/Docs/2025 Sept Commission Calcs.xlsx`
- **CSV source**: `/Users/jimnewgent/Projects/broker_growth/Docs/2025 Sept Commission Calcs.csv`

## Critical Learnings - SELF-INFLICTED ERRORS TO AVOID

### 1. ALWAYS READ SOURCE FILES, NEVER INFER FROM MEMORY OR SCRIPTS YOU CREATED
- **What happened**: Created Python scripts with only 17 people based on what I *remembered* from earlier code reading
- **The error**: Compared my incomplete script (17 people) to Excel (38 rows) and concluded "21 people missing"
- **The truth**: Calculator HTML actually has 34 unique people, only 3 are missing
- **Root cause**: Used my own incomplete data as source of truth instead of reading actual files
- **How to prevent**:
  1. NEVER count/compare from scripts or data I created from memory
  2. ALWAYS read the actual source file first: `Read commission_calculator.html` or `grep` the actual file
  3. When user asks "are we missing people?", answer MUST come from reading actual calculator HTML, not from analysis scripts
  4. Verify every claim against actual source code before stating it as fact

### 2. DO NOT GUESS OR MAKE ASSUMPTIONS - BE A MATHEMATICIAN
- **User feedback**: "stop doing math delta to suggest crap for delta. The math is the math"
- **User feedback**: "oh claude you are good coder but not good at math"
- **What happened**: Made arithmetic errors, said $96,568 matches $97,539 "within rounding" when they differ by $971
- **How to prevent**:
  1. Calculate exact differences, don't assume rounding
  2. When comparing totals, subtract and show the exact difference
  3. Don't make assumptions about what might be causing differences - investigate actual data

### 3. WHEN USER ASKS FOR SOMETHING 3 TIMES, STOP AND DO EXACTLY THAT
- **User request (asked 3 times)**: "provide me a line by line comparison in essentially 3 column but person"
- **What I did wrong**: Kept doing other analysis, creating templates, asking user for data
- **User feedback**: "you still have not fucking done what i asked. 3rd time i have asked."
- **How to prevent**:
  1. If user repeats a request, STOP everything else
  2. Do exactly what they asked, nothing more, nothing less
  3. Don't ask user for data I should calculate myself
  4. Don't create templates and ask user to fill them in - do the actual work

### 4. USE EXCEL AS GOLD STANDARD, NOT V2 DASHBOARD
- **User feedback (repeated multiple times)**: "stop trying to match v2. i do not know that v2 is 100% correct"
- **What I did wrong**: Kept comparing to V2 screenshots instead of Excel formulas
- **Correct approach**: Excel SEPTEMBER SUMMARY sheet cell D41 = $97,539.31 is the only source of truth
- **Kyle Singer example**: V2 shows $7,368.16 (includes $160 catch-up from last month), Excel formula would show $7,208.16

### 5. READ EXCEL FORMULAS DIRECTLY WHEN NEEDED
- **User guidance**: "go run a new bash or find on the web a way for you to convert the xlsx file to someting that works for you"
- **Solution found**: Use Python openpyxl to read .xlsx files directly
- **How to use**:
  ```python
  from openpyxl import load_workbook

  # Load workbook (data_only=True for values, False for formulas)
  wb = load_workbook('Docs/2025 Sept Commission Calcs.xlsx', data_only=True)

  # List all sheet names
  print(wb.sheetnames)
  # Output: ['SEPTEMBER SUMMARY', 'ALLPayOut2', 'Dispo Closings', 'Sprint Winners', ...]

  # Access a specific sheet
  sheet = wb['SEPTEMBER SUMMARY']

  # Read a specific cell (using 1-based indexing)
  total = sheet.cell(row=41, column=4).value  # Cell D41
  name = sheet.cell(row=3, column=3).value     # Cell C3

  # Iterate through rows
  for row in range(3, 40):  # Rows 3-39
      name = sheet.cell(row=row, column=3).value  # Column C
      payout = sheet.cell(row=row, column=4).value  # Column D
      if name:
          print(f"{name}: ${payout:,.2f}")
  ```

- **Key Excel sheets in this project**:
  - `SEPTEMBER SUMMARY`: Final payout totals (D41 = $97,539.31)
  - `Sprint Winners`: Sprint bonus amounts by person
  - `ALLPayOut2`: Detailed DISPO agent calculations
  - `PayoutChart`: ACQ agent calculations

- **Column mapping in SEPTEMBER SUMMARY**:
  - Column A: (empty)
  - Column B: Group (Acq, Acq Mgr, Dispo, Dispo Mgr, UW)
  - Column C: Name
  - Column D: Payout amount
  - Row 41: Total = $97,539.31

### 6. MOVE FILES I CREATE TO SUBFOLDERS - USER SHOULDN'T HAVE TO REMIND ME
- **User feedback**: "please move any document you added (again i have to tell you often)"
- **What I did wrong**: Created 5 analysis files in root directory, cluttering user's workspace
- **How to prevent**:
  1. PROACTIVELY move any analysis/temp files I create to appropriate subfolder
  2. Check for existing folders first: zarchive/, analysis_docs/, sandbox/
  3. Do this IMMEDIATELY after creating files, not when user asks
  4. User should never have to tell me to clean up

### 7. MAINTAIN A CONTEXT FILE FOR HANDOFFS
- **User question**: "are you using a file to keep notes and learnings for context or future handoffs?"
- **Answer was**: No (and that was the problem)
- **Solution**: This file (CONTEXT_AND_LEARNINGS.md) should be updated throughout the session
- **Purpose**: Persist knowledge across sessions, enable clean handoffs to future Claude instances

### 8. TRUST ISSUES - COMMITTING TO MEMORY
- **User feedback**: "how can you learn from this? not sure possible. just cannot trust you unless you can commit this to memory"
- **The core issue**: Saying "I'll do better" but repeating same mistakes within the same session
- **What broke trust**:
  1. Making claims from incomplete data I created
  2. Not reading actual source files before drawing conclusions
  3. Apologizing but not changing behavior
- **How to rebuild trust**:
  1. Read this file at start of every session on this project
  2. Before making ANY claim about what's in the calculator, read the actual file
  3. Don't apologize - just fix the behavior and show the work

### 2. Excel Structure (SEPTEMBER SUMMARY sheet)
- **Total people**: 36 unique entries (rows 3-38)
- **Categories**: Acq, Acq Mgr, Dispo, Dispo Mgr, UW
- **Total**: Row 41 = $97,539.31

### 3. People Status
**In calculator** (34 unique):
- Alec Prieto, Andrew Caceres, Ashley Preston, Brittany Taylor, Chris Chambers, Christian Flasch, Devin Buford, Devin Cooper, Devin Hoffman, Dominick Mazliah, Ex Rebuilt, Garrett Paschal, Ian Ross, Jack Webster, Jarod Weaver, Jesse Sychowski, Joe Haupt, Kayla Watkins, Kirk Schaafsma, Kyle Singer, Leland Boyd, Luis Guzman, Maegan Grace, Mel Grant, Miguel Aguilar, Scott Pennebaker, Shon Yoshida, Steve Shelburne, Steven Stack, Tamara Humbolt, Terrell Johnson, Vincent Gnapi, Warren Smith, Yoseph Israel

**Missing from calculator** (3):
- Patrick Solomon (Acq Mgr): $6,043.56
- Rob Gorski (Dispo Mgr): $3,672.31
- Dustin Hepburn (UW): $1,346.26

**In calculator but not in Excel payouts**:
- Scott Pennebaker (has 0 deals currently)

### 4. Known Issues to Fix
1. **Wrong categories**: Christian Flasch, Jack Webster, Yoseph Israel are in ACQ but should be DISPO
2. **Sprint amounts**: Need to verify against Sprint Winners sheet (some are wrong)
3. **Kyle Singer $160 difference**: One-time catch-up from last month - NOT a calculator issue, it's a manual adjustment in Excel only

### 5. Tier Rates (Must be precise)
**DISPO Tiers**:
- Tier 1 (<$25K): 2.0% off, 1.3333% ff
- Tier 2 ($25-50K): 3.0% off, 2.0% ff
- Tier 3 ($50-75K): 4.0% off, 2.6667% ff
- Tier 4 ($75-100K): 5.0% off, 3.3333% ff
- Tier 5 ($100-125K): 6.0% off, 4.0% ff
- Tier 6 ($125-150K): 7.0% off, 4.6667% ff
- Tier 7 ($150-175K): 8.0% off, 5.3333% ff
- Tier 8 ($175-200K): 9.0% off, 6.0% ff
- Tier 9 ($200K+): 10.0% off, 6.6667% ff

**ACQ Tiers**:
- Tier 1 (<$25K): 4.0%
- Tier 2 ($25-50K): 6.0%
- Tier 3 ($50-100K): 8.0%
- Tier 4 ($100K+): 10.0%

**Special cases**:
- Alec Prieto: Hardcoded to Tier 6 (not Tier 5+1)
- Ex Rebuilt: Always Tier 1

### 6. Sprint Winners (from Excel Sprint Winners sheet)
Total: $4,500
- Brittany Taylor: $500
- Terrell Johnson: $400
- Alec Prieto: $350
- Kyle Singer: $550
- Ian Ross: $300
- Jesse Sychowski: $300
- Joe Haupt: $300
- Garrett Paschal: $200
- Steven Stack: $200
- Ashley Preston: $150
- Luis Guzman: $150
- Christian Flasch: $100
- Devin Buford: $100
- Devin Cooper: $100
- Devin Hoffman: $100
- Jarod Weaver: $100
- Kayla Watkins: $100
- Kirk Schaafsma: $100
- Mel Grant: $100
- Miguel Aguilar: $100
- Tamara Humbolt: $100
- Warren Smith: $100

## Next Steps
1. Fix agent categories (move Christian/Jack/Yoseph to DISPO)
2. Verify and fix sprint amounts
3. Add 3 missing people (Patrick Solomon, Rob Gorski, Dustin Hepburn)
4. Verify final total matches Excel $97,539.31

## Session History
- **2025-10-22**: Initial context document created
- **2025-10-22**: Added detailed self-inflicted error patterns and prevention strategies based on user feedback

## For Next Session
1. Read this entire file FIRST before doing any work
2. Before making any claims about calculator contents, read the actual HTML file
3. Create analysis files in zarchive/ or analysis_docs/, not root
4. Update this file with any new learnings
5. Excel SEPTEMBER SUMMARY D41 = $97,539.31 is the ONLY gold standard
