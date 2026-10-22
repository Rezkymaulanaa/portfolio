// English texts of the website (everything that is not edited in the Studio).
// id.ts must have exactly the same keys; TypeScript reports a missing one.
// "{name}" parts are filled in by the code.

export const en = {
  meta: {
    portfolio: "Portfolio",
    workTitle: "Work",
    workDescription:
      "All projects by Alif Rezky Maulana: UI/UX design, web development and graphic design, from real client projects to personal explorations.",
    projectImageAlt: "Project from the portfolio of Alif Rezky Maulana",
  },
  common: {
    letsTalk: "Let’s Talk",
    back: "Back",
    backToTop: "Back to top",
    skipToContent: "Skip to content",
    language: "Language",
  },
  nav: {
    label: "Main",
    open: "Open navigation",
    work: "Work",
    service: "Service",
    capabilities: "Capabilities",
    about: "About Me",
  },
  hero: {
    browseProjects: "Browse Projects",
  },
  work: {
    watermark: "Portfolio",
    selectedWork: "Selected Work",
    allWork: "All Work",
    viewAll: "View All work",
    moreWork: "More Work",
    filterLabel: "Filter projects",
    all: "All",
    empty: "No projects in this category yet.",
  },
  category: {
    "real-project": "Real Project",
    exploration: "Exploration",
  },
  service: {
    watermark: "Service",
    title: "Service",
  },
  capabilities: {
    watermark: "Capabilities",
    title: "Main Skills & Tools",
    tools: "Tools that i usually use",
  },
  about: {
    watermark: "About",
    title: "About Me",
    downloadCv: "Download CV",
  },
  education: {
    title: "/Education",
    graduated: "Graduated · 2026",
    degreeLevel: "Bachelor’s Degree",
    major: "Information Systems",
    gpa: "GPA",
  },
  project: {
    service: "Service",
    timeline: "Timeline",
    tools: "Tools",
    livePreview: "Live Preview",
    contents: "Contents",
    sectionsLabel: "Case study sections",
    problem: "Problem",
    solution: "Solution",
  },
  footer: {
    ctaHeading: "Have a project in mind?",
  },
  notFound: {
    title: "Page not found",
    text: "The page you are looking for does not exist or has been moved.",
    backHome: "Back to home",
  },
  contact: {
    status: "Usually replies within 1–2 days",
    close: "Close message panel",
    intro:
      "Hi! Tell me a bit about your project or idea. Your message goes straight to my email, and I’ll reply to you there.",
    sent: "Message sent ✓",
    thanks: "Thanks, {name}! I got your message and will reply to {email} soon.",
    sendAnother: "Send another message",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@email.com",
    message: "Message",
    messagePlaceholder: "What are you working on?",
    send: "Send message",
    sending: "Sending…",
    emailDirectly: "You can also email me directly at",
    preferEmail: "Prefer email?",
    copyEmail: "Copy {email}",
    copied: "Copied!",
    errors: {
      name: "Please enter your name.",
      email: "Please enter a valid email address.",
      message: "Please write a message of at least 10 characters.",
      links: "Please include at most {max} links.",
      timedOut: "This form timed out. Please press send again.",
      tooMany: "You have sent several messages already. Please try again later.",
      notSetUp: "Sending is not set up yet.",
      failed: "Your message could not be sent.",
    },
  },
};

export type Dictionary = typeof en;
