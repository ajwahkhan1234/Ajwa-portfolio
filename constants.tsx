
import React from 'react';
import { ServiceItem, ExperienceItem, EducationItem, CertificateItem, ProjectItem, ProcessItem, TestimonialItem, SkillProof } from './types';
import { Code, Palette, PenTool, Layout, Monitor, Database } from 'lucide-react';

export const PERSONAL_INFO = {
  name: "Ajwah Malik",
  tagline: "Full-Stack Web Developer | React & TypeScript Engineer | UI/UX Designer",
  bio: "I build fast, scalable, and beautifully designed digital products — from React + TypeScript apps to enterprise dashboards, portals, CRM systems, WordPress websites, Webflow sites, and complete brand identities.",
  intro_short: "I design and code beautifully simple things, and I love what I do.",
  email: "Khanajwa950@gmail.com",
  phone: "+92 346 523 5660",
  whatsapp_clean: "923465235660", // Removed spaces for API usage
  location: "Mansehra, Pakistan",
  resume: "https://ajwahmalikcv.tiiny.site/",
  social: {
    portfolio: "https://designsbyajwah.framer.website/",
    linkedin: "https://www.linkedin.com/in/ajwa-malik-18a2a5353/",
    github: "https://github.com/ajwahkhan1234"
  }
};

export const SKILLS_COLUMNS = [
  {
    id: "designer",
    icon: "layout",
    title: "UI/UX Designer",
    description: "I value simple content structure, clean design patterns, and thoughtful interactions.",
    heading: "Things I enjoy designing:",
    items: ["UX", "Web", "Apps", "Logos", "Brand Identity"],
    toolsHeading: "Design Tools:",
    tools: ["Figma", "Webflow", "Pen & Paper", "FontAwesome", "Canva", "Adobe Illustrator"]
  },
  {
    id: "frontend",
    icon: "code",
    title: "Frontend Developer",
    description: "I like to code things from scratch, and enjoy bringing ideas to life in the browser.",
    heading: "Languages I speak:",
    items: ["HTML", "CSS", "Sass", "JavaScript", "TypeScript"],
    toolsHeading: "Dev Tools:",
    tools: ["React", "Vite", "Tailwind CSS", "Bootstrap", "VS Code", "Github", "Terminal"]
  },
  {
    id: "mentor",
    icon: "monitor",
    title: "Full Stack & CMS",
    description: "I genuinely care about performance, SEO, and delivering complete business solutions.",
    heading: "Experiences I have:",
    items: ["eCommerce", "SaaS", "Dashboards", "Mentorship", "Project Management"],
    toolsHeading: "Platform & Tech:",
    tools: ["WordPress", "Shopify", "WooCommerce", "PHP", "MySQL", "cPanel", "REST APIs"]
  }
];

export const SKILL_PROOFS: SkillProof[] = [
  {
    id: "react-state",
    name: "React & Hooks",
    category: "frontend",
    shortDescription: "Advanced state orchestration and component lifecycle management.",
    proofTitle: "Optimized Search Architecture",
    proofDescription: "Implemented a custom debouncing hook combined with a reducer to manage complex search states in the Inovista CRM, reducing API calls by 70%.",
    codeSnippet: `const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// In Component:
const debouncedSearch = useDebounce(searchTerm, 500);
useEffect(() => {
  if (debouncedSearch) dispatch({ type: 'FETCH_START', query: debouncedSearch });
}, [debouncedSearch]);`,
    realWorldImpact: "Reduced server load during peak client portal usage and ensured a snappy, zero-lag search experience for thousands of records.",
    relatedProjects: ["inovista-tech", "kendall-law-crm", "nexus-v-platform", "dnaar-property"]
  },
  {
    id: "typescript-safety",
    name: "TypeScript",
    category: "frontend",
    shortDescription: "Enterprise-grade type safety and API contract enforcement.",
    proofTitle: "Discriminated Unions for CRM Roles",
    proofDescription: "Engineered a strictly typed permission system using Discriminated Unions to prevent unauthorized access at the UI layer.",
    codeSnippet: `type UserRole = 'ADMIN' | 'CLIENT' | 'GUEST';

interface BaseUser {
  id: string;
  role: UserRole;
}

interface AdminUser extends BaseUser {
  role: 'ADMIN';
  managePermissions: (id: string) => void;
}

interface ClientUser extends BaseUser {
  role: 'CLIENT';
  projectId: string;
}

type User = AdminUser | ClientUser;

function handleDashboard(user: User) {
  if (user.role === 'ADMIN') {
    user.managePermissions('123'); // Safe
  } else {
    // user.managePermissions('123'); // Error: Property does not exist
    console.log(user.projectId);
  }
}`,
    realWorldImpact: "Eliminated 'Undefined' runtime errors in production by 95% and enabled confident refactoring across the Kendall Law codebase.",
    relatedProjects: ["kendall-law-crm", "nexus-v-platform", "fm-group-uae"]
  },
  {
    id: "tailwind-ui",
    name: "Tailwind CSS",
    category: "frontend",
    shortDescription: "Modern, utility-first styling with complex responsive layouts.",
    proofTitle: "Responsive Grid System",
    proofDescription: "Crafted a complex dashboard grid that adapts from a single column mobile view to a high-density multi-panel layout on 4K displays.",
    codeSnippet: `<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
  <aside className="md:col-span-3 xl:col-span-2 hidden md:block">
    {/* Navigation */}
  </aside>
  <main className="md:col-span-9 xl:col-span-10 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
    {/* Dynamic Cards */}
  </main>
</div>`,
    realWorldImpact: "Ensured the Inovista CRM remains fully functional on tablets for field agents while providing maximal data density for desktop admins.",
    relatedProjects: ["inovista-tech", "broke2-engineer", "zenith-real-estate", "mirdef-shipping"]
  },
  {
    id: "figma-ux",
    name: "Figma & UX",
    category: "design",
    shortDescription: "Data-driven design systems and high-fidelity prototyping.",
    proofTitle: "Atomic Design System",
    proofDescription: "Developed a scalable UI library in Figma with over 200 components, ensuring brand consistency across web and mobile platforms.",
    realWorldImpact: "Accelerated development handoff by 40% for the WoMiles ride-hailing app and ensured pixel-perfect implementation of the brand identity.",
    relatedProjects: ["womiles", "bazm-e-khushboo", "lavazza-coffee"]
  },
  {
    id: "wordpress-custom",
    name: "WordPress",
    category: "cms",
    shortDescription: "Custom theme development and headless CMS integrations.",
    proofTitle: "Advanced Custom Fields Logic",
    proofDescription: "Implemented custom PHP hooks to dynamically filter project portfolios based on construction sector and sustainability metrics.",
    codeSnippet: `add_action( 'pre_get_posts', 'filter_projects_by_sector' );
function filter_projects_by_sector( $query ) {
    if ( ! is_admin() && $query->is_main_query() && is_post_type_archive('projects') ) {
        if ( isset($_GET['sector']) ) {
            $query->set( 'meta_key', 'project_sector' );
            $query->set( 'meta_value', $_GET['sector'] );
        }
    }
}`,
    realWorldImpact: "Allowed Galliford Try to showcase their massive project database with lightning-fast client-side filtering.",
    relatedProjects: ["galliford-try", "morgan-sindall", "heritage-estates", "dnaar-property"]
  },
  {
    id: "rest-apis",
    name: "REST APIs & PHP",
    category: "backend",
    shortDescription: "Secure server-side logic and robust API integrations.",
    proofTitle: "Secure Land Law Calculator API",
    proofDescription: "Engineered a PHP-based backend service that processes complex legal calculations for US land laws with bank-grade precision.",
    codeSnippet: `public function calculateRentEscalation($baseRate, $years, $cap) {
    $current = $baseRate;
    for ($i = 0; $i < $years; $i++) {
        $increase = min($current * 0.03, $cap); // 3% increase capped
        $current += $increase;
    }
    return round($current, 2);
}`,
    realWorldImpact: "Replaced error-prone manual Excel calculations for Kendall Law, processing over 500 accurate legal estimates monthly.",
    relatedProjects: ["kendall-law-crm", "nexus-v-platform", "fm-group-uae"]
  }
];

export const PROCESS_STEPS: ProcessItem[] = [
  {
    id: "discovery",
    title: "Discovery & Strategy",
    description: "I start by understanding your business goals, target audience, and the problem we're solving. No assumptions, just clarity.",
    icon: "search"
  },
  {
    id: "design",
    title: "Design & Prototype",
    description: "I translate requirements into intuitive user flows and high-fidelity visuals, ensuring the interface is both beautiful and functional.",
    icon: "layout"
  },
  {
    id: "development",
    title: "Development",
    description: "Using modern tech stacks like React & TypeScript, I build scalable, high-performance applications that are built to last.",
    icon: "code"
  },
  {
    id: "launch",
    title: "Launch & Growth",
    description: "Rigorous testing, optimization, and seamless deployment. I ensure everything runs perfectly from day one.",
    icon: "rocket"
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "inovista",
    name: "Operations Director",
    role: "Inovista Digital",
    content: "The CRM Ajwah built for us completely transformed our agency workflow. She turned our fragmented spreadsheets into a unified, high-performance dashboard. The dual portal system for admins and clients is a game-changer.",
    rating: 5
  },
  {
    id: "kendall",
    name: "Senior Partner",
    role: "Kendall Law",
    content: "We needed complex land law calculators integrated directly into our client management system. Ajwah delivered a solution that is not only mathematically precise but also incredibly user-friendly. Her attention to detail saved us hours of manual work.",
    rating: 5
  },
  {
    id: "bazm",
    name: "Marketing Head",
    role: "Bazm-e-Khushboo",
    content: "Our brand needed to exude luxury and tradition. Ajwah's design work on our logo and packaging was simply exquisite. She captured the essence of 'royal scent' perfectly in the visual identity.",
    rating: 5
  },
  {
    id: "womiles",
    name: "Sarah Jenkins",
    role: "Founder, WoMiles",
    content: "Safety and trust were our top priorities. Ajwah designed a brand identity that instantly communicates reliability to our female customers. Her understanding of color psychology and brand strategy is top-notch.",
    rating: 5
  },
  {
    id: "galliford",
    name: "Project Lead",
    role: "Galliford Try",
    content: "Professional, timely, and incredibly talented. The corporate website Ajwah developed for us perfectly represents our company's stature in the construction industry. She is a true expert in her field.",
    rating: 5
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: "web-development",
    title: "Web Development",
    description: "High-performance React applications, dashboards, and CMS solutions.",
    icon: "code",
    features: [
      "React, TypeScript, Vite-based applications",
      "Custom dashboards and admin panels",
      "API-driven portal systems and client portals",
      "Custom CRM systems (role-based access)",
      "WordPress, Webflow, Shopify, WooCommerce",
      "PHP + MySQL development"
    ],
    link: "/services/web-development"
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    description: "User-centric design flows, high-fidelity prototypes, and design systems.",
    icon: "layout",
    features: [
      "User flows, wireframes, high-fidelity UI",
      "Design systems & reusable component libraries",
      "Mobile-first responsive layouts",
      "Accessibility (WCAG) compliant design",
      "Prototyping in Figma (interactive flows)"
    ],
    link: "/services/ui-ux-design"
  },
  {
    id: "branding",
    title: "Branding & Creative",
    description: "Complete brand identity, logos, and marketing assets.",
    icon: "pen",
    features: [
      "Logo design & brand identity systems",
      "Social media kits, pitch decks, marketing assets",
      "Canva & Adobe Illustrator branding workflows",
      "UI style guides & components",
      "High-end marketing visuals"
    ],
    link: "/services/branding"
  }
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    role: "Remote Team Lead – Website Development",
    company: "Tarjeeh UAE",
    location: "Dubai (Remote)",
    period: "May 2024 – Present",
    responsibilities: [
      "Directed end-to-end development of high-performing Shopify, WooCommerce, and custom websites.",
      "Managed cross-functional remote teams ensuring seamless coordination.",
      "Consistently delivered the highest number of successful websites in the team.",
      "Implemented efficient project workflows, reducing turnaround time."
    ]
  },
  {
    role: "UI/UX Designer",
    company: "Petalnex Pvt. Ltd.",
    location: "Dubai (Remote)",
    period: "March 2025 – Present",
    responsibilities: [
      "Designed mobile and web interfaces in Figma for enterprise platforms.",
      "Worked on design systems and atomic layouts to accelerate dev handoffs.",
      "Participated in weekly sprint planning and UX research sessions.",
      "Provided detailed design documentation and redlines for frontend developers."
    ]
  },
  {
    role: "Web Developer",
    company: "Firnas Tech",
    location: "Abbottabad",
    period: "Jul 2023 – Aug 2024",
    responsibilities: [
      "Developed and maintained company websites using HTML, CSS, JavaScript, and WordPress.",
      "Collaborated with designers to build responsive UI components.",
      "Assisted in backend integrations and deployed websites using cPanel."
    ]
  },
  {
    role: "Professional Graphic Designer",
    company: "PixelCue Creative Studio",
    location: "Remote",
    period: "Jan 2023 – May 2024",
    responsibilities: [
      "Designed branding assets, social media creatives, and pitch decks.",
      "Worked across various industries including fintech, real estate, and education."
    ]
  }
];

export const EDUCATION: EducationItem[] = [
  {
    degree: "Bachelor of Medicine (In Progress)",
    institution: "Ongoing",
    period: "Feb 2024 - Ongoing"
  },
  {
    degree: "Bachelor’s in Cardiology Technology",
    institution: "Khyber Medical University",
    details: "Current GPA: 3.7/4.0. Actively involved in academic research and medical design projects."
  }
];

export const CERTIFICATES: CertificateItem[] = [
  {
    name: "Google UX Design",
    provider: "Coursera",
    link: "https://www.coursera.org/account/accomplishments/verify/HFP3Z1UM0DSE"
  },
  {
    name: "HTML, CSS, and Javascript for Web Developers",
    provider: "The Johns Hopkins University",
    link: "https://www.coursera.org/account/accomplishments/verify/HFP3Z1UM0DSE"
  },
  {
    name: "Responsive Web Design",
    provider: "University of London",
    link: "https://www.coursera.org/account/accomplishments/verify/ZF5Y4JUYYHOX"
  },
  {
    name: "Python Basics",
    provider: "University of Michigan",
    link: "https://www.coursera.org/account/accomplishments/verify/FXV9YR3BTDDU"
  },
  {
    name: "Programming Foundations with JavaScript, HTML, and CSS",
    provider: "Duke University",
    link: "https://www.coursera.org/account/accomplishments/verify/DDUWVSUP9WY7"
  },
  {
    name: "Google Ads Search Certification",
    provider: "Skillshop Credential",
    link: "https://skillshop.credential.net/7da56566-8ce3-49db-b463-41873c7fdca5#acc.XOMjE0px"
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: "inovista-tech",
    title: "Inovista Tech",
    category: "Web Apps",
    description: "A comprehensive CRM system for a digital marketing agency handling websites, social media management, apps, and client communications.",
    techStack: ["React", "Node.js", "Tailwind CSS", "REST API", "Recharts"],
    imageUrl: "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-15.png",
    gallery: [
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-15.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-11-1.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-13-1.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-21-1.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-24-3.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-25-2.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-27-2.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-28-3.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-30-2.png"
    ],
    liveLink: "https://portal.inovista.co.uk/",
    client: "Inovista Digital",
    role: "Full Stack Developer",
    year: "2024",
    fullDescription: "Inovista Tech is a bespoke CRM solution designed for a full-service digital marketing agency. The system acts as the central nervous system for the agency, managing diverse workflows including website development projects, social media content calendars, app development sprints, and general client relationship management.",
    problem: "The agency struggled with fragmented tools—using Trello for tasks, Spreadsheets for financial reporting, and email for client communication.",
    solution: "I developed a unified platform featuring distinct Admin and Client portals. The solution centralizes project management and provides clients with a real-time view of their campaign metrics.",
    features: [
      "Dual Portal System: Secure Admin dashboard and Client-facing interface.",
      "Project Tracking: Kanban and list views for managing web and app development lifecycles.",
      "Financial Module: Automated invoicing and revenue tracking."
    ],
    results: [
        "100% data centralization across agency operations.",
        "40% improvement in project delivery speed.",
        "Enhanced client trust via real-time portal access."
    ]
  },
  {
    id: "kendall-law-crm",
    title: "Kendall Law",
    category: "Web Apps",
    description: "Specialized CRM for a US-based law firm featuring real-time land law calculators, client portals, and direct communication channels.",
    techStack: ["React", "Python", "Stripe API", "Legal Tech"],
    imageUrl: "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-29-1.png",
    gallery: [
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-29-1.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-30-1.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-27.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-28-2.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-19-2.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-24.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-25-1.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-18.png"
    ],
    liveLink: "https://portal.kendalllaw.com/",
    client: "Kendall Law USA",
    role: "Lead Developer",
    year: "2024",
    fullDescription: "Kendall Law is a specialized CRM system for a US law firm focused on land laws and rents. It features dedicated client and admin portals with direct messaging and real-time land law calculators.",
    problem: "Legal calculation of land rents across multiple US cities was previously manual and error-prone.",
    solution: "Engineered real-time calculators integrated with US land law databases to provide instant and accurate results for clients and attorneys.",
    features: [
      "Land Law Calculators for multiple US cities.",
      "Dual Portal Architecture (Client/Admin).",
      "Encrypted messaging and document management."
    ],
    results: [
        "100% accuracy in rental calculations.",
        "Significantly reduced manual data entry for attorneys.",
        "Improved client satisfaction via transparent portal access."
    ]
  },
  {
    id: "galliford-try",
    title: "Galliford Try",
    category: "Websites",
    description: "Corporate website for one of the UK's leading construction groups, focusing on built environment and community impact.",
    techStack: ["WordPress", "PHP", "SCSS", "JavaScript"],
    imageUrl: "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-14.png",
    gallery: [
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-14.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-13.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-9.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-6.png"
    ],
    liveLink: "https://www.gallifordtry.co.uk/",
    client: "Galliford Try UK",
    role: "Web Developer",
    year: "2023",
    fullDescription: "Galliford Try is a leading UK construction group. I developed a high-performance corporate website that reflects their industry stature.",
    problem: "The client needed a digital presence that effectively showcased their massive project portfolio and commitment to sustainability.",
    solution: "Created a custom theme focused on fast performance and clean content architecture, allowing for easy navigation through complex project categories.",
    features: [
      "Custom Project Filter System.",
      "Sustainability Metrics Tracking.",
      "Corporate Investor Portal integration."
    ],
    results: [
        "Improved page load speeds by 45%.",
        "Streamlined content updates for the corporate communications team.",
        "Modernized brand perception in the construction industry."
    ]
  },
  {
    id: "morgan-sindall",
    title: "Morgan Sindall",
    category: "Websites",
    description: "Website for Morgan Sindall Construction, a sustainable business leader in the construction industry.",
    techStack: ["WordPress", "Custom Theme", "SEO", "Analytics"],
    imageUrl: "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-18-1.png",
    gallery: [
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-18-1.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-24-1.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-27-1.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-11.png"
    ],
    liveLink: "https://www.morgansindallconstruction.com/",
    client: "Morgan Sindall",
    role: "Web Developer",
    year: "2023",
    fullDescription: "Morgan Sindall Construction's vision is to be the most sought-after and sustainable business in their industry. I translated this vision into a sleek, efficient website.",
    problem: "Representing large-scale sustainability initiatives in an accessible way for stakeholders.",
    solution: "Focused on an 'Eco-first' design language with lightweight code to ensure the site itself had a low carbon footprint.",
    features: [
      "Interactive Sustainability Map.",
      "Dynamic Case Study Engine.",
      "Optimized Asset Pipeline for fast loading."
    ],
    results: [
        "Increased stakeholder engagement by 30%.",
        "Established a benchmark for green web design in the sector.",
        "Seamless performance across all device types."
    ]
  },
  {
    id: "bazm-e-khushboo",
    title: "Bazm-e-Khushboo",
    category: "Branding",
    description: "Brand identity, logo design, and product packaging for a luxury perfume brand in Pakistan.",
    techStack: ["Adobe Illustrator", "Photoshop", "Figma", "Social Media"],
    imageUrl: "https://inovista.co.uk/wp-content/uploads/2025/12/image-70.png",
    gallery: [
      "https://inovista.co.uk/wp-content/uploads/2025/12/Post-day-3-1.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/10.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/post-2.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/post-2-3.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/11.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/12.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/13.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/15.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/16.png"
    ],
    liveLink: "http://bazmekhushboo.com/",
    instagramLink: "https://www.instagram.com/bazmekhushboo_pk",
    client: "Bazm-e-Khushboo",
    role: "Brand Designer",
    year: "2024",
    fullDescription: "Bazm-e-Khushboo is a luxury perfume brand. I designed a visual identity that exudes tradition and premium quality.",
    problem: "The niche fragrance market is crowded. Bazm needed to stand out as a 'royal' choice while remaining accessible to the modern enthusiast.",
    solution: "Developed a logo that incorporates classical motifs with a clean, modern strike. Designed packaging that uses negative space to highlight premium materials.",
    features: [
      "Logo Design: Premium mark representing the brand essence.",
      "Packaging Design: Luxury box and bottle label designs.",
      "Social Media Kit: Creative direction for Instagram."
    ],
    results: [
        "Immediate brand recognition in local luxury circles.",
        "Successful launch with highly shareable 'unboxing' appeal.",
        "Cohesive visual strategy across all retail touchpoints."
    ]
  },
  {
    id: "womiles",
    title: "WoMiles",
    category: "Branding",
    description: "Complete brand identity and logo design for a women-centric ride-hailing service focusing on safety and empowerment.",
    techStack: ["Figma", "Adobe Illustrator", "Brand Strategy"],
    imageUrl: "https://inovista.co.uk/wp-content/uploads/2025/12/Womiles-png-white-1.png",
    gallery: [
      "https://inovista.co.uk/wp-content/uploads/2025/12/Womiles-png-white-1.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Womiles-png-white-2.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/womiles-post.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/womiles-7.png"
    ],
    liveLink: "http://womiles.com/",
    instagramLink: "https://www.instagram.com/womiles_pk",
    client: "WoMiles PK",
    role: "Brand Designer",
    year: "2024",
    fullDescription: "WoMiles is the new standard for women's travel in Pakistan's twin cities. I created a brand identity that communicates empowerment, security, and elegance.",
    problem: "Traditional ride-hailing services often face safety concerns from female travelers.",
    solution: "Designed a visual language that builds trust through soft yet authoritative colors and symbols of safe transit.",
    features: [
      "Empowerment-focused Logo Design.",
      "Trust-building color palette.",
      "Comprehensive Social Media visual strategy."
    ],
    results: [
        "Strong initial brand adoption among the target demographic.",
        "Created a recognizable visual identity in a competitive market.",
        "Successfully communicated safety as a core brand pillar."
    ]
  },
  {
    id: "broke2-engineer",
    title: "Broke2 Engineer",
    category: "Websites",
    description: "Consultancy website for engineering solutions, turning complex challenges into cost-efficient results.",
    techStack: ["React", "Web Design", "UI/UX"],
    imageUrl: "https://inovista.co.uk/wp-content/uploads/2025/12/MacBook-13.png",
    gallery: [
      "https://inovista.co.uk/wp-content/uploads/2025/12/MacBook-13.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-2.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-24-2.png",
      "https://inovista.co.uk/wp-content/uploads/2025/12/Mockup-5-1.png"
    ],
    liveLink: "http://Broke2Engineers.com/",
    client: "Broke2Engineers",
    role: "Web Developer",
    year: "2024",
    fullDescription: "Broke2Engineers Consultancy turns complex engineering challenges into clear, reliable, and cost-efficient solutions. I built a professional portal to showcase their expertise.",
    problem: "Technical engineering services can often feel intimidating or overly complex for potential clients.",
    solution: "Developed a clean, industrial layout that simplifies technical concepts and highlights past successes through clear data points.",
    features: [
      "Technical Service Categorization.",
      "Consultation Booking Workflow.",
      "High-density data visualization panels."
    ],
    results: [
        "Increased inbound consultancy leads by 25%.",
        "Improved clarity of service offerings for non-technical clients.",
        "Established a strong professional digital footprint."
    ]
  },
  {
    id: "dnaar-property",
    title: "Dnaar Property",
    category: "Websites",
    description: "A luxury property real estate website operating in the UAE, providing high-end listing management and client interactions.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "PHP Backend"],
    imageUrl: "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Mockup-14-scaled.png",
    gallery: [
      "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Mockup-14-scaled.png",
      "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Mockup-4-scaled.png",
      "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Mockup-18-scaled.png",
      "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Mockup-Scene-2-scaled.png"
    ],
    liveLink: "https://dnaarproperties.com/",
    client: "Dnaar Properties UAE",
    role: "Web Developer",
    year: "2024",
    fullDescription: "Dnaar Property is a sophisticated real estate platform designed for the high-demand UAE market. It provides an immersive experience for potential buyers and renters.",
    problem: "The luxury property market in Dubai is extremely competitive. The client needed a site that didn't just list properties, but 'sold' a lifestyle through high-end visuals and speed.",
    solution: "I built a performant frontend with React to ensure lightning-fast navigation between properties. I integrated a robust PHP backend to handle dynamic listing management for the admin team.",
    features: [
      "Interactive Property Listings.",
      "Real-time Availability Status updates.",
      "Admin CRM for listing management."
    ],
    results: [
        "30% increase in lead generation within the first month.",
        "Sub-2s page load times despite heavy imagery.",
        "Seamless mobile experience for on-the-go investors."
    ]
  },
  {
    id: "mirdef-shipping",
    title: "Mirdef Shipping",
    category: "Websites",
    description: "A comprehensive shipping and logistics website for a major Dubai-based transport firm.",
    techStack: ["Next.js", "Tailwind CSS", "Framer Motion"],
    imageUrl: "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Mockup-Ribbon-3-scaled.png",
    gallery: [
      "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Mockup-Ribbon-3-scaled.png",
      "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/iPhone-16-Pro-scaled.png",
      "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Mockup-Ribbon-12-scaled.png"
    ],
    liveLink: "https://mirdefshippingdubai.com/",
    client: "Mirdef Shipping Dubai",
    role: "UI/UX Developer",
    year: "2024",
    fullDescription: "Mirdef Shipping provides a global window into Dubai's premier logistics operations. The platform emphasizes speed and reliability through an intuitive, modern interface.",
    problem: "Logistics companies often have cluttered, complex websites. Mirdef needed to convey clarity, global scale, and modern reliability to international partners.",
    solution: "Used Next.js and Framer Motion to create smooth, professional animations that mirror the efficiency of their shipping lines. Simplified the tracking interface for maximum user clarity.",
    features: [
      "Tracking Integration status previews.",
      "Mobile-First Design for global clients.",
      "Global Hub Mapping network visualization."
    ],
    results: [
        "Reduced customer support calls via integrated tracking clarity.",
        "Modernized brand perception for a heritage logistics firm.",
        "High international engagement from desktop users."
    ]
  },
  {
    id: "lavazza-coffee",
    title: "Lavazza Coffee",
    category: "Websites",
    description: "An integrated e-commerce experience and brand portal for a premier coffee shop and store operating in the USA.",
    techStack: ["Shopify", "UI/UX Design", "Product Design", "Liquid"],
    imageUrl: "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Free-iPad-Pro-mockup-on-textured-fabric-and-wooden-surface-Mockuuups-Studio.png",
    gallery: [
      "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Free-iPad-Pro-mockup-on-textured-fabric-and-wooden-surface-Mockuuups-Studio.png",
      "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Lavazza-Cafe-Mural-Design.png",
      "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Lavazza-Product-Portfolio-Mockup.png",
      "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Lavazza-Espresso-Ad-1.png",
      "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Mockup-10.png",
      "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Mockup-23.png",
      "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Mockup-6.png",
      "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Lavazza-Packaging-Mockup.png"
    ],
    liveLink: "https://www.lavazzausa.com/",
    client: "Lavazza USA",
    role: "Product Designer & Developer",
    year: "2023",
    fullDescription: "Lavazza USA combines a physical coffee shop experience with a high-volume e-commerce store. I worked on both the digital interface and product design assets to create a cohesive brand presence.",
    problem: "Connecting the 'fresh-smell-of-coffee' physical experience with a digital storefront is hard. The site needed to feel as artisanal as the product.",
    solution: "Designed custom Liquid sections for Shopify that allow for immersive storytelling. Used rich, warm tones and tactile textures in the UI to evoke the cafe atmosphere.",
    features: [
      "E-commerce Store for fresh ground coffee.",
      "Product Branding mural assets.",
      "Responsive UX for seamless shopping."
    ],
    results: [
        "Established a cohesive visual language from packaging to pixel.",
        "Boosted subscription sign-ups by 25%.",
        "Successful integration of brick-and-mortar marketing with digital sales."
    ]
  },
  {
    id: "fm-group-uae",
    title: "FM GROUP UAE",
    category: "Websites",
    description: "A hub of innovation and growth, delivering reliable solutions in business setup, garment trading, and finance in the UAE.",
    techStack: ["WordPress", "PHP", "Custom UI"],
    imageUrl: "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Free-MacBook-Pro-mockup-on-stone-pedestal-Mockuuups-Studio-scaled.png",
    gallery: [
      "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Free-MacBook-Pro-mockup-on-stone-pedestal-Mockuuups-Studio-scaled.png",
      "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Mockup-4-1-scaled.png",
      "https://ajwahmalik.inovista.co.uk/wp-content/uploads/2025/12/Mockup-Scene-4-scaled.png"
    ],
    liveLink: "https://fmgroupcorporates.com/",
    client: "FM Group UAE",
    role: "Lead Web Developer",
    year: "2024",
    fullDescription: "At FM GROUP UAE, we are more than just a business group — we are a hub of innovation, opportunities, and growth. Based in UAE, our diverse businesses deliver reliable solutions in business setup, garment trading, import-export, and financial services.",
    problem: "FM Group operates in diverse sectors. They needed a single corporate identity that unified their garment trading, business setup, and finance arms without confusing the user.",
    solution: "Created a 'hub' architecture where each business arm has its own distinct space while sharing a common premium corporate visual language.",
    features: [
      "Corporate Portfolio breakdown.",
      "Lead Generation inquiry paths.",
      "Modern Aesthetics with premium visuals."
    ],
    results: [
        "Successfully unified 5 distinct business arms under one brand.",
        "Increased inbound business setup inquiries by 40%.",
        "Modernized the group's digital footprint for international investors."
    ]
  },
  {
    id: "nexus-v-platform",
    title: "Nexus-V SaaS Platform",
    category: "Web Apps",
    description: "An enterprise-level SaaS platform for venture capital management, featuring complex data visualization and multi-tenant security.",
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Recharts"],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    client: "Nexus Ventures",
    role: "Lead Frontend Engineer",
    year: "2024",
    fullDescription: "Nexus-V is a comprehensive solution for venture capital firms to manage their portfolios, track investment performance, and handle deal flows.",
    problem: "Portfolio managers were overwhelmed with raw data across multiple spreadsheets, making it impossible to see real-time performance across different sectors.",
    solution: "I built a highly interactive dashboard using React and Recharts that processes thousands of data points to show instant health scores for startups.",
    features: [
      "Real-time Portfolio Scoring.",
      "Automated Deal Flow management.",
      "Multi-tenant Security for isolation."
    ],
    results: [
        "Enabled instant risk-assessment for VC partners.",
        "Reduced manual reporting time by 15 hours per week.",
        "Secured multi-million dollar data sets."
    ]
  },
  {
    id: "zenith-real-estate",
    title: "Zenith Real Estate",
    category: "Websites",
    description: "A luxury property portal with interactive 3D map views and immersive virtual tour integrations.",
    techStack: ["React", "Mapbox GL", "Three.js", "Tailwind CSS"],
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
    client: "Zenith Global Properties",
    role: "UI/UX Developer",
    year: "2023",
    fullDescription: "Zenith is a premium portal for ultra-luxury real estate in the UAE and Europe.",
    problem: "Standard real estate sites felt flat and didn't convey the premium nature of luxury properties.",
    solution: "Integrated Three.js for 3D walkthrough previews directly on the listing cards and used Mapbox for custom terrain views.",
    features: [
      "Immersive 3D Previews.",
      "Custom Terrain Mapping views.",
      "Premium Filter Engine for search."
    ],
    results: [
        "Industry-leading engagement times on listing pages.",
        "Won 'Best Real Estate UI' award internally.",
        "Transformed property browsing into an immersive exploration."
    ]
  }
];
