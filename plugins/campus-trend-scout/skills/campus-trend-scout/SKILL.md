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
  version: "0.2.0"
---

# Campus Trend Scout Daily

Run the daily US/Canada campus trend pipeline for IGOTIN card-news planning. Keep this file focused on orchestration; load the reference files below only when the relevant stage begins.

The goal is not generic education news. Find topics that US and Canadian college students, incoming freshmen, transfer students, international students, community college students, and graduating students would share, save, debate, or use as practical campus-life guidance.

## Reference Routing

Read these files before the matching stage:

- `references/source-collection.md` — before research. Source standards, quotas, Reddit/TikTok/college-ranking collection rules, freshness, and evidence discipline.
- `references/content-lens.md` — before clustering and topic selection. IGOTIN performance patterns, topic lanes, stale-topic penalties, and diversity rules.
- `references/topic-selection.md` — before ranking. Exclusions, contentization tests, structural fit, scoring rubric, ranking rules, and risk handling.
- `references/output-contract.md` — before saving rankings, card-news briefs, selected-topic drafts, or reports. Output fields, report sections, card-news contract, and final checklist.

Full daily runs should load all four in order. Partial requests should load only the relevant reference.

## Required Tools

- **File I/O**: Use Read, Write, and Bash tools to save and read all data under the project `data/` directory. No MCP server is needed.
- Use **WebSearch** and **WebFetch** for source discovery and research.
- Use **`/insane-search`** for SNS platform access (Reddit, X/Twitter, TikTok, YouTube, Threads 등). 사용 불가 시 **Chrome MCP** (`mcp__Claude_in_Chrome__*`)로 fallback. 둘 다 불가 시 사용자에게 설치 안내.
- Use **Chrome MCP** for Reddit and TikTok when `/insane-search` is unavailable or when direct visual post context must be observed.
- Use `/instagram-analytics` skill on Mondays (KST) for weekly Instagram performance analysis.
- Do not count search snippets, blocked pages, deleted posts, login walls, or unobserved pages as evidence.

## Data Directory Layout

All pipeline outputs live under the project root `data/` directory. Resolve the absolute path from the working directory.

```
data/
├── signals/{YYYY-MM-DD}.json      # signal batch
├── clusters/{YYYY-MM-DD}.json     # topic clusters
├── rankings/{YYYY-MM-DD}.json     # ranked topics (HTML dashboard)
├── reports/{YYYY-MM-DD}.html      # daily report (HTML dashboard, KR+EN)
├── instagram-analytics/
│   └── week-of-{YYYY-MM-DD}.html  # weekly Instagram analytics (Monday only)
├── runs/{YYYY-MM-DD}T{HH-MM-SS}.json  # run metadata
├── query-log.json                      # query rotation tracker
└── archive/
    ├── topic_history.json          # cumulative topic overlap tracker
    ├── signals/{date}_{ts}.json    # overwritten signal backups
    ├── clusters/{date}_{ts}.json
    └── rankings/{date}_{ts}.json
```

## Date and Overwrite Rules

1. Resolve "today" in the user's local timezone (KST) as `YYYY-MM-DD`.
2. Before research or any save, check which files already exist for today:
   ```bash
   ls data/signals/{DATE}.json data/clusters/{DATE}.json data/rankings/{DATE}.json data/reports/{DATE}.html 2>/dev/null
   ```
3. If any file exists, name every conflicting category and **stop**. Ask the user whether to overwrite.
4. On overwrite approval, back up each conflicting file before writing:
   ```bash
   mkdir -p data/archive/signals data/archive/clusters data/archive/rankings
   mv data/signals/{DATE}.json data/archive/signals/{DATE}_$(date +%s%3N).json
   ```

## File I/O Operations

### Save (Write tool)

Write JSON files with the Write tool. Every JSON file must be valid, pretty-printed (2-space indent). Final reports and rankings are HTML.

### Read (Read tool)

After every save, read the file back to verify it was written correctly. Spot-check key fields (e.g., signal count, topic count, batch ID).

### List saved dates

To list all dates that have data:
```bash
ls data/signals/ data/clusters/ data/rankings/ data/reports/ 2>/dev/null | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' | sort -u
```

### Check topic overlap

Read `data/archive/topic_history.json` and compare candidate themes against `theme_id` entries. Respect `cooldown_until` dates.

### Check past Instagram analytics

Read all files under `data/instagram-analytics/` to understand which content types and topics have performed well or poorly. Use this to inform topic selection and diversity.

### Update topic history

After rankings are saved, append new theme entries or update existing ones in `data/archive/topic_history.json`. Set `last_updated` to today. Add `cooldown_until` (typically +3 days for themes appearing 2+ times, +5 days for 3+ consecutive days).

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

### Step 1: Research Planning

Read `references/source-collection.md`, then use **WebSearch** to decompose the run into source axes: education news, campus newspapers, official/government sources, Reddit/student communities, short-form social platforms, reports/datasets, college rankings, Canada/international-student policy, and real-time trend leads.

### Step 2: Signals

Write `data/signals/{DATE}.json`, then read it back.

- Required JSON structure:
  ```json
  {
    "signal_batch_id": "sb_{YYYYMMDD}",
    "run_date": "{YYYY-MM-DD}",
    "time_window": "...",
    "region": ["US", "Canada"],
    "source_count": 0,
    "coverage_notes": {
      "total_signals_target": "...",
      "sns_community_target": "...",
      "reddit_target": "...",
      "topic_lane_target": "..."
    },
    "signals": [
      {
        "id": "src_001",
        "source_name": "...",
        "source_type": "news | sns_tiktok | sns_x | sns_threads | sns_instagram | reddit | report | government | college_newspaper | ranking_site | community_forum",
        "platform": "...",
        "title": "...",
        "url": "...",
        "published_at": "...",
        "retrieved_at": "{YYYY-MM-DD}",
        "summary": "...",
        "category": "...",
        "region": "US | Canada | Both",
        "relevance": "...",
        "reliability": "...",
        "usable_for_ranking": true,
        "topic_lane": "..."
      }
    ]
  }
  ```
- Save only original source signals actually opened or directly observed through an allowed public route.
- Meet the source coverage targets in `references/source-collection.md` or document the shortfall.
- Never invent URLs, dates, engagement counts, views, likes, comments, percentages, rankings, or observed figures.

### Step 3: Clusters

Read `references/content-lens.md`, then write `data/clusters/{DATE}.json` and read it back.

- Required JSON structure:
  ```json
  {
    "cluster_batch_id": "cb_{YYYYMMDD}",
    "input_signal_batch_id": "sb_{YYYYMMDD}",
    "cluster_count": 0,
    "clusters": [
      {
        "cluster_id": "cl_01",
        "topic": "...",
        "category": "...",
        "summary": "...",
        "source_ids": ["src_001"],
        "representative_source_id": "src_001",
        "student_reaction_summary": "...",
        "factual_basis_summary": "...",
        "target_audience": ["..."],
        "possible_content_angle": "...",
        "topic_lane": "...",
        "igotin_pattern_match": ["..."],
        "hook_point_candidates": ["..."],
        "selection_point": "...",
        "content_direction": "carousel | reels | post | story",
        "region_relevance": "US | Canada | Both",
        "school_relevance_tags": [],
        "confidence": "high | medium | low",
        "risk_level": "low | medium | high",
        "eligible_for_ranking": true,
        "cluster_notes": "..."
      }
    ]
  }
  ```
- Group signals by topic.
- Separate student reaction from verified factual basis.
- Mark topic lane, IGOTIN fit, risk, and ranking eligibility.
- **Maximize topic diversity** — spread across different topic lanes and categories.

### Step 4: Topic Selection

Read `references/topic-selection.md`.

- Apply immediate exclusions, contentization tests, structural fit, and the scoring rubric before ranking.
- **Read the most recent Instagram analytics** from `data/instagram-analytics/` to understand what content types and topics have driven the best engagement.
- This is a judgment stage; no file is saved here.

### Step 5: Rankings + Source Verification + HTML Report

Produce **exactly 10 diverse topics** ranked by production priority.

#### 5a. Source Verification

Before finalizing each topic, **verify every source URL** cited:
1. Attempt to fetch each URL with WebFetch.
2. If the URL returns 404, is paywalled, or is otherwise inaccessible, mark it and find a replacement source or drop the citation.
3. Only include verified, accessible URLs in the final output.

#### 5b. Topic Recommendation Format

Each of the 10 topics must follow the structure in `references/output-contract.md`.

#### 5c. Ranking Criteria

- Base recommendations on past Instagram analytics: what content types/topics performed well.
- Ensure **maximum topic diversity** — no two topics from the same narrow category.
- Avoid overlap with recent topics (check `topic_history.json`).
- Prioritize topics with strong contentization potential (clear hook, slide structure, comment trigger).

#### 5d. Save

Write the final output as **`data/reports/{DATE}.html`** — a single HTML dashboard file containing:
1. **Korean version** — all 10 topics in full detail
2. **English version** — all 10 topics in full detail

The HTML must be self-contained (inline CSS), mobile-friendly, and include every field for every topic.

After saving, update `data/archive/topic_history.json`.

### Step 6: Run Metadata

Write `data/runs/{DATE}T{HH-MM-SS}.json` with run status, steps completed, signal/topic counts, output files, warnings, and errors.

## Selected Topic Draft

When the user chooses one topic from a saved trend output, read `references/output-contract.md` and create the final English card-news draft. Write it to `data/cardnews/{DATE}.json`.
