---
name: campus-trend-scout
description: >
  Run the daily Campus Trend Scout pipeline for US and Canadian college student
  card-news ideas. Use for requests like "오늘 캠퍼스 트렌드 수집해줘",
  "데일리 브리프 써줘", "card-news topic ranking", "후킹포인트/선정포인트까지 뽑아줘",
  or "campus trend report"; collect real source signals, cluster them, score
  production-worthy topics, create card-news-ready briefs, and save everything
  directly to the data/ directory using file I/O.
metadata:
  version: "0.3.0"
---

# Campus Trend Scout Daily

## Auto-Update Check

Before starting any pipeline work, check for plugin updates:

```bash
PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")/../.." 2>/dev/null && pwd || find . -path '*/campus-trend-scout/skills' -type d 2>/dev/null | head -1 | sed 's|/skills||')"
if ! command -v git &>/dev/null; then
  echo "⚠️ git이 설치되어 있지 않아 자동 업데이트를 확인할 수 없습니다."
  echo "플러그인을 삭제 후 /plugin 마켓플레이스에서 다시 추가해주세요."
elif [ ! -d "$PLUGIN_DIR/.git" ]; then
  echo "⚠️ 이 플러그인이 git clone으로 설치되지 않아 자동 업데이트가 불가합니다."
  echo "자동 업데이트를 받으려면 기존 폴더를 삭제하고 다시 설치하세요:"
  echo "  git clone https://github.com/hyeeun-bondit/campus-trend-scout-plugin.git"
else
  git -C "$PLUGIN_DIR" fetch --quiet 2>/dev/null
  BEHIND=$(git -C "$PLUGIN_DIR" log HEAD..origin/main --oneline 2>/dev/null)
  if [ -n "$BEHIND" ]; then
    echo "⚡ campus-trend-scout 업데이트가 있습니다:"
    echo "$BEHIND"
    git -C "$PLUGIN_DIR" pull --ff-only 2>/dev/null && echo "✅ 자동 업데이트 완료" || echo "⚠️ 자동 업데이트 실패 — 수동으로 git pull 해주세요: $PLUGIN_DIR"
  else
    echo "✅ campus-trend-scout 최신 버전입니다."
  fi
fi
```

Run this check at the start of every skill invocation. If the pull succeeds, continue with the updated pipeline. Otherwise warn the user and proceed with the current version.

---

Run the daily US/Canada campus trend pipeline for IGOTIN card-news planning. Keep this file focused on orchestration; load the reference files below only when the relevant stage begins.

The goal is not generic education news. Find topics that US and Canadian college students, incoming freshmen, transfer students, international students, community college students, and graduating students would share, save, debate, or use as practical campus-life guidance.

## Reference Routing

Read these files before the matching stage:

- `references/source-collection.md` — before research. Source standards, quotas, tool rules, and query selection.
- `references/content-lens.md` — before clustering and topic selection. IGOTIN performance patterns, topic lanes, stale-topic penalties, and diversity rules.
- `references/topic-selection.md` + `references/output-contract.md` — before ranking. Loaded together. Exclusions, contentization tests, scoring rubric, output fields, report sections, and final checklist.

Full daily runs should load source-collection first, then content-lens, then topic-selection + output-contract together. Partial requests should load only the relevant reference.

## Required Tools

- **File I/O**: Use Read, Write, and Bash tools to save and read all data under the project `data/` directory. No MCP server is needed.
- Use **WebSearch** and **WebFetch** for source discovery and research.
- Use **`/insane-search`** for SNS platform access (Reddit, X/Twitter, TikTok, YouTube, Threads 등). When calling `/insane-search`, only the references relevant to the target platform need to load (e.g., `twitter.md` for X, `jina.md` for Reddit). Skip unrelated references (e.g., `naver.md`, `cache-archive.md`) unless specifically needed.
- Use **Chrome MCP** as fallback when `/insane-search` is unavailable.
- Use `/instagram-analytics` skill on Mondays (KST) for weekly Instagram performance analysis.
- Do not count search snippets, blocked pages, deleted posts, login walls, or unobserved pages as evidence.

## Data Directory Layout

All pipeline outputs live under the project root `data/` directory. Resolve the absolute path from the working directory.

```
data/
├── reports/{YYYY-MM-DD}.html      # daily report (HTML dashboard, KR+EN)
├── instagram-analytics/
│   └── week-of-{YYYY-MM-DD}.html  # weekly Instagram analytics (Monday only)
├── runs/{YYYY-MM-DD}T{HH-MM-SS}.json  # run metadata
├── query-log.json                      # query rotation tracker (auto-managed by script)
├── query-pools/{news,reddit,tiktok}.json  # query pools (do not edit manually)
├── cardnews/{YYYY-MM-DD}.json          # card-news drafts
└── archive/
    └── topic_history.json          # cumulative topic overlap tracker
```

## Date and Overwrite Rules

1. Resolve "today" in the user's local timezone (KST) as `YYYY-MM-DD`.
2. Before research or any save, check which files already exist for today:
   ```bash
   ls data/reports/{DATE}.html 2>/dev/null
   ```
3. If the report file exists, **stop** and ask the user whether to overwrite.
4. On overwrite approval, back up the conflicting file before writing:
   ```bash
   mkdir -p data/archive/reports
   mv data/reports/{DATE}.html data/archive/reports/{DATE}_$(date +%s%3N).html
   ```

## Save Verification

After writing any JSON or HTML file, verify with a lightweight Bash check instead of reading the entire file back:

```bash
# For JSON files
python3 -c "import json; d=json.load(open('FILE')); print(f'OK: {len(d)} top-level keys')"

# For HTML files
python3 -c "
f=open('FILE').read()
assert '<!doctype html>' in f.lower() or '<html' in f.lower(), 'Not valid HTML'
print(f'OK: {len(f)} chars')
"
```

Only use the Read tool to verify a file if the Bash check fails or you need to inspect specific content.

---

## Pipeline

Run the full pipeline in this order.

### Step 0: Monday Instagram Analytics (KST Monday only)

**Trigger**: If the current date in KST is a Monday, run this step BEFORE anything else.

1. Invoke the `/instagram-analytics` skill to analyze the @igotin.official account.
2. Focus the analysis on **content vs. engagement** (likes, shares, comments, saves, reach per post).
3. Compare content types (carousel, reels, story, single post) and topic categories.
4. Save the result to `data/instagram-analytics/week-of-{DATE}.html`.
5. This analysis feeds into topic selection criteria for the entire week.

If not Monday, skip this step but still read the most recent `data/instagram-analytics/` file to inform topic recommendations.

### Step 1: Research & Signals

Read `references/source-collection.md`, then:

1. **Run the query selector script** to get today's queries:
   ```bash
   python3 scripts/select-queries.py --date {DATE} [--keyword "trending topic"]
   ```
2. Execute the selected queries using WebSearch, `/insane-search`, and WebFetch.
3. Collect signals meeting the coverage targets in the reference file.
4. Each signal must include: `id`, `source_name`, `source_type`, `platform`, `title`, `url`, `published_at`, `retrieved_at`, `summary`, `category`, `region`, `relevance`, `reliability`, `usable_for_ranking`, `topic_lane`, and `verified_at` (ISO timestamp of when the URL was successfully accessed).

Signal `source_type` values: `news`, `sns_tiktok`, `sns_x`, `sns_threads`, `sns_instagram`, `reddit`, `report`, `government`, `college_newspaper`, `ranking_site`, `community_forum`.

Save only original source signals actually opened or directly observed through an allowed public route. Meet the source coverage targets or document the shortfall. Never invent URLs, dates, engagement counts, views, likes, comments, percentages, rankings, or observed figures.

Signals are held in context for the next step — no intermediate file save required.

### Step 2: Clusters & Topic Selection

Read `references/content-lens.md` and `references/topic-selection.md`.

**Clustering:**
- Group signals by topic.
- Separate student reaction from verified factual basis.
- Mark topic lane, IGOTIN fit, risk, and ranking eligibility.
- Maximize topic diversity — spread across different topic lanes and categories.

**Selection (merged):**
- Apply immediate exclusions, contentization tests, structural fit, and the scoring rubric.
- Read the most recent Instagram analytics from `data/instagram-analytics/` to understand what content types and topics have driven the best engagement.
- Check `data/archive/topic_history.json` and compare candidate themes against `theme_id` entries. Respect `cooldown_until` dates.

Clusters and selection results are held in context — no intermediate file save required.

### Step 3: Rankings + HTML Report

Read `references/output-contract.md`.

Produce **exactly 10 diverse topics** ranked by production priority.

#### 3a. Source Verification (deduplicated)

Only verify URLs that were NOT already successfully accessed during Step 1 (check each signal's `verified_at` field). For signals accessed today, skip re-verification. For any new or unverified URLs:
1. Attempt to fetch with WebFetch.
2. If inaccessible, find a replacement source or drop the citation.

#### 3b. Topic Recommendation Format

Each of the 10 topics must follow the structure in `references/output-contract.md`.

#### 3c. Ranking Criteria

- Base recommendations on past Instagram analytics: what content types/topics performed well.
- Ensure **maximum topic diversity** — no two topics from the same narrow category.
- Avoid overlap with recent topics (check `topic_history.json`).
- Prioritize topics with strong contentization potential (clear hook, slide structure, comment trigger).

#### 3d. Save as HTML Report

Write the final output as **`data/reports/{DATE}.html`** — a single self-contained HTML dashboard file containing:
1. **Korean version** — all 10 topics in full detail
2. **English version** — all 10 topics in full detail

The HTML must be self-contained (inline CSS), mobile-friendly, and include every field for every topic.

After saving, verify with the Bash check. Then update `data/archive/topic_history.json` — append new theme entries or update existing ones, set `last_updated` to today, add `cooldown_until` (typically +3 days for themes appearing 2+ times, +5 days for 3+ consecutive days).

### Step 4: Run Metadata

Write `data/runs/{DATE}T{HH-MM-SS}.json` with:
- Run status, steps completed
- Signal count, topic count
- Output files produced
- Queries used (from script output)
- Warnings and errors
- Coverage shortfalls if any

Verify with the Bash check.

## Selected Topic Draft

When the user chooses one topic from a saved trend output, read `references/output-contract.md` and create the final English card-news draft. Write it to `data/cardnews/{DATE}.json`.
