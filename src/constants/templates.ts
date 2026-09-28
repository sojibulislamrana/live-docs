export const templates = [
  {
    id: "blank",
    label: "Blank document",
    imageUrl: "/blank-document.svg",
    initialContent: "",
  },
  {
    id: "software-proposal",
    label: "Software development proposal",
    imageUrl: "/software-proposal.svg",
    initialContent: `
      <h1>Software Development Proposal</h1>
      <h2>Project overview</h2>
      <p>Describe the problem, goals, and proposed solution.</p>
      <h2>Scope of work</h2>
      <ul>
        <li>Discovery and planning</li>
        <li>Implementation</li>
        <li>Testing and launch</li>
      </ul>
    `,
  },
  {
    id: "project-proposal",
    label: "Project proposal",
    imageUrl: "/project-proposal.svg",
    initialContent: `
      <h1>Project Proposal</h1>
      <h2>Summary</h2>
      <p>Outline the project objectives, timeline, and expected outcomes.</p>
    `,
  },
  {
    id: "business-letter",
    label: "Business letter",
    imageUrl: "/business-letter.svg",
    initialContent: `
      <p>Dear [Name],</p>
      <p>Write your message here.</p>
      <p>Sincerely,<br/>[Your name]</p>
    `,
  },
  {
    id: "resume",
    label: "Resume",
    imageUrl: "/resume.svg",
    initialContent: `
      <h1>Your Name</h1>
      <p>Email · Phone · Location</p>
      <h2>Experience</h2>
      <p>Add your most relevant roles here.</p>
      <h2>Education</h2>
      <p>Add your education here.</p>
    `,
  },
  {
    id: "cover-letter",
    label: "Cover letter",
    imageUrl: "/cover-letter.svg",
    initialContent: `
      <p>Dear Hiring Manager,</p>
      <p>Introduce yourself and explain why you are a strong fit for this role.</p>
      <p>Sincerely,<br/>[Your name]</p>
    `,
  },
  {
    id: "letter",
    label: "Letter",
    imageUrl: "/letter.svg",
    initialContent: `
      <p>Hello,</p>
      <p>Write your letter here.</p>
    `,
  },
];
