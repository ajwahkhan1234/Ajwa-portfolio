
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../constants';
import { ProjectItem } from '../types';
import { ExternalLink } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';

const Projects: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Web Apps', 'Websites', 'Branding'];

  const filteredProjects = filter === 'All' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === filter);

  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Projects</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
             A showcase of my recent work in web development, UI/UX design, and branding.
          </p>
        </div>

        {/* Filter */}
        <div className="flex justify-center mb-16 flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-base font-medium transition-all duration-200 ${
                filter === cat 
                  ? 'bg-primary text-white shadow-lg transform -translate-y-0.5' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-primary border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProjects.map((project: ProjectItem) => (
            <div key={project.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col">
              <div className="relative h-60 bg-slate-100 overflow-hidden">
                <OptimizedImage 
                  src={project.imageUrl} 
                  alt={project.title} 
                  containerClassName="w-full h-full"
                  className="group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-0 right-0 m-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-primary shadow-sm uppercase tracking-wider z-20">
                  {project.category}
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6 flex-grow">{project.description}</p>
                
                <div className="mb-6 pt-6 border-t border-slate-100">
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-indigo-50 text-primary text-xs font-semibold rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <Link 
                  to={`/projects/${project.id}`} 
                  className="mt-auto inline-flex items-center justify-center w-full px-6 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-full hover:border-primary hover:bg-primary hover:text-white transition-all duration-300"
                >
                  View Case Study <ExternalLink size={18} className="ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
