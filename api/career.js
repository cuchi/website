
export default async function(req, res) {
  const career = {
    events: [
      {
        id: "02107002-33e1-4187-a71d-b74a6179882f",
        level: 1,
        where: "UDESC",
        title: "Computer Science (incomplete)",
        type: "Bachelor Degree",
        logoUrl: "/career-logos/udesc.png",
        period: { begin: "2012-02", end: "2015-12-30" },
      },
      {
        id: "e30c66c1-d594-48fb-a6fa-d9e6219e1b8d",
        level: 1,
        where: "UDESC",
        title: "Systems Analysis",
        type: "Technology Degree",
        logoUrl: "/career-logos/udesc.png",
        period: { begin: "2016-01-10", end: "2018" },
      },
      {
        id: "ffa66fc8-3164-4a7c-83a0-afedf6b832d6",
        level: 1,
        where: "SENAI",
        title: "Web Development",
        type: "Technical Degree",
        logoUrl: "/career-logos/senai.png",
        period: { begin: "2010-02", end: "2011-12" },
      },
      {
        id: "104298ca-c805-45ff-a13d-4d1063f24f2d",
        where: "UDESC",
        title: "Technical Support",
        type: "Scholarship job",
        logoUrl: "/career-logos/udesc.png",
        period: { begin: "2012-07", end: "2013-07" },
      },
      {
        id: "680a1bd1-19ea-466e-9e69-8499269f9a35",
        title: "Software Developer",
        where: "ContaAzul",
        type: "Full-time job",
        activities: [
          `Worked on a web service for accounting routines & integration using
          Java EE 7, Hibernate, JBoss & PostgreSQL.`
        ],
        logoUrl: "/career-logos/contaazul.jpeg",
        period: { begin: "2015-10", end: "2016-03-15" },
      },
      {
        id: "48a2723a-2c67-4794-8503-15de57349f41",
        title: "Software Developer (R&D)",
        where: "NG Informática",
        type: "Full-time job",
        activities: [
          `Worked on the development of a Android application for asset
          maintenance execution & management.`,
          `Worked on an experimental web application for notifications & alerts
          written in Node.Js & MongoDB.`,
          `Worked as a back-end tech lead for a SaaS web application using
          Node.Js, TypeScript, GraphQL & PostgreSQL.`,
          `Worked on the research of new tools and methods to improve the DevOps
          cycle of the organization SaaS products.`,
        ],
        logoUrl: "/career-logos/ng-informatica.jpeg",
        period: { begin: "2016-05-06", end: "2020-03" },
      },
      {
        id: "3b06277a-edf2-4c4a-979d-359480c15f9b",
        where: "Magrathea Labs",
        title: "Software Developer",
        type: "Full-time job",
        activities: [
          `Worked on a data intensive web application that collects and displays
          reports for animal production corporations. The main technologies used
          were Python, Django, PostgreSQL, Redis, ElasticSearch and Angular.`,
          `Worked as a tech lead of a forked subset of the project above. This
          new project had international stakeholders who shared regular
          follow-ups with our development team.`,
          `Provided technical mentorship to employees on the projects we had in
          common.`,
          `Worked on a internal project of the company that employees used to
          make appointments to managed by the HR. The stack of this project was
          Node.Js, TypeScript, React and PostgreSQL.`
        ],
        logoUrl: "/career-logos/magrathea.jpeg",
        period: { begin: "2020-03-10" },
      },
      {
        id: "a3d62c73-8fb7-41f2-9fa4-51e481ac2bf5",
        level: 2,
        title: "Programming Contest Staff",
        where: "UDESC",
        type: "Volunteership",
        logoUrl: "/career-logos/udesc.png",
        period: { begin: "2014-02", end: "2015-12" },
      },
      {
        id: "9dcaa7cb-67f3-4533-846a-8d08b4c89e88",
        level: 2,
        type: "Volunteership",
        where: "COLMEIA (UDESC)",
        title: "Volunteer",
        logoUrl: "/career-logos/udesc.png",
        period: { begin: "2012-07", end: "2013-12" },
      }
    ],
    currentDate: new Date(),
  };

  res
    .writeHead(200, { "Content-Type": "application/json" })
    .end(JSON.stringify(career));
}
