
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Mail, Monitor, Github, Linkedin, MessageCircle, Terminal, Bug } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Debug Game', path: '/debug' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm transition-all duration-300 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary tracking-tighter">
                AJWAH.
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-bold uppercase tracking-widest transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'text-primary'
                      : 'text-slate-500 hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-2.5 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300"
              >
                Say Hello
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-primary focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 absolute w-full shadow-lg">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-4 rounded-md text-base font-bold uppercase tracking-widest ${
                    isActive(link.path)
                      ? 'text-primary bg-indigo-50'
                      : 'text-slate-600 hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="block mt-4 text-center w-full px-6 py-3 border-2 border-primary text-primary font-bold uppercase tracking-widest rounded-full"
              >
                Say Hello
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${PERSONAL_INFO.whatsapp_clean}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        className="fixed bottom-8 right-8 z-50 p-4 bg-primary text-white rounded-full shadow-xl hover:shadow-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
      >
        <MessageCircle size={32} />
      </a>

      {/* Footer */}
      <footer className="bg-slate-950 text-white pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 text-center">
          
          <Link to="/" className="text-3xl font-bold text-white inline-block mb-8 tracking-tighter">
            AJWAH.
          </Link>
          
          <p className="text-slate-400 text-xl max-w-lg mx-auto mb-10 leading-relaxed font-light">
            Building the next generation of digital products with precision and purpose.
          </p>

          <div className="flex justify-center space-x-6 mb-12">
            <a href={`mailto:${PERSONAL_INFO.email}`} className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-primary hover:border-primary transition-all duration-300">
              <Mail size={24} />
            </a>
            <a href={PERSONAL_INFO.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-primary hover:border-primary transition-all duration-300">
              <Linkedin size={24} />
            </a>
            <a href={PERSONAL_INFO.social.github} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-primary hover:border-primary transition-all duration-300">
              <Github size={24} />
            </a>
          </div>
          
          <div className="text-slate-600 text-sm font-mono">
             Handcrafted in {new Date().getFullYear()} • Designed by Ajwah Malik
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
