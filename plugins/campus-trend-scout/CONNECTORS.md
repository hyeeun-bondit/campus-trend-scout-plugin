# Connectors

## How tool references work

Plugin files use `~~category` as a placeholder for whatever tool the user
connects in that category. Plugins are tool-agnostic — they describe
workflows in terms of categories rather than specific products.

## Connectors for this plugin

| Category | Placeholder | Included | Fallback |
| --- | --- | --- | --- |
| SNS Access | `/insane-search` | insane-search (bundled skill) | Chrome MCP |
| Browser | `~~browser` | Claude in Chrome | — |

## SNS Access: insane-search (bundled)

이 플러그인에 insane-search 스킬이 내장되어 있습니다. Reddit, X/Twitter, TikTok, YouTube, Threads 등 SNS 플랫폼 접근 시 자동으로 WAF/봇 차단을 우회합니다.

- 별도 설치 불필요 — 이 플러그인 설치 시 함께 포함됨
- 원본: [fivetaku/insane-search](https://github.com/fivetaku/insane-search) (MIT License)

## Browser: Claude in Chrome

Chrome MCP는 커스텀 커넥터 추가 시 `https://` URL이 필요합니다. Claude in Chrome은 로컬 `http://localhost` 주소를 사용하므로 커스텀 커넥터 UI에서 직접 추가할 수 없습니다.

**설치 방법:**
1. [Claude in Chrome](https://chromewebstore.google.com/detail/claude-in-chrome/) 확장 프로그램을 Chrome에 설치
2. 확장 프로그램이 자동으로 Claude Desktop과 연결됨 (커스텀 커넥터 UI를 사용하지 않음)
3. 연결 확인: Claude Desktop에서 `mcp__Claude_in_Chrome__*` 도구가 표시되면 정상
