#!/usr/bin/env python3
"""
Query rotation selector for campus-trend-scout.
Reads query pools, filters out recently used queries, selects N per platform,
and updates query-log.json. Outputs selected queries as JSON to stdout.

Usage:
  python3 scripts/select-queries.py [--date YYYY-MM-DD] [--keyword KEYWORD]
"""

import argparse
import json
import random
import sys
from datetime import datetime, timedelta
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
DATA_DIR = SCRIPT_DIR.parent / "data"
POOL_DIR = DATA_DIR / "query-pools"
LOG_FILE = DATA_DIR / "query-log.json"


def load_json(path):
    if not path.exists():
        return None
    with open(path) as f:
        return json.load(f)


def save_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def get_recently_used(log_data, platform, today, cooldown_days):
    cutoff = today - timedelta(days=cooldown_days)
    used = set()
    for entry in log_data.get("query_log", []):
        if entry.get("platform") != platform:
            continue
        entry_date = datetime.strptime(entry["date"], "%Y-%m-%d").date()
        if entry_date >= cutoff:
            used.update(entry.get("queries_used", []))
    return used


def prune_old_entries(log_data, today, max_age_days=14):
    cutoff = today - timedelta(days=max_age_days)
    log_data["query_log"] = [
        e for e in log_data.get("query_log", [])
        if datetime.strptime(e["date"], "%Y-%m-%d").date() >= cutoff
    ]


def select_from_pool(pool, recently_used, pick_count):
    all_queries = []
    category_names = list(pool["categories"].keys())
    for cat in category_names:
        for q in pool["categories"][cat]:
            if q not in recently_used:
                all_queries.append((cat, q))

    random.shuffle(all_queries)

    selected = []
    cats_used = set()
    # first pass: one per category for diversity
    for cat, q in all_queries:
        if cat not in cats_used and len(selected) < pick_count:
            selected.append(q)
            cats_used.add(cat)
    # second pass: fill remaining
    for cat, q in all_queries:
        if q not in selected and len(selected) < pick_count:
            selected.append(q)

    return selected


def get_seasonal(pool, month):
    return [
        s["query"] for s in pool.get("seasonal", [])
        if month in s.get("months", [])
    ]


def get_evergreen(pool, keyword):
    if not keyword:
        return []
    templates = pool.get("evergreen_templates", pool.get("evergreen", []))
    return [
        t.replace("[KEYWORD]", keyword).replace("[hot%20topic]", keyword.replace(" ", "%20"))
        for t in templates[:2]
    ]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", default=datetime.now().strftime("%Y-%m-%d"))
    parser.add_argument("--keyword", default="", help="Trending keyword for evergreen queries")
    args = parser.parse_args()

    today = datetime.strptime(args.date, "%Y-%m-%d").date()
    month = today.month

    log_data = load_json(LOG_FILE) or {"query_log": []}
    prune_old_entries(log_data, today)

    result = {}
    new_log_entries = []

    for pool_file in sorted(POOL_DIR.glob("*.json")):
        pool = load_json(pool_file)
        if not pool:
            continue
        platform = pool["platform"]
        pick = pool.get("pick_per_run", 7)
        cooldown = pool.get("cooldown_days", 7)

        recently_used = get_recently_used(log_data, platform, today, cooldown)
        selected = select_from_pool(pool, recently_used, pick)
        seasonal = get_seasonal(pool, month)
        evergreen = get_evergreen(pool, args.keyword)

        all_selected = selected + seasonal + evergreen

        result[platform] = {
            "queries": selected,
            "seasonal_bonus": seasonal,
            "evergreen_bonus": evergreen,
            "total": len(all_selected)
        }

        new_log_entries.append({
            "date": args.date,
            "platform": platform,
            "queries_used": all_selected
        })

    log_data["query_log"].extend(new_log_entries)
    save_json(LOG_FILE, log_data)

    json.dump(result, sys.stdout, indent=2, ensure_ascii=False)
    print()


if __name__ == "__main__":
    main()
