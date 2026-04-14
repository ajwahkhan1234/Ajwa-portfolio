import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SERVICES } from '../constants';
import { ArrowLeft, CheckCircle, Code, Server, Globe, PenTool, Layout } from 'lucide-react';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const service = SERVICES.find(s => s.link.includes(id || ""));

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Service Not Found</h2>
        <Link to="/services" className="text-primary hover:underline">Back to Services</Link>
      </div>
    );
  }

  // Render different content based on ID for demo purposes to satisfy "3 separate pages" content requirement
  const renderContent = () => {
    switch (id) {
      case 'web-development':
        return (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <Code className="text-primary w-10 h-10 mb-4" />
                  <h3 className="text-xl font-bold mb-2">React & TypeScript Apps</h3>
                  <p className="text-slate-600">Building scalable SPA architecture using modern tooling like Vite. Type-safe, performant, and maintainable codebases.</p>
               </div>
               <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <Server className="text-primary w-10 h-10 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Dashboards & CRMs</h3>
                  <p className="text-slate-600">Custom admin panels with role-based access control, analytics charts, and data management workflows.</p>
               </div>
               <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <Globe className="text-primary w-10 h-10 mb-4" />
                  <h3 className="text-xl font-bold mb-2">CMS Solutions</h3>
                  <p className="text-slate-600">Expertise in WordPress, Webflow, Shopify, and WooCommerce for content-heavy or e-commerce sites.</p>
               </div>
            </div>
          </div>
        );
      case 'ui-ux-design':
        return (
          <div className="space-y-12">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <Layout className="text-accent w-10 h-10 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Wireframing & Prototyping</h3>
                  <p className="text-slate-600">Moving from low-fidelity wireframes to interactive high-fidelity prototypes in Figma to validate flows before coding.</p>
               </div>
               <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <CheckCircle className="text-accent w-10 h-10 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Design Systems</h3>
                  <p className="text-slate-600">Creating atomic design systems with reusable components to ensure consistency across the entire product.</p>
               </div>
            </div>
          </div>
        );
      case 'branding':
        return (
           <div className="space-y-12">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <PenTool className="text-pink-500 w-10 h-10 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Brand Identity</h3>
                  <p className="text-slate-600">Logo design, color palettes, and typography selection that resonates with your target audience.</p>
               </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/services" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Back to Services
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{service.title}</h1>
          <p className="text-xl text-slate-300 max-w-3xl">{service.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b pb-4">What I Offer</h2>
          {renderContent()}
          
          <div className="mt-12 bg-indigo-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Interested in this service?</h3>
            <p className="text-slate-600 mb-8">Let's discuss how I can help bring your vision to life.</p>
            <Link to="/contact" className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md">
              Start a Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;