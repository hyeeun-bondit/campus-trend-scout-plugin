---
name: card-news-draft
description: >
  기사 링크 하나(또는 campus-trend-scout에서 선택한 토픽)를 받아 인스타그램 카드뉴스
  영어 슬라이드 초안을 만든다. "이 기사로 카드뉴스 만들어줘", "슬라이드 구성해줘",
  "타이틀 후보 뽑아줘", "discussion question 만들어줘" 같은 요청에 사용한다.
metadata:
  version: "0.2.0"
---

# Card News Draft

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

기사 링크 하나를 받아서, 어떤 내용을 다루는지 정리하고, 고정 레이아웃에 맞춰 영어 슬라이드 초안을
만든다. campus-trend-scout 파이프라인에서 주제를 고른 경우에도 같은 절차를 쓴다.

---

## 입력 두 가지 경로

1. **단독 링크** — 사용자가 기사 링크만 던지는 경우. 랭킹/topic_id 없이 바로 진행한다.
2. **campus-trend-scout 토픽 선택** — 그날 저장된 랭킹 중 하나를 고른 경우.

---

## 절차

### 1단계 — 기사 분석
- 링크를 열어 실제로 무엇을 다루는지 요약한다(지어내지 않음, 숫자/출처 그대로).
- 어떤 사실/데이터가 핵심이고, 어떤 부분이 미국/캐나다 대학생과 직접 연결되는지 구분한다.

### 2단계 — College Marketing Point 체크
아래 5개 기준으로 이 기사가 카드뉴스로 먹힐지 짧게 점검하고, 어떤 기준이 강한지 한 줄씩 적는다.

| 기준 | 질문 |
|---|---|
| self_relevance | 전공/학비/취업/기숙사/생활비 등 학생 개인 상황과 연결되는가 |
| comparison_potential | 학교/전공/지역/학년별로 결과가 달라지는가 |
| decision_usefulness | 곧 마주할 선택(전공, 취업, 생활비 관리 등)에 도움이 되는가 |
| share_trigger | 친구나 같은 상황 사람에게 보낼 구체적 이유가 있는가 |
| comment_trigger | "우리 학교는 다르다" 식 댓글을 유도하는가 |

가장 강하게 걸리는 1~2개 기준을 슬라이드의 훅(hook)과 헤드라인 방향으로 삼는다.

### 3단계 — 슬라이드 1 타이틀 + 한줄 요약 후보
- 타이틀(헤드라인) 후보 3~5개, 톤을 다르게(숫자 강조형 / 반전형 / 직접 질문형 등).
- 각 타이틀에 어울리는 한줄 요약(body 1~2문장)도 같이 짝지어 제시한다.
- 사용자가 그중 하나를 고르면 이후 단계에 반영한다.

### 4단계 — 고정 레이아웃으로 슬라이드 구성 (영어)
모든 슬라이드는 다음 3단 구조를 따른다:

```
상단 태그 (Tag): 짧은 카테고리 라벨. 예) "Price Hike"
Headline: 가장 강한 한 문장. 숫자나 대비는 색으로 강조 표시
Body: 헤드라인을 보충하는 1~2문장 설명
(필요시) 차트/통계 박스, 하단 Source 표기
```

- 슬라이드 수는 보통 4~6장: Hook(슬라이드1) → Context → Key fact/data → Student angle →
  (선택) Comparison → CTA/discussion 유도.
- 각 슬라이드마다 Tag / Headline / Body를 구분해서 영어로 작성하고, 데이터가 들어가는 슬라이드는
  source를 명시한다(지어내지 않음).

### 5단계 — Discussion Question
- 마지막 슬라이드 또는 캡션용으로 쓸 discussion question 3~5개 추천.
- "우리 학교는 어때?", "너라면 어떻게 할래?" 식으로 댓글을 유도하는 질문 위주.

### 6단계 — 저장

**모든 경우에** 결과를 `data/cardnews/{DATE}.json`에 저장한다.

- 해당 날짜 파일이 이미 존재하면, 기존 JSON을 읽고 `topics` 배열에 새 항목을 append한다.
- 파일이 없으면 새로 생성한다.

저장 JSON 구조:

```json
{
  "date": "{YYYY-MM-DD}",
  "topics": [
    {
      "topic_id": "cn_{YYYYMMDD}_{nn}",
      "source_url": "...",
      "source_type": "standalone_link | trend_scout_topic",
      "trend_scout_rank": null,
      "article_summary": "...",
      "marketing_points": {
        "self_relevance": "...",
        "comparison_potential": "...",
        "decision_usefulness": "...",
        "share_trigger": "...",
        "comment_trigger": "...",
        "strongest_points": ["..."]
      },
      "title_options": [
        { "title": "...", "one_line_summary": "..." }
      ],
      "selected_title": null,
      "slide_structure": [
        {
          "slide_number": 1,
          "tag": "...",
          "headline": "...",
          "body": "...",
          "source": null
        }
      ],
      "discussion_questions": ["..."],
      "created_at": "{ISO timestamp}"
    }
  ]
}
```

campus-trend-scout 토픽인 경우 `source_type`을 `"trend_scout_topic"`으로, `trend_scout_rank`에 해당 랭크를 기록한다.

민감/위험 토픽(risk_level high/exclude)에는 meme 톤을 쓰지 않는다.

저장 후 파일을 Read로 다시 열어 검증한다.

---

## 출력 형식 체크리스트

- [ ] 기사 핵심 내용 요약 (지어낸 숫자/출처 없음)
- [ ] college marketing point 5개 기준 중 강하게 걸리는 포인트 명시
- [ ] 슬라이드1 타이틀+한줄요약 후보 3개 이상
- [ ] 슬라이드마다 Tag / Headline / Body 구분
- [ ] discussion question 3~5개
- [ ] `data/cardnews/{DATE}.json`에 저장 완료
