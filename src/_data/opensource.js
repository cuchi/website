/**
 * Open-source work featured in the CV.
 *
 * `contributions` — changes merged upstream into projects maintained by others.
 * `projects`      — repositories owned and maintained by the author.
 *
 * Both lists are ordered by relevance, not chronologically.
 */
module.exports = {
  contributions: [
    {
      project: "ramda",
      lang: "JavaScript",
      url: "https://github.com/ramda/ramda/pull/2581",
      description:
        "Rewrote difference, without and intersection to drop their time complexity from O(n²) to O(n) using the internal _Set, with before/after benchmarks; merged upstream across two PRs (#2581, #2603).",
      descriptionPt:
        "Reescrevi difference, without e intersection para reduzir a complexidade de O(n²) para O(n) usando o _Set interno, com benchmarks de antes e depois; mesclado upstream em dois PRs (#2581, #2603).",
    },
    {
      project: "TypeORM",
      lang: "TypeScript",
      url: "https://github.com/typeorm/typeorm/pull/5178",
      description:
        "Fixed parameter collisions in SelectQueryBuilder by namespacing internal query parameters, and improved the Repository.save() return type to cover generated columns; both merged (#5178, #2796).",
      descriptionPt:
        "Corrigi colisões de parâmetros no SelectQueryBuilder ao namespacar parâmetros internos da query e melhorei o tipo de retorno de Repository.save() para cobrir colunas geradas; ambos mesclados (#5178, #2796).",
    },
    {
      project: "DefinitelyTyped",
      lang: "TypeScript",
      url: "https://github.com/DefinitelyTyped/DefinitelyTyped/pull/40254",
      description:
        "Restored the missing | undefined on the R.head and R.last return types for the ramda definitions, lost in an earlier refactor; merged (#40254).",
      descriptionPt:
        "Restaurei o | undefined ausente nos tipos de retorno de R.head e R.last nas definições do ramda, perdido em um refactor anterior; mesclado (#40254).",
    },
    {
      project: "django-extensions",
      lang: "Python",
      url: "https://github.com/django-extensions/django-extensions/pull/1529",
      description:
        "Added an option to syncdata that removes extraneous objects before upserting, covering fixtures that break on unique constraints; merged (#1529). Also diagnosed a path where syncdata failed silently and reported success (#1527).",
      descriptionPt:
        "Adicionei uma opção ao syncdata que remove objetos excedentes antes do upsert, cobrindo fixtures que quebram em restrições únicas; mesclado (#1529). Também diagnostiquei um caminho em que o syncdata falhava em silêncio e reportava sucesso (#1527).",
    },
    {
      project: "Bull",
      lang: "Node.js",
      url: "https://github.com/OptimalBits/bull/pull/944",
      description:
        "Implemented sub-minute repeat intervals (millisecond granularity) for the job scheduler, then fixed the regression that followed in the same code path; both merged (#944, #968).",
      descriptionPt:
        "Implementei intervalos de repetição abaixo de um minuto (granularidade em milissegundos) no agendador de jobs e corrigi a regressão que apareceu no mesmo trecho; ambos mesclados (#944, #968).",
    },
  ],
  projects: [
    {
      name: "jinja2-action",
      lang: "Python",
      note: "47 stars",
      notePt: "47 estrelas",
      url: "https://github.com/cuchi/jinja2-action",
      description:
        "GitHub Action that renders files with the Jinja2 template engine, published on the GitHub Marketplace — 44 public forks, used in third-party CI pipelines.",
      descriptionPt:
        "GitHub Action que renderiza arquivos com o motor de templates Jinja2, publicada no GitHub Marketplace — 44 forks públicos, usada em pipelines de CI de terceiros.",
    },
    {
      name: "deepsave",
      lang: "Rust",
      url: "https://github.com/cuchi/deepsave",
      description:
        "Self-hosted personal finance manager: imports bank transactions via open banking (Pluggy) and categorizes them with DeepSeek, learning from every correction. Rust, React and PostgreSQL.",
      descriptionPt:
        "Gerenciador financeiro pessoal self-hosted: importa transações bancárias via open banking (Pluggy) e as categoriza com o DeepSeek, aprendendo com cada correção. Rust, React e PostgreSQL.",
    },
    {
      name: "sobrou-nada-pro-bet",
      lang: "Rust",
      note: "Apache 2.0",
      notePt: "Apache 2.0",
      url: "https://github.com/cuchi/sobrou-nada-pro-bet",
      description:
        "Full-stack cashless betting app in production: Rust (Axum, SQLx) backend, React + TypeScript frontend, PostgreSQL. Built by directing an AI coding agent and reviewing every change it produced.",
      descriptionPt:
        "App full-stack de apostas sem dinheiro real, em produção: backend em Rust (Axum, SQLx), frontend em React + TypeScript, PostgreSQL. Construído dirigindo um agente de código de IA e revisando cada mudança produzida.",
    },
  ],
};
