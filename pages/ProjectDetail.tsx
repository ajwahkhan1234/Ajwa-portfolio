
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PROJECTS } from '../constants';
import { ProjectItem } from '../types';
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle, 
  Code, 
  Target, 
  Lightbulb, 
  Trophy, 
  Instagram, 
  ArrowRight,
  Clock,
  User,
  Briefcase,
  Loader2
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import OptimizedImage from '../components/OptimizedImage';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      // First check static projects
      const staticProject = PROJECTS.find(p => p.id === id);
      if (staticProject) {
        setProject(staticProject);
        setLoading(false);
        return;
      }

      // If not found, check Firestore
      if (id) {
        try {
          const docRef = doc(db, 'projects', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProject({
              id: docSnap.id,
              ...data,
              techStack: data.technologies || []
            } as ProjectItem);
          }
        } catch (error) {
          console.error("Error fetching project from Firestore:", error);
        }
      }
      setLoading(false);
    };

    fetchProject();
  }, [id]);
  
  // For next project, we'll just use static for now or just the next in static list
  const projectIndex = PROJECTS.findIndex(p => p.id === id);
  const nextProject = projectIndex !== -1 
    ? PROJECTS[(projectIndex + 1) % PROJECTS.length]
    : PROJECTS[0];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading case study...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Project Not Found</h2>
        <Link to="/projects" className="text-primary hover:underline flex items-center">
          <ArrowLeft size={16} className="mr-2" /> Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-0">
      {/* Immersive Hero Section */}
      <section className="relative pt-32 pb-60 bg-slate-950 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#4f46e5_0%,transparent_50%)] opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,#8b5cf6_0%,transparent_50%)] opacity-20"></div>
          
          {/* Background Blurred Image */}
          <div className="absolute inset-0 opacity-10 blur-3xl scale-125">
             <OptimizedImage src={project.imageUrl} alt="" containerClassName="w-full h-full" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <Link to="/projects" className="inline-flex items-center text-slate-400 hover:text-white mb-10 transition-colors group">
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Portfolio
            </Link>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold mb-6 tracking-widest uppercase">
                {project.category}
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tight">
                {project.title}
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-2xl font-light">
                {project.description}
              </p>
              
              <div className="mt-10 flex flex-wrap gap-4">
                {project.liveLink && (
                  <a 
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-indigo-600 text-white font-bold rounded-full transition-all duration-300 shadow-xl shadow-primary/20 hover:shadow-primary/40"
                  >
                    Launch Live Project <ExternalLink size={20} className="ml-2" />
                  </a>
                )}
                {project.instagramLink && (
                  <a 
                    href={project.instagramLink}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full backdrop-blur-md transition-all duration-300"
                  >
                    Instagram Showcase <Instagram size={20} className="ml-2" />
                  </a>
                )}
              </div>
            </ScrollReveal>

            {/* Floating Tech Stack Chips (Desktop) */}
            <ScrollReveal delay={200} className="hidden lg:flex flex-wrap gap-3 justify-end items-center">
              {project.techStack?.map((tech, idx) => (
                <span 
                  key={tech} 
                  style={{ animationDelay: `${idx * 100}ms` }}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 text-slate-300 text-sm font-medium rounded-2xl backdrop-blur-sm animate-float hover:bg-white/10 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Hero Image Container */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 -mt-40 relative z-20">
        <ScrollReveal threshold={0.2}>
          <div className="rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200 bg-white group">
             <OptimizedImage 
               src={project.imageUrl} 
               alt={project.title} 
               containerClassName="w-full h-auto"
               className="transition-transform duration-700 group-hover:scale-105"
               priority={true}
             />
          </div>
        </ScrollReveal>
      </div>

      {/* Project Metadata Bar */}
      <section className="pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 px-8 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <User size={14} className="mr-2" /> Client
                </span>
                <span className="text-lg font-bold text-slate-900">{project.client || "Confidential"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <Briefcase size={14} className="mr-2" /> My Role
                </span>
                <span className="text-lg font-bold text-slate-900">{project.role || "Lead Developer"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <Clock size={14} className="mr-2" /> Year
                </span>
                <span className="text-lg font-bold text-slate-900">{project.year || "2024"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <Code size={14} className="mr-2" /> Core Stack
                </span>
                <span className="text-lg font-bold text-slate-900">{project.techStack?.[0] || "N/A"} & More</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Detailed Narrative Section */}
          <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Main Narrative (Left) */}
            <div className="lg:col-span-8 space-y-24">
              
              {/* The Narrative */}
              <ScrollReveal>
                <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-6">Introduction</h2>
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8">Crafting a solution that fits the vision.</h3>
                <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed">
                  {project.fullDescription || project.description}
                </div>
              </ScrollReveal>

              {/* Challenge vs Solution Section - Improved Contrast */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ScrollReveal className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-8">
                    <Target size={28} />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-4">The Challenge</h4>
                  <p className="text-slate-600 leading-relaxed">
                    {project.problem || "This project involved complex technical and design requirements that necessitated a deep dive into user behavior and architectural efficiency."}
                  </p>
                </ScrollReveal>
                
                <ScrollReveal delay={200} className="bg-indigo-50 p-10 rounded-[2.5rem] border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-indigo-100 text-primary rounded-2xl flex items-center justify-center mb-8">
                    <Lightbulb size={28} />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-4">The Strategy</h4>
                  <p className="text-slate-600 leading-relaxed">
                    {project.solution || "Our approach focused on building a scalable, high-performance architecture that unified user experience with business-critical operations."}
                  </p>
                </ScrollReveal>
              </div>

              {/* Impact / Results Section */}
              {project.results && project.results.length > 0 && (
                <ScrollReveal>
                  <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-20 blur-[100px] -mr-20 -mt-20"></div>
                    <div className="relative z-10">
                      <h4 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-10">Project Impact</h4>
                      <h3 className="text-3xl md:text-4xl font-extrabold mb-12">Delivering measurable results.</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {project.results.map((result, idx) => (
                          <div key={idx} className="group p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
                             <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                               <Trophy size={20} />
                             </div>
                             <p className="text-xl font-bold leading-snug">{result}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Sticky Sidebar Features (Right) */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-12">
              <ScrollReveal>
                <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
                  <h4 className="text-xl font-bold text-slate-900 mb-8 flex items-center">
                    <CheckCircle className="text-primary mr-3" /> Core Features
                  </h4>
                  <ul className="space-y-6">
                    {project.features?.map((feature, idx) => (
                      <li key={idx} className="flex items-start group">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-4 group-hover:scale-150 transition-transform"></div>
                        <span className="text-slate-700 font-medium leading-tight">{feature}</span>
                      </li>
                    ))}
                    {(!project.features || project.features.length === 0) && (
                      <li className="text-slate-400 italic">No specific features listed for this project.</li>
                    )}
                  </ul>
                </div>
              </ScrollReveal>
              
              <ScrollReveal delay={200}>
                <div className="p-10 bg-indigo-50 rounded-3xl border border-indigo-100 text-center">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">Interested in results like these?</h4>
                  <p className="text-slate-600 mb-8 text-sm">I'm currently accepting new projects. Let's discuss your vision.</p>
                  <Link to="/contact" className="inline-flex items-center justify-center w-full px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-primary/20">
                    Get in Touch
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery - Standardized 2-Column Grid Layout */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="py-24 bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <ScrollReveal className="text-center mb-16">
              <h4 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">Project Visuals</h4>
              <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900">Pixel-perfect implementation.</h3>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {project.gallery.map((img, idx) => (
                <ScrollReveal 
                  key={idx} 
                  delay={idx * 150}
                  className="rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white border border-slate-100 group"
                >
                  <OptimizedImage 
                    src={img} 
                    alt={`${project.title} detailed view ${idx + 1}`} 
                    containerClassName="aspect-[4/3] w-full"
                    objectFit="cover"
                    className="group-hover:scale-110 transition-transform duration-700"
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Next Project Footer */}
      <section className="bg-slate-900 py-32 overflow-hidden relative group">
         <div className="absolute inset-0 opacity-20 blur-md group-hover:opacity-30 group-hover:scale-105 transition-all duration-700 pointer-events-none">
            <OptimizedImage src={nextProject.imageUrl} alt="" containerClassName="w-full h-full" />
         </div>
         <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
         
         <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
            <ScrollReveal>
              <p className="text-indigo-400 font-bold uppercase tracking-widest mb-6">Next Case Study</p>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-12 group-hover:text-primary transition-colors">{nextProject.title}</h2>
              <Link 
                to={`/projects/${nextProject.id}`} 
                className="inline-flex items-center justify-center px-12 py-5 bg-white text-slate-900 font-black rounded-full hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 shadow-2xl"
              >
                Discover More <ArrowRight size={20} className="ml-3" />
              </Link>
            </ScrollReveal>
         </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
