# cuchi.me

My personal website — built with [Eleventy](https://www.11ty.dev/), zero client-side JavaScript.

## Stack

- **11ty** — static site generator
- **Nunjucks** — templating
- **Prism** — syntax highlighting (via `@11ty/eleventy-plugin-syntaxhighlight`)
- **pdfkit** — CV generation from career data
- **Custom CSS** — no framework, ~400 lines

## Structure

```
src/
├── _includes/        # Base layout, post layout
├── _data/            # Career, open source, CV variants, site metadata
├── posts/            # Markdown blog posts
├── assets/           # CSS, fonts, images
├── index.njk         # Homepage
├── posts.njk         # Posts listing
├── feed.njk          # RSS feed
└── sitemap.njk       # XML sitemap
public/               # Static files copied to root (CNAME, robots.txt, favicon)
scripts/              # CV generation script
```

## Getting started

```bash
npm install
npm run dev     # Local server at http://localhost:8080
npm run build   # Production build to _site/
```

The `build` command also regenerates every CV (see below) from the data in `src/_data/`.

## Deployment

Pushes to `master` trigger a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds the site and deploys to GitHub Pages at [cuchi.me](https://cuchi.me).

## CV

The download button on the homepage serves a PDF generated at build time from the data modules in `src/_data/`. Update the career or open source data and every CV stays in sync automatically.

Resumes come in two variants, defined in `src/_data/cv.js`:

- **`general`** — the default resume, linked from the homepage.
- **`oss`** — tailored to open-source contributor roles.

`scripts/generate-cv.js` renders each variant once per locale, so `npm run cv` writes four PDFs:

| Variant   | EN                                   | PT                                      |
| --------- | ------------------------------------ | --------------------------------------- |
| `general` | `public/Paulo-Henrique-Cuchi.pdf`    | `public/Paulo-Henrique-Cuchi-pt.pdf`    |
| `oss`     | `public/Paulo-Henrique-Cuchi-oss.pdf` | `public/Paulo-Henrique-Cuchi-oss-pt.pdf` |

A variant controls its own headline, summary, section order, and how much of a section to show. The content itself is shared: `career.js` supplies the experience timeline and `opensource.js` the contributions and owned repositories, so both variants stay in sync.

## License

Apache 2.0
