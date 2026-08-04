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
      "In the main product team, worked on migrating compensation logic from a legacy system (Airtable) into native application code (Ruby on Rails).",
      "Moved to the infrastructure team, where I built CLI tools (Ruby / Thor) to help the engineering team with their daily tasks.",
      "Worked on cost optimization across CI/CD pipelines (GitHub, CircleCI), monitoring (New Relic, Sentry, Mezmo) and infrastructure resources (AWS).",
      "Migrated application compute from Heroku to AWS EKS, and built tooling to improve the developer experience around deploying and debugging Kubernetes pods. Tools used: Kubernetes, ArgoCD, Helm, Terraform & Ruby.",
      "Worked on a product team developing features for a business-facing web application.",
    ],
    activitiesPt: [
      "No time de produto principal, trabalhei na migração da lógica de remuneração de um sistema legado (Airtable) para código nativo da aplicação (Ruby on Rails).",
      "Passei para o time de infraestrutura, onde criei ferramentas CLI (Ruby / Thor) para auxiliar o time de engenharia nas tarefas do dia a dia.",
      "Trabalhei em otimizações de custos em pipelines de CI/CD (GitHub, CircleCI), monitoramento (New Relic, Sentry, Mezmo) e recursos de infraestrutura (AWS).",
      "Migrei a computação da aplicação do Heroku para AWS EKS e criei ferramentas para melhorar a experiência dos engenheiros ao fazer deploy e depurar pods Kubernetes. Ferramentas usadas: Kubernetes, ArgoCD, Helm, Terraform e Ruby.",
      "Trabalhei em um time de produto desenvolvendo funcionalidades para uma aplicação web voltada ao negócio.",
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
      "Worked as a tech lead of a forked subset of the project above. This new project had international stakeholders who shared regular follow-ups with our development team.",
      "Provided technical mentorship to employees on the projects we had in common.",
      "Worked on an internal project of the company that employees used to make appointments managed by HR. The stack of this project was Node.Js, TypeScript, React and PostgreSQL.",
    ],
    activitiesPt: [
      "Trabalhei em uma aplicação web de dados intensivos que coleta e exibe relatórios para empresas de produção animal. As principais tecnologias usadas foram Python, Django, PostgreSQL, Redis, ElasticSearch e Angular.",
      "Atuei como tech lead de um subconjunto do projeto acima. Este novo projeto tinha stakeholders internacionais que faziam follow-ups regulares com nosso time de desenvolvimento.",
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
      "Worked as a back-end tech lead for a SaaS web application using Node.Js, TypeScript, GraphQL & PostgreSQL.",
      "Worked on the research of new tools and methods to improve the DevOps cycle of the organization's SaaS products.",
    ],
    activitiesPt: [
      "Trabalhei no desenvolvimento de um aplicativo Android para execução e gestão de manutenção de ativos.",
      "Trabalhei em uma aplicação web experimental para notificações e alertas escrita em Node.Js e MongoDB.",
      "Atuei como tech lead backend de uma aplicação web SaaS usando Node.Js, TypeScript, GraphQL e PostgreSQL.",
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
