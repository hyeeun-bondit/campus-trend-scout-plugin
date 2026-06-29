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
  - `/insane-search`가 사용 불가능하면 (스킬 미설치) **Chrome MCP** (`mcp__Claude_in_Chrome__*`)로 fallback한다. Chrome MCP로 해당 SNS 페이지에 직접 접속하여 검색 결과를 수집한다.
  - Chrome MCP도 사용 불가능하면 아래 안내를 사용자에게 출력한다:
    > ⚠️ `/insane-search` 스킬과 Chrome MCP가 모두 사용 불가합니다. SNS 접근이 제한됩니다.
    > 설치 방법: `/insane-search` → `/plugin` 마켓플레이스에서 설치 / Chrome MCP → [Claude in Chrome](https://chromewebstore.google.com/detail/claude-in-chrome/) 확장 프로그램 설치 후 브라우저에서 연결.
- Use **Chrome MCP** for Reddit and TikTok when `/insane-search` is unavailable, or when the final source needs observed post context (screenshots, visual layout).
- Do not count search snippets, blocked pages, deleted posts, login walls, or unobserved pages as evidence.
- When fallback access is used, record the original public source URL whenever possible and note fallback-derived access honestly.

## Query Rotation Rules

Each platform has a large query pool, but running all of them every day is too slow. Follow these rules:

1. **Pick 10 queries per platform per day** — randomly select from the pool, spread across different categories so no single category dominates.
2. **Never reuse a query used in the last 7 days.** Before selecting, read `data/query-log.json` and exclude any query whose `last_used` date is within the past 7 days.
3. **After research, log every query used.** Append to `data/query-log.json` with today's date.
4. **Seasonal queries are bonus** — if the current month matches a seasonal query, add it on top of the 10 (does not count toward the 10 limit).
5. **Evergreen template queries are bonus** — if there is a major trending news item, substitute and run 1–2 template queries on top of the 10.

### Query log format

```json
{
  "query_log": [
    {
      "date": "2026-06-29",
      "platform": "news",
      "queries_used": [
        "college housing crisis 2026 shortage",
        "AI chatgpt college cheating academic integrity policy"
      ]
    },
    {
      "date": "2026-06-29",
      "platform": "reddit",
      "queries_used": [...]
    },
    {
      "date": "2026-06-29",
      "platform": "tiktok",
      "queries_used": [...]
    }
  ]
}
```

Save to `data/query-log.json`. On first run, create the file. On subsequent runs, append new entries. Prune entries older than 14 days to keep the file small.

---

## News & WebSearch Queries

Use WebSearch for these queries. **Pick 10 per run** from the pool below, spread across categories. Check `data/query-log.json` to avoid queries used in the last 7 days.

### Core education news

| Query | Target |
|---|---|
| `college university news this week` | General higher-ed news sweep |
| `US college campus news today` | Breaking campus events |
| `Canadian university news this week` | Canada-specific coverage |
| `higher education policy changes 2026` | Policy and regulation shifts |
| `college enrollment trends 2026` | Enrollment data and patterns |

### Housing & cost of living

| Query | Target |
|---|---|
| `college housing crisis 2026 shortage` | Housing crunch in college towns |
| `college tuition increase 2026 2027` | Tuition hikes and affordability |
| `student rent prices college town gentrification` | Rent and gentrification |
| `student food insecurity campus food bank` | Food insecurity on campus |
| `college meal plan cost controversy` | Meal plan pricing debates |
| `student homelessness college campus` | Student homelessness |

### Student finance & employment

| Query | Target |
|---|---|
| `student loan repayment news 2026` | Student debt policy updates |
| `FAFSA changes 2026 financial aid` | FAFSA and financial aid updates |
| `college graduate job market 2026` | Post-grad employment outlook |
| `college students side hustle gig economy` | Student gig economy |
| `gen z investing spending habits college` | Gen Z financial behavior |
| `college student credit card debt` | Student credit and debt |
| `college internship pay unpaid controversy` | Internship compensation debates |

### Academics & AI disruption

| Query | Target |
|---|---|
| `AI chatgpt college cheating academic integrity policy` | AI and academic honesty |
| `college major demand decline 2026` | Shifting major popularity |
| `skills employers want college graduates 2026` | Skills gap and employability |
| `college curriculum changes AI technology` | Curriculum updates for AI era |
| `trade school vs college degree debate` | Alternatives to 4-year degree |
| `college professor shortage adjunct crisis` | Faculty and staffing issues |
| `online education college hybrid learning trends` | Online/hybrid learning evolution |
| `college students study abroad trends 2026` | Study abroad patterns |

### Mental health & campus wellness

| Query | Target |
|---|---|
| `college student mental health crisis 2026` | Mental health stats and coverage |
| `campus counseling center wait times shortage` | Therapy access barriers |
| `college student burnout stress statistics` | Burnout and stress data |
| `campus wellness programs new initiatives` | Wellness program innovations |
| `college student sleep deprivation research` | Sleep and health research |
| `college student substance use trends` | Substance use patterns |

### Campus politics, safety & activism

| Query | Target |
|---|---|
| `college campus protest 2026` | Active protests and activism |
| `college free speech controversy news` | Free speech debates |
| `DEI diversity college campus policy changes` | DEI policy updates |
| `Title IX college campus safety policy` | Title IX and safety |
| `college campus shooting safety measures` | Campus safety measures |
| `college sustainability climate action initiatives` | Green campus initiatives |
| `student government election controversy` | Student government news |

### Technology & campus innovation

| Query | Target |
|---|---|
| `college campus technology upgrades 2026` | Infrastructure and tech |
| `college students social media trends gen z` | Student social media behavior |
| `campus app student engagement technology` | Student engagement platforms |
| `college esports program growth` | Esports and gaming on campus |

### Rankings & reports

| Query | Target |
|---|---|
| `best colleges ranking 2026 2027 new` | Fresh ranking releases |
| `college ranking controversy methodology debate` | Ranking debates |
| `happiest college students campus survey` | Thematic/lifestyle rankings |
| `best college dorms food campus life ranking` | Campus-experience rankings |
| `best colleges international students 2026` | International student rankings |
| `college return on investment ROI salary data` | ROI and salary outcomes |

### Social & culture

| Query | Target |
|---|---|
| `gen z college loneliness friendship crisis` | Loneliness epidemic |
| `greek life fraternity sorority reform hazing` | Greek life reform |
| `college dating culture gen z trends` | Dating on campus |
| `college sports NIL deals student athletes` | NIL and student athletes |
| `college party culture nightlife trends` | Nightlife and social scene |
| `college freshman orientation trends 2026` | Orientation innovations |
| `transfer student experience community college` | Transfer and CC students |

### Seasonal queries (run when timely)

| Query | Season | Target |
|---|---|---|
| `back to school college trends` | Aug–Sep | Back-to-school content |
| `college application essay tips viral` | Sep–Oct | Application season |
| `college halloween costume party trends` | Oct | Halloween |
| `college thanksgiving break travel tips` | Nov | Thanksgiving |
| `finals week college stress tips` | Dec/May | Finals culture |
| `winter break plans international students college` | Dec | Winter break |
| `new year resolution college students` | Jan | New year resolutions |
| `valentine day college dating trends` | Feb | Valentine's |
| `spring break college budget destinations` | Mar | Spring break |
| `college graduation ceremony trends` | Apr–May | Graduation |
| `summer internship college trends` | May–Jun | Summer internships |
| `college freshman class profile incoming` | Jun–Jul | Incoming class profiles |

### Evergreen template queries

Substitute `[KEYWORD]` with the day's trending topic or breaking news:

- `college students react to [KEYWORD]`
- `how [KEYWORD] affects college students`
- `[KEYWORD] college campus impact`
- `university response to [KEYWORD]`

## Reddit Collection

Reddit is a core source for real student anxieties, disagreements, jokes, comparisons, and phrasing. Open Reddit search pages or subreddit internal searches and save only actual post URLs in `/r/.../comments/...` form.

**Pick 10 per run** from the pool below, spread across categories. Check `data/query-log.json` to avoid queries used in the last 7 days.

### Core

| URL/query | Target |
|---|---|
| `reddit.com/search/?q=college%20freshman%20advice%202026` | Class of 2030, freshman anxiety |
| `reddit.com/search/?q=college%20roommate%20dorm%20move%20in` | Dorm/roommate anxiety |
| `reddit.com/search/?q=college%20major%20regret%20internship` | Major regret and career pressure |
| `reddit.com/search/?q=college%20tuition%20rent%20meal%20plan` | Cost of attendance and living costs |
| `reddit.com/search/?q=international%20student%20college%20US%20Canada` | International students |
| `reddit.com/r/ApplyingToCollege/search/?q=college%20choice&restrict_sr=1` | Incoming-student school choice |
| `reddit.com/r/college/search/?q=campus%20life&restrict_sr=1` | Current student campus life |
| `reddit.com/r/college/search/?q=roommate&restrict_sr=1` | Roommates and dorms |

### Lifestyle & housing

| URL/query | Target |
|---|---|
| `reddit.com/search/?q=college%20students%20housing%20crisis` | Housing shortage in college towns |
| `reddit.com/search/?q=college%20apartment%20interior%20design%20gen%20z` | Gen Z dorm/apartment aesthetics |
| `reddit.com/search/?q=alternative%20housing%20student%20co-living` | Co-living and alternative housing models |
| `reddit.com/search/?q=housing%20shortage%20college%20towns%20gentrification` | College town gentrification |

### Money, spending & side hustles

| URL/query | Target |
|---|---|
| `reddit.com/search/?q=cheapest%20ways%20college%20students%20make%20money` | Student money-making strategies |
| `reddit.com/search/?q=student%20side%20hustle%20trends` | Side hustle culture |
| `reddit.com/search/?q=college%20students%20cryptocurrency%20investing` | Student investing behavior |
| `reddit.com/search/?q=gen%20z%20college%20thrifting%20resale%20fashion` | Thrifting and resale boom |
| `reddit.com/search/?q=college%20meal%20plan%20alternatives` | Meal plan hacks and alternatives |
| `reddit.com/search/?q=affordability%20crisis%20college%20textbooks` | Textbook cost alternatives |
| `reddit.com/search/?q=student%20debt%20payment%20impact` | Student debt and loan impact |
| `reddit.com/search/?q=coffee%20shop%20economy%20college%20towns` | Coffee shop culture in college towns |

### Academics & career shifts

| URL/query | Target |
|---|---|
| `reddit.com/search/?q=college%20major%20changing%20trends%20AI%20era` | Major changes driven by AI |
| `reddit.com/search/?q=skills%20gap%20employers%20want%20college%20grads` | Skills gap and employability |
| `reddit.com/search/?q=internship%20market%20competitive` | Competitive internship market |
| `reddit.com/search/?q=trade%20school%20vs%20college%20debate` | Trade school vs. college |
| `reddit.com/search/?q=career%20fairs%20AI%20resume%20writing%20tools` | AI tools for career prep |
| `reddit.com/search/?q=college%20students%20gap%20year%20decisions` | Gap year decisions |
| `reddit.com/r/cscareerquestions/search/?q=college%20grad%20job%20market&restrict_sr=1` | CS/tech career pipeline |
| `reddit.com/r/premed/search/?q=premed%20burnout&restrict_sr=1` | Pre-med pressure |

### Mental health & wellness

| URL/query | Target |
|---|---|
| `reddit.com/search/?q=college%20mental%20health%20crisis%20burnout` | Mental health crisis on campus |
| `reddit.com/search/?q=gen%20z%20stress%20management%20wellness%20trends` | Gen Z wellness trends |
| `reddit.com/search/?q=therapy%20on%20campus%20accessibility%20barriers` | Campus therapy access |
| `reddit.com/search/?q=campus%20fitness%20trends%20gym%20culture` | Gym and fitness culture shift |
| `reddit.com/search/?q=sleep%20deprivation%20college%20all-nighters` | Sleep culture and all-nighters |
| `reddit.com/search/?q=mindfulness%20meditation%20college%20students` | Mindfulness adoption |

### Campus politics & activism

| URL/query | Target |
|---|---|
| `reddit.com/search/?q=college%20students%20protest%20activism` | Student activism and protests |
| `reddit.com/search/?q=diversity%20equity%20inclusion%20college%20campus` | DEI on campus |
| `reddit.com/search/?q=college%20free%20speech%20debate%20controversy` | Free speech debates |
| `reddit.com/search/?q=climate%20action%20college%20sustainability` | Campus sustainability initiatives |
| `reddit.com/search/?q=student%20organizing%20labor%20rights%20movement` | Student labor organizing |

### Tech & innovation on campus

| URL/query | Target |
|---|---|
| `reddit.com/search/?q=ai%20chatgpt%20college%20academic%20integrity` | AI cheating and academic integrity |
| `reddit.com/search/?q=college%20classrooms%20hybrid%20learning` | Hybrid learning continuation |
| `reddit.com/search/?q=campus%20technology%20infrastructure%20upgrades` | Campus tech upgrades |
| `reddit.com/search/?q=virtual%20reality%20education%20college` | VR in education |

### Social & community

| URL/query | Target |
|---|---|
| `reddit.com/search/?q=college%20friend%20groups%20gen%20z%20loneliness` | Gen Z loneliness epidemic |
| `reddit.com/search/?q=greek%20life%20hazing%20reform%20controversy` | Greek life and hazing reform |
| `reddit.com/search/?q=freshman%20orientation%20welcome%20week%20trends` | Orientation and welcome week |
| `reddit.com/search/?q=dating%20app%20usage%20college%20students` | College dating culture |
| `reddit.com/search/?q=club%20sports%20intramural%20participation` | Club sports and intramurals |
| `reddit.com/search/?q=campus%20event%20attendance%20post-pandemic` | Post-pandemic campus life rebound |
| `reddit.com/r/GradSchool/search/?q=grad%20school%20vs%20job&restrict_sr=1` | Grad school vs. job market |
| `reddit.com/r/StudentLoans/search/?q=student%20loan%20repayment&restrict_sr=1` | Student loan struggles |
| `reddit.com/r/FinancialAid/search/?q=financial%20aid%20fafsa&restrict_sr=1` | Financial aid and FAFSA |

### Evergreen queries (rotate daily)

| URL/query | Target |
|---|---|
| `reddit.com/search/?q=college%20students%20think%20about%20[hot%20topic]` | Student opinion on trending news |
| `reddit.com/search/?q=college%20major%20stereotypes` | Major stereotypes and humor |
| `reddit.com/search/?q=college%20vs%20high%20school%20differences%20reality` | College vs. high school reality check |
| `reddit.com/r/professors/search/?q=students%20today&restrict_sr=1` | Professor perspective on students |

Replace `[hot topic]` with the day's biggest trending news keyword.

For each usable Reddit signal, record the real post URL, title, visible date/freshness, visible engagement counts only, `student_quote_summary`, and `content_seed`.

## TikTok Collection

TikTok `/discover/` pages are not individual posts. Record only actual video URLs such as `tiktok.com/@user/video/...`.

**Pick 10 per run** from the pool below, spread across categories. Check `data/query-log.json` to avoid queries used in the last 7 days.

### Core

| URL | Target |
|---|---|
| `tiktok.com/search?q=college+student+2026` | General college student |
| `tiktok.com/search?q=campus+life` | Campus culture |
| `tiktok.com/search?q=dorm+room+college` | Dorm life |
| `tiktok.com/search?q=college+major+regret` | Major regret |
| `tiktok.com/search?q=college+move+in+2026` | Freshman move-in |
| `tiktok.com/search?q=college+tuition+rent+student` | Cost and rent |

### Lifestyle & aesthetics

| URL | Target |
|---|---|
| `tiktok.com/search?q=college+outfit+grwm` | College fashion and GRWM |
| `tiktok.com/search?q=college+apartment+interior+aesthetic` | Apartment/dorm aesthetics |
| `tiktok.com/search?q=college+glow+up+transformation` | Glow-up and transformation |
| `tiktok.com/search?q=broke+college+student+hacks` | Budget hacks and survival tips |
| `tiktok.com/search?q=college+cooking+meal+prep+budget` | Student cooking and meal prep |

### Money & hustle

| URL | Target |
|---|---|
| `tiktok.com/search?q=student+side+hustle+trends` | Side hustle culture |
| `tiktok.com/search?q=gen+z+thrifting+resale+college` | Thrifting and resale fashion |
| `tiktok.com/search?q=college+student+investing+money` | Student investing |
| `tiktok.com/search?q=student+discount+hacks+tips` | Discount strategies |

### Academics & career

| URL | Target |
|---|---|
| `tiktok.com/search?q=studytok+college+productivity` | Study tips and productivity |
| `tiktok.com/search?q=college+major+stereotypes` | Major stereotypes and humor |
| `tiktok.com/search?q=ai+chatgpt+college+cheating` | AI and academic integrity |
| `tiktok.com/search?q=internship+starter+pack+college` | Internship culture |
| `tiktok.com/search?q=trade+school+vs+college` | Trade school vs. college debate |

### Mental health & wellness

| URL | Target |
|---|---|
| `tiktok.com/search?q=college+burnout+mental+health` | Burnout and mental health |
| `tiktok.com/search?q=college+gym+fitness+culture` | Campus fitness trends |
| `tiktok.com/search?q=college+all+nighter+finals+week` | Finals and all-nighter culture |

### Social & community

| URL | Target |
|---|---|
| `tiktok.com/search?q=greek+life+rush+bid+day` | Greek life rush and bid day |
| `tiktok.com/search?q=college+party+nightlife` | Party and nightlife |
| `tiktok.com/search?q=college+dating+relationships` | College dating |
| `tiktok.com/search?q=professor+story+college+funny` | Professor and TA stories |
| `tiktok.com/search?q=freshman+orientation+welcome+week` | Orientation and welcome week |
| `tiktok.com/search?q=college+graduation+senior+year` | Graduation and senior year |
| `tiktok.com/search?q=college+loneliness+making+friends` | Loneliness and making friends |

### Campus politics & activism

| URL | Target |
|---|---|
| `tiktok.com/search?q=college+protest+activism+student` | Student activism |
| `tiktok.com/search?q=college+sustainability+climate` | Campus sustainability |

### Seasonal queries (run when timely)

| URL | Season | Target |
|---|---|---|
| `tiktok.com/search?q=back+to+school+college+move+in` | Sep | Move-in and back to school |
| `tiktok.com/search?q=halloween+college+party+costume` | Oct | Halloween costumes |
| `tiktok.com/search?q=thanksgiving+break+travel+college` | Nov | Thanksgiving travel |
| `tiktok.com/search?q=finals+week+stress+college+culture` | Dec | Finals week stress |
| `tiktok.com/search?q=new+year+resolution+college` | Jan | New year resolutions |
| `tiktok.com/search?q=valentine+day+dating+college` | Feb | Valentine's dating |
| `tiktok.com/search?q=spring+break+destinations+college+budget` | Mar | Spring break |
| `tiktok.com/search?q=graduation+cap+gown+photo+trends` | Apr | Graduation trends |
| `tiktok.com/search?q=summer+internship+starter+pack` | May | Summer internship |

### Hashtag reverse-search

When a hashtag is trending, search it directly to find the underlying story:
`#collegelife` `#collegestudent` `#campustiktok` `#dormtok` `#studytok` `#collegecheck`

Use TikTok as a trend and reaction source. Verify factual claims with stronger sources before ranking.

## College Rankings Content

Collect ranking-based content every day because rankings can produce debate, comparison, and share behavior when the criteria are specific.

Reference sites:

| Site | URL | Use |
|---|---|---|
| US News | `https://www.usnews.com/best-colleges/rankings` | Overall/submetric rankings and movement |
| Forbes | `https://www.forbes.com/search/?q=university` | University articles and nontraditional rankings |
| Princeton Review | `https://www.princetonreview.com/` | Thematic rankings such as happiness, party life, food |
| Niche | `https://www.niche.com/colleges/rankings/` | Student-life and campus-experience rankings |
| BLS / government datasets | `https://www.bls.gov/` | Employment and salary evidence |

Prioritize submetric comparisons, thematic rankings, recent rank changes, debate rankings, and practical rankings around cost, dorms, food, commute, city life, and international-student support.

## Search Tips

- **Reddit subs to mine directly**: r/college, r/ApplyingToCollege, r/professors, r/universityofreddit, r/GradSchool, r/premed, r/cscareerquestions, r/StudentLoans, r/FinancialAid
- **TikTok/Reels hashtag reverse-search**: Find trending hashtags like `#collegelife` `#collegestudent` `#campustiktok`, then ask "why is this trending?" to discover the underlying story.
- **X/Twitter raw opinions**: Search `from:college_* -filter:links` or `college students` filtered to recent for unfiltered student takes.
- **Evergreen template queries**: Replace the bracketed term with the day's trending news:
  - `college students think about [hot topic]`
  - `college reaction to [trending news]`
  - `college girls boys perspective on [topic]`
  - `what college students want [something]`
  - `college vs high school differences reality check`
