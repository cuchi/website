# Agent instructions: finding Paulo's experience

## Purpose

This repository is the source of truth for Paulo Henrique Cuchi's professional
experience, skills, open-source work, projects, and education. Use it to answer
recruiter questionnaires, CV questions, and experience summaries.

Do not invent facts. If the repository does not contain the answer, say so and
ask for the missing detail. If the user provides a correction, treat it as
authoritative and label it as user-supplied context.

## Source of truth

Read these files before answering experience questions:

| Path | What it contains |
| --- | --- |
| `src/_data/career.js` | Jobs, education, volunteering, dates, activities, and explicit technology mentions. The `type` field separates full-time jobs, scholarships, degrees, and volunteering. |
| `src/_data/cv.js` | Resume variants, summaries, skill rows, language lists, and writing links. |
| `src/_data/opensource.js` | Upstream contributions and repositories owned by Paulo. |
| `src/_data/projects.js` | Personal and open-source projects. |
| `src/posts/*.md` | Dated writing. Useful for LLM, Go, Rust, and project context. |
| `public/Paulo-Henrique-Cuchi*.pdf` | Generated resumes. Use `pdftotext` to inspect the current output. |
| `scripts/generate-cv.js` | CV renderer, section order, and contact block. |
| `src/index.njk` | Contact links and site metadata. |
| `README.md` | Build and CV generation instructions. |

Do not use `_site` or `node_modules` as sources. `_site` is generated output.

## Workflow

1. Read `src/_data/career.js` first and build a timeline from `period.begin` and
   `period.end`.
2. Separate entries by `type` before counting anything.
3. Count a technology for a role only when the role's `activities`, `title`, or
   an explicit CV skill row connects that technology to the role.
4. Cross-check the result against `cv.js`, `opensource.js`, `projects.js`, and
   the posts.
5. Use the generated PDF as a consistency check, not as the only source.
6. State assumptions, ranges, and gaps in the answer.

## Duration rules

- Dates are written as `YYYY-MM` or `YYYY` in `period.begin` and `period.end`.
- Match the convention in `computeDuration` in `career.js`: subtract the start
  date from the end date. Do not add one month. The site and PDFs use this
  convention.
- If `period.end` is missing, use the current date and label the role as
  present.
- Show exact years and months when precision matters. Round only in prose.
- Do not sum overlapping periods. Check for overlaps before adding.
- The `duration` field in `career.js` is computed when the module loads. For a
  role with no end date, it changes over time, so verify against `period`.

## Professional versus personal experience

Professional experience:

- Entries with `type: "Full-time job"`.

Work-like but not a full-time job:

- Entries with `type: "Scholarship"`, such as the UDESC technical support role.
  Report these separately. If a recruiter asks for professional years only,
  say that the scholarship can be excluded.

Not professional experience:

- Education entries.
- Volunteering entries.
- Personal projects in `projects.js`.
- Repositories owned by Paulo in `opensource.js`.
- Upstream open-source contributions. These show skill but are not employment.

If the question asks for total experience, combine professional and personal
time. If it asks for professional experience, exclude personal and open-source
time.

## Counting technologies

- Only count a technology when the repository explicitly associates it with a
  role or project. Do not infer PostgreSQL because a role used Rails. Do not
  infer TypeScript because a project used React unless the source says so.
- Do not assign a full role duration to a technology used on one project inside
  a longer role. Use a range, a conservative estimate, or "less than" and
  explain the basis.
- Do not double count related technologies. React and Node.js are part of
  TypeScript and JavaScript. If both are reported, state that React and Node.js
  are included in the TypeScript and JavaScript total.
- For databases, distinguish the primary datastore from supporting
  infrastructure. Redis and ElasticSearch are used alongside PostgreSQL, not as
  the primary database.
- For cloud, only AWS is evidenced. Heroku and Render are platforms, not AWS,
  Azure, or GCP. Report them separately.
- For LLMs and AI tooling, count only explicit evidence such as API
  integration, agentic development, or review of AI-generated patches. Do not
  claim RAG pipelines, LangChain, TensorFlow, or PyTorch without evidence.

## Current timeline

Snapshot from `career.js`. Recalculate if the data changes.

| Period | Company | Type | Duration | Explicit stack |
| --- | --- | --- | --- | --- |
| 2012-07 to 2013-07 | UDESC | Scholarship | 1 year | HTML, JavaScript, PHP, MySQL |
| 2015-10 to 2016-03 | ContaAzul | Full-time job | 5 months | Java EE 7, Hibernate, JBoss, PostgreSQL |
| 2016-05 to 2020-03 | NG Informatica | Full-time job | 3 years 10 months | Node.js, TypeScript, GraphQL, PostgreSQL, MongoDB, Android |
| 2020-03 to 2022-01 | Magrathea Labs | Full-time job | 1 year 10 months | Python, Django, PostgreSQL, Redis, ElasticSearch, Angular, Node.js, TypeScript, React |
| 2022-01 to 2026-06 | Trusted Health | Full-time job | 4 years 5 months | Ruby, Rails, AWS, Kubernetes, Terraform, Helm, ArgoCD, GitHub Actions, CircleCI |

Education:

| Period | Institution | Degree |
| --- | --- | --- |
| 2016 to 2018 | UDESC | Technology Degree in Systems Analysis and Development |
| 2012 to 2016 | UDESC | Bachelor's Degree in Computer Science, transferred |
| 2010 to 2012 | SENAI | Technical Degree in Web Development |

## Known gaps and user-supplied context

These details are not fully captured in `career.js`. Use them only when the user
has confirmed them, and ask for exact dates when a firm number is required.

- React at Trusted Health: the user confirmed React was used in product teams
  outside the infrastructure team. `career.js` does not record this. The
  professional React estimate used in recruiter replies was approximately 4 to
  5 years total, combining Trusted Health product-team work with an internal HR
  scheduling project at Magrathea Labs.
- TypeScript and JavaScript includes Node.js and React. The professional total
  used in recruiter replies was approximately 9 years: NG Informatica at 3
  years 10 months, Magrathea Labs at 1 year 10 months, and Trusted Health React
  work at approximately 3 to 4 years.
- If the UDESC scholarship is counted as professional, add 1 year to the
  JavaScript total.
- Professional Python was 1 year 10 months at Magrathea Labs.
- Professional Java was 5 months at ContaAzul.
- Professional PHP and MySQL were 1 year each at UDESC. Report them separately
  because the role was a scholarship.
- Professional PostgreSQL was approximately 6 years 1 month: ContaAzul at 5
  months, NG Informatica at 3 years 10 months, and Magrathea Labs at 1 year 10
  months.
- LLMs and AI tooling were approximately 1 to 2 years, based on personal
  projects. No production employer LLM work is evidenced.
- RAG pipelines: 0 years. The closest evidence is LLM API integration and
  structured model-output handling in `deepsave`.
- AWS was 4 years 5 months at Trusted Health. Azure and GCP are not evidenced.

These figures are derived from the repository plus the user's corrections. Do
not copy them blindly. Recalculate from the dates and explicit technology
mentions when the data changes.

## Answering recruiter emails

- Use the recruiter's terms and answer in the same order as the questions.
- Give a single number or a tight range. Include the company and period
  breakdown so the number is auditable.
- Label scholarship work, personal work, and open-source work separately.
- If the question says professional only, exclude personal, open-source,
  education, and volunteering.
- If the repository lacks evidence, say so. Do not fill the gap with a guess.
- Use plain ASCII in emails unless the user asks otherwise. Avoid all-caps
  headings and decorative punctuation.
- Attach `public/Paulo-Henrique-Cuchi.pdf` for the general resume,
  `public/Paulo-Henrique-Cuchi-oss.pdf` for the open-source variant, and the
  `-pt.pdf` files for Portuguese.
- Contact details: `paulo@cuchi.me`, `cuchi.me`, `github.com/cuchi`,
  `linkedin.com/in/pcuchi`.

## Useful commands

Search the data files:

```sh
grep -RIn "React\|Python\|PostgreSQL" src/_data
```

Inspect the generated resume:

```sh
pdftotext public/Paulo-Henrique-Cuchi.pdf -
```

Regenerate the PDFs after a data change:

```sh
npm run cv
```

Regenerate the PDFs and the site:

```sh
npm run build
```

## What not to do

- Do not infer a technology from a job title or company name.
- Do not count education or volunteering as professional experience.
- Do not double count React or Node.js inside TypeScript and JavaScript.
- Do not claim RAG, LangChain, TensorFlow, PyTorch, Azure, GCP, or any other
  skill that the repository does not evidence.
- Do not edit `career.js` just to answer an email. Read it and report from it
  unless the user asks for a data change.
- Do not edit `_site` by hand. It is generated.
