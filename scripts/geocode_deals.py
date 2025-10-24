#!/usr/bin/env python3
"""
Geocode deal addresses for the Commission Intelligence dashboard.

Reads a CSV file with property addresses (exported from Excel) and writes
`deal_locations.json` that the dashboard can consume to plot address-level pins.

Usage:
    python scripts/geocode_deals.py \
        --input data/deal_addresses.csv \
        --output reconciled/full_dashboard/data/deal_locations.json

CSV head requirements:
    property,city,state,agent,gp,days_to_close

Dependencies:
    pip install requests

Notes:
    • Uses the US Census Geocoding API (Public_AR_Current benchmark).
    • Applies basic caching so re-running the script will not hit the API twice.
    • Average throughput ~5 req/sec; no formal quota for this batch size.
"""

import argparse
import csv
import json
import time
from pathlib import Path
from typing import Dict, List, Optional

try:
    import requests
except ImportError as exc:
    raise SystemExit(
        "Missing dependency 'requests'. Install it with `pip install requests`."
    ) from exc


Cache = Dict[str, Dict[str, float]]


def load_cache(cache_path: Path) -> Cache:
    if cache_path.exists():
        try:
            return json.loads(cache_path.read_text())
        except json.JSONDecodeError:
            print(f"⚠️  Cache file {cache_path} is invalid JSON; ignoring.")
    return {}


def save_cache(cache_path: Path, cache: Cache) -> None:
    cache_path.parent.mkdir(parents=True, exist_ok=True)
    cache_path.write_text(json.dumps(cache, indent=2))


def build_search_string(row: Dict[str, str]) -> str:
    parts = [row.get("property", "").strip()]
    locality = ", ".join(
        filter(None, [row.get("city", "").strip(), row.get("state", "").strip()])
    )
    if locality:
        parts.append(locality)
    return ", ".join(filter(None, parts))


def clean_currency(value: str) -> Optional[float]:
    """Convert currency string like '$2,715' to float 2715.0"""
    if not value:
        return None
    try:
        # Remove $, commas, and spaces
        cleaned = value.strip().replace('$', '').replace(',', '').replace(' ', '')
        return float(cleaned) if cleaned else None
    except (ValueError, AttributeError):
        return None


def geocode_with_census(query: str, session: requests.Session) -> Optional[Dict[str, float]]:
    url = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress"
    params = {
        "address": query,
        "benchmark": "Public_AR_Current",
        "format": "json",
    }
    try:
        response = session.get(url, params=params, timeout=10)
        response.raise_for_status()
    except requests.RequestException as exc:
        print(f"Error contacting Census API for '{query}': {exc}")
        return None

    data = response.json()
    matches = data.get("result", {}).get("addressMatches", [])
    if not matches:
        return None

    coords = matches[0].get("coordinates", {})
    if "x" in coords and "y" in coords:
        return {"lon": float(coords["x"]), "lat": float(coords["y"])}
    return None


def geocode_rows(rows: List[Dict[str, str]], cache: Cache) -> List[Dict[str, object]]:
    session = requests.Session()
    results: List[Dict[str, object]] = []

    for idx, row in enumerate(rows, start=1):
        query = build_search_string(row)
        if not query:
            print(f"Skipping row {idx}: missing address fields.")
            continue

        if query in cache:
            location = cache[query]
            print(f"[cache] {query} -> {location['lat']}, {location['lon']}")
        else:
            location = geocode_with_census(query, session)
            if not location:
                print(f"❌ No match for '{query}'")
                continue
            cache[query] = location
            print(f"[api]   {query} -> {location['lat']:.6f}, {location['lon']:.6f}")
            time.sleep(0.2)  # polite pacing

        result = {
            "property": row.get("property"),
            "city": row.get("city"),
            "state": row.get("state"),
            "agent": row.get("agent"),
            "dispo_agent": row.get("dispo_agent"),
            "gp": clean_currency(row.get("gp", "")),
            "days_to_close": int(row["days_to_close"]) if row.get("days_to_close") else None,
            "close_date": row.get("close_date"),
            "lat": location["lat"],
            "lon": location["lon"],
        }
        results.append(result)

    return results


def read_csv(path: Path) -> List[Dict[str, str]]:
    with path.open(newline="") as csvfile:
        reader = csv.DictReader(csvfile)
        required = {"property", "city", "state"}
        missing = required - set(reader.fieldnames or [])
        if missing:
            raise ValueError(
                f"Input CSV must include columns: {', '.join(sorted(required))}"
            )
        return list(reader)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Geocode deal addresses.")
    parser.add_argument("--input", required=True, type=Path, help="Input CSV path.")
    parser.add_argument(
        "--output",
        required=True,
        type=Path,
        help="Output JSON path consumed by the dashboard.",
    )
    parser.add_argument(
        "--cache",
        type=Path,
        default=Path(".cache/geocode_deals.json"),
        help="Optional cache file to reuse previous lookups.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    rows = read_csv(args.input)
    cache = load_cache(args.cache)
    results = geocode_rows(rows, cache)

    save_cache(args.cache, cache)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    if args.output.suffix == ".js":
        payload = json.dumps(results, indent=2)
        args.output.write_text(f"window.DEAL_LOCATIONS = {payload};\n")
    else:
        payload = {"deal_locations": results}
        args.output.write_text(json.dumps(payload, indent=2))

    print(f"\n✅ Wrote {len(results)} geocoded deals to {args.output}")


if __name__ == "__main__":
    main()
