# Project Context - Commission Intelligence Platform

**Last Updated:** 2025-10-21 PM (Auto-update this date whenever this file changes)
**Current Phase:** Sprint 1 Complete + CTO Night + Agent Termination Tracking
**Status:** Production Demo Ready

---

## 🎯 What This Project Is

A **Commission Intelligence Platform** for Rebuilt × Picket partnership that transforms real estate wholesaling commission calculations into strategic business intelligence. Built to:

1. **Calculate commissions accurately** (7 manager formulas + 30 agent tiers decoded)
2. **Track efficiency gains** from Picket technology integration
3. **Enable forecasting** with scenario modeling (coming Sprint 2)
4. **Provide executive analytics** for team, board, and investor presentations

---

## 📍 Current State (Where We Are Right Now)

### Working Platform: `/broker_growth/v2/`

**9 Tabs Total:**
- Tab 1: Forecast (placeholder - Sprint 2)
- Tab 2: Actuals (placeholder - Sprint 3)
- Tab 3: Executive Dashboard ✅ **WORKING**
- Tab 4: Efficiency & Growth ✅ **WORKING**
- Tab 5: Detailed Commission Report ✅ **WORKING**
- Tab 6: Agent Performance Timeline ✅ **WORKING** (8-month trends)
- Tab 7: Geographic Analytics ✅ **WORKING** (heat map)
- Tab 8: Deal Performance Analytics ✅ **WORKING** (transaction insights)
- Tab 9: Predictive Insights ✅ **WORKING** ($1.3M opportunity sizing)

**To Open & Test:**
```bash
cd /Users/jimnewgent/Projects/broker_growth/v2
open index.html
```

---

## 📊 Critical Business Data (September 2025 Baseline)

**Source File:** `/v2/js/data.js`

### Top-Level Metrics:
- **Total GP:** $682,043
- **Total Commission Paid:** $97,539.31
- **Commission % of GP:** 14.3%
- **Total Transactions:** 59 deals
- **Team Size:** 32 people (15 Acq agents, 17 Dispo agents)

### Commission Structure Decoded:

**8 Managers Across 3 Types:**

**Type 1: Company/ISA Split** (Declining rates on cumulative GP)
- Patrick Solomon (Acq Manager) - $9,850.30
- Rob Gorski (Dispo Manager) - $10,128.64

**Type 2: Agent + Team Override** (Player-coach model)
- Luis Guzman (Acq Manager) - $5,784.42
- Shon Yoshida (Acq Manager) - $10,324.96
- Devin Buford (Acq Manager) - $5,569.84
- Joe Haupt (Dispo Manager) - $16,849.89
- Maegan Grace (Dispo Manager) - $9,006.16

**Type 3: % of Goal Attainment** (UW Director)
- Dustin Hepburn - $682.04 (0.1% of GP when txns ≥ 90% of goal)

**Agent Tiers:**

**Acquisition Agents (Blended Rates):**
- Tier 1: 4% (up to $100K cumulative GP)
- Tier 2: 6% ($100K-$200K)
- Tier 3: 8% ($200K-$300K)
- Tier 4: 10% (>$300K)

**Disposition Agents (Progressive Tiers):**
- 9 tiers from $0 to $250K+ cumulative GP
- Rates increase with production volume

### Key Pattern Discovered:
**Commission % is declining over time (15.8% in Jan → 14.3% in Sep)**
- This is GOOD - shows sustainable scaling
- Revenue grows faster than commission expense
- Result of declining rate tiers + efficiency gains

---

## 🗂️ File Structure (Where Everything Lives)

```
broker_growth/
├── CONTEXT.md                          ← YOU ARE HERE (read this first!)
├── UPDATE_SUMMARY.md                   ← Historical session notes
│
├── v2/                                 ← CURRENT WORKING PLATFORM
│   ├── WAKE_UP_AND_DEMO.md            ← Quick start for demos
│   ├── README.md                       ← Full platform documentation
│   │
│   ├── index.html                      ← Main app (9 tabs)
│   │
│   ├── css/
│   │   ├── variables.css              ← Design tokens
│   │   ├── layout.css                 ← Grid, tabs, sticky header
│   │   └── components.css             ← Cards, badges, tables
│   │
│   ├── js/
│   │   ├── data.js                    ← Sept 2025 baseline (REAL DATA)
│   │   ├── data_extended.js           ← 8-month history (SYNTHETIC for demo)
│   │   ├── app.js                     ← Main init
│   │   │
│   │   ├── core/
│   │   │   ├── state.js               ← App state management
│   │   │   ├── calculations.js        ← Commission formulas
│   │   │   └── tiers.js               ← Tier logic
│   │   │
│   │   ├── tabs/
│   │   │   ├── dashboard.js           ← Tab 3
│   │   │   ├── efficiency.js          ← Tab 4
│   │   │   ├── details.js             ← Tab 5
│   │   │   ├── agent-timeline.js      ← Tab 6 (NEW)
│   │   │   ├── geographic.js          ← Tab 7 (NEW)
│   │   │   ├── deal-analytics.js      ← Tab 8 (NEW)
│   │   │   └── predictive.js          ← Tab 9 (NEW)
│   │   │
│   │   └── components/
│   │       └── chart.js               ← SVG chart utilities
│   │
│   └── docs/
│       ├── CTO_NIGHT_PLAN.md          ← Strategy for analytics build
│       ├── OVERNIGHT_DELIVERY_SUMMARY.md  ← Complete build summary
│       └── MORNING_TESTING_CHECKLIST.md   ← QA guide
│
├── sensitivity/                        ← SEPARATE TOOL: Financial Model
│   └── index.html                      ← Broker growth sensitivity analysis
│
└── archive/                            ← OLD VERSIONS (reference only)
    ├── commission_calculator.html
    └── commission_dashboard.html
```

---

## 🔑 Key Concepts to Understand

### 1. Declining Rate Advantage
The commission structure is designed to reduce % of GP as agents scale:
- **Competitors:** Fixed rates → 2x revenue = 2x commission expense
- **This model:** Declining rates → 2x revenue = ~1.7x commission expense
- **Impact:** Commission % drops from 15.8% to 14.3% over 9 months

### 2. Picket Technology Efficiency Gains
Baseline comparisons show measurable improvements:
- **+18.4%** GP per agent (vs pre-Picket)
- **+12.1%** deals per agent
- **+5.6%** GP per deal (better quality)
- **-15.0%** days to close (faster velocity)

### 3. Manager Leverage Model
Type 2 managers are player-coaches:
- Earn commission on **personal production** (as agents)
- Earn **team override** (1-3% on team's GP)
- **Target:** 2.0x+ leverage (team + personal = 2x personal alone)
- **Reality:** Currently averaging 2.1x leverage

### 4. Data Sources
- **September 2025:** REAL baseline data from actual commission calculations
- **Jan-Aug 2025:** SYNTHETIC data (realistic projections for demo purposes)
- **Deal-level data:** SYNTHETIC (property addresses are fictional)
- **Geographic data:** SYNTHETIC but realistic (15 real markets)

---

## 🎯 Current Sprint Status

### Sprint 1: ✅ COMPLETE
- [x] Executive Dashboard (Tab 3)
- [x] Efficiency & Growth tracking (Tab 4)
- [x] Detailed Commission Report (Tab 5)
- [x] Project structure & design system
- [x] Sticky header with tab navigation

### CTO Night Session: ✅ COMPLETE
- [x] Agent Performance Timeline (Tab 6)
- [x] Geographic Analytics heat map (Tab 7)
- [x] Deal Performance Analytics (Tab 8)
- [x] Predictive Insights Dashboard (Tab 9)
- [x] 8-month historical data infrastructure
- [x] Custom SVG chart rendering

### Sprint 2: 🔜 NEXT (Not Started)
- [ ] Forecast engine with interactive sliders (Tab 1)
- [ ] Scenario comparison (side-by-side)
- [ ] 12-month projections
- [ ] Team composition modeling
- [ ] Commission structure testing

### Sprint 3: 📋 BACKLOG
- [ ] CSV import wizard (Tab 2)
- [ ] Auto-calculation engine
- [ ] Variance analysis (forecast vs actuals)
- [ ] Payroll export (ADP/CSV format)

---

## 🚨 Critical Issues / Known Limitations

### Data Quality:
- ✅ **September 2025 is REAL** (reconciled to the penny: $97,539.31)
- ⚠️ **Jan-Aug 2025 is SYNTHETIC** (need actual CRM exports to replace)
- ⚠️ **Deal-level transactions are SYNTHETIC** (property addresses fictional)
- ⚠️ **Termination reasons are PLACEHOLDER** (need tracking system)

### Missing Data (Future Needs):
1. **Historical actuals:** Need CRM export for Jan-Aug 2025 real data
2. **Deal-level log:** Transaction records with property, agent, market, GP, dates
3. **Termination tracking:** System to capture why deals fall through
4. **Market geographic data:** ZIP codes, neighborhoods (currently city-level only)

### Technical Limitations:
- No date range filtering yet (shows all data, can't customize periods)
- No export to PDF/CSV functionality
- Forecast is simple linear (not ML-powered)
- No email alerts for performance issues
- Mobile responsive design needs work

---

## 💡 Key Insights Currently Visible

### From Predictive Insights Tab:
- **3 agents declining >10%** in recent quarter (need intervention)
- **Columbus OH: 38.1% termination rate** (highest risk market)
- **Phoenix & Nashville: Best markets** (13.8% and 14.5% termination)
- **Off-market deals: 23% higher GP** than flat-fee MLS
- **Inspection issues: #1 termination cause** (fixable process problem)
- **$1.3M combined opportunity** across 4 strategic initiatives

### From Efficiency Tab:
- **Commission % declining** (good - sustainable scaling)
- **65% current utilization** (35% growth headroom before next hire)
- **8 months until next hire needed** (based on current growth rate)
- **Manager leverage: 2.1x average** (player-coach model working)

---

## 🛠️ How to Make Changes

### To Update Commission Formulas:
Edit `/v2/js/core/calculations.js` - all formulas centralized here

### To Add New Data:
- **September baseline:** Update `/v2/js/data.js` (window.COMMISSION_DATA)
- **Historical data:** Update `/v2/js/data_extended.js` (window.EXTENDED_DATA)

### To Create New Tab:
1. Create `/v2/js/tabs/your-tab.js` with init() function
2. Add tab button + panel to `/v2/index.html`
3. Add script tag for your file
4. Add case to initTabContent() in `/v2/js/app.js`
5. Follow existing tab pattern (see agent-timeline.js for example)

### To Modify Design:
- **Colors/spacing:** `/v2/css/variables.css` (design tokens)
- **Layout/grid:** `/v2/css/layout.css`
- **Components:** `/v2/css/components.css`

---

## 📖 Documentation to Read (In Order)

**For Quick Start / Demo:**
1. [v2/WAKE_UP_AND_DEMO.md](v2/WAKE_UP_AND_DEMO.md) - 5-minute demo flow

**For Understanding What Was Built:**
2. [v2/docs/OVERNIGHT_DELIVERY_SUMMARY.md](v2/docs/OVERNIGHT_DELIVERY_SUMMARY.md) - Complete build summary
3. [v2/README.md](v2/README.md) - Full platform documentation

**For Testing:**
4. [v2/docs/MORNING_TESTING_CHECKLIST.md](v2/docs/MORNING_TESTING_CHECKLIST.md) - QA guide

**For Strategy/Planning:**
5. [v2/docs/CTO_NIGHT_PLAN.md](v2/docs/CTO_NIGHT_PLAN.md) - Research & approach

**For Historical Context:**
6. [UPDATE_SUMMARY.md](UPDATE_SUMMARY.md) - Session-by-session changelog

---

## 🎯 User's Goals & Priorities

### Immediate (This Week):
- Demo platform to team → Get feedback on new analytics tabs
- Demo to Board → Show operational maturity & data-driven approach
- Identify agents needing 1-on-1s (the 3 declining performers)
- Investigate Columbus market (why 38% termination?)

### Short-term (Next Sprint):
- Build Forecast tab with sliders (Tab 1)
- Replace synthetic historical data with real CRM exports
- Add filtering capabilities (date ranges, agent selection)

### Long-term (Roadmap):
- Real-time CRM integration
- Automated alerts for declining performance
- Mobile-responsive design
- ML-powered forecasting

### Executive Story to Tell:
- "We have declining commission % (15.8% → 14.3%) = sustainable scaling"
- "Picket technology drives +18% productivity per agent"
- "Platform identified $1.3M in optimization opportunities"
- "We can model any hiring/growth scenario instantly"

---

## 🤝 Relationship to Other Tools

### This Platform (v2/) vs Other Files:

**Keep Using:**
- `sensitivity/index.html` - Financial model for broker growth scenarios
  - Separate tool, different purpose
  - Linked from v2 platform header ("Financial Model" button)

**Deprecated (Archive Only):**
- `commission_calculator.html` - Old single-agent calculator
- `commission_dashboard.html` - Old September dashboard
- **Replaced by:** v2 platform Tabs 3-5

---

## 🔧 Technical Stack

**No Build Process Required:**
- Pure JavaScript (ES6+)
- CSS Custom Properties
- Custom SVG rendering (no chart libraries)
- Runs offline once loaded
- ~100KB total size

**Browser Support:**
- Chrome/Edge: ✅
- Safari: ✅
- Firefox: ✅
- IE11: ❌

**Data Format:**
- All data in JavaScript files as `window.OBJECT_NAME`
- No server required
- No database
- Client-side only

---

## 🚀 Git Workflow

**Main Branch:** All work on `main`
**Remote:** `origin/main` (may be behind by ~6 commits as of 2025-10-21)

**Recent Commits:**
```
315d9a5 docs(v2): Add wake-up guide for morning demo
79c87cc refactor(v2): Move documentation to docs/ folder
6fc5b74 docs(v2): Update README with all 9 tabs and CTO night deliverables
e8bc2e6 docs(v2): Add morning testing checklist for demo prep
9d52b68 feat(v2): Add 4 analytics tabs with 8-month historical insights (MAIN FEATURE)
4cd0449 feat(v2): Commission Intelligence Platform - Sprint 1 Complete
```

**To Push Latest:**
```bash
git push origin main
```

---

## 💬 Common Questions & Answers

**Q: Is the data real?**
A: September 2025 baseline is 100% real. Jan-Aug history is synthetic but realistic. Deal-level data is synthetic for demo.

**Q: Can I trust the commission calculations?**
A: Yes - September reconciles to $97,539.31 (within $0.66 of target). All formulas decoded and validated.

**Q: What's the declining rate advantage?**
A: As agents scale, their commission % drops but $ amount increases. Revenue grows faster than commission expense. This is by design and proves sustainable scaling.

**Q: Why build this vs using existing tools?**
A: Existing tools (Zoho, Salesforce, etc.) don't understand our unique commission structure. This platform encodes our specific formulas and tells our efficiency story.

**Q: What's next to build?**
A: Forecast tab (Tab 1) with sliders for scenario modeling. User wants to model "what if we grow 50% but only hire 2 agents?"

**Q: How do I add real historical data?**
A: Export CRM data to CSV, transform to match `data_extended.js` structure, replace synthetic data. Takes ~1 hour.

---

## 🎓 For New LLM Taking Over

**Read These in Order:**
1. This file (CONTEXT.md) - you just did! ✅
2. [v2/WAKE_UP_AND_DEMO.md](v2/WAKE_UP_AND_DEMO.md) - understand what works now
3. [v2/docs/OVERNIGHT_DELIVERY_SUMMARY.md](v2/docs/OVERNIGHT_DELIVERY_SUMMARY.md) - understand what was built

**Then:**
- Open `/v2/index.html` in browser to see it working
- Read through `/v2/js/core/calculations.js` to understand formulas
- Ask user: "What do you want to work on today?"

**Key Things to Remember:**
- September 2025 data is REAL ($97,539.31 reconciled)
- Jan-Aug 2025 data is SYNTHETIC (tell user when referencing it)
- Commission % declining is GOOD (shows sustainable scaling)
- User cares about: Board presentations, team analytics, forecasting
- Always update THIS FILE (CONTEXT.md) when major changes happen

**User Preferences:**
- Appreciates thoroughness and documentation
- Wants to "impress team and Boards"
- Values transparency (synthetic vs real data)
- Likes autonomous work ("be the CTO for a couple hours")
- Prefers git commits with detailed messages

---

## 📝 Update Log (Recent Changes to This File)

**2025-10-21 PM:** Agent Termination Tracking + UX Refinements
- Added agent-level termination rate tracking feature (Tab 8 - Deals)
- Period filters: YTD, Last 3 Months, This Month
- Data table + horizontal bar chart showing termination rates per agent
- Problem agents identified: Chris Chambers (19.2%), Steve Shelburne (20%)
- Clear SYNTHETIC DATA warnings added
- Tab names abbreviated to fit on one line (Timeline, Markets, Deals)
- Renamed Tab 2: "Actuals" → "Commissions"
- Added icon-only links between Financial Model ↔ Commission Intelligence
- All changes committed to git

**2025-10-21 AM:** Initial creation of living context document
- Consolidated all project knowledge into single handoff file
- Documented current state, data structure, file locations
- Added technical details, known limitations, next steps
- Created reference guide for new LLM instances

---

**🔄 IMPORTANT: Update this file whenever:**
- Major features are added or removed
- Data structure changes
- Sprint status changes (mark tasks complete)
- New critical insights discovered
- User priorities shift
- Technical architecture evolves

**This is the living source of truth for project context.**
