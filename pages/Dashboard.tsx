import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, LogOut, Save, Image as ImageIcon, Link as LinkIcon, Type, FileText, Tag, Lock, LogIn, Edit2, X, Calendar, User, Briefcase, Target, Lightbulb, Trophy, Code } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy, updateDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';

interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  imageUrl: string;
  category: string;
  technologies?: string[];
  link?: string;
  year?: string;
  date?: string;
  client?: string;
  role?: string;
  problem?: string;
  solution?: string;
  features?: string[];
  results?: string[];
  gallery?: string[];
  createdAt: any;
}

const Dashboard: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Form State
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    fullDescription: '',
    imageUrl: '',
    category: 'Web Development',
    technologies: '',
    link: '',
    year: '',
    date: '',
    client: '',
    role: '',
    problem: '',
    solution: '',
    features: '',
    results: '',
    gallery: ['', '', '', '', '']
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        fetchProjects();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const projectData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123456789') {
      setIsUnlocked(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login failed:", error);
      const domain = window.location.hostname;
      setAuthError(`${error.message || "An unknown error occurred during login."} (Domain: ${domain})`);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const techArray = newProject.technologies.split(',').map(t => t.trim()).filter(t => t !== '');
      const featuresArray = newProject.features.split(',').map(t => t.trim()).filter(t => t !== '');
      const resultsArray = newProject.results.split(',').map(t => t.trim()).filter(t => t !== '');
      const galleryArray = newProject.gallery.map(t => t.trim()).filter(t => t !== '');

      const projectData = {
        title: newProject.title,
        description: newProject.description,
        fullDescription: newProject.fullDescription,
        imageUrl: newProject.imageUrl,
        category: newProject.category,
        link: newProject.link,
        year: newProject.year,
        date: newProject.date,
        client: newProject.client,
        role: newProject.role,
        problem: newProject.problem,
        solution: newProject.solution,
        technologies: techArray,
        features: featuresArray,
        results: resultsArray,
        gallery: galleryArray,
      };

      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), {
          ...projectData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'projects'), {
          ...projectData,
          createdAt: serverTimestamp()
        });
      }
      
      resetForm();
      setIsAdding(false);
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project. Make sure you are logged in with the correct admin email.");
    }
  };

  const resetForm = () => {
    setNewProject({
      title: '',
      description: '',
      fullDescription: '',
      imageUrl: '',
      category: 'Web Development',
      technologies: '',
      link: '',
      year: '',
      date: '',
      client: '',
      role: '',
      problem: '',
      solution: '',
      features: '',
      results: '',
      gallery: ['', '', '', '', '']
    });
  };

  const handleEditProject = (project: Project) => {
    setNewProject({
      title: project.title,
      description: project.description,
      fullDescription: project.fullDescription || '',
      imageUrl: project.imageUrl,
      category: project.category,
      technologies: project.technologies?.join(', ') || '',
      link: project.link || '',
      year: project.year || '',
      date: project.date || '',
      client: project.client || '',
      role: project.role || '',
      problem: project.problem || '',
      solution: project.solution || '',
      features: project.features?.join(', ') || '',
      results: project.results?.join(', ') || '',
      gallery: [...(project.gallery || []), '', '', '', '', ''].slice(0, 5)
    });
    setEditingId(project.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Dashboard Access</h1>
          <p className="text-slate-500 text-center mb-8">Please enter the system password to continue.</p>
          
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                autoFocus
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Unlock Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Admin Authentication</h1>
          <p className="text-slate-500 mb-8">Sign in with your Google account to manage projects.</p>
          
          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-left">
              <p className="font-bold mb-1">Login Error:</p>
              <p className="break-words">{authError}</p>
              <p className="mt-2 text-xs opacity-80">
                Tip: Ensure popups are allowed and that this domain is authorized in your Firebase console.
              </p>
            </div>
          )}

          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
          <p className="mt-6 text-xs text-slate-400">Only authorized emails can modify data.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <h1 className="text-lg font-bold text-slate-900 hidden sm:block">Portfolio Manager</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden md:block">{user.email}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
            <p className="text-slate-500">Manage your portfolio projects and case studies.</p>
          </div>
          <button 
            onClick={() => {
              if (isAdding) {
                setIsAdding(false);
                setEditingId(null);
                resetForm();
              } else {
                setIsAdding(true);
              }
            }}
            className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            {isAdding ? <><X className="w-5 h-5" /> Cancel</> : <><Plus className="w-5 h-5" /> Add Project</>}
          </button>
        </div>

        {/* Add Project Form */}
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-12"
          >
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              {editingId ? <Edit2 className="w-6 h-6 text-primary" /> : <Plus className="w-6 h-6 text-primary" />}
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h3>
            
            <form onSubmit={handleAddProject} className="space-y-10">
              {/* Basic Info Section */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Type className="w-4 h-4" /> Project Title
                    </label>
                    <input 
                      required
                      type="text" 
                      value={newProject.title}
                      onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                      placeholder="e.g. Modern E-commerce Platform"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Category
                    </label>
                    <select 
                      value={newProject.category}
                      onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    >
                      <option>Web Development</option>
                      <option>UI/UX Design</option>
                      <option>Mobile App</option>
                      <option>Branding</option>
                      <option>Web Apps</option>
                      <option>Websites</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Year
                    </label>
                    <input 
                      type="text" 
                      value={newProject.year}
                      onChange={(e) => setNewProject({...newProject, year: e.target.value})}
                      placeholder="e.g. 2024"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Specific Date
                    </label>
                    <input 
                      type="text" 
                      value={newProject.date}
                      onChange={(e) => setNewProject({...newProject, date: e.target.value})}
                      placeholder="e.g. March 2024"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Media & Links */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Media & Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Main Image URL
                    </label>
                    <input 
                      required
                      type="url" 
                      value={newProject.imageUrl}
                      onChange={(e) => setNewProject({...newProject, imageUrl: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" /> Live Project Link
                    </label>
                    <input 
                      type="url" 
                      value={newProject.link}
                      onChange={(e) => setNewProject({...newProject, link: e.target.value})}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Gallery Images (Up to 5 URLs)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {newProject.gallery.map((url, idx) => (
                      <input 
                        key={idx}
                        type="url" 
                        value={url}
                        onChange={(e) => {
                          const newGallery = [...newProject.gallery];
                          newGallery[idx] = e.target.value;
                          setNewProject({...newProject, gallery: newGallery});
                        }}
                        placeholder={`Image ${idx + 1} URL`}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Case Study Details */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Case Study Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" /> Client Name
                    </label>
                    <input 
                      type="text" 
                      value={newProject.client}
                      onChange={(e) => setNewProject({...newProject, client: e.target.value})}
                      placeholder="e.g. Acme Corp"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> My Role
                    </label>
                    <input 
                      type="text" 
                      value={newProject.role}
                      onChange={(e) => setNewProject({...newProject, role: e.target.value})}
                      placeholder="e.g. Lead UI/UX Designer"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" /> The Challenge (Problem)
                    </label>
                    <textarea 
                      rows={3}
                      value={newProject.problem}
                      onChange={(e) => setNewProject({...newProject, problem: e.target.value})}
                      placeholder="What was the main challenge?"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" /> The Strategy (Solution)
                    </label>
                    <textarea 
                      rows={3}
                      value={newProject.solution}
                      onChange={(e) => setNewProject({...newProject, solution: e.target.value})}
                      placeholder="How did you solve it?"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Core Features (Comma separated)
                    </label>
                    <textarea 
                      rows={2}
                      value={newProject.features}
                      onChange={(e) => setNewProject({...newProject, features: e.target.value})}
                      placeholder="Feature 1, Feature 2, Feature 3"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Trophy className="w-4 h-4" /> Results/Impact (Comma separated)
                    </label>
                    <textarea 
                      rows={2}
                      value={newProject.results}
                      onChange={(e) => setNewProject({...newProject, results: e.target.value})}
                      placeholder="Increased conversion by 20%, Reduced load time..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Descriptions & Tech</h4>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Short Description (Card view)
                    </label>
                    <textarea 
                      required
                      rows={2}
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      placeholder="Briefly describe the project for the listing card..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Full Case Study Introduction
                    </label>
                    <textarea 
                      rows={4}
                      value={newProject.fullDescription}
                      onChange={(e) => setNewProject({...newProject, fullDescription: e.target.value})}
                      placeholder="Detailed introduction for the case study page..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4" /> Technologies (Comma separated)
                    </label>
                    <input 
                      type="text" 
                      value={newProject.technologies}
                      onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
                      placeholder="React, Tailwind, Node.js"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-4">
                <button 
                  type="submit"
                  className="flex-grow flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                >
                  <Save className="w-6 h-6" /> {editingId ? 'Update Project' : 'Publish Project'}
                </button>
                {editingId && (
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setIsAdding(false);
                      resetForm();
                    }}
                    className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}

        {/* Projects List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-400">No projects found. Add your first project!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <motion.div 
                key={project.id}
                layout
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-100">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button 
                      onClick={() => handleEditProject(project)}
                      className="p-2 bg-white/90 backdrop-blur-sm text-primary rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 bg-white/90 backdrop-blur-sm text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-lg">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 mb-1">{project.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                    {project.technologies && project.technologies.length > 3 && (
                      <span className="text-[10px] font-semibold text-slate-400">+{project.technologies.length - 3} more</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
