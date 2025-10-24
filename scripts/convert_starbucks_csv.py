#!/usr/bin/env python3
"""
Convert a Starbucks location CSV into GeoJSON circle-marker friendly output.

The default CSV source is the community-maintained dataset:
https://raw.githubusercontent.com/2023vishal/Starbucks-Locations/master/Starbucks_Coffee_Store_Locations.csv
"""

import argparse
import csv
import json
from pathlib import Path
from typing import Dict, Iterable, Optional

import requests


DEFAULT_SOURCE = "https://raw.githubusercontent.com/2023vishal/Starbucks-Locations/master/Starbucks_Coffee_Store_Locations.csv"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", help="Local CSV path. If omitted, --source is used.")
    parser.add_argument("--source", default=DEFAULT_SOURCE, help="Remote CSV URL when --input is not supplied.")
    parser.add_argument("--out", required=True, help="Destination GeoJSON path.")
    parser.add_argument("--limit", type=int, help="Optional limit on rows (for quick sampling).")
    return parser.parse_args()


def fetch_csv(source: str) -> Iterable[Dict[str, str]]:
    response = requests.get(source, timeout=60)
    response.raise_for_status()
    text = response.text
    return csv.DictReader(text.splitlines())


def read_local_csv(path: Path) -> Iterable[Dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            yield row


def convert_row(row: Dict[str, str]) -> Optional[Dict]:
    lat = row.get("Latitude") or row.get("latitude")
    lon = row.get("Longitude") or row.get("longitude")
    if not lat or not lon:
        return None
    try:
        lat_f = float(lat)
        lon_f = float(lon)
    except ValueError:
        return None
    name = row.get("Store Name") or row.get("name") or "Starbucks"
    city = row.get("City") or row.get("city") or ""
    state = row.get("State/Province") or row.get("state") or ""
    address = row.get("Street Address") or row.get("address") or ""
    popup_name = name
    if city and state:
        popup_name = f"{name} – {city}, {state}"
    elif city:
        popup_name = f"{name} – {city}"
    elif state:
        popup_name = f"{name} – {state}"
    properties = {
        "name": popup_name,
        "brand": "Starbucks",
        "address": address,
        "city": city,
        "state": state,
    }
    return {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [lon_f, lat_f]},
        "properties": properties,
    }


def main() -> None:
    args = parse_args()
    if args.input:
        rows_iter = read_local_csv(Path(args.input))
    else:
        rows_iter = fetch_csv(args.source)

    features = []
    for idx, row in enumerate(rows_iter, start=1):
        feature = convert_row(row)
        if feature:
            features.append(feature)
        if args.limit and idx >= args.limit:
            break

    output = {"type": "FeatureCollection", "features": features}
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as handle:
        json.dump(output, handle)
    print(f"Wrote {len(features)} Starbucks locations to {out_path}")


if __name__ == "__main__":
    main()
