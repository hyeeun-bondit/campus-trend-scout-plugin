figma.showUI(__html__, { width: 460, height: 640 });

// === REUSABLE BUILDER LOGIC (everything until the PLUGIN UI BOOTSTRAP marker below) ===
// This section has no dependency on figma.showUI/ui messaging — it only uses the
// Figma Plugin API (`figma.*`). It is copy-pasted verbatim into use_figma MCP calls;
// see figma-plugin/references/use-figma-integration.md. Keep it self-contained.

const SLIDE_W = 1080;
const SLIDE_H = 1350;
const PAD_X = 72;
const PAD_TOP = 64;
const PAD_BOTTOM = 64;
const CONTENT_W = SLIDE_W - PAD_X * 2;

const COLORS = {
  purple: { r: 0x6b / 255, g: 0x4e / 255, b: 0xff / 255 },
  coverA: { r: 0x7c / 255, g: 0x5c / 255, b: 0xff / 255 },
  coverB: { r: 0x4e / 255, g: 0x2f / 255, b: 0xe0 / 255 },
  magenta: { r: 0xff / 255, g: 0x2d / 255, b: 0x78 / 255 },
  yellow: { r: 0xff / 255, g: 0xd2 / 255, b: 0x3f / 255 },
  mint: { r: 0x2e / 255, g: 0xff / 255, b: 0xc2 / 255 },
  cyan: { r: 0x3d / 255, g: 0xd9 / 255, b: 0xff / 255 },
  white: { r: 1, g: 1, b: 1 },
  black: { r: 0x11 / 255, g: 0x11 / 255, b: 0x11 / 255 },
  boardBg: { r: 0xed / 255, g: 0xed / 255, b: 0xf2 / 255 }
};

function highlightColor(name) {
  return COLORS[name] || COLORS.yellow;
}

const FONT_W400 = [{ family: "Inter", style: "Regular" }];
const FONT_W600 = [
  { family: "Inter", style: "SemiBold" },
  { family: "Inter", style: "Medium" },
  { family: "Inter", style: "Regular" }
];
const FONT_W700 = [
  { family: "Inter", style: "Bold" },
  { family: "Inter", style: "SemiBold" },
  { family: "Inter", style: "Regular" }
];
const FONT_W800 = [
  { family: "Inter", style: "Extra Bold" },
  { family: "Inter", style: "Black" },
  { family: "Inter", style: "Bold" }
];
const FONT_COVER_HEAVY = [
  { family: "SF Pro Rounded Heavy", style: "Regular" },
  { family: "SF Pro Rounded", style: "Heavy" }
].concat(FONT_W800);
const FONT_COVER_REGULAR = [
  { family: "SF Pro Rounded Regular", style: "Regular" },
  { family: "SF Pro Rounded", style: "Regular" }
].concat(FONT_W400);
const FONT_COVER_SEMIBOLD = [
  { family: "SF Pro Rounded Semibold", style: "Regular" },
  { family: "SF Pro Rounded", style: "SemiBold" }
].concat(FONT_W600);

const fontCache = new Map();

async function resolveFont(candidates) {
  const key = JSON.stringify(candidates);
  if (fontCache.has(key)) return fontCache.get(key);
  for (const font of candidates) {
    try {
      await figma.loadFontAsync(font);
      fontCache.set(key, font);
      return font;
    } catch (e) {
      // try next candidate
    }
  }
  const fallback = { family: "Inter", style: "Regular" };
  await figma.loadFontAsync(fallback);
  fontCache.set(key, fallback);
  return fallback;
}

async function createText(opts) {
  const t = figma.createText();
  t.name = opts.name || "text";
  const font = await resolveFont(opts.fontCandidates);
  t.fontName = font;
  t.fontSize = opts.size;
  t.textAlignHorizontal = opts.align || "LEFT";
  if (opts.lineHeightPercent) {
    t.lineHeight = { unit: "PERCENT", value: opts.lineHeightPercent };
  }
  if (opts.letterSpacing) {
    t.letterSpacing = { unit: "PIXELS", value: opts.letterSpacing };
  }
  const opacity = opts.opacity === undefined ? 1 : opts.opacity;
  t.fills = [{ type: "SOLID", color: opts.color || COLORS.white, opacity }];
  t.characters = opts.content || "";
  t.textAutoResize = "HEIGHT";
  if (opts.width) t.resize(opts.width, t.height);
  return t;
}

function place(node, x, y) {
  node.x = x;
  node.y = y;
  return node;
}

async function createTagPill(text) {
  const wrap = figma.createFrame();
  wrap.name = "tag-pill";
  wrap.layoutMode = "HORIZONTAL";
  wrap.primaryAxisSizingMode = "AUTO";
  wrap.counterAxisSizingMode = "AUTO";
  wrap.paddingTop = 10;
  wrap.paddingBottom = 10;
  wrap.paddingLeft = 26;
  wrap.paddingRight = 26;
  wrap.cornerRadius = 999;
  wrap.fills = [{ type: "SOLID", color: COLORS.white }];
  const label = await createText({
    name: "tag-pill-label",
    content: text || "",
    fontCandidates: FONT_W700,
    size: 20,
    color: COLORS.black
  });
  wrap.appendChild(label);
  return wrap;
}

async function createDonut(percent) {
  const size = 380;
  const pct = Math.max(0, Math.min(100, Number(percent) || 0));
  const group = [];

  const track = figma.createEllipse();
  track.name = "donut-track";
  track.resize(size, size);
  track.fills = [];
  track.strokes = [{ type: "SOLID", color: COLORS.white, opacity: 0.15 }];
  track.strokeWeight = 24;
  group.push(track);

  const progress = figma.createEllipse();
  progress.name = "donut-progress";
  progress.resize(size, size);
  progress.fills = [];
  progress.strokes = [{ type: "SOLID", color: COLORS.mint }];
  progress.strokeWeight = 24;
  progress.strokeCap = "ROUND";
  progress.arcData = {
    startingAngle: -Math.PI / 2,
    endingAngle: -Math.PI / 2 + (pct / 100) * 2 * Math.PI,
    innerRadius: 0
  };
  group.push(progress);

  const centerText = await createText({
    name: "donut-center",
    content: `${pct}%`,
    fontCandidates: FONT_W800,
    size: 72,
    color: COLORS.mint,
    align: "CENTER",
    width: size
  });

  const holder = figma.createFrame();
  holder.name = "donut-wrap";
  holder.resize(size, size);
  holder.fills = [];
  holder.clipsContent = false;
  group.forEach((n) => holder.appendChild(n));
  holder.appendChild(centerText);
  place(centerText, 0, (size - centerText.height) / 2);
  return holder;
}

async function createChipRow(items) {
  const row = figma.createFrame();
  row.name = "chip-row";
  row.layoutMode = "HORIZONTAL";
  row.itemSpacing = 20;
  row.primaryAxisSizingMode = "FIXED";
  row.counterAxisSizingMode = "AUTO";
  row.fills = [];
  row.resize(CONTENT_W, row.height);

  for (const item of items || []) {
    const chip = figma.createFrame();
    chip.name = "chip";
    chip.layoutMode = "VERTICAL";
    chip.primaryAxisSizingMode = "AUTO";
    chip.counterAxisSizingMode = "AUTO";
    chip.counterAxisAlignItems = "CENTER";
    chip.paddingTop = 36;
    chip.paddingBottom = 36;
    chip.paddingLeft = 20;
    chip.paddingRight = 20;
    chip.itemSpacing = 10;
    chip.cornerRadius = 24;
    chip.fills = [{ type: "SOLID", color: COLORS.white, opacity: 0.12 }];
    chip.layoutGrow = 1;

    const value = await createText({
      name: "chip-value",
      content: String(item.value || ""),
      fontCandidates: FONT_W800,
      size: 52,
      color: highlightColor(item.color),
      align: "CENTER"
    });
    const label = await createText({
      name: "chip-label",
      content: String(item.label || ""),
      fontCandidates: FONT_W400,
      size: 19,
      color: COLORS.white,
      opacity: 0.8,
      align: "CENTER"
    });
    chip.appendChild(value);
    chip.appendChild(label);
    row.appendChild(chip);
  }
  return row;
}

async function createTrend(points, callout) {
  const chartW = 520;
  const chartH = 200;
  const holder = figma.createFrame();
  holder.name = "trend-wrap";
  holder.layoutMode = "VERTICAL";
  holder.primaryAxisSizingMode = "AUTO";
  holder.counterAxisSizingMode = "FIXED";
  holder.counterAxisAlignItems = "CENTER";
  holder.itemSpacing = 8;
  holder.fills = [];
  holder.resize(chartW, holder.height);

  const pts = points && points.length ? points : [];
  const chartFrame = figma.createFrame();
  chartFrame.name = "trend-chart";
  chartFrame.resize(chartW, chartH);
  chartFrame.fills = [];
  chartFrame.clipsContent = false;

  if (pts.length > 1) {
    const values = pts.map((p) => Number(p.value) || 0);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const coords = pts.map((p, i) => {
      const x = (i / (pts.length - 1)) * chartW;
      const y = chartH - ((Number(p.value) - min) / range) * chartH;
      return { x, y };
    });

    for (let i = 0; i < coords.length - 1; i++) {
      const a = coords[i];
      const b = coords[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const seg = figma.createRectangle();
      seg.name = "trend-segment";
      seg.resize(Math.max(len, 1), 6);
      seg.cornerRadius = 3;
      seg.fills = [{ type: "SOLID", color: COLORS.cyan }];
      place(seg, a.x, a.y - 3);
      seg.rotation = -angle;
      chartFrame.appendChild(seg);
    }
    coords.forEach((c, i) => {
      const isLast = i === coords.length - 1;
      const r = isLast ? 9 : 3;
      const dot = figma.createEllipse();
      dot.name = "trend-point";
      dot.resize(r * 2, r * 2);
      dot.fills = [{ type: "SOLID", color: COLORS.cyan }];
      place(dot, c.x - r, c.y - r);
      chartFrame.appendChild(dot);
    });
  }
  holder.appendChild(chartFrame);

  if (pts.length) {
    const labelsRow = figma.createFrame();
    labelsRow.name = "trend-labels";
    labelsRow.layoutMode = "HORIZONTAL";
    labelsRow.primaryAxisSizingMode = "FIXED";
    labelsRow.counterAxisSizingMode = "AUTO";
    labelsRow.primaryAxisAlignItems = "SPACE_BETWEEN";
    labelsRow.fills = [];
    labelsRow.resize(chartW, labelsRow.height);
    for (const p of pts) {
      const lbl = await createText({
        name: "trend-label",
        content: String(p.label || ""),
        fontCandidates: FONT_W400,
        size: 18,
        color: COLORS.white,
        opacity: 0.6
      });
      labelsRow.appendChild(lbl);
    }
    holder.appendChild(labelsRow);
  }

  if (callout) {
    const calloutText = await createText({
      name: "trend-callout",
      content: callout,
      fontCandidates: FONT_W800,
      size: 32,
      color: COLORS.cyan,
      align: "CENTER",
      width: chartW
    });
    holder.appendChild(calloutText);
  }
  return holder;
}

async function createPhotoVsPhoto(leftLabel, rightLabel) {
  const wrap = figma.createFrame();
  wrap.name = "matchup";
  wrap.layoutMode = "HORIZONTAL";
  wrap.primaryAxisSizingMode = "FIXED";
  wrap.counterAxisSizingMode = "AUTO";
  wrap.itemSpacing = 16;
  wrap.counterAxisAlignItems = "CENTER";
  wrap.fills = [];
  wrap.resize(CONTENT_W, 480);
  wrap.clipsContent = false;

  async function photo(label) {
    const box = figma.createFrame();
    box.name = "photo";
    box.layoutMode = "VERTICAL";
    box.primaryAxisSizingMode = "FIXED";
    box.counterAxisSizingMode = "FIXED";
    box.primaryAxisAlignItems = "MAX";
    box.counterAxisAlignItems = "CENTER";
    box.paddingBottom = 20;
    box.cornerRadius = 20;
    box.fills = [{ type: "SOLID", color: COLORS.white, opacity: 0.15 }];
    box.layoutGrow = 1;
    box.resize(300, 400);

    const cap = figma.createFrame();
    cap.name = "cap";
    cap.layoutMode = "HORIZONTAL";
    cap.primaryAxisSizingMode = "AUTO";
    cap.counterAxisSizingMode = "AUTO";
    cap.paddingTop = 6;
    cap.paddingBottom = 6;
    cap.paddingLeft = 16;
    cap.paddingRight = 16;
    cap.cornerRadius = 999;
    cap.fills = [{ type: "SOLID", color: COLORS.black, opacity: 0.35 }];
    const capText = await createText({
      name: "cap-text",
      content: label || "",
      fontCandidates: FONT_W700,
      size: 22,
      color: COLORS.white
    });
    cap.appendChild(capText);
    box.appendChild(cap);
    return box;
  }

  wrap.appendChild(await photo(leftLabel));

  const badge = figma.createEllipse();
  badge.name = "vs-badge";
  badge.resize(72, 72);
  badge.fills = [{ type: "SOLID", color: COLORS.magenta }];
  badge.strokes = [{ type: "SOLID", color: COLORS.purple }];
  badge.strokeWeight = 6;

  wrap.appendChild(await photo(rightLabel));

  const badgeText = await createText({
    name: "vs-text",
    content: "VS",
    fontCandidates: FONT_W800,
    size: 24,
    color: COLORS.white,
    align: "CENTER",
    width: 72
  });

  const badgeHolder = figma.createFrame();
  badgeHolder.name = "vs-badge-holder";
  badgeHolder.resize(72, 72);
  badgeHolder.fills = [];
  badgeHolder.clipsContent = false;
  badgeHolder.appendChild(badge);
  place(badge, 0, 0);
  badgeHolder.appendChild(badgeText);
  place(badgeText, 0, (72 - badgeText.height) / 2);
  wrap.appendChild(badgeHolder);
  place(badgeHolder, CONTENT_W / 2 - 36, 480 / 2 - 36);

  return wrap;
}

async function buildVisual(visual) {
  if (!visual || !visual.type || visual.type === "none") return null;
  const data = visual.data || {};
  try {
    if (visual.type === "donut") return await createDonut(data.percent);
    if (visual.type === "chips") return await createChipRow(data.items);
    if (visual.type === "trend") return await createTrend(data.points, data.callout);
    if (visual.type === "photo_vs_photo")
      return await createPhotoVsPhoto(data.left_label, data.right_label);
  } catch (e) {
    figma.notify(`시각 요소 생성 실패 (${visual.type}): ${e.message || e}`, { error: true });
  }
  return null;
}

async function buildWordmark() {
  return createText({
    name: "wordmark",
    content: "IGOT N",
    fontCandidates: FONT_W800,
    size: 22,
    letterSpacing: 8,
    color: COLORS.white,
    align: "CENTER",
    width: CONTENT_W
  });
}

async function buildAccentLine() {
  const rect = figma.createRectangle();
  rect.name = "accent-line";
  rect.resize(8, SLIDE_H);
  rect.fills = [{ type: "SOLID", color: COLORS.magenta }];
  place(rect, 0, 0);
  return rect;
}

async function buildContentSlide(slide) {
  const frame = figma.createFrame();
  frame.name = `Slide ${slide.slide_number} — content`;
  frame.resize(SLIDE_W, SLIDE_H);
  frame.fills = [{ type: "SOLID", color: COLORS.purple }];
  frame.clipsContent = true;

  frame.appendChild(await buildAccentLine());

  let cursor = PAD_TOP;

  const wordmark = await buildWordmark();
  frame.appendChild(wordmark);
  place(wordmark, PAD_X, cursor);
  cursor += wordmark.height + 28;

  if (slide.tag) {
    const pill = await createTagPill(slide.tag);
    frame.appendChild(pill);
    place(pill, PAD_X, cursor);
    cursor += pill.height + 36;
  }

  if (slide.headline) {
    const headline = await createText({
      name: "headline",
      content: slide.headline,
      fontCandidates: FONT_W800,
      size: 56,
      lineHeightPercent: 125,
      color: COLORS.white,
      width: CONTENT_W
    });
    if (slide.headline_highlight && slide.headline.includes(slide.headline_highlight)) {
      const start = slide.headline.indexOf(slide.headline_highlight);
      const end = start + slide.headline_highlight.length;
      headline.setRangeFills(start, end, [
        { type: "SOLID", color: highlightColor(slide.headline_highlight_color) }
      ]);
    }
    frame.appendChild(headline);
    place(headline, PAD_X, cursor);
    cursor += headline.height + 28;
  }

  if (slide.body_bullets && slide.body_bullets.length) {
    for (let i = 0; i < slide.body_bullets.length; i++) {
      const bulletText = slide.body_bullets[i];
      const dash = await createText({
        name: "bullet-dash",
        content: "—",
        fontCandidates: FONT_W400,
        size: 28,
        color: COLORS.white,
        opacity: 0.55
      });
      const text = await createText({
        name: "bullet-text",
        content: bulletText,
        fontCandidates: FONT_W400,
        size: 28,
        lineHeightPercent: 150,
        color: COLORS.white,
        opacity: 0.92,
        width: CONTENT_W - 32
      });
      frame.appendChild(dash);
      frame.appendChild(text);
      place(dash, PAD_X, cursor);
      place(text, PAD_X + 32, cursor);
      cursor += text.height + (i === slide.body_bullets.length - 1 ? 0 : 14);
    }
    cursor += 24;
  }

  const visualAreaTop = cursor;
  const visualAreaBottom = SLIDE_H - PAD_BOTTOM;
  const visual = await buildVisual(slide.visual);
  if (visual) {
    frame.appendChild(visual);
    const bandH = Math.max(visualAreaBottom - visualAreaTop, 0);
    place(
      visual,
      PAD_X + (CONTENT_W - visual.width) / 2,
      visualAreaTop + Math.max((bandH - visual.height) / 2, 0)
    );
  }

  if (slide.source) {
    const source = await createText({
      name: "source-tag",
      content: `Source: ${slide.source}`,
      fontCandidates: FONT_W400,
      size: 16,
      color: COLORS.white,
      opacity: 0.35,
      width: CONTENT_W
    });
    frame.appendChild(source);
    place(source, PAD_X, SLIDE_H - 28 - source.height);
  }

  return frame;
}

async function buildCoverSlide(slide) {
  const frame = figma.createFrame();
  frame.name = `Slide ${slide.slide_number} — cover`;
  frame.resize(SLIDE_W, SLIDE_H);
  frame.fills = [
    {
      type: "GRADIENT_LINEAR",
      gradientStops: [
        { position: 0, color: { ...COLORS.coverA, a: 1 } },
        { position: 1, color: { ...COLORS.coverB, a: 1 } }
      ],
      gradientTransform: [
        [0.7071, 0.7071, 0],
        [-0.7071, 0.7071, 0.5]
      ]
    }
  ];
  frame.clipsContent = true;

  frame.appendChild(await buildAccentLine());

  const wordmark = await buildWordmark();
  frame.appendChild(wordmark);
  place(wordmark, PAD_X, PAD_TOP);

  const eyebrowText = (slide.cover_eyebrow || "").toUpperCase();
  const eyebrow = eyebrowText
    ? await createText({
        name: "cover-eyebrow",
        content: eyebrowText,
        fontCandidates: FONT_W700,
        size: 20,
        letterSpacing: 2,
        color: COLORS.white,
        opacity: 0.75,
        width: CONTENT_W
      })
    : null;

  const title = await createText({
    name: "cover-title",
    content: slide.cover_title || "",
    fontCandidates: FONT_COVER_HEAVY,
    size: 110,
    lineHeightPercent: 115,
    color: COLORS.white,
    width: CONTENT_W
  });
  if (slide.cover_boxed_word && slide.cover_title && slide.cover_title.includes(slide.cover_boxed_word)) {
    const start = slide.cover_title.indexOf(slide.cover_boxed_word);
    const end = start + slide.cover_boxed_word.length;
    title.setRangeFills(start, end, [{ type: "SOLID", color: COLORS.yellow }]);
  }

  const subcopy = slide.cover_subcopy
    ? await createText({
        name: "cover-subcopy",
        content: slide.cover_subcopy,
        fontCandidates: FONT_COVER_REGULAR,
        size: 45,
        lineHeightPercent: 130,
        color: COLORS.white,
        opacity: 0.9,
        width: CONTENT_W
      })
    : null;

  const cta = await createText({
    name: "swipe-cue",
    content: slide.cta || "Swipe → ",
    fontCandidates: FONT_COVER_SEMIBOLD,
    size: 42,
    color: COLORS.white,
    opacity: 0.9
  });

  let y = SLIDE_H - PAD_BOTTOM - cta.height;
  frame.appendChild(cta);
  place(cta, PAD_X, y);

  if (subcopy) {
    y -= 30 + subcopy.height;
    frame.appendChild(subcopy);
    place(subcopy, PAD_X, y);
  }

  y -= 30 + title.height;
  frame.appendChild(title);
  place(title, PAD_X, y);

  if (eyebrow) {
    y -= 20 + eyebrow.height;
    frame.appendChild(eyebrow);
    place(eyebrow, PAD_X, y);
  }

  return frame;
}

async function buildDiscussionSlide(slide) {
  const padX = 96;
  const padTop = 120;
  const contentW = SLIDE_W - padX * 2;
  const frame = figma.createFrame();
  frame.name = `Slide ${slide.slide_number} — discussion`;
  frame.resize(SLIDE_W, SLIDE_H);
  frame.fills = [{ type: "SOLID", color: COLORS.purple }];
  frame.clipsContent = true;

  frame.appendChild(await buildAccentLine());

  const emoji = await createText({
    name: "emoji",
    content: slide.emoji || "💬",
    fontCandidates: FONT_W400,
    size: 100,
    align: "CENTER",
    width: contentW
  });
  const question = await createText({
    name: "question",
    content: slide.headline || "",
    fontCandidates: FONT_W800,
    size: 44,
    lineHeightPercent: 135,
    color: COLORS.white,
    align: "CENTER",
    width: contentW
  });

  const blockH = emoji.height + 32 + question.height;
  const availH = SLIDE_H - padTop * 2;
  const startY = padTop + Math.max((availH - blockH) / 2, 0);

  frame.appendChild(emoji);
  place(emoji, padX, startY);
  frame.appendChild(question);
  place(question, padX, startY + emoji.height + 32);

  return frame;
}

async function buildSlide(slide) {
  if (slide.type === "cover") return buildCoverSlide(slide);
  if (slide.type === "discussion") return buildDiscussionSlide(slide);
  return buildContentSlide(slide);
}

async function buildBoard(topic) {
  const board = figma.createFrame();
  const title =
    topic.selected_title ||
    (topic.title_options && topic.title_options[0] && topic.title_options[0].title) ||
    topic.topic_id;
  board.name = `${topic.topic_id || "topic"} — ${title || ""}`;
  board.layoutMode = "VERTICAL";
  board.primaryAxisSizingMode = "AUTO";
  board.counterAxisSizingMode = "AUTO";
  board.itemSpacing = 24;
  board.paddingTop = 40;
  board.paddingBottom = 40;
  board.paddingLeft = 40;
  board.paddingRight = 40;
  board.fills = [{ type: "SOLID", color: COLORS.boardBg }];

  const heading = await createText({
    name: "board-title",
    content: `${topic.topic_id || ""} — ${title || ""}`,
    fontCandidates: FONT_W700,
    size: 24,
    color: COLORS.black
  });
  board.appendChild(heading);

  const row = figma.createFrame();
  row.name = "slides-row";
  row.layoutMode = "HORIZONTAL";
  row.itemSpacing = 80;
  row.primaryAxisSizingMode = "AUTO";
  row.counterAxisSizingMode = "AUTO";
  row.fills = [];

  const slides = topic.slide_structure || [];
  for (const slide of slides) {
    try {
      const slideFrame = await buildSlide(slide);
      row.appendChild(slideFrame);
    } catch (e) {
      figma.notify(
        `슬라이드 ${slide.slide_number} 생성 실패: ${e.message || e}`,
        { error: true }
      );
    }
  }
  board.appendChild(row);
  return board;
}

function normalizeTopics(data) {
  if (Array.isArray(data)) return data;
  if (data.topics) return data.topics;
  if (data.slide_structure) return [data];
  throw new Error("인식할 수 없는 JSON 구조입니다 (topics 배열 또는 slide_structure가 필요)");
}

async function importCardNews(data) {
  const topics = normalizeTopics(data);
  if (!topics.length) throw new Error("가져올 토픽이 없습니다");

  let startY = 0;
  for (const node of figma.currentPage.children) {
    const bottom = node.y + node.height;
    if (bottom > startY) startY = bottom;
  }
  if (startY > 0) startY += 200;

  const created = [];
  let cursorY = startY;
  for (const topic of topics) {
    const board = await buildBoard(topic);
    figma.currentPage.appendChild(board);
    place(board, 0, cursorY);
    cursorY += board.height + 160;
    created.push(board);
  }

  figma.viewport.scrollAndZoomIntoView(created);
  figma.notify(`✅ 카드뉴스 ${topics.length}개 토픽을 Figma 레이어로 가져왔습니다`);
  return created.map((board) => ({
    boardId: board.id,
    name: board.name,
    x: board.x,
    y: board.y,
    width: board.width,
    height: board.height
  }));
}

// === PLUGIN UI BOOTSTRAP (stop copying here for use_figma calls) ===

figma.ui.onmessage = async (msg) => {
  if (msg.type === "import") {
    try {
      const data = JSON.parse(msg.json);
      await importCardNews(data);
      figma.ui.postMessage({ type: "done" });
    } catch (err) {
      figma.ui.postMessage({ type: "error", message: (err && err.message) || String(err) });
    }
  }
  if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
