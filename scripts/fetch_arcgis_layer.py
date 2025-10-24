#!/usr/bin/env python3
"""
Download features from an ArcGIS FeatureServer/MapServer layer and export as GeoJSON.

Example:
python scripts/fetch_arcgis_layer.py \
  --service-url https://services1.arcgis.com/Ezk9fcjSUkeadg6u/arcgis/rest/services/Electric_Power_Transmission_Lines/FeatureServer \
  --layer 0 \
  --out reconciled/full_dashboard/data/geospatial/power_lines.geojson \
  --fields OWNER,VOLTAGE,SUB_1,SUB_2 \
  --geometry -130,20,-65,50
"""

import argparse
import json
import math
import sys
from pathlib import Path
from typing import Dict, List, Optional

import requests


DEFAULT_CHUNK = 2000


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--service-url", required=True, help="Base URL for the service (ending in /FeatureServer or /MapServer)")
    parser.add_argument("--layer", type=int, default=0, help="Layer index (default: 0)")
    parser.add_argument("--out", required=True, help="Path to the GeoJSON file to write")
    parser.add_argument("--where", default="1=1", help="SQL where clause filter (default: 1=1)")
    parser.add_argument("--fields", default="*", help="Comma separated field list or * for all")
    parser.add_argument("--chunk", type=int, default=DEFAULT_CHUNK, help="Records per request (default: 2000)")
    parser.add_argument("--geometry", help="Bounding box 'xmin,ymin,xmax,ymax' in WGS84 for spatial filter")
    parser.add_argument("--timeout", type=int, default=120, help="HTTP timeout seconds (default: 120)")
    parser.add_argument("--max-records", type=int, help="Optional cap on total features to fetch (prevents runaway jobs)")
    parser.add_argument("--retry", type=int, default=3, help="Retry attempts on HTTP errors (default: 3)")
    return parser.parse_args()


def build_query(
    where: str,
    fields: str,
    chunk: int,
    offset: int,
    geometry: Optional[str],
) -> Dict[str, str]:
    query = {
        "f": "geojson",
        "where": where,
        "outFields": fields,
        "outSR": 4326,
        "resultOffset": offset,
        "resultRecordCount": chunk,
    }
    if geometry:
        xmin, ymin, xmax, ymax = geometry.split(",")
        query.update(
            {
                "geometry": f"{xmin},{ymin},{xmax},{ymax}",
                "geometryType": "esriGeometryEnvelope",
                "inSR": 4326,
                "spatialRel": "esriSpatialRelIntersects",
            }
        )
    return query


def fetch_chunk(
    session: requests.Session,
    url: str,
    params: Dict[str, str],
    timeout: int,
    retry: int,
) -> Dict:
    last_error: Optional[Exception] = None
    for attempt in range(1, retry + 1):
        try:
            response = session.get(url, params=params, timeout=timeout)
            response.raise_for_status()
            payload = response.json()
            if "error" in payload:
                raise RuntimeError(payload["error"])
            return payload
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            backoff = min(5 * attempt, 30)
            print(f"[fetch_arcgis_layer] Attempt {attempt} failed: {exc}. Retrying in {backoff}s...", file=sys.stderr)
            if attempt < retry:
                try:
                    import time

                    time.sleep(backoff)
                except KeyboardInterrupt as interrupted:
                    raise interrupted
    assert last_error is not None
    raise RuntimeError(f"Failed to fetch data after {retry} attempts: {last_error}") from last_error


def accumulate_features(
    service_url: str,
    layer: int,
    where: str,
    fields: str,
    chunk: int,
    geometry: Optional[str],
    timeout: int,
    max_records: Optional[int],
    retry: int,
) -> List[Dict]:
    base_query_url = service_url.rstrip("/") + f"/{layer}/query"
    session = requests.Session()
    features: List[Dict] = []
    offset = 0

    while True:
        if max_records is not None and offset >= max_records:
            break

        result_count = chunk
        if max_records is not None:
            remaining = max_records - offset
            result_count = min(chunk, remaining)

        query_params = build_query(where, fields, result_count, offset, geometry)
        payload = fetch_chunk(session, base_query_url, query_params, timeout, retry)
        chunk_features = payload.get("features", [])
        features.extend(chunk_features)

        exceeded_limit = bool(payload.get("properties", {}).get("exceededTransferLimit"))
        if not chunk_features:
            break
        if not exceeded_limit and len(chunk_features) < result_count:
            break

        offset += result_count
        progress_pct = ""
        if max_records:
            pct = min(offset / max_records, 1.0) * 100
            progress_pct = f" ({pct:.1f}% of cap)"
        print(f"[fetch_arcgis_layer] Retrieved {len(chunk_features)} features (total {len(features)} so far){progress_pct}", file=sys.stderr)

    return features


def main() -> None:
    args = parse_args()
    output_path = Path(args.out)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    print(f"[fetch_arcgis_layer] Fetching layer {args.layer} from {args.service_url}", file=sys.stderr)
    features = accumulate_features(
        service_url=args.service_url,
        layer=args.layer,
        where=args.where,
        fields=args.fields,
        chunk=args.chunk,
        geometry=args.geometry,
        timeout=args.timeout,
        max_records=args.max_records,
        retry=args.retry,
    )
    feature_collection = {"type": "FeatureCollection", "features": features}

    with output_path.open("w", encoding="utf-8") as f:
        json.dump(feature_collection, f)

    print(f"[fetch_arcgis_layer] Wrote {len(features)} features to {output_path}", file=sys.stderr)


if __name__ == "__main__":
    main()
