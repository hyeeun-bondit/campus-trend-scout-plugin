# Card News Importer (Figma plugin)

`card-news-draft` 스킬이 저장한 `data/cardnews/{DATE}.json`을 읽어서 각 슬라이드를 실제
Figma 프레임/텍스트/도형 레이어로 생성한다. HTML 미리보기 대신 Figma에서 바로 레이아웃을
확인하고 수정하고 싶을 때 쓴다.

## 설치 (최초 1회)

1. Figma **데스크톱 앱**을 연다 (브라우저판은 로컬 플러그인 import를 지원하지 않음).
2. 아무 파일이나 열고 상단 메뉴 → `Plugins` → `Development` → `Import plugin from manifest…`
3. 이 폴더의 `manifest.json`을 선택한다:
   `plugins/campus-trend-scout/figma-plugin/manifest.json`
4. (선택, 권장) 커버 슬라이드 타이포그래피를 정확히 재현하려면 아래 3개 폰트 파일을 macOS
   서체 관리자(Font Book)에 설치한다 — 설치 안 해도 동작은 하지만 커버 슬라이드가 Inter로
   대체된다:
   `plugins/campus-trend-scout/skills/card-news-draft/assets/fonts/SF-Pro-Rounded-Heavy.otf`
   `plugins/campus-trend-scout/skills/card-news-draft/assets/fonts/SF-Pro-Rounded-Regular.otf`
   `plugins/campus-trend-scout/skills/card-news-draft/assets/fonts/SF-Pro-Rounded-Semibold.otf`

## 사용법

1. Figma에서 `Plugins` → `Development` → `Campus Trend Scout — Card News Importer` 실행.
2. `data/cardnews/{DATE}.json` 파일을 파일 선택창으로 열거나, 내용을 복사해서 textarea에
   붙여넣는다. (해당 날짜에 만든 토픽 중 하나만 옮기고 싶으면 `topics` 배열 안의 항목 하나만
   복사해서 붙여넣어도 된다.)
3. `Figma로 가져오기` 클릭.
4. 캔버스에 토픽별로 슬라이드 6장이 가로로 나열된 보드가 생성된다. 이후 텍스트/색/도형을
   Figma에서 바로 수정하면 된다.

## 알아둘 점

- 도넛/트렌드/칩/포토vs포토 시각 요소는 정확한 픽셀 재현이 아니라 **편집 가능한 근사치**다.
  값과 배치가 맞는지 확인 후 Figma에서 다듬는다.
- 커버 슬라이드 그라디언트도 원본 CSS의 이중 그라디언트를 단순화한 근사치다.
- 매번 재실행하면 캔버스에 새 보드가 아래로 계속 추가된다(기존 보드를 덮어쓰지 않음).
