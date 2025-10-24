#!/usr/bin/env python3
"""
Filter waterways.geojson to only include features near property locations.
This creates a lightweight version for better browser performance.
"""

import json
from pathlib import Path
import math

# Property coordinates from deal_locations.js
PROPERTY_COORDS = [
    (38.00260176379, -84.196782833448),  # Winchester, KY
    (29.3946696, -98.5224864),  # San Antonio, TX
    (43.59495724751, -83.884864279821),  # Bay City, MI
    (33.348288, -105.677985),  # Ruidoso, NM
    (35.8895815, -88.91561734117),  # Humboldt, TN
    (34.2923925, -87.62583928228),  # Haleyville, AL
    (32.4063095, -104.2436955),  # Carlsbad, NM
    (35.5658691, -89.6457691),  # Covington, TN
    (36.324027, -78.308705),  # Henderson, NC
    (33.5201752, -86.8147336),  # Birmingham, AL
    (29.03869, -95.69796),  # Sweeny, TX
    (40.580645, -83.123305),  # Marion, OH
    (39.113075, -84.515625),  # Cincinnati, OH
    (36.263885, -83.802275),  # Maynardville, TN
    (41.00402, -80.35076),  # New Castle, PA
    (32.55183, -86.21453),  # Wetumpka, AL
    (32.8276665, -83.66073299924),  # Macon, GA
    (43.273365, -86.164165),  # Twin Lake, MI
    (40.062385, -74.918365),  # Beverly, NJ
]

# Maximum distance in miles to keep waterways
MAX_DISTANCE_MILES = 50

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate distance in miles between two lat/lon points."""
    R = 3959  # Earth's radius in miles

    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))

    return R * c

def is_near_any_property(coordinates):
    """Check if any coordinate in a LineString is near any property."""
    for lon, lat in coordinates:
        for prop_lat, prop_lon in PROPERTY_COORDS:
            distance = haversine_distance(lat, lon, prop_lat, prop_lon)
            if distance <= MAX_DISTANCE_MILES:
                return True
    return False

def filter_waterways():
    """Filter waterways to only include those near properties."""

    input_path = Path("/Users/jimnewgent/Projects/broker_growth/reconciled/full_dashboard/data/geospatial/waterways.geojson")
    output_path = Path("/Users/jimnewgent/Projects/broker_growth/reconciled/full_dashboard/data/geospatial/waterways_filtered.geojson")

    print("\n" + "="*60)
    print("Filtering Waterways by Property Proximity")
    print("="*60)
    print(f"Input: {input_path.name}")
    print(f"Max distance: {MAX_DISTANCE_MILES} miles from properties")
    print(f"Property count: {len(PROPERTY_COORDS)}")

    # Read original waterways
    print(f"\nReading {input_path.name}...")
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    original_count = len(data['features'])
    original_size = input_path.stat().st_size / (1024 * 1024)
    print(f"  Original: {original_count:,} features, {original_size:.1f} MB")

    # Filter features
    print("\nFiltering features...")
    filtered_features = []

    for i, feature in enumerate(data['features']):
        if i % 10000 == 0 and i > 0:
            print(f"  Processed {i:,}/{original_count:,} features...")

        if feature['geometry']['type'] == 'LineString':
            coords = feature['geometry']['coordinates']
            if is_near_any_property(coords):
                filtered_features.append(feature)

    # Create filtered GeoJSON
    filtered_geojson = {
        "type": "FeatureCollection",
        "features": filtered_features
    }

    # Save
    print(f"\nSaving filtered waterways...")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(filtered_geojson, f, separators=(',', ':'))

    filtered_count = len(filtered_features)
    filtered_size = output_path.stat().st_size / (1024 * 1024)
    reduction_pct = (1 - filtered_count / original_count) * 100
    size_reduction_pct = (1 - filtered_size / original_size) * 100

    print("\n" + "="*60)
    print("Filtering Complete")
    print("="*60)
    print(f"Original:  {original_count:,} features, {original_size:.1f} MB")
    print(f"Filtered:  {filtered_count:,} features, {filtered_size:.1f} MB")
    print(f"Reduction: {reduction_pct:.1f}% features, {size_reduction_pct:.1f}% file size")
    print(f"\nOutput: {output_path}")

if __name__ == "__main__":
    filter_waterways()
