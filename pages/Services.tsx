import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../constants';
import { ArrowRight, Code, Layout, PenTool, Check } from 'lucide-react';

const Services: React.FC = () => {
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">My Services</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Comprehensive digital solutions tailored to your business needs, from code to creative.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12">
          {SERVICES.map((service, index) => (
            <div key={service.id} className={`flex flex-col md:flex-row gap-8 items-center bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="w-full md:w-1/2 p-8 md:p-12">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-primary mb-6">
                  {service.icon === 'code' && <Code size={32} />}
                  {service.icon === 'layout' && <Layout size={32} />}
                  {service.icon === 'pen' && <PenTool size={32} />}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{service.title}</h2>
                <p className="text-slate-600 text-lg mb-8">{service.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check size={20} className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={service.link} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-indigo-700 transition-colors">
                  View Details <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
              
              <div className="w-full md:w-1/2 h-64 md:h-auto min-h-[400px] bg-slate-200 relative">
                {/* Placeholder for service specific imagery */}
                 <img 
                  src={`https://picsum.photos/seed/${service.id}/800/800`} 
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-indigo-900/10"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;