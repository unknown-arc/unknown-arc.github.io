// Content data for Ankit Kumar Singh's portfolio
window.SITE_DATA = {
  home: {
    introduction: {
      greeting: "hi ankit here. 👋",
      description:
        "Data Analyst by profession, Python developer at heart. I turn messy data into decisions.",
      chatPrompt: "For Q&A, start a chat with Ankit's Assistant",
      escalation: {
        text: "For anything urgent, reach out on",
        linkText: "LinkedIn",
        suffix: "instead.",
      },
    },
    escalationLink: {
      href: "https://www.linkedin.com/in/ankitkumarsingh-in/",
      title: "Ankit on LinkedIn",
    },
  },

  socials: [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/ankitkumarsingh-in/", icon: "linkedin" },
    { name: "GitHub", href: "https://github.com/unknown-arc/", icon: "github" },
    { name: "Email", href: "mailto:ankitkumarsingh.in@gmail.com", icon: "mail" },
  ],

  routes: [
    { path: "index.html", name: "home", description: "Portfolio overview, recent projects, and career highlights", showInNav: true },
    { path: "projects.html", name: "projects", description: "Portfolio projects showcase", showInNav: true },
    { path: "contact.html", name: "contact", description: "Contact form", showInNav: true },
    { path: "privacy.html", name: "privacy", description: "Privacy policy", showInNav: false },
  ],

  // No prior work experience yet — these are the two things Ankit has been doing.
  career: [
    {
      name: "Freelance / Self-Employed",
      href: "https://www.linkedin.com/in/ankitkumarsingh-in/",
      logo: "img/data_analysts.png",
      positions: [
        {
          title: "Data Analyst",
          start: "2025",
          description: [
            "Analyzing datasets and building dashboards & reports using Python (Pandas, NumPy), SQL, and visualization tools like Power BI to support data-driven decisions.",
            "Cleaning, transforming, and automating data pipelines to turn raw data into clear, actionable insights.",
          ],
        },
      ],
    },
    {
      name: "Freelance / Self-Employed",
      href: "https://github.com/unknown-arc/",
      logo: "img/python.png",
      positions: [
        {
          title: "Python Developer",
          start: "2023",
          end: "2024",
          description: [
            "Built small automation scripts, tools, and personal projects in Python, sharpening core programming and problem-solving skills.",
            "Laid the foundation that led into data analysis, working with libraries like Pandas and Matplotlib on early projects.",
          ],
        },
      ],
    },
  ],

  education: [
    {
      name: "Indian Institute of Technology Patna",
      href: "https://www.iitp.ac.in/",
      logo: "img/IIT-Patna.png",
      positions: [
        {
          title: "B.Sc in Computer Science and Data Analytics",
          start: "Dec 2024",
          end: "Present",
          description: [
            "Excellence in Mathematics",
            "Member of ARCANE",
            "Academic CPI Score: 9.12",
          ],
        },
      ],
    },
  ],

  // Only TT4D kept, per request
  projects: [
    {
      name: "TT4D",
      description: "Generate winning combinations, view past results, and analyze lottery trends all in one place",
      image: "img/tt4d.png",
      tags: ["Python", "FastAPI", "Docker", "Fly.io", "NextJS", "PostgreSQL", "TailwindCSS", "BS4"],
      links: [
        { name: "Website", href: "https://huatnumbers.com", icon: "globe" },
        { name: "Source", href: "https://github.com/tedawf/tt4d", icon: "github" },
        { name: "Source (UI)", href: "https://github.com/tedawf/tt4d-web", icon: "github" },
      ],
    },
  ],
};
