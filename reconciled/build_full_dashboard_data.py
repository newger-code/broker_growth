#!/usr/bin/env python3
"""Generate reconciled full-dashboard data.js from the detail JSON."""

from __future__ import annotations

import json
import re
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RECONCILED_HTML = ROOT / "reconciled" / "commission_dashboard_reconciled.html"
OUTPUT_JS = ROOT / "reconciled" / "full_dashboard" / "js" / "data.js"


def d(value: object) -> Decimal:
    return Decimal(str(value))


def round2(value: object) -> float:
    return float(d(value).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


def load_reconciled_payload() -> dict:
    html = RECONCILED_HTML.read_text()
    match = re.search(r'<script type="application/json" id="commission-data">\s*(\{.*?\})\s*</script>', html, re.S)
    if not match:
        raise RuntimeError("commission-data script block not found in reconciled dashboard")
    return json.loads(match.group(1))


def build_data_object(raw: dict) -> dict:
    acq_agents = raw["acquisition_agents"]
    dispo_agents = raw["disposition_agents"]
    manager_entries = raw["managers"]

    acq_count = len(acq_agents)
    dispo_count = len(dispo_agents)

    acq_total_gp = sum(d(agent.get("gross_profit", 0)) for agent in acq_agents)
    dispo_total_gp = sum(d(agent.get("off_market_gp", 0)) + d(agent.get("flat_fee_gp", 0)) for agent in dispo_agents)

    acq_total_actual = sum(d(agent.get("actual_payout", 0)) for agent in acq_agents)
    dispo_total_actual = sum(d(agent.get("actual_payout", 0)) for agent in dispo_agents)
    manager_total_actual = sum(d(mgr.get("actual_payout", 0)) for mgr in manager_entries)

    totals = raw["metadata"]["totals"]
    total_commission = d(totals["grand_total"])
    agent_commission = d(totals["agent_commission"])
    manual_adjustments = d(totals["manual_adjustments"])
    mentor_bonuses = d(totals["mentor_bonuses"])
    sprint_pool = d(totals["sprint_pool"])
    total_gp = d(682043)
    trx_actual = next((int(mgr["trx_actual"]) for mgr in manager_entries if mgr.get("trx_actual")), 59)
    commission_pct = (total_commission / total_gp * 100).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)

    manager_breakdown = []
    for mgr in manager_entries:
        bucket = mgr.get("summary_bucket")
        entry = {
            "name": mgr["name"],
            "role": mgr.get("role"),
            "summary_bucket": bucket,
            "total": round2(mgr.get("actual_payout", 0)),
            "manual_adjustment": round2(mgr.get("manual_adjustment", 0)),
        }
        if bucket == "senior_leader":
            entry.update(
                {
                    "type": "Type 1: Company/ISA Split",
                    "company_gp": round2(mgr.get("company_gp", 0)),
                    "isa_gp": round2(mgr.get("isa_gp", mgr.get("company_gp", 0))),
                }
            )
        elif bucket == "acq_manager":
            entry.update(
                {
                    "type": "Type 2: Agent + Team",
                    "personal_gp": round2(mgr.get("personal_gp", 0)),
                    "team_gp": round2(mgr.get("team_gp", 0)),
                    "personal_deals": mgr.get("personal_deals"),
                    "team_members": mgr.get("team_members", []),
                }
            )
        elif bucket == "dispo_manager":
            entry.update(
                {
                    "type": "Type 2: Agent + Team",
                    "personal_gp": round2(mgr.get("personal_gp", 0)),
                    "team_gp": round2(mgr.get("team_gp", 0)),
                    "personal_deals": mgr.get("personal_deals"),
                    "team_members": mgr.get("team_members", []),
                }
            )
        elif bucket == "underwriting":
            components = mgr.get("components") or {}
            entry.update(
                {
                    "type": "Type 3: % of Goal",
                    "trx_actual": mgr.get("trx_actual"),
                    "trx_target": mgr.get("trx_target"),
                    "gp_actual": round2(mgr.get("gp_actual", 0)),
                    "gp_target": round2(mgr.get("gp_target", 0)),
                    "components": {k: round2(v) for k, v in components.items()},
                }
            )
        else:
            entry["type"] = "Other"
        manager_breakdown.append(entry)

    processed_acq = [
        {
            "name": agent["name"],
            "gross_profit": round2(agent.get("gross_profit", 0)),
            "tier": agent.get("tier") or 1,
            "rate": agent.get("rate") or 0,
            "commission": round2(agent.get("commission", 0)),
            "sprint": round2(agent.get("sprint", 0)),
            "manual_adjustment": round2(agent.get("manual_adjustment", 0)),
            "total": round2(agent.get("actual_payout", 0)),
            "summary_bucket": agent.get("summary_bucket"),
            "adjustment_note": agent.get("adjustment_note"),
        }
        for agent in acq_agents
    ]

    processed_dispo = [
        {
            "name": agent["name"],
            "off_market_gp": round2(agent.get("off_market_gp", 0)),
            "flat_fee_gp": round2(agent.get("flat_fee_gp", 0)),
            "total_gp": round2(d(agent.get("off_market_gp", 0)) + d(agent.get("flat_fee_gp", 0))),
            "tier": agent.get("tier"),
            "commission": round2(agent.get("commission", 0)),
            "sprint": round2(agent.get("sprint", 0)),
            "mentor": round2(agent.get("mentor", 0)),
            "manual_adjustment": round2(agent.get("manual_adjustment", 0)),
            "total": round2(agent.get("actual_payout", 0)),
            "adjustment_note": agent.get("adjustment_note"),
        }
        for agent in dispo_agents
    ]

    return {
        "metadata": {
            "month": raw["metadata"]["month"],
            "source_file": raw["metadata"]["source_file"],
            "total_gp": int(total_gp),
            "total_transactions": trx_actual,
            "total_commission_paid": round2(total_commission),
            "commission_pct_of_gp": float(commission_pct),
            "team_count": {
                "acq_agents": acq_count,
                "dispo_agents": dispo_count,
                "acq_managers": sum(1 for m in manager_entries if m["summary_bucket"] == "acq_manager"),
                "dispo_managers": sum(1 for m in manager_entries if m["summary_bucket"] == "dispo_manager"),
                "leadership": sum(1 for m in manager_entries if m["summary_bucket"] == "senior_leader"),
                "underwriting": sum(1 for m in manager_entries if m["summary_bucket"] == "underwriting"),
            },
        },
        "agent_summary": {
            "acq_agents": {
                "count": acq_count,
                "total_gp": round2(acq_total_gp),
                "total_commission": round2(acq_total_actual),
                "avg_gp_per_agent": round2(acq_total_gp / acq_count) if acq_count else 0,
                "avg_deals_per_agent": 3.9,
            },
            "dispo_agents": {
                "count": dispo_count,
                "total_gp": round2(dispo_total_gp),
                "total_commission": round2(dispo_total_actual),
                "avg_gp_per_agent": round2(dispo_total_gp / dispo_count) if dispo_count else 0,
                "avg_deals_per_agent": 2.1,
            },
        },
        "manager_summary": {
            "total_commission": round2(manager_total_actual),
            "breakdown": manager_breakdown,
        },
        "aggregates": {
            "agent_commission_base": round2(agent_commission),
            "manual_adjustments": round2(manual_adjustments),
            "mentor_bonuses": round2(mentor_bonuses),
            "sprint_pool": round2(sprint_pool),
        },
        "acquisition_agents": processed_acq,
        "disposition_agents": processed_dispo,
        "efficiency_baseline": {
            "avg_gp_per_agent": 21310,
            "avg_deals_per_agent": 3.0,
            "avg_gp_per_deal": 11560,
            "avg_days_to_close": 28,
            "funnel": {
                "lead_to_assessment": 0.48,
                "assessment_to_offer": 0.70,
                "offer_to_close": 0.58,
            },
        },
    }


def main() -> None:
    data = build_data_object(load_reconciled_payload())
    OUTPUT_JS.write_text("window.COMMISSION_DATA = " + json.dumps(data, indent=2) + "\n")
    print(f"Wrote {OUTPUT_JS}")


if __name__ == "__main__":
    main()
