// Single source of truth for the site's content. Edit here; every page reads from it.
import { builtProjects } from './content/projects.js';
import media from './content/media.json';

export const site = {
  name: 'Ajwa Malik',
  role: 'Full-stack developer & SEO engineer',
  email: 'khanajwa950@gmail.com',
  socials: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ajwa-malik-18a2a5353/' },
    { label: 'GitHub', url: 'https://github.com/ajwahkhan1234' },
  ],
  timezone: 'Asia/Dubai',
};

export const services = [
  {
    title: 'Web builds',
    body: 'Marketing sites, storefronts and web apps in Next.js, React and WordPress, shipped to Vercel or managed hosting.',
  },
  {
    title: 'Technical SEO',
    body: 'Crawl and indexing diagnosis, canonical and sitemap repair, schema, Core Web Vitals and content architecture.',
  },
  {
    title: 'WordPress engineering',
    body: 'Custom themes, Elementor kits, plugins and malware recovery for sites that have been compromised.',
  },
  {
    title: 'Automation',
    body: 'Internal tools, data pipelines and local-AI assistants that take repetitive work off a team.',
  },
];


// SEO case studies: Search Console figures for Jun 30 – Sep 28, 2026, read from GSC.
const seoFiles = import.meta.glob('./content/seo/*.json', { eager: true, import: 'default' });
const seoColors = {
  'blanks-boutique': ['#c2185b', '#f8bbd0', '#1a0610'],
  'kincer-chassis': ['#ff6a00', '#ffd5b3', '#121212'],
  'catalina-spas': ['#0277bd', '#b3e5fc', '#031a29'],
  'bfp-law-firm': ['#f2c200', '#fff0a6', '#0d0d0d'],
  'aqua-gym-swim-spas': ['#00acc1', '#b2ebf2', '#02191c'],
  'chriss-pressure-washing': ['#e65100', '#ffccbc', '#1a0a02'],
};
const seoProjects = Object.values(seoFiles)
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
  .map((c) => ({
    slug: c.slug,
    title: c.clientName,
    client: `${c.industry} · ${c.market}`,
    category: 'SEO',
    year: '2026',
    role: 'SEO lead',
    stack: c.services,
    colors: seoColors[c.slug] || ['#ff4f9a', '#ffd1e6', '#14070d'],
    mark: c.clientName[0],
    summary: `${c.headline.value} ${c.headline.label}.`,
    challenge: c.challenge,
    solution: c.summary,
    features: c.approach,
    results: c.results,
    metrics: c.highlightMetrics.map((m) => ({ label: m.label, value: (m.value || m.change || m.after).replace('≈', ''), note: m.before ? `${m.before} → ${m.after}` : m.note })),
    dataWindow: c.dataWindow,
    url: c.websiteUrl,
  }));

// Home gallery shows these, in this order.
const featured = ['kincer-chassis', 'quantum', 'route72', 'blanks-boutique', 'kendall-law', 'le-crazy-dubai', 'bfp-law-firm', 'driverite-autos'];

export const categories = ['SEO', 'Web app', 'Website', 'WordPress', 'Site care', 'Concept', 'Tool'];

export const projects = [...seoProjects, ...builtProjects]
  .map((p) => ({ ...p, ...(media[p.slug] || {}) }))
  .sort((a, b) => categories.indexOf(a.category) - categories.indexOf(b.category));

export const featuredProjects = featured.map((s) => projects.find((p) => p.slug === s)).filter(Boolean);

// Career, from the CV (Ajwa_Malik_CV_Full-Stack_AI_Developer.pdf). Newest first.
export const experience = [
  {
    company: 'Digital Engage', logo: '/logos/digital-engage.webp', role: 'Senior Full-Stack Developer',
    dates: 'Sep 2026 – Present', place: 'Tennessee, USA · Remote',
    points: [
      'Build and ship full-stack web apps and client websites for a US digital agency in React, Next.js, Node.js, PHP, WordPress, WooCommerce and Shopify.',
      'Own features end to end, from scoping and architecture through code review, QA, deployment and post-launch support.',
      'Set performance, security and code-quality standards through reusable components, API integrations and Core Web Vitals work.',
      'Built the CMSC technical paper archive, a WordPress plugin that stores and searches decades of papers with member-only access.',
      'Delivered review rounds on client sites such as Infinite Abilities ABA, working through structured client feedback to sign-off.',
      'Scoped and documented the move of a WooCommerce build to catalogue mode, with a written plan the client could approve.',
    ],
  },
  {
    company: 'Maximum Vapor', logo: '/logos/maximum-vapor.svg', logo2: '/logos/vape-closeouts.webp', dark: true, role: 'Senior Shopify / Full-Stack Developer',
    dates: 'Jun 2026 – Present', place: 'Los Angeles, USA · Remote',
    points: [
      'Architected and delivered Quantum, the company’s multi-state tax platform: sales/use tax, vapor excise and PACT Act returns for 85 registrations across 33 states.',
      'Built store connectors for 8 commerce platforms behind one normalizer, with OAuth, encrypted credentials and a one-click WooCommerce pairing plugin.',
      'Shopify storefronts, a React homepage redesign with a compliance age gate, and technical SEO for Vape Closeouts and MIA Tyson Vape Deals.',
      'Grew Vape Closeouts to 161K impressions and 3.32K organic clicks in three months, and took MIA Tyson Vape Deals from no rankings to 11.5K impressions.',
      'Backed tax lookups with a 59,600-row US jurisdiction directory and a daily sync cron, tested against in-process Postgres.',
      'Imported Shopify order history as PACT Act shipment records, and redesigned the RedHawk and Suorin USA storefronts.',
    ],
  },
  {
    company: 'ServeTech Global', logo: '/logos/servetech.webp', role: 'PHP / WordPress Developer',
    dates: 'Jan 2026 – Present', place: 'Lachine, Canada · Remote',
    points: [
      'Custom PHP on WordPress and WooCommerce, including legacy code. Delivered a PHP 7.4 to 8 upgrade after patching a site-down blocker in a third-party plugin.',
      'Migrated 168 products with reviews and WebP images to a new host, verified 168 of 168.',
      'Built ServeTech Shield, a malware scanning and hardening plugin now running on the company’s 5 sites.',
      'Engineered reusable plugin architecture across Elementor, Divi, Gutenberg and Bricks to standardise delivery.',
      'Recovered and hardened client WordPress sites across shared, managed and WP Engine hosting, then set up ongoing monitoring.',
      'Fixed legacy-site issues end to end: reCAPTCHA on old PHP servers, broken WooCommerce databases and theme conflicts.',
    ],
  },
  {
    company: 'Inovista', logo: '/logos/inovista.svg', role: 'Founder / Full-Stack Developer',
    dates: 'Dec 2025 – Present', place: 'United Kingdom · Remote',
    points: [
      'Founded and run a studio building websites and custom software for US law firms and SaaS clients, from scoping to handoff.',
      'Built the studio’s AI tooling: FirmScope (LangGraph agent), a 12-agent SEO engine with RAG, and an ops dashboard.',
      'Run the internal systems the team uses every week: PayPoint (time clock and payroll) and Huddle (task management).',
      'Built the Inovista website: a Next.js studio site for US law firms with a 3D parallax hero, in-hero lead capture and a 27-page SEO package.',
      'Launched the Inovista Plugin Store on Shopify, selling Inovista Shield, Review Engine and ClickFix Remover as downloads.',
      'Built Client Finder (law-firm discovery, audit and outreach) and Rank Check (geo-accurate Google rank reports).',
    ],
  },
  {
    company: '22 Signals', logo: '/logos/22-signals.webp', role: 'Senior Full-Stack Developer',
    dates: 'Nov 2025 – Present', place: 'US digital agency · Remote',
    points: [
      'Lead end-to-end development for US clients in TypeScript, React, Node.js, PHP and MySQL.',
      'Built Review Engine, a WordPress plugin that merges Google reviews from three sources, with a tamper-detecting lock and 104 automated tests.',
      'Led security incident response on 8+ WordPress sites: forensics, clean-up, hardening and monitoring.',
      'Designed normalized MySQL schemas exposed through REST APIs and webhooks for intake, lead capture and CRM workflows.',
      'Built LeadGen CRM integrations: Google Places, Apollo and Hunter enrichment, and Calendar and Gmail OAuth.',
      'Own architecture, testing, deployment and maintenance for each client from first commit to post-launch support.',
    ],
  },
  {
    company: 'Tarjeeh', logo: '/logos/tarjeeh.webp', role: 'Web Developer & Team Lead',
    dates: 'Jun 2024 – Dec 2025', place: 'Dubai, UAE · Remote',
    points: [
      'Built 30+ responsive websites and web apps on WordPress, WooCommerce and Shopify.',
      'Integrated payment gateways, CRMs and analytics, with strong PageSpeed scores through lazy loading, code splitting and compression.',
      'Led a delivery team across 20+ simultaneous client projects.',
      'Coordinated scoping, QA and deployment for every project the team shipped.',
      'Delivered cross-browser, cross-device builds with lazy loading, code splitting and asset compression as standard.',
    ],
  },
  {
    company: 'Petalnex & Pixel', logo: '/logos/petalnex.webp', role: 'UI Designer & Front-End Developer',
    dates: 'Jan 2023 – Nov 2025', place: 'UAE / United Kingdom · Remote',
    points: [
      'Converted 50+ Figma and Adobe XD designs into responsive, mobile-first websites on WordPress and Webflow.',
      'Delivered branding systems and redesigns focused on accessibility, UI consistency and clean developer handoff.',
      'Produced design systems and component libraries so developers could build pages without guesswork.',
      'Worked across UAE and UK clients on redesigns, landing pages and brand refreshes.',
    ],
  },
];

export const education = [
  { title: 'Bachelor of Cardiology Technology', place: 'Khyber Medical University, Abbottabad', dates: '2024 – 2028' },
  { title: 'Certifications', place: 'Responsive Web Design (University of London) · HTML, CSS & JavaScript (Johns Hopkins) · Programming Foundations (Duke) · Python Basics (Michigan) · Google UX Design · Google Analytics', dates: '' },
];

export const tools = [
  'Next.js', 'React', 'Vite', 'Three.js', 'GSAP', 'Node',
  'WordPress', 'Elementor', 'PHP', 'Shopify', 'Medusa', 'Postgres',
  'Neon', 'Vercel', 'Playwright', 'Python', 'Ollama', 'Figma',
];

export const principles = [
  { title: 'Measure first', body: 'Every fix starts from a number I can check again afterwards.' },
  { title: 'Small and correct', body: 'The smallest change that solves the real problem, not the one that looks impressive.' },
  { title: 'Owner-editable', body: 'If the client cannot change it without me, the job is not finished.' },
];
