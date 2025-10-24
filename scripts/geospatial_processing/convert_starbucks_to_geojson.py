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
