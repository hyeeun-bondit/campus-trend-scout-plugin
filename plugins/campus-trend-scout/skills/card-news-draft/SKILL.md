---
name: card-news-draft
description: >
  기사 링크 하나(또는 campus-trend-scout에서 선택한 토픽)를 받아 인스타그램 카드뉴스
  영어 슬라이드 초안을 만든다. "이 기사로 카드뉴스 만들어줘", "슬라이드 구성해줘",
  "타이틀 후보 뽑아줘", "discussion question 만들어줘" 같은 요청에 사용한다.
metadata:
  version: "0.3.0"
---

# Card News Draft

## Auto-Update Check

Before starting, check for plugin updates:

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

---

기사 링크 하나를 받아서, 어떤 내용을 다루는지 정리하고, 고정 레이아웃에 맞춰 영어 슬라이드 초안을
만든다. campus-trend-scout 파이프라인에서 주제를 고른 경우에도 같은 절차를 쓴다.

**최종 산출물은 JSON(데이터)과 HTML(실제 카드뉴스 비주얼) 두 개다.** JSON만으로 끝내지 않는다 —
HTML은 `assets/template.html`(IGOTIN 브랜드 퍼플 배경, 마젠타 accent line, 워드마크, pill 태그,
색 강조 헤드라인, 슬라이드별 데이터 시각화를 갖춘 6단계 참조 덱)을 그대로 복제해서 채운다.

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

IGOTIN 카드뉴스는 항상 아래 시각 스타일(모든 슬라이드 공통)을 따른다:

- 배경은 밝은/흰색이 아니라 **솔리드 브랜드 퍼플**(`#6B4EFF` 근사치 — 정확한 브랜드 hex는
  디자인팀 가이드 확인 권장), 6장 전부 동일.
- 상단 중앙 "IGOT N" 워드마크(스몰캡, 흰색).
- 카드 왼쪽 끝을 따라 얇은 **마젠타 accent line**(모든 슬라이드 공통, 마지막 슬라이드도 포함).
- 워드마크 아래 **흰 배경 + 검정 텍스트 pill 뱃지**로 Tag 표시.
- Headline은 굵은 흰색이되, 핵심 숫자/단어만 **yellow/mint/cyan 중 하나로 색 강조**(굵기가 아니라
  색이 강조를 담당).
- Body는 문단이 아니라 **불릿 포인트 2~4개**로 작성한다(각 불릿은 헤드라인을 보충하는 짧은 문장).
- 데이터가 있는 슬라이드는 하단에 **작고 옅은(low-opacity) source 표기**를 고정한다.

슬라이드 수는 보통 6장 구성을 기본으로 한다:

1. **Cover (Hook)** — 다른 슬라이드와 톤이 다른 커버. 히어로 이미지/그라디언트 배경,
   타이틀 안에 핵심 키워드를 박스로 감싸 강조, 우하단에 "Swipe →" 큐. 워드마크는 유지하되
   Tag pill·body 불릿은 넣지 않는다.
2~5. **Content 슬라이드** — Context → Key fact/data → Student angle → (선택) Comparison 순.
   슬라이드마다 Tag / Headline(색 강조 포함) / Body(불릿) / 아래 "데이터 시각화 매칭" 표를 따라
   시각 요소 하나를 배치한다.
6. **Discussion (CTA)** — 거의 크롬 없이 이모지 하나 + discussion question 한 문장만 중앙 배치
   (워드마크·Tag pill 생략, accent line만 유지).

**데이터 시각화 매칭** — 슬라이드 내용에 맞는 시각 요소 하나를 고른다(억지로 4종류를 다 채우지
않는다. 데이터 성격에 안 맞으면 생략 가능):

| 데이터 성격 | 시각 요소 |
|---|---|
| 단일 퍼센트/비율 하나 | 도넛/링 차트 |
| 병렬 비교 통계 (2~4개 그룹) | 색이 다른 chip 카드 나열 |
| 시간에 따른 변화율/추세 | 작은 트렌드(스파크라인) 차트 |
| 두 대상 맞대결 비교 | photo-vs-photo (양쪽 사진 + 중앙 VS 뱃지) |
| 시각화할 만한 수치가 없음 | 생략, body 불릿만 유지 |

- 각 슬라이드마다 Tag / Headline / Body(불릿) / (해당 시) 시각 요소를 구분해서 영어로 작성하고,
  데이터가 들어가는 슬라이드는 source를 명시한다(지어내지 않음).
- 실제 HTML 구현은 7단계에서 `assets/template.html`을 그대로 복제해 사용한다 — 색상 값,
  구조, 클래스명을 새로 설계하지 않는다.

### 5단계 — Discussion Question
- 마지막 슬라이드 또는 캡션용으로 쓸 discussion question 3~5개 추천.
- "우리 학교는 어때?", "너라면 어떻게 할래?" 식으로 댓글을 유도하는 질문 위주.

### 6단계 — 데이터 저장 (JSON)

**모든 경우에** 결과를 `data/cardnews/{DATE}.json`에 저장한다. 이 JSON은 HTML을 만들기 위한
소스 데이터이자 campus-trend-scout 파이프라인의 이력 기록이다.

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
          "type": "cover | content | discussion",
          "tag": "...",
          "headline": "...",
          "headline_highlight": "...",
          "headline_highlight_color": "yellow | mint | cyan",
          "body_bullets": ["...", "..."],
          "visual": {
            "type": "donut | chips | trend | photo_vs_photo | none",
            "data": {}
          },
          "source": null
        }
      ],
      "discussion_questions": ["..."],
      "html_output_path": "data/cardnews/{DATE}_{topic_id}.html",
      "created_at": "{ISO timestamp}"
    }
  ]
}
```

- `visual.data`는 시각 요소별로 필요한 값을 담는다: `donut` → `{ "percent": 28 }`,
  `chips` → `{ "items": [{ "value": "$300", "label": "In-state public", "color": "yellow" }, ...] }`,
  `trend` → `{ "points": [{ "label": "2021", "value": 10 }, ...], "callout": "+42% since 2021" }`,
  `photo_vs_photo` → `{ "left_label": "...", "right_label": "..." }`.
- Slide 1(cover)은 `headline` 대신 `cover_title`(줄바꿈 포함 가능), `cover_boxed_word`(박스로 강조할
  키워드), `cover_eyebrow`(작은 상단 라벨)를 쓴다. Body/visual 필드는 비운다.
- 마지막 슬라이드(discussion)는 `tag`/`body_bullets`/`visual`을 비우고 `headline`에 discussion
  question 문장, 별도로 `emoji` 필드를 추가한다.
- campus-trend-scout 토픽인 경우 `source_type`을 `"trend_scout_topic"`으로, `trend_scout_rank`에
  해당 랭크를 기록한다.
- 민감/위험 토픽(risk_level high/exclude)에는 meme 톤을 쓰지 않는다.

### 7단계 — HTML 카드뉴스 생성

JSON을 사람이 바로 보고 넘길 수 있는 **완결된 HTML 파일 하나**로 렌더링한다. JSON만 던지고 끝내지
않는다.

- 베이스는 `assets/template.html`이다. 이 파일을 통째로 복제한 뒤, `.slide` 블록마다 6단계에서
  만든 슬라이드 데이터로 텍스트/색/시각 요소를 교체한다. **CSS 변수, 클래스 구조, 색상 값은 그대로
  둔다** — 새로 디자인하지 않는다. 필요한 만큼 `.slide` 블록을 늘리거나 줄인다.
- `body-bullets`는 실제로 `<li>` 여러 개로 렌더링한다(요약해서 한 문장으로 뭉치지 않는다 —
  내용 생략 없이 그대로).
- headline의 강조 단어는 `<span class="hl-yellow|hl-mint|hl-cyan">`로 감싼다.
- 시각 요소(`visual.type`)에 맞는 블록을 `template.html`의 해당 예시에서 그대로 가져와 값만 채운다:
  - `donut`: `stroke-dasharray`는 `percent/100 * 502.65` 계산으로 채운다(원 둘레 502.65 = 2π×80).
  - `chips`: chip 개수만큼 `.chip` 반복, 값마다 강조 색 지정.
  - `trend`: `points`를 SVG `polyline` 좌표로 변환(x는 균등 분할, y는 값 반전 매핑).
  - `photo_vs_photo`: 실제 사진 에셋이 없으면 placeholder 박스 + 캡션 유지.
- 파일명: `data/cardnews/{DATE}_{topic_id}.html`. 토픽이 여러 개면 토픽마다 별도 HTML 파일로
  저장한다(한 파일에 여러 토픽을 억지로 합치지 않는다).
- 저장 후 Read로 다시 열어 슬라이드 수·텍스트 누락 여부를 확인한다. 가능하면 브라우저 프리뷰로
  실제 렌더링을 확인한다.

---

## 출력 형식 체크리스트

- [ ] 기사 핵심 내용 요약 (지어낸 숫자/출처 없음)
- [ ] college marketing point 5개 기준 중 강하게 걸리는 포인트 명시
- [ ] 슬라이드1 타이틀+한줄요약 후보 3개 이상
- [ ] 슬라이드마다 Tag / Headline(색 강조) / Body(불릿) 구분
- [ ] 데이터가 있는 슬라이드마다 시각 요소(도넛/chips/trend/photo-vs-photo) 매칭
- [ ] discussion question 3~5개
- [ ] `data/cardnews/{DATE}.json`에 저장 완료
- [ ] `assets/template.html` 기반 HTML 카드뉴스가 `data/cardnews/{DATE}_{topic_id}.html`로 저장
      완료(내용 생략 없이, IGOTIN 스타일 그대로)
