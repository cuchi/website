/**
 * CV variant definitions, consumed by scripts/generate-cv.js.
 *
 * Every variant is rendered once per locale, so a variant with two locales
 * produces two PDFs.
 *
 * - `general` — the default resume served from the website.
 * - `oss`     — tailored to open-source contributor roles.
 *
 * `order` lists the sections to render, top to bottom. Section renderers live
 * in scripts/generate-cv.js.
 */

const LANGUAGES = {
  en: ["Python", "TypeScript / JavaScript", "Ruby", "Rust", "Go", "Java", "C", "SQL"],
  pt: ["Python", "TypeScript / JavaScript", "Ruby", "Rust", "Go", "Java", "C", "SQL"],
};

// The only public evidence for C is a handful of 2014–15 repositories, so the
// general-purpose resume leaves it out in favour of space for stronger signal.
const withoutC = (list) => list.filter((item) => item !== "C");

/**
 * The skills block is a list of labelled rows, one axis per row, so no
 * technology appears twice. Frameworks never share a row with languages.
 */
const skillsFor = (languages) => ({
  en: [
    { label: "Languages", items: languages.en },
    {
      label: "Backend",
      items: ["Rails", "Django", "Flask", "Node.js", "Axum", "GraphQL"],
    },
    {
      label: "Data",
      items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "ElasticSearch"],
    },
    { label: "Frontend", items: ["React", "Svelte", "Angular", "HTML / CSS"] },
    {
      label: "Infrastructure",
      items: ["AWS", "Kubernetes", "Terraform", "Helm", "ArgoCD", "GitHub Actions", "CircleCI"],
    },
    {
      label: "Practices",
      items: ["Testing & code review", "Technical leadership & mentorship", "Unix tooling"],
    },
  ],
  pt: [
    { label: "Linguagens", items: languages.pt },
    {
      label: "Backend",
      items: ["Rails", "Django", "Flask", "Node.js", "Axum", "GraphQL"],
    },
    {
      label: "Dados",
      items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "ElasticSearch"],
    },
    { label: "Frontend", items: ["React", "Svelte", "Angular", "HTML / CSS"] },
    {
      label: "Infraestrutura",
      items: ["AWS", "Kubernetes", "Terraform", "Helm", "ArgoCD", "GitHub Actions", "CircleCI"],
    },
    {
      label: "Práticas",
      items: ["Testes e revisão de código", "Liderança técnica e mentoria", "Ferramentas Unix"],
    },
  ],
});

module.exports = {
  general: {
    order: ["summary", "experience", "skills", "opensource", "writing", "education"],
    title: {
      en: "Senior Software Engineer",
      pt: "Engenheiro de Software Sênior",
    },
    location: {
      en: "Joinville, Brazil · UTC-3 · Remote",
      pt: "Joinville, Brasil · UTC-3 · Remoto",
    },
    spokenLanguages: {
      en: "Portuguese (native) · English (fluent, C2)",
      pt: "Português (nativo) · Inglês (fluente, C2)",
    },
    summary: {
      en: "Senior software engineer with 10+ years building and maintaining production systems across backend, frontend and infrastructure, including technical leadership of small teams. Owns problems end to end — migrating critical systems with zero downtime, reducing infrastructure spend, and taking products from zero to first customers. Works primarily in Ruby, Python, TypeScript and Rust.",
      pt: "Engenheiro de software sênior com mais de 10 anos construindo e mantendo sistemas em produção no backend, no frontend e na infraestrutura, incluindo liderança técnica de times pequenos. Atua de ponta a ponta — migrando sistemas críticos sem downtime, reduzindo custos de infraestrutura e levando produtos do zero aos primeiros clientes. Trabalha principalmente com Ruby, Python, TypeScript e Rust.",
    },
    skills: skillsFor({
      en: withoutC(LANGUAGES.en),
      pt: withoutC(LANGUAGES.pt),
    }),
    // Matched against the untranslated title in src/_data/career.js.
    excludeEducation: ["Computer Science (incomplete)"],
    // A general reader needs the headline contributions, not the full ledger.
    openSource: { maxContributions: 4 },
    writing: [
      {
        title: {
          en: "Go vs Rust: Writing a CLI tool",
          pt: "Go vs Rust: Escrevendo uma ferramenta CLI",
        },
        url: "https://cuchi.me/posts/go-vs-rust/",
        urlPt: "https://cuchi.me/pt-br/posts/go-vs-rust/",
        description: {
          en: "Hands-on comparison of the same CLI tool built in both languages, covering error handling, compile times, memory usage and CI.",
          pt: "Comparação prática da mesma ferramenta CLI feita nas duas linguagens, cobrindo tratamento de erros, tempo de compilação, uso de memória e CI.",
        },
      },
      {
        title: {
          en: "I Vibe-coded a Full-Stack App for $2.96",
          pt: "Desenvolvi um App Full-Stack com Vibe Coding por $2.96",
        },
        url: "https://cuchi.me/posts/vibe-coding/",
        urlPt: "https://cuchi.me/pt-br/posts/vibe-coding/",
        description: {
          en: "Shipping a production Rust + React application by directing an AI coding agent, and an honest account of where it fell short.",
          pt: "Colocando em produção um app em Rust + React ao dirigir um agente de código de IA, com um relato honesto de onde ele falhou.",
        },
      },
    ],
  },

  oss: {
    order: ["summary", "skills", "opensource", "experience", "education"],
    title: {
      en: "Software Engineer · Open Source Contributor",
      pt: "Engenheiro de Software · Contribuidor Open Source",
    },
    summary: {
      en: "Software engineer with 10+ years of experience building and maintaining production systems across backend, frontend and infrastructure, including technical leadership and mentorship. Polyglot by preference and an active open-source contributor, with changes merged into ramda, TypeORM, DefinitelyTyped, django-extensions and Bull. Comfortable exploring unfamiliar codebases, writing unit, integration and end-to-end tests, and reviewing code (including AI-generated patches) for correctness, security and maintainability.",
      pt: "Engenheiro de software com mais de 10 anos de experiência construindo e mantendo sistemas em produção no backend, no frontend e na infraestrutura, incluindo liderança técnica e mentoria. Poliglota por preferência e contribuidor ativo de open source, com mudanças mescladas em ramda, TypeORM, DefinitelyTyped, django-extensions e Bull. Confortável em explorar bases de código desconhecidas, escrever testes unitários, de integração e ponta a ponta, e revisar código (incluindo patches gerados por IA) quanto a correção, segurança e manutenibilidade.",
    },
    skills: skillsFor(LANGUAGES),
  },
};
