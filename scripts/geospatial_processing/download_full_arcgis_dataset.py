#!/usr/bin/env python3
"""
Download complete ArcGIS FeatureServer datasets bypassing transfer limits.
Uses offset/limit pagination instead of Object IDs to avoid URL length issues.
"""

import json
import requests
from pathlib import Path
import time

def get_feature_count(service_url):
    """Get total feature count from the service."""
    params = {
        'where': '1=1',
        'returnCountOnly': 'true',
        'f': 'json'
    }

    response = requests.get(f"{service_url}/query", params=params, timeout=60)
    response.raise_for_status()
    data = response.json()

    return data.get('count', 0)

def download_features_paginated(service_url, total_count, page_size=1000):
    """Download features using resultOffset pagination."""
    all_features = []

    for offset in range(0, total_count, page_size):
        params = {
            'where': '1=1',
            'outFields': '*',
            'f': 'geojson',
            'returnGeometry': 'true',
            'resultOffset': offset,
            'resultRecordCount': page_size
        }

        batch_num = offset // page_size + 1
        total_batches = (total_count - 1) // page_size + 1
        print(f"  Downloading batch {batch_num}/{total_batches} (offset {offset})...")

        try:
            response = requests.get(f"{service_url}/query", params=params, timeout=120)
            response.raise_for_status()
            batch_data = response.json()

            if 'features' in batch_data:
                all_features.extend(batch_data['features'])
                print(f"    Got {len(batch_data['features'])} features (total: {len(all_features)})")

            time.sleep(0.3)

        except Exception as e:
            print(f"    Error: {e}")
            continue

    return all_features

def download_complete_dataset(service_url, output_path, dataset_name):
    """Download complete dataset from ArcGIS REST API."""
    print(f"\n{'='*60}")
    print(f"Downloading: {dataset_name}")
    print(f"{'='*60}")

    print("Step 1: Getting feature count...")
    total_count = get_feature_count(service_url)
    print(f"  Found {total_count:,} features")

    if total_count == 0:
        print("  No features found!")
        return False

    print("Step 2: Downloading all features...")
    all_features = download_features_paginated(service_url, total_count)
    print(f"  Downloaded {len(all_features):,} features")

    geojson = {
        "type": "FeatureCollection",
        "features": all_features
    }

    print(f"Step 3: Saving to {output_path.name}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(geojson, f, separators=(',', ':'))

    file_size = output_path.stat().st_size / (1024 * 1024)
    print(f"  ✓ Saved {file_size:.1f} MB")
    print(f"  ✓ Complete!")

    return True

if __name__ == "__main__":
    base_dir = Path("/Users/jimnewgent/Projects/broker_growth/reconciled/full_dashboard/data/geospatial")
    base_dir.mkdir(parents=True, exist_ok=True)

    datasets = [
        {
            'name': 'Power Transmission Lines (HIFLD)',
            'url': 'https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Electric_Power_Transmission_Lines/FeatureServer/0',
            'output': base_dir / 'power_lines.geojson'
        },
        {
            'name': 'Railroads (BTS)',
            'url': 'https://services.arcgis.com/xOi1kZaI0eWDREZv/arcgis/rest/services/NTAD_North_American_Rail_Network_Lines/FeatureServer/0',
            'output': base_dir / 'railroads.geojson'
        },
        {
            'name': 'Cell Towers (NASA HIFLD)',
            'url': 'https://maps.nccs.nasa.gov/mapping/rest/services/hifld_open/communications/FeatureServer/3',
            'output': base_dir / 'cell_towers.geojson'
        }
    ]

    for dataset in datasets:
        try:
            download_complete_dataset(dataset['url'], dataset['output'], dataset['name'])
        except Exception as e:
            print(f"Failed to download {dataset['name']}: {e}")

    print(f"\n{'='*60}")
    print("ALL DOWNLOADS COMPLETE")
    print(f"{'='*60}\n")
