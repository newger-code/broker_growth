#!/usr/bin/env python3
"""
Download Census tract geometries and median income data.
Creates a choropleth layer for income visualization.
"""

import json
import requests
from pathlib import Path
import time
import zipfile
import io

# State FIPS codes for states with deals
STATE_FIPS = {
    '04': 'AZ', '48': 'TX', '39': 'OH', '18': 'IN',
    '37': 'NC', '32': 'NV', '47': 'TN', '40': 'OK',
    '12': 'FL', '21': 'KY', '01': 'AL', '35': 'NM'
}

def download_census_income_for_state(state_fips):
    """Download median income for all tracts in a state from Census API."""

    url = "https://api.census.gov/data/2022/acs/acs5"

    params = {
        'get': 'B19013_001E,NAME',  # Median household income
        'for': 'tract:*',
        'in': f'state:{state_fips}'
    }

    print(f"  Downloading income data for state {state_fips}...")

    try:
        response = requests.get(url, params=params, timeout=60)
        response.raise_for_status()
        data = response.json()

        # Convert to dict keyed by GEOID
        income_data = {}
        headers = data[0]
        for row in data[1:]:
            row_dict = dict(zip(headers, row))
            geoid = f"{row_dict['state']}{row_dict['county']}{row_dict['tract']}"
            try:
                income = int(row_dict['B19013_001E']) if row_dict['B19013_001E'] not in ['-666666666', None, ''] else None
                if income and income > 0:
                    income_data[geoid] = income
            except (ValueError, KeyError):
                continue

        return income_data
    except Exception as e:
        print(f"    Error: {e}")
        return {}

def download_tract_geometries_for_state(state_fips, year='2022'):
    """Download Census tract geometries from TIGER shapefiles."""

    # TIGER shapefile URL
    url = f"https://www2.census.gov/geo/tiger/TIGER{year}/TRACT/tl_{year}_{state_fips}_tract.zip"

    print(f"  Downloading tract geometries for state {state_fips}...")

    try:
        response = requests.get(url, timeout=120)
        response.raise_for_status()

        # Extract ZIP in memory
        with zipfile.ZipFile(io.BytesIO(response.content)) as z:
            # Find the .shp file
            shp_files = [f for f in z.namelist() if f.endswith('.shp')]
            if not shp_files:
                print("    No shapefile found")
                return None

            # Extract all files to temp directory
            temp_dir = Path(f"/tmp/census_tract_{state_fips}")
            temp_dir.mkdir(exist_ok=True)
            z.extractall(temp_dir)

            return temp_dir / shp_files[0]

    except Exception as e:
        print(f"    Error: {e}")
        return None

def shapefile_to_geojson_with_income(shp_path, income_data):
    """Convert shapefile to GeoJSON and join with income data."""

    try:
        import geopandas as gpd

        # Read shapefile
        gdf = gpd.read_file(shp_path)

        # Add income data
        gdf['median_income'] = gdf['GEOID'].map(income_data)

        # Filter to only tracts with income data
        gdf = gdf[gdf['median_income'].notna()]

        # Simplify geometries to reduce file size
        gdf['geometry'] = gdf['geometry'].simplify(tolerance=0.001, preserve_topology=True)

        # Convert to GeoJSON dict
        geojson_dict = json.loads(gdf.to_json())

        return geojson_dict['features']

    except ImportError:
        print("    geopandas not available, skipping geometry processing")
        return []
    except Exception as e:
        print(f"    Error converting shapefile: {e}")
        return []

if __name__ == "__main__":
    output_dir = Path("/Users/jimnewgent/Projects/broker_growth/reconciled/full_dashboard/data/geospatial")
    output_dir.mkdir(parents=True, exist_ok=True)

    all_features = []

    print("\n" + "="*60)
    print("Downloading Census Income Data")
    print("="*60)

    for state_fips, state_code in STATE_FIPS.items():
        # Download income data
        income_data = download_census_income_for_state(state_fips)
        print(f"    Got income for {len(income_data)} tracts")

        if not income_data:
            continue

        # Download tract geometries
        shp_path = download_tract_geometries_for_state(state_fips)

        if shp_path and shp_path.exists():
            # Convert and join
            features = shapefile_to_geojson_with_income(shp_path, income_data)
            all_features.extend(features)
            print(f"    Added {len(features)} tracts with geometry")

        time.sleep(1)

    if all_features:
        # Create GeoJSON
        geojson = {
            "type": "FeatureCollection",
            "features": all_features
        }

        # Save
        output_path = output_dir / 'census_income_tracts.geojson'
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(geojson, f, separators=(',', ':'))

        file_size = output_path.stat().st_size / (1024 * 1024)
        print(f"\n✓ Downloaded {len(all_features):,} census tracts with income data")
        print(f"✓ Saved {file_size:.1f} MB to census_income_tracts.geojson")
    else:
        print("\n✗ No data downloaded (geopandas may not be installed)")
        print("  To enable census income layer: pip install geopandas")
