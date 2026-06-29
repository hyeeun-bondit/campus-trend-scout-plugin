# Output Contract Reference

Use this reference before saving ranked topics, card-news briefs, selected-topic drafts, or daily reports.

## Ranking Content Analysis

When the MCP schema allows, each ranked topic should include `content_analysis`:

```json
{
  "topic_summary": "Student-facing 2-sentence summary",
  "hook_points": ["At least 3 first-slide or first-second hooks"],
  "selection_points": ["At least 3 reasons this is worth selecting today"],
  "content_direction": "carousel / reels / post / story recommendation and why",
  "igotin_fit": "Connection to IGOTIN performance patterns and app behavior",
  "audience_segment": ["Class of 2030", "international students", "Greek life"],
  "share_reason": "Why a student would send this to someone",
  "comment_prompt": "Question likely to generate comments",
  "save_reason": "Why someone would save it, if applicable",
  "visual_idea": "First slide or thumbnail idea",
  "slide_outline": ["5-7 slide structure for production topics"],
  "headline_candidates": ["At least 3 title options"],
  "cta": "IGOTIN app/community action",
  "risk_note": "Verification, sensitivity, or framing risk"
}
```

Rank 1-5 should also include a `production_brief` when possible:

```json
{
  "recommended_format": "carousel | reels | post | story",
  "priority_reason": "Production-priority rationale",
  "opening_hook": "First-screen copy",
  "angle_type": "unexpected_culture | identity_belonging | cost_anxiety | school_specific_utility | debate_ranking | freshman_transition | career_ai | international_student | city_life",
  "asset_needs": ["ranking table", "map", "campus photo", "comment-summary screenshot"],
  "do_not_make_it_about": ["Frames or claims to avoid"]
}
```

If the MCP schema does not support these exact fields, preserve the same information in the closest available notes, rationale, brief, or report fields.

## Report Requirements

The final report must be in English and production-ready for card-news planning.

Required sections:

- `# Daily US & Canada Campus Trend Brief`
- `## Today's Overall Theme`
- `## Recommended Production Priority`
- `## Top Topics`
- `## Content Opportunity Matrix`
- `## Top 5 Card News Drafts`
- `## Reddit & Community Signals`
- `## College Rankings Content`
- `## Topics to Monitor`
- `## Topics to Avoid`
- `## Source Notes`
- `## Risk Notes`

Every ranked topic source URL and monitoring source URL must appear verbatim in the report body. If the save call rejects the report because URLs are missing, repair the report and retry the same stage before continuing.

## Top Topic Mini Block

For each Top Topic, include `Topic Summary`, `Hook Points`, `Selection Points`, `Content Direction`, `Why It Fits IGOTIN`, `Suggested Slides`, `Comment/Share Trigger`, and `Sources`.

## Selected Topic Card-News Draft

When the user chooses one topic from the saved trend output, create the final English card-news draft through `save_selected_topic_cardnews`, then read it back with `read_cardnews_briefs`.

Use the marketing team's article-to-card prompt as the content contract:

- Explain what the linked article/source covers in `article_summary`.
- Reference `college_marketing_points`: student relevance, campus-life hook, decision/usefulness angle, and how that point should affect copy.
- Recommend multiple first-slide options in `first_slide_options`; each option must include `title` and `one_line_summary`.
- Recommend multiple `discussion_questions` for comments or editorial choice.
- Provide at least 3 `title_options`.
- Every slide in `slide_structure` must include `fixed_layout.top_tag`, `fixed_layout.headline`, and `fixed_layout.body`.
- Keep all visible slide copy in English.
- Preserve source discipline: factual claims in the draft must be tied to opened source URLs or saved source ids in `source_note` / `editor_notes.source_ids_used`.

Fixed layout reference:

```text
Top tag:
Headline:
Body:
```

## Final Checklist

- [ ] `campus_trend_scout.list_saved_dates` was checked before writing.
- [ ] Relevant reference files were loaded for the stage.
- [ ] Every source is a real URL that was opened or otherwise directly observed through an allowed public route.
- [ ] No URL, date, engagement number, percentage, ranking, or observed figure was invented.
- [ ] Source coverage targets were met or shortfalls were disclosed.
- [ ] Only topics passing the contentization and selection filters were ranked as clean recommendations.
- [ ] Every ranked topic has `selection_rubric` filled.
- [ ] Every production topic has hook points, selection points, slide outline, headline candidates, and risk notes.
- [ ] Topics below 28 points or with `evidence_availability <= 2` are marked `needs_verification: true`.
- [ ] Non-AI topics were added after Top 10 according to the AI diversity rule.
- [ ] Sensitive or high-risk topics do not use `produce_today` or meme tone.
- [ ] The report body includes every ranked and monitoring source URL.
- [ ] Each save stage was verified with the matching read tool.
