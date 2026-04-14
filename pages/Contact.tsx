import React, { useState } from 'react';
import { PERSONAL_INFO } from '../constants';
import { Mail, Phone, MapPin, Send, Linkedin, Github } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Project Inquiry',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Get In Touch</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Have a project in mind or want to discuss a potential collaboration? I'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-indigo-50 p-3 rounded-lg mr-4 text-primary">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Email</p>
                    <a href={`mailto:${PERSONAL_INFO.email}`} className="text-slate-600 hover:text-primary transition-colors">
                      {PERSONAL_INFO.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-indigo-50 p-3 rounded-lg mr-4 text-primary">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Phone & WhatsApp</p>
                    <a 
                      href={`https://wa.me/${PERSONAL_INFO.whatsapp_clean}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-slate-600 hover:text-green-600 transition-colors"
                    >
                      {PERSONAL_INFO.phone} (Click to Chat)
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-indigo-50 p-3 rounded-lg mr-4 text-primary">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Location</p>
                    <p className="text-slate-600">{PERSONAL_INFO.location}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex gap-4">
                   <a href={PERSONAL_INFO.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-100 rounded-lg text-slate-600 hover:bg-[#0077b5] hover:text-white transition-all">
                      <Linkedin size={24} />
                   </a>
                   <a href={PERSONAL_INFO.social.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-900 hover:text-white transition-all">
                      <Github size={24} />
                   </a>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
               <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-primary opacity-20 blur-3xl rounded-full"></div>
               <h3 className="text-2xl font-bold mb-4 relative z-10">Collaboration Steps</h3>
               <ol className="space-y-4 relative z-10 text-slate-300">
                 <li className="flex items-center"><span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold mr-3">1</span> Free Consultation</li>
                 <li className="flex items-center"><span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold mr-3">2</span> Proposal & Scoping</li>
                 <li className="flex items-center"><span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold mr-3">3</span> Development & Design</li>
                 <li className="flex items-center"><span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold mr-3">4</span> Launch & Support</li>
               </ol>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h3>
            <form 
              action="https://formsubmit.co/khanajwa950@gmail.com" 
              method="POST"
              className="space-y-6"
            >
              {/* FormSubmit Configuration */}
              <input type="hidden" name="_subject" value="New Portfolio Contact Submission!" />
              <input type="hidden" name="_captcha" value="false" />
              {/* Optional: Add a redirect link if you have a thank you page, otherwise it shows default success page */}
              {/* <input type="hidden" name="_next" value="https://yourwebsite.com/thanks" /> */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                    placeholder="Your Name" 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                    placeholder="your@email.com" 
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <select 
                  id="subject" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-white"
                >
                  <option value="Project Inquiry">Project Inquiry</option>
                  <option value="Freelance / Contract">Freelance / Contract</option>
                  <option value="Web Development">Web Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Branding">Branding</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea 
                  id="message" 
                  name="message"
                  rows={4} 
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>

              <button type="submit" className="w-full inline-flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-primary hover:bg-indigo-700 transition-colors shadow-lg">
                Send Message <Send size={20} className="ml-2" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;