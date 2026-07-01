# Card news → Figma via the `use_figma` MCP tool

이게 지금 기본 경로다. `data/cardnews/{DATE}.json`을 실제 Figma 파일에 편집 가능한 레이어로
직접 쓴다 — 사용자가 플러그인을 설치하거나 실행 버튼을 누를 필요가 없다. `figma-plugin/code.js`,
`manifest.json`, `ui.html`(수동 설치 플러그인)은 Figma MCP 커넥터가 없는 환경을 위한 폴백으로만
남겨둔다.

## 전제 조건

- 세션에 실제 Figma MCP 커넥터(`mcp__<id>__use_figma`, `whoami`, `create_new_file`,
  `get_screenshot` 등의 도구, 서버 이름이 `54ddddb5-...` 같은 UUID로 보임)가 연결돼 있어야 한다.
  연결이 안 보이면 사용자에게 claude.ai 커넥터 설정에서 Figma를 연결해달라고 안내하고, 안 되면
  `figma-plugin/README.md`의 수동 플러그인 경로로 폴백한다.
- 이 MCP는 `skill://figma/figma-use/SKILL.md` 같은 전용 가이드 리소스를 제공하지 않는다
  (확인됨, 2026-07-01 기준). 별도 스킬을 로드하려 하지 말고 이 문서의 패턴을 그대로 따른다.

## 절차

### 1. 대상 Figma 파일/페이지 — 기본값 고정됨

기본 목적지는 다음으로 고정한다 (2026-07-01, 사용자 확인):

- `fileKey`: `1Ugah0tTBvhYzO9Lm986IE` (`IGOTIN-Marketing_Emily`)
- 페이지: `3088:3785`, 이름 `콘텐츠 포스트 카드뉴스 초안`
- 이 파일은 다른 사람(Emily 등)도 쓰는 공유 파일이다 — 항상 이 페이지 안에서만 작업하고,
  다른 페이지(예: `2798:3755` "Design Element")에는 만들지 않는다. 실수로 다른 페이지에
  만들었으면 바로 지우고 올바른 페이지로 다시 만든다.
- 사용자가 다른 파일/페이지 URL을 명시적으로 주면 그때만 그걸 우선한다
  (`https://figma.com/design/:fileKey/:fileName?node-id=...`에서 `fileKey`/`nodeId` 추출,
  `nodeId`의 `-`를 `:`로 바꾸면 페이지 id).
- 새 파일을 만들어야 하는 예외적인 경우에만 `whoami`로 plan 목록을 확인하고(하나면 그 `key`,
  여러 개면 AskUserQuestion으로 확인) `create_new_file`을 쓴다.

### 2. 페이지 지정

`use_figma` 코드 맨 앞에서 항상 페이지를 명시적으로 전환한다:

```js
const page = await figma.getNodeByIdAsync("3088:3785");
await figma.setCurrentPageAsync(page);
```

이후의 `importCardNews`/배치 로직은 전부 `figma.currentPage` 기준이라 자동으로 이 페이지
안에서만 동작한다.

### 3. 레이어 생성 코드 준비

`code.js`에서 `// === REUSABLE BUILDER LOGIC ===` 마커부터 `// === PLUGIN UI BOOTSTRAP ===`
마커 바로 **위**까지를 그대로 복사한다(총 700줄 안팎, `figma.showUI`/`figma.ui.onmessage` 부분은
제외). 그 뒤에 아래 두 줄을 붙인다:

```js
const data = /* data/cardnews/{DATE}.json 내용 그대로, 또는 새로 만든 topics 배열 */;
return await importCardNews(data);
```

`importCardNews`는 이미 다음을 처리한다:
- `data.topics` 배열이든 단일 topic 객체든 정규화
- 같은 페이지(`figma.currentPage`)의 기존 콘텐츠 bounding box 아래로 자동 배치(겹침 방지)
- 토픽마다 보드(제목 + 슬라이드 6장 가로 배열) 생성
- 뷰포트를 새로 만든 보드로 스크롤/줌
- 생성된 각 보드의 `{boardId, name, x, y, width, height}` 배열을 반환

기존 콘텐츠가 있는 파일에 추가할 때는 이 자동 배치로 충분하다. 특정 섹션 밑에 정확히 붙이고
싶으면(예: 팀원이 관리하는 파일) 먼저 `get_metadata`로 대상 페이지의 최상위 노드 좌표를 확인하고,
`importCardNews` 호출 전에 원하는 시작 `y`를 계산해 board 배치 로직을 그 값으로 오버라이드한다.

**사용자 확인(2026-07-01): 매번 지우지 않고 계속 쌓는다.** 새 초안을 생성할 때마다 이 페이지의
기존 콘텐츠(이전 초안들, 확인용 프레임 포함)는 그대로 두고 그 아래로 계속 추가한다 — 페이지를
비우거나 이전 보드를 지우지 않는다.

### 4. `use_figma` 호출

```
use_figma({
  fileKey: "<파일 키>",
  description: "Import {DATE} card-news drafts as Figma layers",
  code: "<위에서 만든 전체 코드 문자열>"
})
```

- `code`는 50,000자 제한이 있다. `code.js`의 재사용 섹션(~20KB) + 토픽 JSON(보통 몇 KB) 정도는
  여유롭다. 토픽이 아주 많으면(하루에 여러 개) 배치로 나눠서 여러 번 호출한다.
- 커버 슬라이드 폰트(SF Pro Rounded)는 사용자 Figma 계정에 설치돼 있지 않으면 자동으로 Inter로
  대체된다 — 실패로 취급하지 않는다.

### 5. 확인 및 공유

- 호출 결과로 받은 `boardId`로 `get_screenshot(fileKey, nodeId)`를 호출해 실제로 잘 만들어졌는지
  확인한다. 스크린샷 URL은 임시이므로 필요하면 `curl`로 받아서 Read로 사용자에게 보여준다.
- 사용자에게는 `https://figma.com/design/{fileKey}/{fileName}?node-id={boardId 하이픈버전}`
  형태의 직접 링크를 함께 준다(콜론을 하이픈으로 바꾼다, 예: `3098:2` → `node-id=3098-2`).
- 실제 팀 공유 파일에 작업할 때는 무엇을 어디에 만들었는지 명확히 알려준다 — 다른 사람이 보는
  파일이므로 조용히 추가하지 않는다.

## 알아둘 점

- 2026-07-01 실제 초안(cn_20260701_01, "8 Colleges Just Closed in 2026")으로 JSON→HTML→Figma
  전체 파이프라인을 라이브로 검증 완료. 커버 그라디언트/박스 강조, 태그 필, 헤드라인 색 강조,
  chips, 도넛, 디스커션 슬라이드 모두 의도대로 생성됨.
- **페이지 id는 반드시 코드 맨 앞에서 명시적으로 지정할 것**(섹션 2) — 이 파일에 페이지가
  여러 개라 지정을 빼먹으면 엉뚱한 페이지에 만들어질 수 있다.
- 같은 공유 파일에 "html.to.design" 플러그인으로 카드뉴스 HTML을 임포트한 선례가 있다
  (`3082:707`, "Student homelessness" 세트, 다른 페이지). 픽셀 완벽한 재현이 특히 중요하면
  `use_figma` 코드 재현 대신 HTML을 html.to.design에 직접 붙여넣는 것도 유효한 대안이다.
