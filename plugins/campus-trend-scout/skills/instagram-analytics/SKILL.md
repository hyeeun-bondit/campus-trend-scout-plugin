---
name: instagram-analytics
description: >
  Chrome MCP로 인스타그램 프로페셔널 대시보드에 직접 접속해 최근 30일 콘텐츠(릴스/게시물/스토리 등)
  전체의 반응 지표를 수집하고, 광고 집행 게시물 효과를 별도 분석한 뒤, 마케팅 인사이트 리포트와
  한글 HTML 대시보드를 생성한다. "인스타그램 분석해줘", "프로페셔널 대시보드 긁어줘",
  "최근 30일 콘텐츠 성과 알려줘", "광고 효과 분석해줘", "인스타 마케팅 인사이트 뽑아줘",
  "대시보드 HTML로", "캐러셀/포스트 인사이트 만들어줘" 같은 요청에 이 스킬을 사용한다.
metadata:
  version: "0.2.0"
---

# Instagram Professional Dashboard Analytics

## Auto-Update Check

Before starting, check for plugin updates:

```bash
PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")/../.." 2>/dev/null && pwd || find . -path '*/campus-trend-scout/skills' -type d 2>/dev/null | head -1 | sed 's|/skills||')"
git -C "$PLUGIN_DIR" fetch --quiet 2>/dev/null
BEHIND=$(git -C "$PLUGIN_DIR" log HEAD..origin/main --oneline 2>/dev/null)
if [ -n "$BEHIND" ]; then
  echo "⚡ campus-trend-scout 업데이트가 있습니다:"
  echo "$BEHIND"
  git -C "$PLUGIN_DIR" pull --ff-only 2>/dev/null && echo "✅ 자동 업데이트 완료" || echo "⚠️ 자동 업데이트 실패 — 수동으로 git pull 해주세요: $PLUGIN_DIR"
else
  echo "✅ campus-trend-scout 최신 버전입니다."
fi
```

---

~~browser로 인스타그램 프로페셔널 대시보드를 직접 탐색하여 콘텐츠 성과 데이터를 수집하고, 마케팅 관점의 분석 리포트를 작성한다. 인스타그램 API가 아니라 브라우저를 통해 실제 대시보드 UI를 읽는 방식이므로, ~~browser가 활성화되어 있고 브라우저에 인스타그램 계정이 로그인된 상태여야 한다.

---

## 지표 정의 및 판단 기준

Read `references/metric-definitions.md` for detailed metric definitions, benchmarks, and interpretation rules.

---

## 사전 확인 사항

1. **~~browser 연결 상태** — `list_connected_browsers`를 호출해 연결된 브라우저가 있는지 확인한다. 없으면 사용자에게 브라우저 확장 프로그램 활성화를 요청한다.
2. **분석 대상 계정 확인** — 분석할 인스타그램 계정 ID(@username)를 사용자에게 먼저 물어본다.

---

## Step 1 — 인스타그램 프로페셔널 대시보드 접속

```
navigate → https://www.instagram.com/
```

로그인 상태를 확인한다. 로그인 화면이 나타나면 작업을 멈추고 사용자에게 직접 로그인한 뒤 다시 실행하도록 안내한다. 로그인 정보를 절대 입력하지 않는다.

로그인 확인 후:
```
navigate → https://www.instagram.com/{username}/
```

프로필 페이지에서 "프로페셔널 대시보드" 버튼을 찾아 클릭한다.

---

## Step 2 — 기간 설정 및 개요 지표 수집

기간 필터를 '최근 30일'로 설정한다.

계정 전체 요약 지표 수집:
- 도달한 계정 수 (Accounts reached)
- 콘텐츠 상호작용 수 (Content interactions)
- 총 팔로워 수 (기말 기준)
- 새 팔로우 수 / 언팔로우 수 / 순증
- 프로필 방문 수

---

## Step 3 — 콘텐츠별 상세 지표 수집

수집 대상 유형: 릴스, 피드 게시물/캐러셀, 스토리, 기타.

각 게시물별 수집 항목: 게시물 ID/제목, 게시 날짜, 콘텐츠 유형, 노출 수, 도달 수, 좋아요/댓글/공유/저장 수, 조회수(릴스), 평균 시청 시간(릴스), 광고 집행 여부.

---

## Step 4 — 광고(Boosted/Promoted) 게시물 별도 수집

광고 전용 추가 항목: 광고 집행 기간, 예산, 목표, 광고 도달 수, 클릭 수, CPC, CPM, 전환 수.

---

## Step 5 — 수집 데이터 구조화

수집한 데이터를 계정 요약 테이블 + 콘텐츠별 상세 테이블 + 광고 게시물 별도 테이블로 정리한다.

---

## Step 6 — 마케팅 분석 및 인사이트 작성

Read `references/analysis-framework.md` for the full analysis framework including:
- 성과 지표 계산 (ER, Save Rate, Share Rate, Net Growth)
- 콘텐츠 유형별 성과 비교
- 잘하고 있는 방향 (What's Working)
- 개선해야 할 점 (What to Fix)
- 앞으로 공략하면 좋을 것 (Opportunities)
- 광고 효과 심층 분석

---

## Step 7 — 저장

**모든 결과를 `data/instagram-analytics/` 디렉토리에 저장한다.**

### 7-1. JSON 원본 데이터

수집한 원본 지표를 `data/instagram-analytics/{DATE}_raw.json`에 저장한다:

```json
{
  "analysis_date": "{YYYY-MM-DD}",
  "account": "@{username}",
  "period": "last_30_days",
  "period_start": "{YYYY-MM-DD}",
  "period_end": "{YYYY-MM-DD}",
  "account_summary": {
    "accounts_reached": 0,
    "content_interactions": 0,
    "total_followers": 0,
    "new_follows": 0,
    "unfollows": 0,
    "net_growth": 0,
    "profile_visits": 0
  },
  "posts": [
    {
      "post_id": "...",
      "caption_preview": "...",
      "date": "{YYYY-MM-DD}",
      "type": "reel | photo | carousel | story",
      "impressions": 0,
      "reach": 0,
      "likes": 0,
      "comments": 0,
      "shares": 0,
      "saves": 0,
      "views": null,
      "avg_watch_time": null,
      "is_boosted": false
    }
  ],
  "boosted_posts": [
    {
      "post_id": "...",
      "ad_period": "...",
      "budget": "...",
      "objective": "...",
      "ad_reach": 0,
      "clicks": 0,
      "cpc": 0,
      "cpm": 0,
      "conversions": null
    }
  ]
}
```

### 7-2. HTML 대시보드

분석 리포트를 `data/instagram-analytics/week-of-{DATE}.html`에 저장한다.

HTML 대시보드 필수 포함 섹션:
- 상단 KPI: Views, Accounts reached, Interactions, Profile visits, Followers
- 콘텐츠 타입 비중: Posts / Reels / Stories
- 유형별 평균: 평균 Reach, 평균 Views, 평균 ER, 저장율, 공유율
- Top 20 콘텐츠 상세 표
- 광고 성과 표
- 잘하고 있는 방향, 개선점, 다음 액션
- 수집 가능 범위와 미수집 항목

HTML은 self-contained (inline CSS, no external dependencies), 모바일 친화적으로 만든다.

### 7-3. 저장 후 검증

파일 생성 후:
- `ls -lh`로 파일 존재와 크기 확인
- JSON은 Read로 다시 열어 주요 필드 검증
- HTML은 `<!doctype html>`, 주요 섹션 제목, 핵심 표가 포함됐는지 확인

---

## 주의 사항

- 로그인 자격증명을 입력하거나 저장하지 않는다.
- 대시보드에 없는 수치를 추정하거나 지어내지 않는다. 없으면 "N/A"로 표기한다.
- Instagram Graph API를 별도로 호출하지 않는다.
- 리포트 하단에 수집 방법과 범위, 미수집 항목과 사유를 반드시 기재한다.
