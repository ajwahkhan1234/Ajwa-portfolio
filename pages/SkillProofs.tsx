
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SKILL_PROOFS } from '../constants';
import { ArrowLeft, ShieldCheck, ArrowRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const SkillProofs: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'frontend', 'design', 'backend', 'cms'];

  const filteredSkills = filter === 'All' 
    ? SKILL_PROOFS 
    : SKILL_PROOFS.filter(s => s.category === filter);

  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Technical Evidence</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
               I believe in "Show, Don't Tell". Here is the proof of my technical expertise through real code and architectural patterns.
            </p>
          </div>
        </ScrollReveal>

        {/* Filter */}
        <div className="flex justify-center mb-16 flex-wrap gap-3">
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
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSkills.map((skill, idx) => (
            <ScrollReveal key={skill.id} delay={idx * 100}>
               <Link to={`/skills/${skill.id}`} className="group bg-white p-10 rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full hover:-translate-y-2 relative overflow-hidden">
                {/* Decorator */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[100px] -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="w-14 h-14 bg-indigo-50 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <ShieldCheck size={28} />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">{skill.name}</h3>
                <p className="text-slate-600 leading-relaxed mb-10 flex-grow text-lg">
                  {skill.shortDescription}
                </p>
                
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                   <span className="text-xs font-black uppercase tracking-widest text-primary/50">{skill.category}</span>
                   <div className="flex items-center text-primary font-bold group-hover:translate-x-2 transition-transform">
                      View Implementation <ArrowRight size={18} className="ml-2" />
                   </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-20 text-center">
           <Link to="/" className="inline-flex items-center text-slate-500 hover:text-primary font-bold transition-colors">
              <ArrowLeft size={18} className="mr-2" /> Back to Home
           </Link>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default SkillProofs;
