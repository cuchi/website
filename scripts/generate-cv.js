const PDFDocument = require("pdfkit");
const fs = require("fs");
const career = require("../src/_data/career");
const i18n = require("../src/_data/i18n");

// ── Layout constants ──────────────────────────────────
const MARGIN = 50;
const WIDTH = 595.28 - MARGIN * 2;
const GRAY = "#444";
const LIGHT = "#888";
const ACCENT = "#222";

// ── Helpers ───────────────────────────────────────────
function sectionHeader(doc, text, y) {
  doc.font("Helvetica-Bold").fontSize(11).fillColor(ACCENT)
    .text(text, MARGIN, y);
  const h = doc.heightOfString(text, { width: WIDTH }) + 2;
  doc.moveTo(MARGIN, y + h + 2).lineTo(MARGIN + WIDTH, y + h + 2)
    .lineWidth(0.5).strokeColor("#CCC").stroke();
  return y + h + 10;
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

function generate(locale, outPath) {
  const t = i18n[locale];
  const usePt = locale === "pt";

  const name = "Paulo Henrique Cuchi";
  const title = "Software Engineer";
  const email = "paulo@cuchi.me";
  const website = "cuchi.me";
  const github = "github.com/cuchi";
  const linkedin = "linkedin.com/in/pcuchi";

  const summary = usePt
    ? "Engenheiro de software com mais de 10 anos de experiência em desenvolvimento web backend, liderança técnica e DevOps. Apaixonado por construir sistemas confiáveis e de fácil manutenção usando as melhores ferramentas para cada desafio. Experiência com Ruby on Rails, Node.js, TypeScript, Rust, Go e infraestrutura em nuvem (AWS, Kubernetes)."
    : "Software engineer with 10+ years of experience in backend web development, technical leadership, and DevOps. Passionate about building reliable, maintainable systems using the best tools for the job. Experienced with Ruby on Rails, Node.js, TypeScript, Rust, Go, and cloud infrastructure (AWS, Kubernetes).";

  const skills = usePt
    ? ["Desenvolvimento web backend", "Liderança técnica e mentoria", "Cultura, processos e ferramentas DevOps", "Ferramentas e sistemas Unix", "Infraestrutura em nuvem (AWS, Kubernetes, Terraform)", "Pipelines de CI/CD (GitHub Actions, CircleCI)"]
    : ["Backend web development", "Technical leadership & mentorship", "DevOps culture, processes & tools", "Unix-based tools and systems", "Cloud infrastructure (AWS, Kubernetes, Terraform)", "CI/CD pipelines (GitHub Actions, CircleCI)"];

  const langList = usePt
    ? ["Ruby / Ruby on Rails", "TypeScript / Node.js", "Rust", "Go", "Python / Django", "Java"]
    : ["Ruby / Ruby on Rails", "TypeScript / Node.js", "Rust", "Go", "Python / Django", "Java"];

  const workExperience = career
    .filter((e) => e.type === "Full-time job" || e.type === "Scholarship")
    .map((e) => ({
      ...e,
      title: usePt && e.titlePt ? e.titlePt : e.title,
      activities: usePt && e.activitiesPt ? e.activitiesPt : e.activities,
    }));

  const education = career
    .filter((e) => e.type === "Technology Degree" || e.type === "Bachelor's Degree" || e.type === "Technical Degree")
    .map((e) => ({
      ...e,
      title: usePt && e.titlePt ? e.titlePt : e.title,
    }));

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
  doc.font("Helvetica-Bold").fontSize(22).fillColor(ACCENT).text(name, MARGIN, y);
  y += 26;
  doc.font("Helvetica").fontSize(11).fillColor(LIGHT).text(title, MARGIN, y);
  y += 18;
  doc.font("Helvetica").fontSize(9).fillColor(GRAY);
  doc.text(`${email}  |  ${website}  |  ${github}  |  ${linkedin}`, MARGIN, y, { width: WIDTH });
  y += 22;

  // Summary
  y = sectionHeader(doc, usePt ? "Resumo" : "Summary", y);
  doc.font("Helvetica").fontSize(9.5).fillColor(GRAY).text(summary, MARGIN, y, { width: WIDTH, lineGap: 3 });
  y += doc.heightOfString(summary, { width: WIDTH }) + 14;

  // Skills
  y = sectionHeader(doc, usePt ? "Habilidades e Tecnologias" : "Skills & Technologies", y);
  const midX = MARGIN + WIDTH / 2 + 10;
  let yL = y, yR = y;
  for (const s of skills) { doc.font("Helvetica").fontSize(9.5).fillColor(GRAY).text(`  •  ${s}`, MARGIN, yL); yL += 14; }
  for (const s of langList) { doc.font("Helvetica").fontSize(9.5).fillColor(GRAY).text(`  •  ${s}`, midX, yR); yR += 14; }
  y = Math.max(yL, yR) + 8;

  // Experience
  y = sectionHeader(doc, usePt ? "Experiência" : "Experience", y);
  for (const job of workExperience) {
    if (y > 720) { doc.addPage(); y = MARGIN; }
    doc.font("Helvetica-Bold").fontSize(10).fillColor(ACCENT).text(job.title, MARGIN, y, { continued: true });
    doc.font("Helvetica").fontSize(10).fillColor(GRAY).text(`  —  ${job.where}`, { continued: false });
    y += 13;
    doc.font("Helvetica").fontSize(9).fillColor(LIGHT).text(`${job.displayBegin} – ${job.displayEnd}  ·  ${job.duration}`, MARGIN, y);
    y += 13;
    if (job.activities) { y = bulletList(doc, job.activities, MARGIN, y, WIDTH); }
    y += 6;
  }

  // Education
  if (y > 680) { doc.addPage(); y = MARGIN; }
  y = sectionHeader(doc, usePt ? "Formação" : "Education", y);
  for (const edu of education) {
    doc.font("Helvetica-Bold").fontSize(10).fillColor(ACCENT).text(edu.title, MARGIN, y, { continued: true });
    doc.font("Helvetica").fontSize(10).fillColor(GRAY).text(`  —  ${edu.where}`, { continued: false });
    y += 13;
    doc.font("Helvetica").fontSize(9).fillColor(LIGHT).text(`${edu.displayBegin} – ${edu.displayEnd}`, MARGIN, y);
    y += 18;
  }

  doc.end();
  out.on("finish", () => console.log(`CV (${locale}) → ${outPath}`));
}

// ── Run ────────────────────────────────────────────────
generate("en", "public/Paulo-Henrique-Cuchi.pdf");
generate("pt", "public/Paulo-Henrique-Cuchi-pt.pdf");
