
export default async function(req, res) {
  const career = {
    events: [
      {
        id: "02107002-33e1-4187-a71d-b74a6179882f",
        level: 1,
        where: "UDESC",
        title: "Computer Science Bachelor's degree",
        type: "University Degree (incomplete)",
        period: { begin: "2012-02", end: "2015-12-30" },
      },
      {
        id: "e30c66c1-d594-48fb-a6fa-d9e6219e1b8d",
        level: 1,
        where: "UDESC",
        title: "Systems Analyst Technology degree",
        type: "University Degree",
        period: { begin: "2016-01-10", end: "2018" },
      },
      {
        id: "ffa66fc8-3164-4a7c-83a0-afedf6b832d6",
        level: 1,
        where: "SENAI",
        title: "Web development course",
        type: "Technical Degree",
        period: { begin: "2010-02", end: "2011-12" },
      },
      {
        id: "104298ca-c805-45ff-a13d-4d1063f24f2d",
        where: "UDESC",
        title: "Technical Support",
        type: "Scholarship job",
        period: { begin: "2012-07", end: "2013-07" },
      },
      {
        id: "680a1bd1-19ea-466e-9e69-8499269f9a35",
        title: "Software Developer",
        where: "ContaAzul",
        type: "Full-time job",
        period: { begin: "2015-10", end: "2016-03-15" },
      },
      {
        id: "48a2723a-2c67-4794-8503-15de57349f41",
        title: "R&D Software Developer",
        where: "NG Informática",
        type: "Full-time job",
        period: { begin: "2016-05-06", end: "2020-03" },
      },
      {
        id: "3b06277a-edf2-4c4a-979d-359480c15f9b",
        where: "Magrathea Labs",
        title: "Software Developer",
        type: "Full-time job",
        activities: [],
        period: { begin: "2020-03-10" },
      },
      {
        id: "a3d62c73-8fb7-41f2-9fa4-51e481ac2bf5",
        level: 2,
        title: "Programming Contest Staff & Sysadmin",
        where: "UDESC",
        type: "Volunteership",
        period: { begin: "2014-02", end: "2015-12" },
      },
      {
        id: "9dcaa7cb-67f3-4533-846a-8d08b4c89e88",
        level: 2,
        type: "Volunteership",
        where: "Grupo de Extensão em Software e Hardware Livre (COLMEIA) - UDESC",
        title: "Volunteer",
        period: { begin: "2012-07", end: "2013-12" },
      }
    ],
    currentDate: new Date(),
  };

  res
    .writeHead(200, { "Content-Type": "application/json" })
    .end(JSON.stringify(career));
}
