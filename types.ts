
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  link: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  gallery?: string[]; // Array of additional images
  // Extended fields for Case Study
  client?: string;
  role?: string;
  year?: string;
  fullDescription?: string;
  problem?: string;
  solution?: string;
  features?: string[];
  results?: string[];
  liveLink?: string;
  instagramLink?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  period: string;
  responsibilities: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period?: string;
  details?: string;
}

export interface CertificateItem {
  name: string;
  provider: string;
  link: string; 
}

export interface ProcessItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
}

export interface SkillProof {
  id: string;
  name: string;
  category: 'frontend' | 'design' | 'backend' | 'cms';
  shortDescription: string;
  proofTitle: string;
  proofDescription: string;
  codeSnippet?: string;
  demoComponent?: string; // Type identifier for interactive demos
  realWorldImpact: string;
  relatedProjects: string[]; // Project IDs
}
