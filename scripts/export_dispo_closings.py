#!/usr/bin/env python3
"""
Export Dispo closings from the September 2025 reconciliation sheet into a clean
CSV that can be geocoded for the Markets map.

Usage:
    python scripts/export_dispo_closings.py \
        --input Docs/Sept\ 2025\ Closings.csv \
        --output reconciled/full_dashboard/data/deal_addresses.csv
"""

import argparse
import csv
from pathlib import Path
from typing import Iterator, List

REQUIRED_HEADERS = {
    "Property Address",
}

OPTIONAL_HEADERS = {
    "Acq Agent",
    "Dispo Agent",
    " Assignment Fee (before fees / expenses) ",
    " Gross Profit  (net of fees) ",
    "Transaction?",
    "Exit Strategy",
    "dispo closing date",
}

OUTPUT_HEADERS = [
    "property",
    "city",
    "state",
    "agent",
    "dispo_agent",
    "gp",
    "assignment_fee",
    "status",
    "close_date",
]


def split_city_state(address: str) -> tuple[str, str]:
    parts = address.rsplit(",", 2)
    if len(parts) >= 2:
        city = parts[-2].strip().title()
        state = parts[-1].split()[0].upper()
        return city, state
    return "", ""


def load_rows(path: Path) -> Iterator[dict]:
    with path.open(newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        missing = REQUIRED_HEADERS - set(reader.fieldnames or [])
        if missing:
            raise ValueError(
                f"Input missing required columns: {', '.join(sorted(missing))}"
            )
        for row in reader:
            address = (row.get("Property Address") or "").strip()
            if not address:
                continue
            yield row


def transform(rows: Iterator[dict]) -> List[dict]:
    results: List[dict] = []
    for row in rows:
        address = row["Property Address"].strip()
        city, state = split_city_state(address)
        results.append(
            {
                "property": address,
                "city": city,
                "state": state,
                "agent": (row.get("Acq Agent") or "").strip(),
                "dispo_agent": (row.get("Dispo Agent") or "").strip(),
                "gp": (row.get(" Gross Profit  (net of fees) ") or "").strip(),
                "assignment_fee": (
                    row.get(" Assignment Fee (before fees / expenses) ") or ""
                ).strip(),
                "status": (row.get("Transaction?") or "").strip(),
                "close_date": (row.get("dispo closing date") or "").strip(),
            }
        )
    return results


def write_csv(path: Path, rows: List[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, OUTPUT_HEADERS)
        writer.writeheader()
        writer.writerows(rows)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Export Dispo closings CSV.")
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    rows = transform(load_rows(args.input))
    write_csv(args.output, rows)
    print(f"Exported {len(rows)} closings to {args.output}")


if __name__ == "__main__":
    main()
