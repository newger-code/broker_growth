# Reconciled Commission Dashboard (Full Experience)

This directory mirrors the original `v2/` single-page analytics experience, but
draws data from the reconciled September 2025 workbook. Every tab, chart, and
summary pulls directly from the updated `js/data.js` payload that was generated
from `reconciled/commission_dashboard_reconciled.html` so the math now matches
the Excel source while keeping the UI/UX intact.

Open `index.html` from this folder to view the multi-tab dashboard with the
reconciled payouts, manual adjustment tooltips, and Dustin Hepburn Type 3
breakdown baked in.

To regenerate the underlying dataset after making changes to
`commission_dashboard_reconciled.html`, run:

```bash
python ../build_full_dashboard_data.py
```
