
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SKILL_PROOFS, PROJECTS } from '../constants';
// Fix: Added missing ArrowRight icon to the lucide-react imports
import { ArrowLeft, Code, Database, Globe, Layers, ShieldCheck, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const SkillDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const skill = SKILL_PROOFS.find(s => s.id === id);

  if (!skill) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Skill Evidence Not Found</h2>
        <Link to="/skills" className="text-primary hover:underline flex items-center">
          <ArrowLeft size={16} className="mr-2" /> Back to Skills
        </Link>
      </div>
    );
  }

  const relatedProjectObjects = PROJECTS.filter(p => skill.relatedProjects.includes(p.id));

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 pt-32 pb-48 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/skills" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Back to Evidence List
          </Link>
          
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold uppercase tracking-widest">
                  {skill.category}
                </span>
                <span className="flex items-center text-green-400 text-xs font-bold uppercase tracking-widest">
                  <ShieldCheck size={14} className="mr-1" /> Verified Implementation
                </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-8 leading-tight">
              {skill.name}
            </h1>
            <p className="text-2xl text-slate-300 font-light leading-relaxed">
              {skill.shortDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Area (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            <ScrollReveal>
              <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 md:p-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                  <Layers className="text-primary mr-3" /> Technical Challenge
                </h2>
                <h3 className="text-xl font-bold text-slate-700 mb-4">{skill.proofTitle}</h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-10">
                  {skill.proofDescription}
                </p>

                {skill.codeSnippet && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center">
                      <Code size={16} className="mr-2" /> Implementation Code
                    </h3>
                    <div className="bg-slate-900 rounded-2xl p-6 md:p-8 overflow-x-auto shadow-inner">
                      <pre className="text-indigo-300 font-mono text-sm leading-relaxed">
                        <code>{skill.codeSnippet}</code>
                      </pre>
                    </div>
                  </div>
                )}

                <div className="mt-12 p-8 bg-green-50 rounded-2xl border border-green-100">
                   <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                     <CheckCircle className="mr-2" /> Real-World Impact
                   </h3>
                   <p className="text-lg text-green-800 leading-relaxed">
                     {skill.realWorldImpact}
                   </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar Area (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            <ScrollReveal delay={200}>
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                  <Globe className="text-primary mr-2" /> Applied in Projects
                </h3>
                <div className="space-y-4">
                  {relatedProjectObjects.map(project => (
                    <Link 
                      key={project.id} 
                      to={`/projects/${project.id}`}
                      className="group block p-4 bg-white rounded-xl border border-slate-200 hover:border-primary transition-all shadow-sm"
                    >
                      <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors flex items-center justify-between">
                        {project.title} <ArrowRight size={16} />
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">{project.category}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
               <div className="bg-primary rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                  <h3 className="text-2xl font-bold mb-4 relative z-10">Need this expertise?</h3>
                  <p className="text-indigo-100 mb-8 relative z-10">
                    I can bring this level of technical precision to your next project.
                  </p>
                  <Link to="/contact" className="inline-flex items-center justify-center w-full px-6 py-4 bg-white text-primary font-bold rounded-xl hover:bg-indigo-50 transition-colors relative z-10">
                    Discuss Collaboration
                  </Link>
               </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SkillDetail;
