import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import SkillProofs from './pages/SkillProofs';
import SkillDetail from './pages/SkillDetail';
import DebugGame from './pages/DebugGame';
import Dashboard from './pages/Dashboard';

// ScrollToTop component to ensure scroll resets on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="skills" element={<SkillProofs />} />
          <Route path="skills/:id" element={<SkillDetail />} />
          <Route path="debug" element={<DebugGame />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </motion.div>
  </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <AnimatedRoutes />
    </HashRouter>
  );
};

export default App;
