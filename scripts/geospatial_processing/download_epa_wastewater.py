#!/usr/bin/env python3
"""
Download wastewater treatment facilities from EPA ECHO.
Uses EPA ECHO API to get NPDES facilities with coordinates.
"""

import json
import requests
from pathlib import Path
import time

# States where deals are located
STATE_CODES = ['AZ', 'TX', 'OH', 'IN', 'NC', 'NV', 'TN', 'OK', 'FL', 'KY', 'AL', 'NM']

def download_npdes_for_state(state_code):
    """Download NPDES facilities for a state using EPA ECHO API."""

    # EPA ECHO REST API endpoint
    url = "https://echodata.epa.gov/echo/npdes_rest_services.get_facilities"

    params = {
        'output': 'JSON',
        'p_st': state_code,
        'p_maj': 'Y',  # Major facilities only
        'p_act': 'Y',  # Active only
        'responseset': '2000'  # Max results
    }

    print(f"  Downloading {state_code}...")

    try:
        response = requests.get(url, params=params, timeout=60)
        response.raise_for_status()
        data = response.json()
        return data.get('Results', {}).get('Results', [])
    except Exception as e:
        print(f"    Error: {e}")
        return []

def epa_to_geojson(facilities):
    """Convert EPA ECHO data to GeoJSON."""
    features = []

    for fac in facilities:
        # Skip if no coordinates
        if not fac.get('FacLat') or not fac.get('FacLong'):
            continue

        try:
            lat = float(fac['FacLat'])
            lon = float(fac['FacLong'])
        except (ValueError, TypeError):
            continue

        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lon, lat]
            },
            "properties": {
                "name": fac.get('FacName', 'Unknown'),
                "city": fac.get('FacCity', ''),
                "state": fac.get('FacState', ''),
                "permit_id": fac.get('SourceID', ''),
                "type": 'Wastewater Treatment'
            }
        }
        features.append(feature)

    return features

if __name__ == "__main__":
    output_dir = Path("/Users/jimnewgent/Projects/broker_growth/reconciled/full_dashboard/data/geospatial")
    output_dir.mkdir(parents=True, exist_ok=True)

    all_features = []

    print("\n" + "="*60)
    print("Downloading Wastewater Treatment Plants from EPA ECHO")
    print("="*60)

    for state_code in STATE_CODES:
        facilities = download_npdes_for_state(state_code)
        if facilities:
            features = epa_to_geojson(facilities)
            all_features.extend(features)
            print(f"    Got {len(features)} facilities")

        time.sleep(0.5)

    # Create GeoJSON
    geojson = {
        "type": "FeatureCollection",
        "features": all_features
    }

    # Save
    output_path = output_dir / 'wastewater_plants.geojson'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(geojson, f, separators=(',', ':'))

    file_size = output_path.stat().st_size / (1024 * 1024)
    print(f"\n✓ Downloaded {len(all_features):,} wastewater facilities")
    print(f"✓ Saved {file_size:.1f} MB to wastewater_plants.geojson")
