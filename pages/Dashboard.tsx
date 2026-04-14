import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, LogOut, Save, Image as ImageIcon, Link as LinkIcon, Type, FileText, Tag, Lock, LogIn } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
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
  createdAt: any;
}

const Dashboard: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  
  // Form State
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    fullDescription: '',
    imageUrl: '',
    category: 'Web Development',
    technologies: '',
    link: ''
  });

  useEffect(() => {
    // Check connection on mount
    const checkConnection = async () => {
      const { testFirestoreConnection } = await import('../firebase');
      const connected = await testFirestoreConnection();
      setIsOffline(!connected);
    };
    checkConnection();

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
      await addDoc(collection(db, 'projects'), {
        ...newProject,
        technologies: techArray,
        createdAt: serverTimestamp()
      });
      
      setNewProject({
        title: '',
        description: '',
        fullDescription: '',
        imageUrl: '',
        category: 'Web Development',
        technologies: '',
        link: ''
      });
      setIsAdding(false);
      fetchProjects();
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project. Make sure you are logged in with the correct admin email.");
    }
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
        {isOffline && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-800 flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">Connection Warning</p>
              <p className="text-sm">Could not reach the database. Please check if an AdBlocker is blocking "firestore.googleapis.com" or try refreshing.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
            <p className="text-slate-500">Manage your portfolio projects and case studies.</p>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            {isAdding ? 'Cancel' : <><Plus className="w-5 h-5" /> Add Project</>}
          </button>
        </div>

        {/* Add Project Form */}
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 mb-8"
          >
            <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Type className="w-4 h-4" /> Project Title
                  </label>
                  <input 
                    required
                    type="text" 
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    placeholder="e.g. Modern E-commerce Platform"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Category
                  </label>
                  <select 
                    value={newProject.category}
                    onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  >
                    <option>Web Development</option>
                    <option>UI/UX Design</option>
                    <option>Mobile App</option>
                    <option>Branding</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Image URL
                  </label>
                  <input 
                    required
                    type="url" 
                    value={newProject.imageUrl}
                    onChange={(e) => setNewProject({...newProject, imageUrl: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" /> Project Link (Optional)
                  </label>
                  <input 
                    type="url" 
                    value={newProject.link}
                    onChange={(e) => setNewProject({...newProject, link: e.target.value})}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Short Description
                  </label>
                  <textarea 
                    required
                    rows={2}
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    placeholder="Briefly describe the project..."
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Full Case Study (Markdown supported)
                  </label>
                  <textarea 
                    rows={4}
                    value={newProject.fullDescription}
                    onChange={(e) => setNewProject({...newProject, fullDescription: e.target.value})}
                    placeholder="Detailed description, challenges, solutions..."
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Technologies (Comma separated)
                  </label>
                  <input 
                    type="text" 
                    value={newProject.technologies}
                    onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
                    placeholder="React, Tailwind, Node.js"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                  >
                    <Save className="w-5 h-5" /> Save Project
                  </button>
                </div>
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
                  <div className="absolute top-3 right-3">
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
