// src/data/content.ts
// Single source of truth for every word on the portfolio.
// Values starting with TODO_ are unknown — components must render nothing for them.

export interface Role {
  id: string;
  release: string; // e.g. "release/2025.11"
  company: string;
  title: string;
  type?: string; // Full-time · Intern · Research
  location?: string;
  start: string; // "Nov 2025"
  end: string; // "present"
  duration: string; // "1y"
  current?: boolean;
  description: string;
  tags: string[];
  projects?: RoleProject[];
}

export interface RoleProject {
  name: string;
  url: string;
  summary: string;
  bullets: string[];
}

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

export interface FeaturedProject {
  id: string;
  kicker: string;
  name: string;
  url: string;
  domainLabel: string;
  description: string;
  features: { title: string; text: string }[];
  tech: string[];
  mockTheme: "ops" | "matrimony"; // drives the BrowserFrame abstract UI colours
}

export interface Repo {
  name: string;
  url: string;
  description: string;
  language: string;
  role: "author" | "maintainer" | "contributor";
}

export const site = {
  name: "Sabari S",
  shortName: "SS",
  role: "Full Stack Developer",
  title:
    "Sabari S | Full Stack Developer — Next.js, TypeScript, PostgreSQL, Spring Boot",
  description:
    "Full Stack Developer building and shipping production web platforms end-to-end: Next.js, React, TypeScript, Supabase/PostgreSQL, Java and Spring Boot. Sole developer of two live products serving real users.",
  url: "TODO_DOMAIN", // e.g. https://sabaris.dev — fall back to the Vercel URL
  keywords: [
    "Sabari S",
    "Sabari Sakthivel",
    "sabarisakthivel",
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript",
    "Supabase",
    "PostgreSQL",
    "Row Level Security",
    "Java Developer",
    "Spring Boot",
    "PWA",
    "MCP Server",
    "Coimbatore",
    "Tamil Nadu",
    "Software Developer Coimbatore",
    "GoldenAxe Technology Solutions",
  ],
  themeColor: "#0A0D12",
  location: {
    city: "Coimbatore",
    region: "Tamil Nadu",
    country: "IN",
    countryLong: "India",
    coords: "11.0168° N · 76.9558° E",
    mapsUrl: "https://www.google.com/maps?q=Coimbatore,Tamil+Nadu,India",
    timezone: "IST · UTC+05:30",
    ianaTz: "Asia/Kolkata",
  },
  links: {
    email: "sabaris.officialwork@gmail.com",
    linkedin: "https://www.linkedin.com/in/sabarisakthivel/",
    github: "https://github.com/sabarisakthivel",
    resume: "TODO_RESUME_URL",
    phone: "+91 73958 10790",
    showPhone: false,
  },
  since: "Nov 2025",
  sinceYear: 2025,
} as const;

export const loader = {
  prompt: "sabari@vercel ~/portfolio $ pnpm build && vercel --prod",
  stages: [
    { label: "Type-check", log: "› tsc --noEmit … 0 errors, strict mode" },
    { label: "Migrate", log: "› supabase db push … 65 migrations applied" },
    { label: "Build", log: "› next build … Route (app) / 12.4 kB · static" },
    { label: "Deploy", log: "› vercel --prod … ✓ aliased to production" },
  ],
  skipLabel: "skip ↵",
};

export const nav = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Stack", href: "#stack" },
  { label: "Built", href: "#built" },
  { label: "Resume", href: "TODO_RESUME_URL", external: true },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "Full Stack Developer",
  name: "SABARI S",
  tagline:
    "I build and ship production web platforms end-to-end — database design, APIs, PWA frontends, deployment — as the only developer on the codebase.",
  ctas: {
    primary: { label: "Let's connect", href: "#contact" },
    secondary: { label: "View the work", href: "#work" },
    resume: { label: "Resume", href: "TODO_RESUME_URL" },
  },
  status: [
    { key: "status", value: "operational" },
    { key: "region", value: "Coimbatore · IN" },
    { key: "since", value: "Nov 2025 · 1y shipping" },
    { key: "local", value: "__CLOCK__" }, // component replaces with live IST time
  ],
  identity: {
    filename: "sabari.json",
    fields: {
      name: "Sabari S",
      role: "full-stack developer",
      stack: ["next.js", "typescript", "postgres", "spring-boot"],
      base: "11.0168° N · 76.9558° E",
      tz: "IST · UTC+05:30",
      shipping_since: "2025-11",
      status: "open_to_work",
    },
  },
  commitGraph: [
    "main",
    "feat/zora-mcp-server",
    "feat/knk-rls",
    "merge → main",
    "v1.0 · deployed",
  ],
  marquee: [
    "Next.js",
    "React",
    "TypeScript",
    "JavaScript (ES6+)",
    "Tailwind CSS",
    "PWA",
    "SSR",
    "Supabase",
    "PostgreSQL",
    "Row Level Security",
    "Database Design",
    "Postgres Functions",
    "Realtime",
    "REST APIs",
    "OAuth 2.1",
    "MCP Server",
    "Cashfree",
    "PhonePe",
    "Idempotency",
    "AES-256-GCM",
    "RBAC",
    "Audit Logging",
    "ETL",
    "Java",
    "Spring Boot",
    "Spring Data JPA",
    "Hibernate",
    "MySQL",
    "Docker",
    "OSRM",
    "VROOM",
    "Vercel",
    "Netlify",
    "Git",
    "GitHub",
    "Postman",
    "Unit Testing",
    "Integration Testing",
    "E2E Testing",
    "AI-Assisted Development",
    "Claude",
    "DSA",
  ],
  scrollLabel: "scroll",
};

export const about = {
  label: "01 — // about",
  headline: ["A product is not done when it compiles.", "It's done when real users depend on it."],
  highlight: "real users depend on it",
  lead:
    "One year as the sole developer on two live products — a meal-subscription operations platform and a matrimony platform — from schema to deployment.",
  body: [
    "I build full-stack web platforms end-to-end in Next.js, React, TypeScript and Supabase/PostgreSQL: the database design and Row Level Security policies, the API layer and payment integrations, the installable PWA frontends, and the deployment. Java and Spring Boot are my backend roots — layered architecture, JPA/Hibernate, REST design — and I still reach for them where they fit.",
    "The throughline: correctness you can prove. 280+ tests across projects, deny-by-default security, idempotent payment settlement, and audit logs on every sensitive read. If a feature can silently fail in production, it isn't finished.",
  ],
  principles: [
    {
      title: "Secure by default",
      text: "Deny-by-default RLS, encrypted PII, audit-logged access — decided at the schema, not bolted on later.",
    },
    {
      title: "Prove it with tests",
      text: "Unit, RLS-aware integration and E2E passes gate every release. Green pipelines, not green promises.",
    },
    {
      title: "Own the whole stack",
      text: "Database, API, frontend, payments, deployment — one developer, one accountable codebase.",
    },
  ],
};

export const work = {
  label: "02 — git log --career",
  headline: "Deployment history.",
  roles: [
    {
      id: "goldenaxe",
      release: "release/2025.11",
      company: "GoldenAxe Technology Solutions",
      title: "Software Developer",
      type: "Full-time · On-site",
      location: "Coimbatore, Tamil Nadu, India",
      start: "Nov 2025",
      end: "present",
      duration: "1y",
      current: true,
      description:
        "Sole full-stack developer on two production platforms serving real customers — owning database design, APIs, PWA frontends, payments, security and deployment end-to-end.",
      tags: [
        "Next.js",
        "React",
        "TypeScript",
        "Supabase",
        "PostgreSQL",
        "RLS",
        "PWA",
        "Payments",
        "MCP",
        "Docker",
      ],
      projects: [
        {
          name: "Zora Healthy Foods — Subscription & Delivery Platform",
          url: "https://zorahealthyfoods.com",
          summary:
            "Meal-subscription operations platform: customer PWA, 29-page staff console, realtime delivery board, kitchen production planner and sales CRM — 55 pages, 65 DB migrations, 43 Postgres functions.",
          bullets: [
            "Integrated dual payment gateways (Cashfree + PhonePe) behind one idempotent, provider-agnostic settlement module.",
            "Built a delivery route planner on self-hosted OSRM/VROOM with Docker.",
            "Shipped an MCP server exposing 36 audited AI-assistant tools (OAuth 2.1, scoped tokens) and phone+PIN auth with WhatsApp resets; 183 unit tests on strict TypeScript.",
          ],
        },
        {
          name: "KNK Matrimony — Matrimony Platform",
          url: "https://kovainagaratharkalyanamalai.com",
          summary:
            "Production matrimony platform: member matchmaking app, 12-module admin console (38 routes), custom phone+PIN auth, installable PWA and PDF biodata generation.",
          bullets: [
            "Bank-grade privacy: AES-256-GCM encrypted national IDs, deny-by-default Postgres RLS, gender-aware contact-privacy rules, audit-logged sensitive-data access.",
            "Migrated 800+ real users from a legacy platform with a custom ETL + delta-sync pipeline.",
            "Verified release with 100+ RLS-aware integration tests and a full E2E acceptance pass.",
          ],
        },
      ],
    },
    {
      id: "research-2023",
      release: "release/2023.07",
      company: "Kongu Engineering College",
      title: "Deep Learning Research · Published",
      type: "Research project",
      location: "Erode, Tamil Nadu, India",
      start: "Jul 2023",
      end: "Nov 2023",
      duration: "5m",
      description:
        "Co-authored and published research on voice-based gender recognition, comparing CNN and RNN architectures on audio features. Improved generalisation across diverse vocal datasets with dropout and batch normalisation.",
      tags: ["Python", "TensorFlow/Keras", "Librosa", "CNN", "RNN", "Audio Processing"],
    },
  ] satisfies Role[],
};

export const stats = {
  label: "02a — EXPLAIN ANALYZE",
  headline: "The work, measured.",
  sub: "One year of solo shipping, reduced to numbers.",
  items: [
    { value: 2, label: "Live products shipped as sole developer" },
    { value: 800, suffix: "+", label: "Real users migrated with zero data loss" },
    { value: 280, suffix: "+", label: "Automated tests across projects" },
    { value: 65, label: "Production DB migrations on one platform" },
  ] satisfies Stat[],
};

export const stack = {
  label: "03 — cat package.json",
  headline: "The toolchain, declared.",
  kicker:
    "Everything below has shipped to production in the last year — not a wishlist.",
  filename: "stack.json",
  modeComment: "// mode: ship_end_to_end  · one dev · schema → UI → deploy",
  groups: [
    {
      key: "frontend",
      label: "Frontend",
      items: [
        "Next.js",
        "React.js",
        "TypeScript",
        "JavaScript (ES6+)",
        "HTML5",
        "CSS3",
        "Tailwind CSS",
        "Responsive Design",
        "PWA",
        "SSR / CSR",
        "React Hooks",
        "State Management",
      ],
    },
    {
      key: "backend",
      label: "Backend / API",
      items: [
        "REST API Design",
        "API Integration",
        "CRUD",
        "HTTP/HTTPS",
        "JSON",
        "API Auth (OAuth 2.1)",
        "Authorization",
        "Error Handling",
        "MCP Servers",
        "Payment Gateways (Cashfree, PhonePe)",
      ],
    },
    {
      key: "database",
      label: "Supabase / Database",
      items: [
        "Supabase",
        "PostgreSQL",
        "SQL",
        "Database Design",
        "Row Level Security",
        "Triggers",
        "Postgres Functions",
        "Supabase Storage",
        "Realtime",
        "Indexing",
        "Joins & Keys",
        "Migrations",
      ],
    },
    {
      key: "security",
      label: "Security",
      items: [
        "RBAC",
        "AuthN & AuthZ",
        "Row Level Security",
        "AES-256-GCM",
        "Access Control",
        "Audit Logging",
        "Secure API Design",
      ],
    },
    {
      key: "java",
      label: "Java",
      items: [
        "Java",
        "Core Java & OOP",
        "Collections",
        "Exception Handling",
        "Multithreading",
        "Stream API",
        "Spring Boot",
        "Spring MVC",
        "Spring Data JPA",
        "Hibernate",
        "MySQL",
        "Maven",
      ],
    },
    {
      key: "tooling",
      label: "Development / Tools",
      items: [
        "Git",
        "GitHub",
        "Vercel",
        "Netlify",
        "Docker",
        "Postman",
        "VS Code",
        "IntelliJ IDEA",
        "AI-Assisted Development",
        "Claude",
        "Bubble.io",
      ],
    },
    {
      key: "testing",
      label: "Testing",
      items: [
        "Unit Testing",
        "RLS-aware Integration Tests",
        "E2E Acceptance",
        "Strict TypeScript",
      ],
    },
  ],
  cards: [
    {
      verb: "build",
      title: "Frontend & PWA",
      groups: ["frontend"],
      text: "Next.js, React, TypeScript, Tailwind CSS, PWA, SSR",
    },
    {
      verb: "store",
      title: "Data & APIs",
      groups: ["backend", "database"],
      text: "Supabase, PostgreSQL, RLS, Postgres Functions, REST, MCP",
    },
    {
      verb: "secure",
      title: "Security & Java Backend",
      groups: ["security", "java"],
      text: "RBAC, AES-256-GCM, Audit Logs, Spring Boot, JPA, Hibernate",
    },
  ],
};

export const built = {
  label: "04 — SELECT * FROM projects WHERE status = 'live'",
  headline: "Shipped, not claimed.",
  featured: [
    {
      id: "zora",
      kicker: "live · production · solo developer",
      name: "Zora Healthy Foods",
      url: "https://zorahealthyfoods.com",
      domainLabel: "zorahealthyfoods.com",
      description:
        "A meal-subscription and delivery operations platform: customers subscribe through an installable PWA while staff run the business from a 29-page console — realtime delivery board, kitchen production planner, sales CRM and finance. 55 pages, 65 migrations, 43 Postgres functions, one developer.",
      features: [
        {
          title: "One settlement module, two gateways",
          text: "Cashfree and PhonePe sit behind a single idempotent, provider-agnostic payment layer — retries and webhooks can never double-charge.",
        },
        {
          title: "Route planning on your own metal",
          text: "Delivery runs are optimised on self-hosted OSRM + VROOM in Docker, so routing costs nothing per request.",
        },
        {
          title: "AI-ready by design",
          text: "An MCP server exposes 36 audited tools behind OAuth 2.1 and scoped tokens, so assistants can operate the platform safely.",
        },
      ],
      tech: [
        "Next.js",
        "React",
        "TypeScript",
        "Supabase",
        "PostgreSQL",
        "Cashfree",
        "PhonePe",
        "OSRM/VROOM",
        "Docker",
        "MCP",
      ],
      mockTheme: "ops",
    },
    {
      id: "knk",
      kicker: "live · production · solo developer",
      name: "KNK Matrimony",
      url: "https://kovainagaratharkalyanamalai.com",
      domainLabel: "kovainagaratharkalyanamalai.com",
      description:
        "A community matrimony platform: members browse and match through a PWA, admins manage everything from a 12-module console with 38 routes, and biodata is generated as PDF on demand. 800+ real users migrated from a legacy system without a single lost record.",
      features: [
        {
          title: "Bank-grade privacy",
          text: "National IDs encrypted with AES-256-GCM, deny-by-default Postgres RLS, and gender-aware contact-privacy rules.",
        },
        {
          title: "Every sensitive read is logged",
          text: "Audit logging on sensitive-data access gives admins a full trail of who saw what, when.",
        },
        {
          title: "Migration you can trust",
          text: "Custom ETL + delta-sync moved 800+ users; 100+ RLS-aware integration tests and a full E2E pass verified the cut-over.",
        },
      ],
      tech: [
        "Next.js",
        "React",
        "TypeScript",
        "Supabase",
        "PostgreSQL",
        "RLS",
        "AES-256-GCM",
        "PWA",
        "PDF Generation",
      ],
      mockTheme: "matrimony",
    },
  ] satisfies FeaturedProject[],
  reposLabel: "open source · github.com/sabarisakthivel",
  repos: [
    {
      name: "leave-management-backend",
      url: "https://github.com/sabarisakthivel/leave-management-backend",
      description:
        "Employee Leave Management REST API — Spring Boot, Spring Data JPA, MySQL. Leave requests, status tracking and admin approval workflows in a layered Controller-Service-Repository architecture.",
      language: "Java",
      role: "author",
    },
    {
      name: "student-management-backend",
      url: "https://github.com/sabarisakthivel/student-management-backend",
      description:
        "Student Management REST API — Spring Boot, JPA, MySQL. Students, courses and academic records with structured API responses and consistent error handling.",
      language: "Java",
      role: "author",
    },
    {
      name: "Java",
      url: "https://github.com/sabarisakthivel/Java",
      description:
        "Core Java learning repository: data types, arrays, OOP, collections and hands-on example programs.",
      language: "Java",
      role: "author",
    },
    {
      name: "Instagram_Clone",
      url: "https://github.com/sabarisakthivel/Instagram_Clone",
      description:
        "Responsive Instagram-inspired UI in React + Bootstrap — feed, stories and suggestions from JSON data with reusable components.",
      language: "JavaScript",
      role: "author",
    },
    {
      name: "login_validation",
      url: "https://github.com/sabarisakthivel/login_validation",
      description:
        "React login demo focused on input validation and clear error handling.",
      language: "JavaScript",
      role: "author",
    },
  ] satisfies Repo[],
  publication: {
    label: "publication",
    title: "Voice-Based Gender Recognition using Deep Learning",
    period: "Jul 2023 → Nov 2023",
    text:
      "Published research comparing CNN and RNN architectures for gender classification from voice. Dropout and batch normalisation improved generalisation across diverse vocal datasets.",
    tags: ["Python", "TensorFlow/Keras", "Librosa", "CNN", "RNN", "Audio Processing"],
  },
  education: [
    {
      degree: "B.Tech",
      field: "Artificial Intelligence & Data Science",
      institution: "Kongu Engineering College",
      location: "Erode, Tamil Nadu",
      period: "2021 → 2025",
      score: "CGPA 7.38 / 10",
    },
    {
      degree: "HSC",
      field: "Higher Secondary",
      institution: "PKD Matriculation Higher Secondary School",
      location: "Pollachi, Tamil Nadu",
      period: "2020 → 2021",
      score: "93.79%",
    },
  ],
};

export const contact = {
  label: "05 — curl -X POST /contact",
  headline: ["Let's connect", "and build something real."],
  highlight: "build something real",
  body:
    "Open to Full Stack and Backend roles — any location, immediate joiner. Happy to talk Next.js, Postgres RLS, payment integrations, or the platform your team is trying to ship with too few hands.",
  copyCommand: "$ echo sabaris.officialwork@gmail.com | pbcopy",
  copiedLabel: "✓ copied to clipboard",
  meta: [
    { key: "base", value: "Coimbatore, Tamil Nadu, IN" },
    { key: "tz", value: "IST · UTC+05:30" },
    { key: "availability", value: "immediate joiner · any location" },
  ],
};

export const footer = {
  line: "© 2026 · built with Next.js · deployed on Vercel from Coimbatore · status: operational",
  links: [
    { label: "LinkedIn", href: site.links.linkedin },
    { label: "GitHub", href: site.links.github },
    { label: "Email", href: `mailto:${site.links.email}` },
  ],
  backToTop: "Back to top ↑",
};
