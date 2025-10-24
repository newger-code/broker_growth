#!/usr/bin/env python3
"""
Download waterways from OpenStreetMap for specific US states.
Uses Overpass API to get rivers, streams, canals.
"""

import json
import requests
from pathlib import Path
import time

# States where deals are located (from market coords in geographic.js)
STATES = {
    'Arizona': 'AZ',
    'Texas': 'TX',
    'Ohio': 'OH',
    'Indiana': 'IN',
    'North Carolina': 'NC',
    'Nevada': 'NV',
    'Tennessee': 'TN',
    'Oklahoma': 'OK',
    'Florida': 'FL',
    'Kentucky': 'KY',
    'Alabama': 'AL',
    'New Mexico': 'NM'
}

def download_waterways_for_state(state_name):
    """Download waterways for a specific state using Overpass API."""

    # Overpass QL query for waterways in the state
    query = f"""
    [out:json][timeout:90];
    area["name"="{state_name}"]["admin_level"="4"]->.searchArea;
    (
      way["waterway"~"river|stream|canal"](area.searchArea);
      relation["waterway"~"river|stream|canal"](area.searchArea);
    );
    out geom;
    """

    url = "https://overpass-api.de/api/interpreter"

    print(f"  Downloading {state_name}...")

    try:
        response = requests.post(url, data={'data': query}, timeout=120)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"    Error: {e}")
        return None

def osm_to_geojson(osm_data):
    """Convert OSM JSON to GeoJSON."""
    features = []

    if not osm_data or 'elements' not in osm_data:
        return features

    for element in osm_data['elements']:
        if element['type'] == 'way' and 'geometry' in element:
            # Convert OSM way to GeoJSON LineString
            coordinates = [[node['lon'], node['lat']] for node in element['geometry']]

            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": coordinates
                },
                "properties": {
                    "name": element.get('tags', {}).get('name', 'Unnamed'),
                    "waterway": element.get('tags', {}).get('waterway', 'unknown')
                }
            }
            features.append(feature)

    return features

if __name__ == "__main__":
    output_dir = Path("/Users/jimnewgent/Projects/broker_growth/reconciled/full_dashboard/data/geospatial")
    output_dir.mkdir(parents=True, exist_ok=True)

    all_features = []

    print("\n" + "="*60)
    print("Downloading Waterways from OpenStreetMap")
    print("="*60)

    for state_name in STATES.keys():
        osm_data = download_waterways_for_state(state_name)
        if osm_data:
            features = osm_to_geojson(osm_data)
            all_features.extend(features)
            print(f"    Got {len(features)} waterways")

        # Be respectful to Overpass API
        time.sleep(2)

    # Create GeoJSON
    geojson = {
        "type": "FeatureCollection",
        "features": all_features
    }

    # Save
    output_path = output_dir / 'waterways.geojson'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(geojson, f, separators=(',', ':'))

    file_size = output_path.stat().st_size / (1024 * 1024)
    print(f"\n✓ Downloaded {len(all_features):,} waterways")
    print(f"✓ Saved {file_size:.1f} MB to waterways.geojson")
