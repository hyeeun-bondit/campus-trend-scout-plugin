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

### Option 1: `/plugin` 메뉴에서 설치 (권장)

1. Claude Desktop 또는 Claude Code CLI 열기
2. 채팅창에 `/plugin` 입력
3. **"Add marketplace"** 선택
4. GitHub URL 입력:
   ```
   https://github.com/hyeeun-bondit/campus-trend-scout-plugin
   ```
5. 마켓플레이스가 추가되면 목록에서 **campus-trend-scout** 선택하여 설치

### Option 2: 수동 클론 후 설치

```bash
gh repo clone hyeeun-bondit/campus-trend-scout-plugin
```

Claude Code에서 `/plugin` → **Add local plugin** → 경로 지정:
```
campus-trend-scout-plugin/plugins/campus-trend-scout
```

### 필수 사전 설치

- [Claude in Chrome](https://chromewebstore.google.com/detail/claude-in-chrome/) 확장 프로그램 (Reddit/TikTok/Instagram 접근용)

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
