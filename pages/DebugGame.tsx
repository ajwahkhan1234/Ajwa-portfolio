
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Terminal, 
  Bug, 
  CheckCircle, 
  AlertCircle, 
  RefreshCcw, 
  Code,
  Zap,
  ChevronRight,
  ShieldCheck,
  Award,
  BookOpen,
  Github,
  Calendar
} from 'lucide-react';
import { PERSONAL_INFO } from '../constants';
import ScrollReveal from '../components/ScrollReveal';

interface DebugLevel {
  id: number;
  title: string;
  problemDescription: string;
  buggyCode: string;
  difficulty: 'Junior' | 'Mid-Level' | 'Senior';
  choices: {
    id: string;
    label: string;
    isCorrect: boolean;
    feedback: string;
    thinking: string;
  }[];
}

const DEBUG_LEVELS: DebugLevel[] = [
  {
    id: 1,
    title: "The Phantom Counter",
    difficulty: "Junior",
    problemDescription: "A simple counter that should increment every second. However, it's stuck at 1 and never moves past it. What's wrong?",
    buggyCode: `const [count, setCount] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(timer);
}, []);`,
    choices: [
      {
        id: 'fix-1',
        label: "Add 'count' to the dependency array",
        isCorrect: false,
        feedback: "Adding 'count' to the dependency array will fix the stale closure, but it will cause the interval to reset on every tick, which is inefficient.",
        thinking: "A Junior developer might just throw everything into the dependency array without considering the lifecycle implications. This causes unnecessary churn."
      },
      {
        id: 'fix-2',
        label: "Use a functional state update",
        isCorrect: true,
        feedback: "Perfect! By using setCount(prev => prev + 1), you remove the dependency on the 'count' variable entirely, avoiding stale closures safely.",
        thinking: "A Senior developer knows how to avoid unnecessary re-subscriptions by utilizing functional updates for state. It keeps the effect lean and efficient."
      }
    ]
  },
  {
    id: 2,
    title: "The Infinite Fetch Loop",
    difficulty: "Mid-Level",
    problemDescription: "Your API is reporting thousands of calls per minute from a single user. The dashboard component seems to be re-fetching data constantly.",
    buggyCode: `const [data, setData] = useState(null);
const options = { method: 'GET', headers: {} };

useEffect(() => {
  fetch('/api/user', options)
    .then(res => res.json())
    .then(setData);
}, [options]);`,
    choices: [
      {
        id: 'fix-a',
        label: "Remove 'options' from dependencies",
        isCorrect: false,
        feedback: "This stops the loop, but now if the options actually change (e.g. auth tokens), the effect won't run again. Not the ideal fix.",
        thinking: "Sometimes removing the dependency works as a band-aid, but it introduces data-consistency bugs later. We need to respect the reactive data flow."
      },
      {
        id: 'fix-b',
        label: "Wrap 'options' in useMemo",
        isCorrect: true,
        feedback: "Correct! The 'options' object is redefined on every render, which changes its reference. useMemo ensures the reference stays stable.",
        thinking: "Understanding reference equality in JavaScript is fundamental for mastering React's useEffect hook. Objects and arrays should be stabilized if they are dependencies."
      }
    ]
  },
  {
    id: 3,
    title: "The Expensive Re-render",
    difficulty: "Senior",
    problemDescription: "A large list of 1000+ items is lagging. Even small typing in a search bar causes the entire UI to freeze for 200ms.",
    buggyCode: `const heavyList = items.map(item => {
  return <ExpensiveComponent key={item.id} data={item} />;
});

return (
  <div>
    <input onChange={(e) => setSearch(e.target.value)} />
    {heavyList}
  </div>
);`,
    choices: [
      {
        id: 'fix-x',
        label: "Wrap ExpensiveComponent in React.memo",
        isCorrect: true,
        feedback: "Great move! React.memo prevents the expensive component from re-rendering if its props haven't changed.",
        thinking: "Architecting for scale means knowing when to opt-out of the default render behavior to save on processing cycles. Memoization is a powerful scalpel."
      },
      {
        id: 'fix-y',
        label: "Use an <img> tag for list items instead",
        isCorrect: false,
        feedback: "That... doesn't solve the re-render performance issue and makes the UI less accessible. Try again.",
        thinking: "Never sacrifice accessibility or correct semantics for perceived performance hacks. We should fix the root cause of the UI thread blockage."
      }
    ]
  }
];

const DebugGame: React.FC = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [showThinking, setShowThinking] = useState(false);

  const level = DEBUG_LEVELS[currentLevelIdx];
  const selectedChoice = level.choices.find(c => c.id === selectedChoiceId);

  const handleChoice = (id: string) => {
    setSelectedChoiceId(id);
    const choice = level.choices.find(c => c.id === id);
    if (choice?.isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const nextLevel = () => {
    if (currentLevelIdx < DEBUG_LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setSelectedChoiceId(null);
      setShowThinking(false);
    } else {
      setIsFinished(true);
    }
  };

  const restart = () => {
    setCurrentLevelIdx(0);
    setSelectedChoiceId(null);
    setIsFinished(false);
    setScore(0);
    setShowThinking(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary selection:text-white">
      {/* Header */}
      <div className="pt-32 pb-16 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-white transition-colors mb-8 group">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform"/> Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <ScrollReveal>
              <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">Debug The App</h1>
              <p className="text-xl text-slate-400 font-light max-w-2xl">
                Most portfolios show screenshots. Mine shows how I debug. Test your React knowledge and see how I solve complex architectural bugs.
              </p>
            </ScrollReveal>
            <div className="flex items-center gap-6 bg-slate-900 border border-white/10 px-6 py-4 rounded-2xl shadow-2xl">
               <div className="text-center">
                  <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Level</div>
                  <div className="text-xl font-bold">{isFinished ? '--' : `${currentLevelIdx + 1} / ${DEBUG_LEVELS.length}`}</div>
               </div>
               <div className="w-px h-10 bg-white/10"></div>
               <div className="text-center">
                  <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Score</div>
                  <div className="text-xl font-bold">{score}</div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {!isFinished ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Problem & Code */}
            <div className="lg:col-span-7 space-y-8">
              <ScrollReveal>
                <div className="bg-slate-900 rounded-[2rem] border border-white/10 p-10 shadow-2xl relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/20 text-red-500 rounded-lg">
                        <Bug size={20} />
                      </div>
                      <h2 className="text-2xl font-bold">{level.title}</h2>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      level.difficulty === 'Junior' ? 'border-green-500/30 text-green-500 bg-green-500/10' :
                      level.difficulty === 'Mid-Level' ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10' :
                      'border-red-500/30 text-red-500 bg-red-500/10'
                    }`}>
                      {level.difficulty}
                    </span>
                  </div>

                  <p className="text-slate-400 text-lg leading-relaxed mb-10">
                    {level.problemDescription}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-500 font-mono text-xs">
                      <Terminal size={14}/> buggy_component.tsx
                    </div>
                    <div className="bg-slate-950 p-8 rounded-2xl border border-white/5 font-mono text-sm leading-relaxed overflow-x-auto shadow-inner group-hover:border-primary/30 transition-colors">
                      <pre className="text-indigo-300">
                        <code>{level.buggyCode}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right: Choices & Feedback */}
            <div className="lg:col-span-5 space-y-8">
              <ScrollReveal delay={200}>
                <div className="space-y-4">
                   <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Choose the best fix</h3>
                   <div className="grid grid-cols-1 gap-4">
                      {level.choices.map((choice) => (
                        <button
                          key={choice.id}
                          disabled={selectedChoiceId !== null}
                          onClick={() => handleChoice(choice.id)}
                          className={`w-full text-left p-6 rounded-3xl border-2 transition-all duration-300 transform ${
                            selectedChoiceId === choice.id 
                              ? choice.isCorrect ? 'border-green-500 bg-green-500/5' : 'border-red-500 bg-red-500/5'
                              : selectedChoiceId !== null
                                ? 'border-slate-800 opacity-50 cursor-not-allowed'
                                : 'border-slate-800 hover:border-primary hover:bg-slate-900 hover:-translate-y-1 shadow-lg'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                             <span className="font-bold text-lg">{choice.label}</span>
                             {selectedChoiceId === choice.id && (
                               choice.isCorrect ? <CheckCircle className="text-green-500"/> : <AlertCircle className="text-red-500"/>
                             )}
                          </div>
                        </button>
                      ))}
                   </div>
                </div>

                {selectedChoiceId && (
                  <ScrollReveal className="mt-8 space-y-6">
                    <div className={`p-8 rounded-[2rem] border ${
                      selectedChoice?.isCorrect ? 'bg-green-500/10 border-green-500/20 text-green-100' : 'bg-red-500/10 border-red-500/20 text-red-100'
                    }`}>
                      <h4 className="font-bold mb-2 flex items-center gap-2 text-xl">
                        {selectedChoice?.isCorrect ? <span className="flex items-center gap-2"><CheckCircle/> Fixed!</span> : <span className="flex items-center gap-2"><AlertCircle/> Still Broken</span>}
                      </h4>
                      <p className="leading-relaxed mb-6 italic">{selectedChoice?.feedback}</p>
                      
                      <button 
                        onClick={() => setShowThinking(!showThinking)}
                        className="text-xs font-black uppercase tracking-widest text-white/60 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        {showThinking ? 'Hide' : 'Reveal'} Architect's Thinking <Zap size={12} className="text-yellow-500 fill-current"/>
                      </button>
                      
                      {showThinking && (
                        <div className="mt-4 text-sm text-slate-400 leading-relaxed pt-4 border-t border-white/10 animate-fade-in">
                          <p className="mb-2"><strong>The Logic:</strong></p>
                          {selectedChoice?.thinking}
                        </div>
                      )}
                    </div>

                    {selectedChoice?.isCorrect && (
                      <button 
                        onClick={nextLevel}
                        className="w-full py-5 bg-white text-slate-950 rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all transform hover:scale-[1.02] shadow-2xl flex items-center justify-center group"
                      >
                        {currentLevelIdx === DEBUG_LEVELS.length - 1 ? 'See Final Results' : 'Next Level'} <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform"/>
                      </button>
                    )}
                    
                    {!selectedChoice?.isCorrect && (
                      <button 
                        onClick={() => setSelectedChoiceId(null)}
                        className="w-full py-5 bg-slate-800 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all flex items-center justify-center"
                      >
                        <RefreshCcw size={16} className="mr-2"/> Try Another Fix
                      </button>
                    )}
                  </ScrollReveal>
                )}
              </ScrollReveal>
            </div>
          </div>
        ) : (
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center space-y-12 py-20">
               <div className="relative inline-block">
                 <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150"></div>
                 <div className="relative w-32 h-32 bg-primary/10 text-primary rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-2xl border border-primary/20 animate-bounce">
                   <Award size={64}/>
                 </div>
               </div>
               
               <div className="space-y-4">
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">That's how I think.</h2>
                 <p className="text-2xl text-slate-400 font-light leading-relaxed">
                   You fixed all architectural bottlenecks with a score of <span className="text-white font-bold">{score} / {DEBUG_LEVELS.length}</span>.
                 </p>
               </div>

               <div className="p-10 bg-slate-900 rounded-[3rem] border border-white/10 text-left max-w-2xl mx-auto relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 text-primary/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ShieldCheck size={100} />
                  </div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10">
                    <ShieldCheck className="text-primary"/> Senior Engineer Endorsement
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-10 italic relative z-10 text-lg">
                    "Debugging is not just about fixing errors; it's about understanding the reconciliation engine and avoiding technical debt before it happens. This playground demonstrates the standard I hold for every line of code I ship."
                  </p>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary shadow-lg">
                      <img src="https://inovista.co.uk/wp-content/uploads/2025/12/ChatGPT-Image-Dec-13-2025-06_55_16-PM.png" alt="Ajwah Malik" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">Ajwah Malik</div>
                      <div className="text-xs text-slate-500 uppercase tracking-widest font-black">Full-Stack Engineer</div>
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-12">
                  <Link 
                    to="/projects"
                    className="py-5 bg-slate-800 hover:bg-slate-700 text-white font-black text-[10px] uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2"
                  >
                    <BookOpen size={16}/> View Projects
                  </Link>
                  <Link 
                    to="/contact"
                    className="py-5 bg-primary hover:bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-full transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <Calendar size={16}/> Book Interview
                  </Link>
                  <a 
                    href={PERSONAL_INFO.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-5 bg-slate-900 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2"
                  >
                    <Github size={16}/> GitHub Pro
                  </a>
                  <a 
                    href={PERSONAL_INFO.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-5 bg-white text-slate-950 hover:bg-slate-100 font-black text-[10px] uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2"
                  >
                    Download CV
                  </a>
               </div>
            </div>
          </ScrollReveal>
        )}
      </main>

      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-pink-500"></div>
    </div>
  );
};

export default DebugGame;
