# Broker Growth - Commission Intelligence Platform

**Live Site:** https://brokergrowth.netlify.app

## Quick Start

1. **Main Dashboard:** [reconciled/full_dashboard/](reconciled/full_dashboard/) - Production commission intelligence platform with geospatial analysis
2. **Sensitivity Calculator:** [sensitivity/](sensitivity/) - Financial modeling tool for broker growth scenarios

## Key Files

- **[HANDOFF.md](HANDOFF.md)** - Complete project status and context (read this first)
- **[CONTEXT_AND_LEARNINGS.md](CONTEXT_AND_LEARNINGS.md)** - Critical lessons learned (mistakes to avoid)
- **[index.html](index.html)** - Landing page with navigation

## Project Structure

```
broker_growth/
├── reconciled/full_dashboard/  # ⭐ LIVE PRODUCTION DASHBOARD
│   ├── index.html             # Main dashboard (9 tabs)
│   ├── data/                  # Commission data + geospatial layers
│   └── js/                    # Tab implementations
├── sensitivity/               # Financial sensitivity calculator
├── comps/                     # Market intelligence (competitive analysis)
├── v2/                        # Legacy dashboard (pre-geospatial)
└── zarchive/                  # Historical files and analysis scripts
```

## Deployment

**Platform:** Netlify (auto-deploys from GitHub main branch)
- **Publish directory:** `.` (root)
- **Git LFS enabled** for large geospatial files (548 MB total)

### Geospatial Layers
- Cell towers (11.7 MB)
- Fiber optic cables (23 MB)
- Schools (7.5 MB)
- Flood zones (113 MB)
- EPA facilities (12 MB)
- Waterways (85 MB - filtered to 50mi radius)

## Architecture

- **Frontend:** Pure JavaScript (no framework)
- **Data:** Static JSON/GeoJSON files
- **Maps:** Leaflet.js with clustering
- **Charts:** ApexCharts for sparklines
- **Hosting:** Netlify with Git LFS support

## Development

```bash
# Serve locally
cd reconciled/full_dashboard
python3 -m http.server 8000
# Visit http://localhost:8000
```

## Recent Updates

- ✅ Deployed to Netlify with Git LFS support
- ✅ Fixed navigation links for root deployment
- ✅ Replaced info icon tooltips with underlined text
- ✅ Added geospatial layers (6 infrastructure datasets)
- ✅ Migrated large files to Git LFS (911 MB waterways removed)

## Historical Context

See [zarchive/docs/](zarchive/docs/) for:
- Architecture analysis
- Excel formula documentation
- Strategic plans and roadmaps
- Competitive research

---

**Last Updated:** 2025-10-24
