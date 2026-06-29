# Topic Selection Reference

Use this reference before ranking. Judge topics by whether US/Canadian college students would want to see, share, save, or comment on the card-news post.

## Immediate Exclusions

Exclude without scoring:

- Generic major introductions, generic scholarship notices, GPA management tips, and common study advice.
- Obvious "Top 10 Best Universities" style university rankings.
- Press-release-level summaries of official announcements.
- Policy or law news not connected to student life.
- Incidents too heavy or sensitive for card-news treatment.
- Topics based only on weak personal anecdotes.
- Old events framed as current.
- General social news not directly connected to college students.

## Contentization Test

Each candidate must answer at least 3 of these 6 questions. If not, do not rank it.

1. Is there a strong first-slide or first-second hook?
2. Is there a concrete reason to send it to a friend, roommate, classmate, same-major peer, or same-school peer?
3. Does it invite comments such as "my school is different" or "I disagree"?
4. Is there a save reason such as a checklist, number, comparison table, map, or cost calculation?
5. Can it call out a specific audience segment?
6. Can it connect naturally to an IGOTIN action such as school groups, class groups, roommate/community discovery, or student discussion?

## Structural Fit

Exclude topics with fewer than 2 of these 6 conditions:

1. Information asymmetry: real data or statistics that most students may not know but would find surprising.
2. Target specificity: clearly addresses a situation such as CS majors, dorm freshmen, job seekers, transfers, or international students.
3. Comparison structure: varies by school, major, year, region, city, or student type.
4. Experience spread: invites different personal experiences rather than one obvious answer.
5. Decision connection: links to choices students face soon, such as graduation, major change, jobs, internships, housing, loans, applications, or school choice.
6. Surprise: creates a "wait, is that real?" reaction through culture, cost, rule, course, ranking, or lifestyle evidence.

## Selection Rubric

Score each ranked topic from 0-5 on every field, for 40 total points:

| # | Field | Question |
|---|---|---|
| 1 | `self_relevance` | Does it connect to major, school, tuition, jobs, dorms, relationships, apps/AI use, side hustles, or international student life? |
| 2 | `comparison_potential` | Can it become a school/major/region/year/domestic-vs-international comparison? |
| 3 | `decision_usefulness` | Does it help with a real decision about majors, schools, apps, side hustles, jobs, housing, living costs, or loans? |
| 4 | `share_trigger` | Is there a concrete reason to send it to a friend, roommate, classmate, or same-major/same-school peer? |
| 5 | `comment_trigger` | Does it invite comments like "my school is different" or "I disagree"? |
| 6 | `format_strength` | Can it become Top 10, Before/After, Myth vs Reality, School/Major Comparison, Red Flag List, Checklist, Cost Breakdown, This or That, or Pros/Cons? |
| 7 | `freshness` | Does it connect to recent news, reports, SNS trends, policy change, hiring market change, campus seasonality, or AI tool change? |
| 8 | `evidence_availability` | Is it supported by data, articles, reports, surveys, official statistics, university material, or directly observed public student reaction? |

Decision rule:

- Total score 28+ -> clean recommended topic eligible for ranking.
- Total score below 28 or `evidence_availability <= 2` -> mark `needs_verification: true` and separate into a verification/monitoring list.

## Ranked Topic Requirements

Each ranked topic should include a title, student-facing 2-sentence summary, source URLs, 3+ hook points, 3+ selection points, 3+ headline candidates, 5-7 slide structure for production topics, comment prompt, share/save reason, recommended format, IGOTIN fit, CTA, risk note, and rubric score table.

## Operational Rules

1. No topic can be ranked without a real opened or directly observed source URL.
2. If a topic has only one weak source and low confidence/evidence quality, `total_score` must not exceed 69.
3. High-risk or excluded topics cannot receive `editor_decision: produce_today`.
4. High-risk topics include individual privacy, unverified rumors, defamation risk, sexual assault, suicide, discrimination, violence, and other sensitive incidents.
5. Reframe sensitive incidents as structural issues when appropriate.
6. Do not use meme tone for sensitive topics.
7. Generic admissions updates, broad university rankings, broad freshman tips, or single-source major-regret anecdotes should have `content_potential <= 9` unless reframed into a specific school/cost/debate/checklist angle.
8. Rank 1-5 must be production-ready with hook points, selection points, slide outline, headline candidates, and production brief.
