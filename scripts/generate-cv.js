const PDFDocument = require("pdfkit");
const fs = require("fs");
const career = require("../src/_data/career");
const opensource = require("../src/_data/opensource");
const variants = require("../src/_data/cv");

// ── Layout constants ──────────────────────────────────
const MARGIN = 50;
const WIDTH = 595.28 - MARGIN * 2;
const GRAY = "#444";
const LIGHT = "#888";
const ACCENT = "#222";
const BREAK = 690;
const PAGE_HEIGHT = 841.89;
const PAGE_BOTTOM = PAGE_HEIGHT - MARGIN;

const CONTACT = {
  name: "Paulo Henrique Cuchi",
  email: "paulo@cuchi.me",
  website: "cuchi.me",
  github: "github.com/cuchi",
  linkedin: "linkedin.com/in/pcuchi",
};

const SECTION_TITLES = {
  summary: { en: "Summary", pt: "Resumo" },
  skills: { en: "Skills & Technologies", pt: "Habilidades e Tecnologias" },
  opensource: { en: "Open Source", pt: "Open Source" },
  experience: { en: "Experience", pt: "Experiência" },
  writing: { en: "Selected Writing", pt: "Textos Selecionados" },
  education: { en: "Education", pt: "Formação" },
};

// ── Helpers ───────────────────────────────────────────
function sectionHeader(doc, text, y) {
  doc.font("Helvetica-Bold").fontSize(11).fillColor(ACCENT)
    .text(text, MARGIN, y);
  const h = doc.heightOfString(text, { width: WIDTH }) + 2;
  doc.moveTo(MARGIN, y + h + 2).lineTo(MARGIN + WIDTH, y + h + 2)
    .lineWidth(0.5).strokeColor("#CCC").stroke();
  return y + h + 10;
}

function shortUrl(url) {
  return String(url).replace(/^https?:\/\//, "");
}

function bulletList(doc, items, x, y, width) {
  let cy = y;
  doc.font("Helvetica").fontSize(9.5).fillColor(GRAY);
  for (const item of items) {
    doc.text(`  •  ${item}`, x, cy, { width, lineGap: 2 });
    cy += doc.heightOfString(item, { width: width - 14 }) + 4;
  }
  return cy;
}

/**
 * Move to a fresh page when `height` would overflow the bottom margin.
 *
 * Every renderer positions text with an explicit y, so pdfkit's implicit page
 * breaks cannot recover our cursor — a block that overflows would place each
 * following line on a page of its own. Blocks must be measured and moved as a
 * whole instead.
 */
function fitBlock(doc, y, height) {
  if (y + height > PAGE_BOTTOM) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

/** A bold heading with a light meta suffix, followed by a wrapped paragraph. */
function titledEntry(doc, heading, meta, text, y) {
  doc.font("Helvetica-Bold").fontSize(9.5).fillColor(ACCENT)
    .text(heading, MARGIN, y, { continued: true });
  doc.font("Helvetica").fontSize(8.5).fillColor(LIGHT)
    .text(`  —  ${meta}`, { continued: false });
  y += 12.5;
  doc.font("Helvetica").fontSize(9.5).fillColor(GRAY)
    .text(text, MARGIN + 10, y, { width: WIDTH - 10, lineGap: 2 });
  return y + doc.heightOfString(text, { width: WIDTH - 10 }) + 7;
}

// ── Sections ──────────────────────────────────────────
// Each renderer takes the current cursor position and returns the next one.

function renderSummary(doc, y, ctx) {
  const text = ctx.variant.summary[ctx.locale];
  y = sectionHeader(doc, SECTION_TITLES.summary[ctx.locale], y);
  doc.font("Helvetica").fontSize(9.5).fillColor(GRAY)
    .text(text, MARGIN, y, { width: WIDTH, lineGap: 3 });
  return y + doc.heightOfString(text, { width: WIDTH }) + 14;
}

function renderSkills(doc, y, ctx) {
  const rows = ctx.variant.skills[ctx.locale];
  const labelWidth = 84;
  const valueWidth = WIDTH - labelWidth;
  const join = (row) => row.items.join("  ·  ");

  // Measure with the same font the values are drawn in.
  doc.font("Helvetica").fontSize(9.5);
  const height = 25 + rows.reduce(
    (sum, row) => sum + doc.heightOfString(join(row), { width: valueWidth }) + 5, 0);

  y = fitBlock(doc, y, height);
  y = sectionHeader(doc, SECTION_TITLES.skills[ctx.locale], y);

  for (const row of rows) {
    const value = join(row);
    doc.font("Helvetica-Bold").fontSize(8).fillColor(LIGHT)
      .text(row.label, MARGIN, y, { width: labelWidth - 8 });
    doc.font("Helvetica").fontSize(9.5).fillColor(GRAY)
      .text(value, MARGIN + labelWidth, y, { width: valueWidth, lineGap: 2 });
    y += doc.heightOfString(value, { width: valueWidth }) + 5;
  }
  return y + 6;
}

function renderOpenSource(doc, y, ctx) {
  const { locale, usePt, ossText, variant } = ctx;
  const limits = variant.openSource || {};
  const contributions = limits.maxContributions
    ? opensource.contributions.slice(0, limits.maxContributions)
    : opensource.contributions;
  const projects = limits.maxProjects
    ? opensource.projects.slice(0, limits.maxProjects)
    : opensource.projects;

  y = sectionHeader(doc, SECTION_TITLES.opensource[locale], y);

  const group = (label, items, headingOf, metaOf) => {
    if (y > BREAK) { doc.addPage(); y = MARGIN; }
    doc.font("Helvetica-Oblique").fontSize(8.5).fillColor(LIGHT)
      .text(label, MARGIN, y);
    y += 13;
    for (const item of items) {
      if (y > BREAK) { doc.addPage(); y = MARGIN; }
      y = titledEntry(doc, headingOf(item), metaOf(item), ossText(item), y);
    }
  };

  group(
    usePt
      ? "Mudanças mescladas em projetos mantidos por outras pessoas"
      : "Changes merged upstream into projects maintained by others",
    contributions,
    (c) => c.project,
    (c) => `${c.lang}  ·  ${shortUrl(c.url)}`
  );

  group(
    usePt ? "Repositórios próprios que eu mantenho" : "Repositories I own and maintain",
    projects,
    (p) => p.name,
    (p) => [p.lang, usePt && p.notePt ? p.notePt : p.note, shortUrl(p.url)].filter(Boolean).join("  ·  ")
  );

  return y + 2;
}

function renderExperience(doc, y, ctx) {
  const jobs = ctx.workExperience;

  doc.font("Helvetica").fontSize(9.5);
  const heights = jobs.map((job) => {
    const bullets = (job.activities || [])
      .reduce((h, item) => h + doc.heightOfString(item, { width: WIDTH - 14 }) + 4, 0);
    return 13 + 13 + bullets + 6;
  });

  // Keep the section header with its first entry instead of orphaning it.
  y = fitBlock(doc, y, 25 + (heights[0] || 0));
  y = sectionHeader(doc, SECTION_TITLES.experience[ctx.locale], y);

  jobs.forEach((job, i) => {
    if (i > 0) y = fitBlock(doc, y, heights[i]);
    doc.font("Helvetica-Bold").fontSize(10).fillColor(ACCENT)
      .text(job.title, MARGIN, y, { continued: true });
    doc.font("Helvetica").fontSize(10).fillColor(GRAY)
      .text(`  —  ${job.where}`, { continued: false });
    y += 13;
    doc.font("Helvetica").fontSize(9).fillColor(LIGHT)
      .text(`${job.displayBegin} – ${job.displayEnd}  ·  ${job.duration}`, MARGIN, y);
    y += 13;
    if (job.activities) y = bulletList(doc, job.activities, MARGIN, y, WIDTH);
    y += 6;
  });
  return y;
}

function renderWriting(doc, y, ctx) {
  y = sectionHeader(doc, SECTION_TITLES.writing[ctx.locale], y);
  for (const post of ctx.variant.writing) {
    if (y > BREAK) { doc.addPage(); y = MARGIN; }
    const url = ctx.usePt && post.urlPt ? post.urlPt : post.url;
    y = titledEntry(doc, post.title[ctx.locale], shortUrl(url), post.description[ctx.locale], y);
  }
  return y + 2;
}

function renderEducation(doc, y, ctx) {
  const excluded = ctx.variant.excludeEducation || [];
  const entries = ctx.education.filter((e) => !excluded.includes(e.title));
  if (!entries.length) return y;

  if (y > 680) { doc.addPage(); y = MARGIN; }
  y = sectionHeader(doc, SECTION_TITLES.education[ctx.locale], y);
  for (const edu of entries) {
    doc.font("Helvetica-Bold").fontSize(10).fillColor(ACCENT)
      .text(edu.displayTitle, MARGIN, y, { continued: true });
    doc.font("Helvetica").fontSize(10).fillColor(GRAY)
      .text(`  —  ${edu.where}`, { continued: false });
    y += 13;
    doc.font("Helvetica").fontSize(9).fillColor(LIGHT)
      .text(`${edu.displayBegin} – ${edu.displayEnd}`, MARGIN, y);
    y += 18;
  }
  return y;
}

const RENDERERS = {
  summary: renderSummary,
  skills: renderSkills,
  opensource: renderOpenSource,
  experience: renderExperience,
  writing: renderWriting,
  education: renderEducation,
};

// ── Generate ──────────────────────────────────────────
function generate(variantKey, locale, outPath) {
  const variant = variants[variantKey];
  if (!variant) throw new Error(`Unknown CV variant: ${variantKey}`);
  const usePt = locale === "pt";

  const workExperience = career
    .filter((e) => e.type === "Full-time job" || e.type === "Scholarship")
    .map((e) => ({
      ...e,
      title: usePt && e.titlePt ? e.titlePt : e.title,
      activities: usePt && e.activitiesPt ? e.activitiesPt : e.activities,
    }));

  const education = career
    .filter((e) =>
      e.type === "Technology Degree" ||
      e.type === "Bachelor's Degree" ||
      e.type === "Technical Degree")
    .map((e) => ({ ...e, displayTitle: usePt && e.titlePt ? e.titlePt : e.title }));

  const ctx = {
    variant,
    locale,
    usePt,
    workExperience,
    education,
    ossText: (item) => (usePt && item.descriptionPt ? item.descriptionPt : item.description),
  };

  // ── Generate PDF ────────────────────────────────────
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
    bufferPages: true,
  });

  const out = fs.createWriteStream(outPath);
  doc.pipe(out);

  let y = MARGIN;

  // Header
  doc.font("Helvetica-Bold").fontSize(22).fillColor(ACCENT).text(CONTACT.name, MARGIN, y);
  y += 26;
  doc.font("Helvetica").fontSize(11).fillColor(LIGHT).text(variant.title[locale], MARGIN, y);
  y += 18;
  doc.font("Helvetica").fontSize(9).fillColor(GRAY);
  doc.text(
    `${CONTACT.email}  |  ${CONTACT.website}  |  ${CONTACT.github}  |  ${CONTACT.linkedin}`,
    MARGIN, y, { width: WIDTH }
  );
  y += 13;
  if (variant.location) {
    doc.font("Helvetica").fontSize(9).fillColor(GRAY)
      .text(`${variant.location[locale]}  ·  ${variant.spokenLanguages[locale]}`, MARGIN, y, { width: WIDTH });
    y += 13;
  }
  y += 9;

  for (const section of variant.order) {
    y = RENDERERS[section](doc, y, ctx);
  }

  doc.end();
  out.on("finish", () => console.log(`CV (${variantKey}/${locale}) → ${outPath}`));
}

// ── Run ────────────────────────────────────────────────
// `general` keeps the original filenames because the site links to them.
generate("general", "en", "public/Paulo-Henrique-Cuchi.pdf");
generate("general", "pt", "public/Paulo-Henrique-Cuchi-pt.pdf");
generate("oss", "en", "public/Paulo-Henrique-Cuchi-oss.pdf");
generate("oss", "pt", "public/Paulo-Henrique-Cuchi-oss-pt.pdf");
