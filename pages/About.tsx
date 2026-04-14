import React from 'react';
import { EXPERIENCE, EDUCATION, CERTIFICATES, PERSONAL_INFO } from '../constants';
import { Briefcase, GraduationCap, Award, Download } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-slate-50 py-20 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6">About Me</h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-8">
            {PERSONAL_INFO.bio}
          </p>
          <a 
            href={PERSONAL_INFO.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-lg"
          >
            <Download size={20} className="mr-2" /> Download Resume
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Experience Section */}
        <section className="mb-20">
          <div className="flex items-center mb-10">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <Briefcase className="text-primary w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Professional Experience</h2>
          </div>
          
          <div className="border-l-2 border-slate-200 ml-6 space-y-12">
            {EXPERIENCE.map((job, index) => (
              <div key={index} className="relative pl-10">
                <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-white border-4 border-primary"></div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{job.role}</h3>
                    <span className="text-sm font-semibold text-primary bg-indigo-50 px-3 py-1 rounded-full mt-2 md:mt-0 w-fit">
                      {job.period}
                    </span>
                  </div>
                  <div className="text-slate-500 font-medium mb-4">{job.company} | {job.location}</div>
                  <ul className="list-disc list-outside ml-4 space-y-2 text-slate-600">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-20">
          <div className="flex items-center mb-10">
             <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <GraduationCap className="text-primary w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Education</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EDUCATION.map((edu, index) => (
              <div key={index} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{edu.degree}</h3>
                <p className="text-primary font-medium mb-2">{edu.institution}</p>
                {edu.period && <p className="text-slate-500 text-sm mb-2">{edu.period}</p>}
                {edu.details && <p className="text-slate-600 text-sm mt-3">{edu.details}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Certifications Section */}
        <section>
          <div className="flex items-center mb-10">
             <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <Award className="text-primary w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Certifications</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CERTIFICATES.map((cert, index) => (
              <div key={index} className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{cert.name}</h4>
                  <p className="text-slate-500 text-xs">{cert.provider}</p>
                </div>
                <a 
                  href={cert.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full transition-colors"
                >
                  Verify
                </a>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4 italic">* Verification links available upon request if not directly linked.</p>
        </section>

      </div>
    </div>
  );
};

export default About;