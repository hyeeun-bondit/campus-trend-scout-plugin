# Source Collection Reference

Use this reference before the research and signal-save stages.

## Research Standard

Prefer sources based on the run date:

- News events, campus issues, SNS memes, platform controversies, and campus incidents: prioritize the last 1-2 weeks.
- Slower-moving topics such as statistics, reports, policy, cost, employment, majors, AI use, and student finance: prioritize 2026 sources; use late-2025 sources only when still relevant to 2026.

Search broadly before clustering. Cover US and Canadian education news, college newspapers, official university/government sources, Reddit, TikTok, Instagram, YouTube Shorts, X, Threads, Google Trends, student surveys, higher-education reports, employment reports, college rankings, and direct student reactions.

Use community and social posts as evidence of student reaction, not as the sole factual authority for factual claims. Subjective tips, memes, aesthetics, and lived-experience discussions can stand as anecdotal or emerging signals when described that way.

## Coverage Targets

- Minimum 30 total signals; 40 is better when time permits.
- Minimum 12 SNS/community signals.
- Minimum 5 Reddit signals.
- Minimum 6 topic lanes represented across usable signals.
- Minimum 3 college-ranking or ranking-adjacent content leads.

If a target cannot be met, record what was tried and why coverage was insufficient. Do not pretend the target was met.

## Tool Rules

- Use **WebSearch** and **WebFetch** for source discovery and research.
- **SNS 검색 (Reddit, X/Twitter, TikTok, YouTube, Threads, Mastodon 등)**: `/insane-search` 스킬을 **우선 사용**한다. WAF/봇 차단을 자동 우회하며 yt-dlp, Jina Reader, curl_cffi TLS impersonation, Playwright 등 다단계 fallback 체인을 제공한다.
  - `/insane-search`가 사용 가능하면 (스킬 목록에 있으면) SNS URL 접근 시 항상 이것을 먼저 시도한다.
  - `/insane-search`가 사용 불가능하면 (스킬 미설치) **Chrome MCP** (`mcp__Claude_in_Chrome__*`)로 fallback한다.
  - Chrome MCP도 사용 불가능하면 아래 안내를 사용자에게 출력한다:
    > ⚠️ `/insane-search` 스킬과 Chrome MCP가 모두 사용 불가합니다. SNS 접근이 제한됩니다.
- Use **Chrome MCP** for Reddit and TikTok when `/insane-search` is unavailable, or when the final source needs observed post context (screenshots, visual layout).
- Do not count search snippets, blocked pages, deleted posts, login walls, or unobserved pages as evidence.
- When fallback access is used, record the original public source URL whenever possible and note fallback-derived access honestly.

## Query Selection — Automated

Query pools are stored in `data/query-pools/{news,reddit,tiktok}.json`. Do NOT read the pool files manually. Run the script instead:

```bash
python3 scripts/select-queries.py --date {YYYY-MM-DD} [--keyword "trending topic"]
```

The script:
1. Reads all pool files and `data/query-log.json`.
2. Excludes queries used in the last 7 days.
3. Selects **7 queries per platform**, spread across categories for diversity.
4. Adds seasonal bonus queries matching the current month.
5. Adds 1-2 evergreen template queries if `--keyword` is provided.
6. Updates `data/query-log.json` automatically.
7. Outputs the selected queries as JSON to stdout.

Use the output directly for research. Do not manually pick queries from the pool.

## Reddit Collection

Reddit is a core source for real student anxieties, disagreements, jokes, comparisons, and phrasing. Open Reddit search pages or subreddit internal searches and save only actual post URLs in `/r/.../comments/...` form.

For each usable Reddit signal, record the real post URL, title, visible date/freshness, visible engagement counts only, `student_quote_summary`, and `content_seed`.

**Subs to mine directly**: r/college, r/ApplyingToCollege, r/professors, r/universityofreddit, r/GradSchool, r/premed, r/cscareerquestions, r/StudentLoans, r/FinancialAid

## TikTok Collection

TikTok `/discover/` pages are not individual posts. Record only actual video URLs such as `tiktok.com/@user/video/...`.

Use TikTok as a trend and reaction source. Verify factual claims with stronger sources before ranking.

**Hashtag reverse-search**: When a hashtag is trending, search it directly to find the underlying story: `#collegelife` `#collegestudent` `#campustiktok` `#dormtok` `#studytok` `#collegecheck`

## College Rankings Content

Collect ranking-based content every day because rankings can produce debate, comparison, and share behavior when the criteria are specific.

| Site | URL | Use |
|---|---|---|
| US News | `https://www.usnews.com/best-colleges/rankings` | Overall/submetric rankings and movement |
| Forbes | `https://www.forbes.com/search/?q=university` | University articles and nontraditional rankings |
| Princeton Review | `https://www.princetonreview.com/` | Thematic rankings such as happiness, party life, food |
| Niche | `https://www.niche.com/colleges/rankings/` | Student-life and campus-experience rankings |
| BLS / government datasets | `https://www.bls.gov/` | Employment and salary evidence |

Prioritize submetric comparisons, thematic rankings, recent rank changes, debate rankings, and practical rankings around cost, dorms, food, commute, city life, and international-student support.

## Search Tips

- **X/Twitter raw opinions**: Search `from:college_* -filter:links` or `college students` filtered to recent for unfiltered student takes.
- **TikTok/Reels hashtag reverse-search**: Find trending hashtags, then ask "why is this trending?" to discover the underlying story.
