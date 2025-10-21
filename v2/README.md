# Commission Intelligence Platform v2.0

**Rebuilt × Picket Partnership**

Transform commission calculations into strategic financial planning with real-time scenario modeling, efficiency tracking, and Board-ready analytics.

---

## 🚀 Quick Start

### Viewing the Platform

1. **Open in browser:**
   ```bash
   open index.html
   ```

2. **Or use a local server (recommended):**
   ```bash
   npx live-server
   ```

### Project Structure

```
v2/
├── index.html                  # Main application shell
├── data/
│   └── september-2025.json    # Baseline commission data
├── css/
│   ├── variables.css          # Design tokens & theme
│   ├── layout.css             # Grid, tabs, responsive
│   └── components.css         # Cards, tables, charts
├── js/
│   ├── core/
│   │   ├── state.js          # App state management
│   │   ├── calculations.js   # Commission formulas
│   │   └── tiers.js          # Tier structures
│   ├── tabs/
│   │   ├── dashboard.js      # Tab 3: Executive Dashboard
│   │   ├── efficiency.js     # Tab 4: Efficiency & Growth
│   │   ├── forecast.js       # Tab 1: Coming in Sprint 2
│   │   └── actuals.js        # Tab 2: Coming in Sprint 3
│   ├── components/
│   │   └── chart.js          # Charting utilities
│   └── app.js                # Main application init
└── README.md                  # This file
```

---

## 📊 Current Features (Sprint 1 Complete)

### Tab 3: Executive Dashboard ✅
- **4 Hero Metrics Cards:**
  - Total Commission Expense
  - Commission % of GP (declining trend)
  - GP per Agent (efficiency metric)
  - Manager Leverage (team multiplier)

- **Commission Breakdown:**
  - By role (Acq/Dispo/Managers)
  - By manager type (Type 1/2/3)

- **Team Composition:**
  - Agent counts
  - Average deals per agent
  - Team distribution

- **Top Performers:**
  - Acquisition leaders
  - Disposition leaders

### Tab 4: Efficiency & Growth ✅
- **Productivity Metrics (Per-Agent):**
  - GP per Agent (+18.4% vs baseline)
  - Deals per Agent (+12.1% improvement)
  - GP per Deal (+5.2% quality)
  - Days to Close (-15.0% faster)

- **Funnel Conversion Tracking:**
  - Lead → Assessment conversion
  - Assessment → Offer conversion
  - Offer → Close conversion
  - Picket technology impact analysis

- **Capacity Analysis:**
  - Current utilization vs max capacity
  - Growth headroom calculation
  - Months until next hire needed

- **Manager Leverage:**
  - Team GP / Personal GP multiplier
  - Player-coach performance tracking

- **Commission Efficiency Trend:**
  - 12-month declining commission % visualization
  - Shows impact of declining rates + efficiency gains
  - Competitive advantage explanation

---

## 🎯 The Strategic Story

### 1. Declining Rate Advantage
Your commission structure is smarter than competitors:
- **Most companies:** Fixed rates → Double revenue = double commission expense
- **Your model:** Declining rates → Managers earn more $ but lower % as they scale
- **Result:** Commission % drops from 15.8% to 13.8% over 12 months

### 2. Efficiency Multiplier (Picket Technology)
Technology improves productivity without adding headcount:
- **18.4%** increase in GP per agent
- **12.1%** increase in deals per agent
- **15.0%** faster closing times
- **Result:** Grow $75K/mo additional GP with same team size

### 3. Manager Leverage Model
Player-coaches create exponential value:
- **Type 2 managers** produce personal GP + manage teams
- **Team override rates** (1-3%) incentivize growth without double-paying
- **Target:** 2.0x+ leverage (team + personal = 2x personal alone)
- **Result:** Scale capacity without proportional commission growth

### Combined Impact:
**Revenue grows faster than commission expense grows = Sustainable scaling**

---

## 📈 Coming Soon (Sprint 2 & 3)

### Tab 1: Forecast & Scenario Modeling (Sprint 2)
- Global sliders for GP, transactions, growth rate
- Team composition modeling (agent counts, manager teams)
- Commission structure testing (adjust tiers, rates)
- 12-month projections
- Scenario comparison (save up to 3 scenarios)
- **Use case:** "What if we grow 50% but only hire 2 agents?"

### Tab 2: Actuals & Payroll Validation (Sprint 3)
- CSV import wizard (drag-and-drop deal files)
- Auto-calculation engine (all commission formulas)
- Variance analysis (forecast vs actuals)
- Manager approval workflow
- Export to payroll systems (ADP/CSV format)
- Historical tracking and trends
- **Use case:** "Upload September deals → validate → export to payroll"

---

## 💡 Key Insights Built Into This Platform

### For the CFO:
- Commission % of GP trending down (14.3% and declining)
- Can model hiring scenarios instantly
- Knows exactly when next hire is needed
- Understands unit economics deeply

### For the CEO:
- Efficiency gains from Picket are measurable (+18% per-agent productivity)
- Growth headroom calculated (35% more GP before next hire)
- Manager leverage tracking (which player-coaches create most value)
- Can answer Board questions with data, not guesses

### For the Board:
- Professional financial tooling demonstrates operational maturity
- Declining rate structure proves sustainable scaling model
- Technology ROI is visible and tracked
- Competitive moat (efficiency + declining rates) is quantified

---

## 🎨 Design Philosophy

### Color Palette:
- **Deep navy/slate:** Professional, trustworthy foundation
- **Electric blue:** Picket brand, innovation
- **Golden yellow:** Premium metrics, key insights
- **Emerald green:** Positive trends, growth
- **Amber:** Warnings, attention items

### Visual Hierarchy:
1. **Hero metrics** - Large, bold numbers with trend indicators
2. **Breakdowns** - Tables and stat lists for detail
3. **Callouts** - Colored boxes highlighting strategic insights
4. **Tooltips** - (Coming) Hover to see calculation formulas

### Responsive Design:
- Desktop: 4-column grid for metrics
- Tablet: 2-column grid
- Mobile: Single column stack

---

## 🔧 Technical Details

### No Dependencies
- Pure JavaScript (ES6+)
- No frameworks required
- Runs offline once loaded
- < 100KB total size

### Browser Compatibility:
- Chrome/Edge: ✅ (recommended)
- Safari: ✅
- Firefox: ✅
- IE11: ❌ (not supported)

### Data Format:
All data in `data/september-2025.json`:
```json
{
  "metadata": { ... },
  "agent_summary": { ... },
  "manager_summary": { ... },
  "efficiency_baseline": { ... }
}
```

### Commission Formulas:
See `js/core/calculations.js` for all formulas:
- Acq agents: Blended rates (4%, 6%, 8%, 10%)
- Dispo agents: Progressive tiers (9 tiers)
- Type 1 managers: Company/ISA weighted split
- Type 2 managers: Agent + Team override
- Type 3 managers: % of goal attainment

---

## 📝 Development Roadmap

### Sprint 1 (Weeks 1-2): ✅ COMPLETE
- [x] Project structure
- [x] Design system
- [x] Tab navigation
- [x] Executive Dashboard (Tab 3)
- [x] Efficiency & Growth (Tab 4)

### Sprint 2 (Weeks 3-4): 🚧 IN PLANNING
- [ ] Forecast engine with sliders
- [ ] Scenario comparison
- [ ] 12-month projections
- [ ] Pre-loaded scenarios
- [ ] Export forecast to PDF

### Sprint 3 (Weeks 5-6): 📋 BACKLOG
- [ ] CSV import wizard
- [ ] Auto-calculation engine
- [ ] Variance analysis
- [ ] Payroll export
- [ ] Historical tracking

---

## 🤝 Relationship to Existing Tools

### Keep Using:
- `commission_calculator.html` - Individual agent calculator
- `commission_dashboard.html` - September actuals display

### This Platform Adds:
- Strategic financial planning (forecasting)
- Efficiency tracking (Picket impact)
- Board-ready presentations
- Scenario modeling capabilities
- Multi-month trend analysis

**Think of it as:**
- **Old tools** = "What did we pay last month?"
- **New platform** = "What should we expect next quarter? How do we optimize?"

---

## 📞 Support & Feedback

Questions or issues?
1. Check browser console for errors
2. Verify `data/september-2025.json` loads correctly
3. Ensure you're using a modern browser

---

## 🎯 Next Steps

1. **Review Sprint 1 output** - Open index.html and explore Tabs 3 & 4
2. **Gather feedback** - What works? What's missing?
3. **Prioritize Sprint 2** - Which forecast features are most important?
4. **Plan Board demo** - Which tab/insights to highlight first?

---

**Built with deep understanding of your commission structure and strategic growth goals.**

*Rebuilt × Picket • Commission Intelligence Platform • v2.0*
