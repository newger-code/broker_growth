# GEOSPATIAL DATASETS SETUP GUIDE
## Complete Step-by-Step Instructions

**IMPORTANT:** Follow these steps IN ORDER. Do not skip steps. Do not try alternative approaches.

---

## PHASE 1: DOWNLOAD DATASETS (4 WORKING DATASETS)

### Step 1.1: Create directory structure
```bash
cd /Users/jimnewgent/Projects/broker_growth
mkdir -p reconciled/full_dashboard/data/geospatial
mkdir -p scripts/geospatial_processing
```

### Step 1.2: Download Power Transmission Lines (HIFLD)
```bash
curl "https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Electric_Power_Transmission_Lines/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson" -o reconciled/full_dashboard/data/geospatial/power_lines.geojson --max-time 300 --retry 3
```

**IMPORTANT:** Copy this as ONE SINGLE LINE. Do NOT split across multiple lines.

**Expected result:** File size 60-120MB. Contains transmission line features with LineString geometry.

### Step 1.3: Download Cell Towers (HIFLD)
```bash
curl "https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Cellular_Towers/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson" -o reconciled/full_dashboard/data/geospatial/cell_towers.geojson --max-time 300 --retry 3
```

**IMPORTANT:** Copy this as ONE SINGLE LINE. Do NOT split across multiple lines.

**Expected result:** File size 25-40MB. Contains cell tower Point features.

### Step 1.4: Download Railroads (BTS)
```bash
curl "https://services.arcgis.com/xOi1kZaI0eWDREZv/arcgis/rest/services/NTAD_North_American_Rail_Network_Lines/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson" -o reconciled/full_dashboard/data/geospatial/railroads.geojson --max-time 300 --retry 3
```

**IMPORTANT:** Copy this as ONE SINGLE LINE. Do NOT split across multiple lines.

**Expected result:** File size 40-70MB. Contains railroad LineString features.

### Step 1.5: Download Starbucks Locations (GitHub)
```bash
curl "https://raw.githubusercontent.com/chrismeller/StarbucksLocations/master/stores.csv" -o reconciled/full_dashboard/data/starbucks_locations.csv --max-time 60
```

**IMPORTANT:** Copy this as ONE SINGLE LINE. Do NOT split across multiple lines.

**Expected result:** File size ~5MB. CSV file with columns: Latitude, Longitude, Name, City, etc.

### Step 1.6: Verify downloads
```bash
ls -lh reconciled/full_dashboard/data/geospatial/
ls -lh reconciled/full_dashboard/data/starbucks_locations.csv
```

**Expected output:** You should see 3 .geojson files (power_lines, cell_towers, railroads) and 1 .csv file (starbucks_locations).

---

## PHASE 2: CONVERT STARBUCKS CSV TO GEOJSON

### Step 2.1: Create Python conversion script
Create file: `/Users/jimnewgent/Projects/broker_growth/scripts/geospatial_processing/convert_starbucks_to_geojson.py`

```python
#!/usr/bin/env python3
"""Convert Starbucks CSV to GeoJSON format."""

import csv
import json
from pathlib import Path

def convert_starbucks_to_geojson(csv_path: str, output_path: str):
    """Convert Starbucks locations CSV to GeoJSON."""

    features = []

    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            # Skip rows without coordinates
            if not row.get('Latitude') or not row.get('Longitude'):
                continue

            try:
                lat = float(row['Latitude'])
                lon = float(row['Longitude'])
            except (ValueError, KeyError):
                continue

            # Filter to US only (optional - remove if you want worldwide)
            if row.get('CountryCode') != 'US':
                continue

            # Create GeoJSON feature
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lon, lat]  # GeoJSON is [lon, lat]
                },
                "properties": {
                    "name": row.get('Name', 'Starbucks'),
                    "city": row.get('City', ''),
                    "state": row.get('StateProvince', ''),
                    "street": row.get('Street1', ''),
                    "postal_code": row.get('PostalCode', ''),
                    "phone": row.get('PhoneNumber', ''),
                    "store_number": row.get('StoreNumber', '')
                }
            }

            features.append(feature)

    # Create GeoJSON FeatureCollection
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }

    # Write to file
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(geojson, f, separators=(',', ':'))

    print(f"✓ Converted {len(features)} Starbucks locations to GeoJSON")
    print(f"✓ Saved to: {output_path}")

if __name__ == "__main__":
    csv_path = "/Users/jimnewgent/Projects/broker_growth/reconciled/full_dashboard/data/starbucks_locations.csv"
    output_path = "/Users/jimnewgent/Projects/broker_growth/reconciled/full_dashboard/data/geospatial/starbucks.geojson"

    convert_starbucks_to_geojson(csv_path, output_path)
```

### Step 2.2: Make script executable and run it
```bash
chmod +x scripts/geospatial_processing/convert_starbucks_to_geojson.py
python3 scripts/geospatial_processing/convert_starbucks_to_geojson.py
```

**Expected result:** Creates `reconciled/full_dashboard/data/geospatial/starbucks.geojson` with ~15K US Starbucks locations.

---

## PHASE 3: UPDATE GEOGRAPHIC.JS WITH ALL 4 OVERLAYS

### Step 3.1: Update the overlaySources object in geographic.js

Open file: `/Users/jimnewgent/Projects/broker_growth/reconciled/full_dashboard/js/tabs/geographic.js`

Find the `overlaySources` object (around line 32-66) and REPLACE it with:

```javascript
overlaySources: {
  powerLines: {
    label: 'Power Transmission Lines',
    url: 'data/geospatial/power_lines.geojson',
    style: {
      color: '#ef4444',     // Red
      weight: 7,
      opacity: 0.8,
      dashArray: '8 4'      // Dashed line
    },
    type: 'line'
  },
  railroads: {
    label: 'Railroads (National Network)',
    url: 'data/geospatial/railroads.geojson',
    style: {
      color: '#a855f7',     // Purple
      weight: 7,
      opacity: 0.85,
      dashArray: '12 8'     // Dashed line
    },
    type: 'line'
  },
  cellTowers: {
    label: 'Cell Towers',
    url: 'data/geospatial/cell_towers.geojson',
    style: {
      color: '#22c55e',     // Green
      radius: 4,
      fillOpacity: 0.6,
      weight: 1,
      fillColor: '#22c55e'
    },
    type: 'point'
  },
  starbucks: {
    label: 'Starbucks Locations',
    url: 'data/geospatial/starbucks.geojson',
    style: {
      color: '#00704A',     // Starbucks green
      radius: 3,
      fillOpacity: 0.5,
      weight: 1,
      fillColor: '#00704A'
    },
    type: 'point'
  }
}
```

### Step 3.2: Update the loadOverlay function to handle Point geometries

Find the `loadOverlay` function (around line 350-400) and UPDATE the layer creation logic:

```javascript
async loadOverlay(key) {
  const source = this.config.overlaySources[key];
  if (!source || this.overlayLayers[key]) return;

  try {
    const response = await fetch(source.url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const geojson = await response.json();

    // Create layer based on geometry type
    let layer;

    if (source.type === 'point') {
      // Point geometry - use CircleMarker
      layer = L.geoJSON(geojson, {
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, source.style);
        }
      });
    } else {
      // Line or Polygon geometry - use regular styling
      layer = L.geoJSON(geojson, {
        style: source.style
      });
    }

    this.overlayLayers[key] = layer;

    // Add to map if checkbox is checked
    const checkbox = document.getElementById(`overlay-${key}`);
    if (checkbox && checkbox.checked) {
      layer.addTo(this.map);
    }

    console.log(`[GeographicTab] Loaded overlay: ${key}`);
  } catch (error) {
    console.error(`[GeographicTab] Failed to load overlay ${key}:`, error);
  }
}
```

### Step 3.3: Update the overlay checkboxes HTML

Find the overlay checkboxes section in `renderOverlayToggles()` method and ensure it generates checkboxes for all 4 overlays:

```javascript
renderOverlayToggles() {
  const container = document.getElementById('overlay-toggles');
  if (!container) return;

  const overlays = Object.entries(this.config.overlaySources);

  container.innerHTML = overlays.map(([key, source]) => `
    <label class="overlay-toggle">
      <input
        type="checkbox"
        id="overlay-${key}"
        data-overlay="${key}"
      >
      <span>${source.label}</span>
    </label>
  `).join('');

  // Add event listeners
  overlays.forEach(([key]) => {
    const checkbox = document.getElementById(`overlay-${key}`);
    if (checkbox) {
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.loadOverlay(key);
        } else {
          this.removeOverlay(key);
        }
      });
    }
  });
}
```

---

## PHASE 4: TEST THE IMPLEMENTATION

### Step 4.1: Start local HTTP server
```bash
cd /Users/jimnewgent/Projects/broker_growth/reconciled/full_dashboard
npx http-server -p 8080
```

### Step 4.2: Open in browser
Navigate to: `http://localhost:8080`

### Step 4.3: Test each overlay
1. Click on the "Geographic Intelligence" tab
2. Check each overlay checkbox one by one:
   - ☐ Power Transmission Lines (should show red dashed lines)
   - ☐ Railroads (should show purple dashed lines)
   - ☐ Cell Towers (should show green dots)
   - ☐ Starbucks Locations (should show dark green dots)
3. Verify overlays appear on the map
4. Uncheck boxes to confirm layers hide/show correctly

### Step 4.4: Check browser console for errors
Open DevTools (F12) → Console tab. You should see:
```
[GeographicTab] Loaded overlay: powerLines
[GeographicTab] Loaded overlay: railroads
[GeographicTab] Loaded overlay: cellTowers
[GeographicTab] Loaded overlay: starbucks
```

---

## TROUBLESHOOTING

### Problem: curl returns "exceededTransferLimit"
**Solution:** This is normal for large datasets. The API will still return data, just in chunks. The GeoJSON file will be valid and usable.

### Problem: File size is smaller than expected
**Solution:** Some services limit the number of features returned in a single query. Add `&resultRecordCount=10000` to the URL if you need to experiment, but the default should work.

### Problem: Starbucks conversion script shows 0 locations
**Solution:** Check the CSV file has data:
```bash
head -n 5 reconciled/full_dashboard/data/starbucks_locations.csv
```

### Problem: Overlays don't show on map
**Solution:**
1. Verify you're using `http://localhost:8080` (NOT `file://`)
2. Check browser console for CORS errors
3. Verify files exist:
```bash
ls -lh reconciled/full_dashboard/data/geospatial/
```

### Problem: Points (cell towers, Starbucks) don't render
**Solution:** Make sure you added the `type: 'point'` property to the overlay config and updated the `loadOverlay` function to use `pointToLayer` with `L.circleMarker`.

---

## FILE SIZE EXPECTATIONS

After completing all steps, you should have:

```
reconciled/full_dashboard/data/geospatial/
├── power_lines.geojson      (~60-120 MB)
├── railroads.geojson         (~40-70 MB)
├── cell_towers.geojson       (~25-40 MB)
└── starbucks.geojson         (~2-4 MB)
```

**Total size:** ~130-230 MB (well within GitHub Pages 1GB repo limit)

---

## WHAT TO SKIP (FOR NOW)

We are NOT implementing these 3 complex datasets in this phase:

❌ **Waterways** - Requires regional filtering (full US is 5GB+)
❌ **Wastewater Treatment Plants** - Requires EPA account + manual CSV export
❌ **Census Median Income** - Requires API + geometry joining + choropleth logic

These can be added later if needed for additional WOW factor.

---

## SUCCESS CRITERIA

✅ 4 GeoJSON files downloaded and saved
✅ Starbucks CSV converted to GeoJSON
✅ geographic.js updated with all 4 overlay configurations
✅ HTTP server running on port 8080
✅ All 4 overlays visible on map when checkboxes checked
✅ No console errors in browser DevTools
✅ Overlays properly styled (correct colors, line weights, point sizes)

---

## NEXT STEPS AFTER SUCCESS

Once all 4 overlays are working:
1. Adjust line weights if too thick/thin (currently set to 7px)
2. Test with different zoom levels for optimal visibility
3. Consider adding layer groups for better organization
4. Deploy to GitHub Pages for VC demo access
