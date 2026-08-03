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
├── _data/            # Career timeline data, site metadata
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

The `build` command also regenerates the CV (`public/Paulo-Henrique-Cuchi.pdf`) from the career data in `src/_data/career.js`.

## Deployment

Pushes to `master` trigger a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds the site and deploys to GitHub Pages at [cuchi.me](https://cuchi.me).

## CV

The download button on the homepage serves a PDF generated at build time from `src/_data/career.js`. Update your career data there and the CV stays in sync automatically. The source script is at `scripts/generate-cv.js`.

## License

Apache 2.0
