# Deal Geocoding Guide

The Markets tab now supports property-level pins alongside the market bubbles. To see exact addresses on the map you need to geocode your closing spreadsheet so each deal has latitude/longitude coordinates.

## 0. Export the “Dispo Closings” tab

If you are working from the September reconciliation workbook (`Docs/Sept 2025 Closings.csv`), run:

```bash
python scripts/export_dispo_closings.py \
  --input "Docs/Sept 2025 Closings.csv" \
  --output reconciled/full_dashboard/data/deal_addresses.csv
```

This normalises the header names and drops non-address columns so the geocoder has a clean input. If you already have a CSV in the expected format you can skip this step.

## 1. Prepare the CSV

Export a CSV (or save-as from Excel) with the following headers:

```
property,city,state,agent,gp,days_to_close
```

Only `property`, `city`, and `state` are required; the other columns are rendered in the popup when available.

Save the file to `reconciled/full_dashboard/data/deal_addresses.csv`.

## 2. Geocode the addresses

From the project root:

```bash
pip install requests
python scripts/geocode_deals.py \
  --input reconciled/full_dashboard/data/deal_addresses.csv \
  --output reconciled/full_dashboard/js/deal_locations.js
```

The script:
- Uses OpenStreetMap’s Nominatim API (respect rate limits; the script throttles requests to 1/sec).
- Caches results in `.cache/geocode_deals.json` so subsequent runs don’t re-hit the API.
- Writes `deal_locations.js` containing `window.DEAL_LOCATIONS = [...]` which the dashboard automatically loads.

If you prefer raw JSON, change the `--output` extension to `.json`.

## 3. Load the new data

`index.html` already pulls in `js/deal_locations.js` when present. Reload the dashboard, choose **September 2025 Closings** (or the latest month) from the new dataset dropdown, toggle **Deal Pins (Closings)**, and use the ◎ button to jump to the pin cluster. Pins sourced from geocoded data show in blue; YTD synthetic fills appear grey with an inline reminder to geocode.

## Troubleshooting

| Issue | Fix |
| --- | --- |
| `ModuleNotFoundError: geopy` | Run `pip install geopy` |
| `ValueError: Input CSV must include columns…` | Ensure the CSV headers exactly match `property, city, state` |
| No pins appear | Check that `deal_locations.js` is generated and that Leaflet isn’t blocked by the browser |
| Pins look clustered at city center | That means we’re using the fallback jittered points; re-run the geocoder |

Once geocoded data exists you can commit `js/deal_locations.js` (or the JSON equivalent) so the map renders precisely for everyone.
