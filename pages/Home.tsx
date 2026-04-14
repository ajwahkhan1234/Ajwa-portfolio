
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Layout, Monitor, ExternalLink, Sparkles, Search, Rocket, Star, Quote, ShieldCheck, Bug, Terminal, Loader2 } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS, SKILLS_COLUMNS, PROCESS_STEPS, TESTIMONIALS, SKILL_PROOFS } from '../constants';
import ScrollReveal from '../components/ScrollReveal';
import ParticleBackground from '../components/ParticleBackground';
import OptimizedImage from '../components/OptimizedImage';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { ProjectItem } from '../types';

// Tilt Card Component for "Wow" factor
const ProjectCard: React.FC<{ project: any }> = ({ project }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (limit to 10 degrees)
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="tilt-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group border border-slate-100 h-full"
    >
      <div className="h-64 overflow-hidden relative">
        <OptimizedImage 
          src={project.imageUrl} 
          alt={project.title} 
          containerClassName="w-full h-full"
          className="group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300 pointer-events-none"></div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm uppercase tracking-wider transform translate-y-[-150%] group-hover:translate-y-0 transition-transform duration-300 z-20">
            {project.category}
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow text-left relative z-10 bg-white">
        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
        <p className="text-slate-600 mb-6 line-clamp-3 flex-grow">{project.description}</p>
        
        <div className="mt-auto pt-6 border-t border-slate-100">
          <Link 
            to={`/projects/${project.id}`} 
            className="inline-flex items-center font-bold text-primary hover:text-indigo-800 transition-colors"
          >
            View Case Study <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Skill Proof Card
const SkillProofCard: React.FC<{ skill: any }> = ({ skill }) => (
  <Link to={`/skills/${skill.id}`} className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 text-left flex flex-col h-full hover:-translate-y-1">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-indigo-50 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
        <ShieldCheck size={24} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-100 px-2 py-1 rounded">Verified Skill</span>
    </div>
    <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{skill.name}</h4>
    <p className="text-slate-500 text-sm mb-6 flex-grow">{skill.shortDescription}</p>
    <div className="pt-4 border-t border-slate-50 flex items-center text-primary font-bold text-sm">
      Show Evidence <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
);

// Testimonial Card for Marquee
const TestimonialCard: React.FC<{ item: any }> = ({ item }) => (
  <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 relative group w-[350px] md:w-[450px] flex-shrink-0 flex flex-col hover:shadow-xl transition-all duration-300 cursor-pointer">
    <div className="absolute top-8 right-8 text-indigo-100 group-hover:text-indigo-500/10 transition-colors duration-300">
      <Quote size={48} fill="currentColor" />
    </div>
    
    <div className="flex gap-1 text-yellow-400 mb-6">
      {[...Array(item.rating)].map((_, i) => (
        <Star key={i} size={18} fill="currentColor" />
      ))}
    </div>
    
    <p className="text-slate-700 italic text-lg mb-8 relative z-10 leading-relaxed flex-grow">
      "{item.content}"
    </p>
    
    <div className="flex items-center mt-auto border-t border-slate-50 pt-6">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md">
        {item.name.charAt(0)}
      </div>
      <div>
        <h4 className="font-bold text-slate-900">{item.name}</h4>
        <p className="text-slate-500 text-sm font-medium">{item.role}</p>
      </div>
    </div>
  </div>
);

const Home: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [dynamicProjects, setDynamicProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const categories = ['All', 'Web Apps', 'Websites', 'Branding', 'Web Development', 'UI/UX Design', 'Mobile App'];

  useEffect(() => {
    const fetchDynamicProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(6));
        const querySnapshot = await getDocs(q);
        const projects = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          techStack: doc.data().technologies || []
        })) as ProjectItem[];
        setDynamicProjects(projects);
      } catch (error) {
        console.error("Error fetching dynamic projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicProjects();
  }, []);

  const allProjects = [...dynamicProjects, ...PROJECTS];

  const filteredProjects = filter === 'All' 
    ? allProjects.slice(0, 6) 
    : allProjects.filter(p => p.category === filter).slice(0, 6);

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section with Particles */}
      <section className="relative bg-slate-50 pt-20 pb-32 md:pt-32 md:pb-48 text-center px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 opacity-50">
           <ParticleBackground />
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <ScrollReveal>
             <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-primary text-sm font-semibold mb-6 animate-pulse-slow">
                <Sparkles size={14} className="mr-2" /> Available for new projects
             </div>
          </ScrollReveal>
          
          <ScrollReveal delay={200}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
              Creating <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">digital experiences</span> that matter.
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 font-light max-w-3xl mx-auto">
              {PERSONAL_INFO.intro_short} I combine technical precision with creative flair to build websites that wow.
            </p>
          </ScrollReveal>
          
          {/* Avatar / Hero Image with Float Animation */}
          <ScrollReveal delay={600}>
            <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80 animate-float">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-full opacity-20 blur-3xl transform scale-110"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl">
                <OptimizedImage 
                  src="https://inovista.co.uk/wp-content/uploads/2025/12/ChatGPT-Image-Dec-13-2025-06_55_16-PM.png" 
                  alt="Ajwah Malik" 
                  containerClassName="w-full h-full"
                  priority={true}
                />
              </div>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={800} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link to="/projects" className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-indigo-700 shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:-translate-y-1">
                View My Work
             </Link>
             <Link to="/debug" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:border-primary hover:text-primary transition-all duration-300 flex items-center gap-2 group">
                <Bug size={20} className="group-hover:rotate-12 transition-transform" /> Debug The App
             </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Intro Purple Block - Skewed Design */}
      <section className="relative py-24 bg-primary text-center transform -skew-y-3 origin-top-left overflow-hidden z-20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-violet-600"></div>
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-4xl mx-auto px-4 transform skew-y-3 relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Hi, I’m {PERSONAL_INFO.name}. <br/><span className="text-indigo-200">Nice to meet you.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-lg md:text-xl text-indigo-50 leading-relaxed max-w-3xl mx-auto">
              {PERSONAL_INFO.bio}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Floating Skills Card */}
      <section className="px-4 pb-24 -mt-10 relative z-30">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal threshold={0.2} className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              
              {SKILLS_COLUMNS.map((col, idx) => (
                <div key={col.id} className="p-8 lg:p-12 text-center flex flex-col h-full hover:bg-slate-50 transition-colors duration-300 group">
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-primary mx-auto mb-8 transform group-hover:rotate-12 transition-transform duration-300 shadow-inner">
                    {col.icon === 'layout' && <Layout size={40} />}
                    {col.icon === 'code' && <Code size={40} />}
                    {col.icon === 'monitor' && <Monitor size={40} />}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{col.title}</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    {col.description}
                  </p>
                  
                  <div className="mt-auto">
                    <h4 className="text-primary font-bold mb-2 uppercase tracking-wide text-sm">{col.heading}</h4>
                    <p className="text-slate-600 mb-8 px-4">
                      {col.items.join(', ')}
                    </p>
                    
                    <h4 className="text-primary font-bold mb-2 uppercase tracking-wide text-sm">{col.toolsHeading}</h4>
                    <ul className="text-slate-600 space-y-1">
                      {col.tools.map((tool, toolIdx) => (
                        <li key={toolIdx}>{tool}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}

            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Interactive Skill Proofs Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Skills with Evidence</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                I don't just list skills—I prove them. Click any card below to see real-world architectural solutions and code implementations.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SKILL_PROOFS.map((skill, idx) => (
              <ScrollReveal key={skill.id} delay={idx * 100}>
                <SkillProofCard skill={skill} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="mt-16 text-center">
             <Link to="/skills" className="inline-flex items-center font-bold text-primary hover:text-indigo-800 transition-colors text-lg">
                Explore All Skill Proofs <ArrowRight className="ml-2" />
             </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Process / How I Work Section */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">How I Work</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                My workflow is designed to ensure transparency, efficiency, and exceptional results for every project.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-8 right-8 h-0.5 bg-slate-100 -z-10"></div>
            
            {PROCESS_STEPS.map((step, idx) => (
              <ScrollReveal key={step.id} delay={idx * 200}>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 relative group h-full flex flex-col">
                  {/* Step Number Badge */}
                  <div className="absolute top-4 right-4 text-6xl font-black text-slate-50 opacity-50 z-0 select-none group-hover:text-indigo-50 transition-colors">
                    0{idx + 1}
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                      {step.icon === 'search' && <Search size={32} />}
                      {step.icon === 'layout' && <Layout size={32} />}
                      {step.icon === 'code' && <Code size={32} />}
                      {step.icon === 'rocket' && <Rocket size={32} />}
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm flex-grow">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Work */}
      <section className="py-24 bg-slate-50 text-center px-4 relative overflow-hidden">
         {/* Background pattern */}
         <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
         
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">My Recent Work</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Here are a few past design and development projects I've worked on. Want to see more? <Link to="/contact" className="text-primary hover:underline font-bold">Email me</Link>.
            </p>
          </ScrollReveal>

          {/* Home Page Filter */}
          <ScrollReveal className="flex justify-center mb-12 flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 uppercase tracking-widest ${
                  filter === cat 
                    ? 'bg-primary text-white shadow-lg transform -translate-y-0.5' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-primary border border-slate-200 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading projects...</p>
              </div>
            ) : filteredProjects.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 100} className="h-full">
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="mt-20">
            <Link 
              to="/projects" 
              className="inline-flex items-center justify-center px-10 py-4 border-2 border-slate-900 text-slate-900 font-bold rounded-full hover:bg-slate-900 hover:text-white transition-all duration-300 hover:shadow-xl"
            >
              View All Projects <ArrowRight size={18} className="ml-2" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials Section (Animated Marquee) */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] opacity-50 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-50 rounded-full blur-[100px] opacity-50 -ml-20 -mb-20"></div>

        <div className="max-w-[1920px] mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16 px-4">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Client Stories</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Real feedback from real projects. See how I've helped businesses grow.
              </p>
            </div>
          </ScrollReveal>

          {/* Marquee Container with Mask */}
          <div className="relative w-full overflow-hidden mask-gradient py-10">
            <div className="flex animate-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused] w-max">
              {/* Original List */}
              <div className="flex gap-8 px-4">
                {TESTIMONIALS.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} item={testimonial} />
                ))}
              </div>
              {/* Duplicate List for Seamless Loop */}
              <div className="flex gap-8 px-4">
                {TESTIMONIALS.map((testimonial) => (
                  <TestimonialCard key={`dup-${testimonial.id}`} item={testimonial} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration / Contact CTA */}
      <section className="py-24 bg-white px-4">
        <ScrollReveal>
          <div className="max-w-5xl mx-auto bg-slate-900 rounded-[2.5rem] p-12 md:p-20 text-center md:flex md:justify-between md:items-center md:text-left shadow-2xl relative overflow-hidden group">
            {/* Animated Glow in CTA */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[100px] opacity-30 -mr-20 -mt-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-[80px] opacity-20 -ml-16 -mb-16 group-hover:opacity-30 transition-opacity duration-500"></div>
            
            <div className="mb-8 md:mb-0 md:mr-8 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Start a project</h2>
              <p className="text-slate-300 text-lg md:text-xl max-w-xl">
                Interested in working together? We should queue up a chat. I’ll buy the coffee.
              </p>
            </div>
            <Link 
              to="/contact" 
              className="relative z-10 inline-flex flex-shrink-0 items-center justify-center px-10 py-5 text-lg font-bold rounded-full text-slate-900 bg-white hover:bg-indigo-50 transition-all duration-300 shadow-lg transform hover:-translate-y-1"
            >
              Let's do this <Sparkles size={20} className="ml-2 text-primary" />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default Home;
