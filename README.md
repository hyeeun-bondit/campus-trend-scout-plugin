# Campus Trend Scout Plugin

Daily US/Canada campus trend pipeline for IGOTIN card-news planning.

## What it does

Collects SNS signals from Reddit, TikTok, news sites, and college communities, clusters them into topics, ranks 10 production-worthy card-news ideas, and outputs a bilingual (Korean + English) HTML dashboard.

## Components

| Component | Description |
| --- | --- |
| Skill: `campus-trend-scout` | Main pipeline — signal collection, clustering, ranking, HTML report |
| Skill: `card-news-draft` | Article-to-card-news slide draft with fixed layout |
| Skill: `instagram-analytics` | Instagram Professional Dashboard data collection and marketing analysis |
| Connector: `~~browser` | Browser access for Reddit/TikTok/Instagram dashboard |

## Setup

1. Install the [Claude in Chrome](https://chromewebstore.google.com/detail/claude-in-chrome/) browser extension
2. Install this plugin in Claude Code or Cowork

## Usage

| Trigger | Skill |
| --- | --- |
| "오늘 캠퍼스 트렌드 수집해줘", "campus trend report" | campus-trend-scout |
| "이 기사로 카드뉴스 만들어줘", "슬라이드 구성해줘" | card-news-draft |
| "인스타그램 분석해줘", "프로페셔널 대시보드 긁어줘" | instagram-analytics |

## Output (data/ directory)

```
data/
├── signals/          — daily signal batches (JSON)
├── clusters/         — topic clusters (JSON)
├── reports/          — HTML dashboards (Korean + English)
├── cardnews/         — card-news slide drafts (JSON)
├── instagram-analytics/  — IG raw data (JSON) + HTML dashboards
├── runs/             — run metadata (JSON)
└── archive/          — topic history + backups
```

## Connectors

This plugin uses `~~browser` for Reddit, TikTok, and Instagram dashboard access. See `CONNECTORS.md`.
