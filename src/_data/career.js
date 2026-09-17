const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatPeriodDate(dateStr) {
  if (!dateStr) return null;
  if (/^\d{4}$/.test(dateStr)) return dateStr;
  const [year, month] = dateStr.split("-");
  return month ? `${MONTHS[parseInt(month, 10) - 1]} ${year}` : year;
}

function computeDuration(begin, end) {
  const start = new Date(begin);
  const finish = end ? new Date(end) : new Date();
  let years = finish.getFullYear() - start.getFullYear();
  let months = finish.getMonth() - start.getMonth();
  if (months < 0) { years--; months += 12; }
  const parts = [];
  if (years > 0) parts.push(`${years}y`);
  if (months > 0) parts.push(`${months}m`);
  return parts.join(" ") || "< 1m";
}

const raw = [
  {
    where: "Trusted Health",
    title: "Sr. Software Engineer",
    titlePt: "Engenheiro de Software Sênior",
    type: "Full-time job",
    activities: [
      "Moved compensation logic out of Airtable — a brittle third-party service holding a critical part of the product — into native Ruby on Rails code, improving stakeholder visibility and long-term maintainability.",
      "On the infrastructure team, built Ruby / Thor CLI tools adopted by 50+ engineers to stand up demo and testing environments on demand.",
      "Reduced CI/CD, observability and AWS infrastructure spend by ~30% (GitHub Actions, CircleCI, New Relic, Sentry, Mezmo).",
      "Migrated 4 services — including 2 large monoliths — from Heroku to AWS EKS with zero downtime, and built tooling to make deploying and debugging Kubernetes pods easier (Kubernetes, ArgoCD, Helm, Terraform, Ruby).",
      "Delivered supplier onboarding and third-party service integrations for a business-facing product, unblocking a client that accounted for ~80% of that product's revenue.",
    ],
    activitiesPt: [
      "Movi a lógica de remuneração do Airtable — um serviço de terceiros frágil que sustentava uma parte crítica do produto — para código nativo em Ruby on Rails, melhorando a visibilidade dos stakeholders e a manutenibilidade a longo prazo.",
      "No time de infraestrutura, criei ferramentas CLI (Ruby / Thor) adotadas por mais de 50 engenheiros para subir ambientes de demonstração e teste sob demanda.",
      "Reduzi em ~30% os custos de CI/CD, observabilidade e infraestrutura AWS (GitHub Actions, CircleCI, New Relic, Sentry, Mezmo).",
      "Migrei 4 serviços — incluindo 2 monolitos grandes — do Heroku para o AWS EKS sem downtime e criei ferramentas para facilitar o deploy e a depuração de pods Kubernetes (Kubernetes, ArgoCD, Helm, Terraform, Ruby).",
      "Entreguei o onboarding de fornecedores e integrações com prestadores de serviço em um produto voltado ao negócio, viabilizando a entrada de um cliente que respondia por ~80% da receita desse produto.",
    ],
    logoUrl: "/career-logos/trusted.jpeg",
    period: { begin: "2022-01", end: "2026-06" },
  },
  {
    where: "Magrathea Labs",
    title: "Sr. Software Engineer",
    titlePt: "Engenheiro de Software Sênior",
    type: "Full-time job",
    activities: [
      "Worked on a data intensive web application that collects and displays reports for animal production corporations. The main technologies used were Python, Django, PostgreSQL, Redis, ElasticSearch and Angular.",
      "Led a team of 4 engineers on a forked subset of the product, owning the technical decisions on how it would scale for the client and running regular follow-ups with international stakeholders.",
      "Provided technical mentorship to employees on the projects we had in common.",
      "Worked on an internal project of the company that employees used to make appointments managed by HR. The stack of this project was Node.Js, TypeScript, React and PostgreSQL.",
    ],
    activitiesPt: [
      "Trabalhei em uma aplicação web de dados intensivos que coleta e exibe relatórios para empresas de produção animal. As principais tecnologias usadas foram Python, Django, PostgreSQL, Redis, ElasticSearch e Angular.",
      "Liderei um time de 4 pessoas em um subconjunto forkado do produto, assumindo as principais decisões técnicas sobre como ele escalaria para o cliente, com follow-ups regulares com stakeholders internacionais.",
      "Ofereci mentoria técnica a funcionários nos projetos que tínhamos em comum.",
      "Trabalhei em um projeto interno da empresa usado pelos funcionários para agendar compromissos gerenciados pelo RH. A stack deste projeto era Node.Js, TypeScript, React e PostgreSQL.",
    ],
    logoUrl: "/career-logos/magrathea.jpeg",
    period: { begin: "2020-03", end: "2022-01" },
  },
  {
    title: "Software Engineer",
    titlePt: "Engenheiro de Software",
    where: "NG Informática — TOTVS Software Partner",
    type: "Full-time job",
    activities: [
      "Worked on the development of an Android application for asset maintenance execution & management.",
      "Worked on an experimental web application for notifications & alerts written in Node.Js & MongoDB.",
      "Back-end tech lead for a SaaS application built from scratch before its first customers (Node.js, TypeScript, GraphQL, PostgreSQL); it was later extended to serve many clients in partnership with TOTVS.",
      "Worked on the research of new tools and methods to improve the DevOps cycle of the organization's SaaS products.",
    ],
    activitiesPt: [
      "Trabalhei no desenvolvimento de um aplicativo Android para execução e gestão de manutenção de ativos.",
      "Trabalhei em uma aplicação web experimental para notificações e alertas escrita em Node.Js e MongoDB.",
      "Tech lead de backend de uma aplicação SaaS construída do zero, antes dos primeiros clientes (Node.js, TypeScript, GraphQL e PostgreSQL); depois foi expandida para atender muitos clientes em parceria com a TOTVS.",
      "Trabalhei na pesquisa de novas ferramentas e métodos para melhorar o ciclo DevOps dos produtos SaaS da organização.",
    ],
    logoUrl: "/career-logos/ng-informatica.jpeg",
    period: { begin: "2016-05", end: "2020-03" },
  },
  {
    title: "Software Engineer",
    titlePt: "Engenheiro de Software",
    where: "ContaAzul",
    type: "Full-time job",
    activities: [
      "Worked on a web service for accounting routines & integration using Java EE 7, Hibernate, JBoss & PostgreSQL.",
    ],
    activitiesPt: [
      "Trabalhei em um serviço web para rotinas contábeis e integração usando Java EE 7, Hibernate, JBoss e PostgreSQL.",
    ],
    logoUrl: "/career-logos/contaazul.jpeg",
    period: { begin: "2015-10", end: "2016-03" },
  },
  {
    where: "UDESC",
    title: "Technical Support",
    titlePt: "Suporte Técnico",
    type: "Scholarship",
    activities: [
      "Worked on the maintenance of a high-traffic website using HTML, JS, PHP & MySQL.",
    ],
    activitiesPt: [
      "Trabalhei na manutenção de um site de alto tráfego usando HTML, JS, PHP e MySQL.",
    ],
    logoUrl: "/career-logos/udesc.png",
    period: { begin: "2012-07", end: "2013-07" },
  },
  {
    where: "UDESC",
    title: "Systems Analysis and Development",
    titlePt: "Análise e Desenvolvimento de Sistemas",
    type: "Technology Degree",
    logoUrl: "/career-logos/udesc.png",
    period: { begin: "2016", end: "2018" },
  },
  {
    where: "UDESC",
    title: "Computer Science (incomplete)",
    titlePt: "Ciência da Computação (incompleto)",
    type: "Bachelor's Degree",
    logoUrl: "/career-logos/udesc.png",
    period: { begin: "2012", end: "2016" },
  },
  {
    where: "SENAI",
    title: "Web Development",
    titlePt: "Desenvolvimento Web",
    type: "Technical Degree",
    logoUrl: "/career-logos/senai.png",
    period: { begin: "2010", end: "2012" },
  },
  {
    title: "Programming Contest Staff",
    titlePt: "Staff de Maratona de Programação",
    where: "UDESC",
    type: "Volunteering",
    logoUrl: "/career-logos/udesc.png",
    period: { begin: "2014-02", end: "2015-12" },
  },
  {
    type: "Volunteering",
    where: "COLMEIA (UDESC)",
    title: "Volunteer",
    titlePt: "Voluntário",
    logoUrl: "/career-logos/udesc.png",
    period: { begin: "2012-07", end: "2013-12" },
  },
];

module.exports = raw
  .map((event) => {
    const begin = event.period.begin;
    const end = event.period.end;
    return {
      ...event,
      displayBegin: formatPeriodDate(begin),
      displayEnd: end ? formatPeriodDate(end) : "Present",
      duration: computeDuration(begin, end),
      isCurrent: !end,
    };
  })
  .sort((a, b) => new Date(b.period.begin) - new Date(a.period.begin));
