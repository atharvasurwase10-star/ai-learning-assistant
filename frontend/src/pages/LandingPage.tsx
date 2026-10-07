import React from 'react';
import {
  Brain,
  Sparkles,
  ArrowRight,
  BookOpen,
  FileText,
  CheckSquare,
  Calendar,
  Layers,
  TrendingUp,
  Cpu,
  GraduationCap,
  Target,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { AgentWorkflowVisualizer } from '../components/AgentWorkflowVisualizer';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { isAuthenticated, loginAsDemoStudent } = useAuth();

  const handleStartLearning = () => {
    if (isAuthenticated) {
      onNavigate('dashboard');
    } else {
      onNavigate('login');
    }
  };

  const handleTryDemo = async () => {
    await loginAsDemoStudent();
    onNavigate('chat');
  };

  const features = [
    {
      title: 'AI Doubt Solver',
      desc: 'Ask academic questions and receive instant, mathematically rigorous, step-by-step engineering explanations.',
      icon: Brain,
      color: 'from-blue-600 to-cyan-600',
    },
    {
      title: 'Smart Notes Generator',
      desc: 'Generate exam-ready structured notes with definitions, key points, derivations, advantages, and viva questions.',
      icon: FileText,
      color: 'from-purple-600 to-indigo-600',
    },
    {
      title: 'AI Quiz Generator',
      desc: 'Automatically generate topic-specific MCQs, test your grasp under timed conditions, and identify weak topics.',
      icon: CheckSquare,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      title: 'Personalized Study Planner',
      desc: 'Create adaptive daily and weekly schedules synchronized with your upcoming semester exam dates.',
      icon: Calendar,
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'AI Flashcards',
      desc: 'Reinforce active recall with intelligent front/back flashcard decks for quick exam revision.',
      icon: Layers,
      color: 'from-pink-600 to-rose-600',
    },
    {
      title: 'Learning Analytics',
      desc: 'Monitor study hours, quiz scores, topic completion rates, and get AI-driven diagnostic insights.',
      icon: TrendingUp,
      color: 'from-cyan-600 to-blue-700',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Ask',
      desc: 'Ask the AI assistant anything about your engineering syllabus, algorithms, code, or theoretical formulas.',
      icon: Zap,
    },
    {
      number: '02',
      title: 'Understand',
      desc: 'Receive simple intuitive explanations, real-world examples, visual tables, and step-by-step derivations.',
      icon: Brain,
    },
    {
      number: '03',
      title: 'Practice',
      desc: 'Solidify your learning by generating adaptive MCQ quizzes and interactive revision flashcards.',
      icon: Target,
    },
    {
      number: '04',
      title: 'Improve',
      desc: 'Inspect automated diagnostic performance analytics and receive personalized recommendations for weak topics.',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/20 via-purple-600/20 to-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Project Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-6 shadow-sm">
            <GraduationCap className="w-4 h-4 text-brand-600" />
            <span>College Engineering Mini Project • Artificial Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Your Personal{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              AI Learning Assistant
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Learn smarter, understand faster, and achieve more with an intelligent AI study companion tailored for college engineering students.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartLearning}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleTryDemo}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Try AI Assistant (1-Click Demo)</span>
            </button>
          </div>

          {/* Hero Visual Mockup */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl p-2 bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 shadow-2xl">
            <div className="rounded-xl bg-slate-900 overflow-hidden border border-slate-800 text-left">
              {/* Fake Window Bar */}
              <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">
                    AI Study Companion • Student Session: Atharva (AIML 2nd Year)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Agent Online</span>
                </div>
              </div>

              {/* Chat Simulation Preview */}
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3 max-w-xl">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    ST
                  </div>
                  <div className="p-3.5 rounded-2xl rounded-tl-sm bg-slate-800 text-slate-200 text-xs sm:text-sm">
                    Explain supervised learning in simple language and give me exam notes with code.
                  </div>
                </div>

                <div className="flex items-start gap-3 max-w-3xl ml-auto">
                  <div className="p-4 rounded-2xl rounded-tr-sm bg-gradient-to-br from-brand-950/90 to-slate-900 border border-brand-800/60 text-slate-200 text-xs sm:text-sm shadow-md">
                    <div className="flex items-center gap-2 font-semibold text-brand-400 text-xs mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Intelligent Agent • Verified Engineering Response</span>
                    </div>
                    <p className="leading-relaxed">
                      <strong>Supervised Learning</strong> is a machine learning paradigm where the algorithm learns a mapping function from input variables ($X$) to labeled output variables ($Y$) using ground-truth training pairs.
                    </p>
                    <div className="mt-3 p-2.5 rounded-lg bg-slate-950/80 font-mono text-xs text-emerald-300 border border-slate-800">
                      <code>from sklearn.tree import DecisionTreeClassifier # ID3/CART Entropy Split</code>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>Next Recommendation: Practice 5 MCQs on Decision Trees</span>
                      <button
                        onClick={handleTryDemo}
                        className="text-brand-400 font-semibold hover:underline"
                      >
                        Start Practice →
                      </button>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-500 text-white flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="py-20 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs uppercase tracking-widest font-bold text-brand-600 dark:text-brand-400">
              End-to-End Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              Everything an Engineering Student Needs
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
              Designed specifically to tackle complex engineering subjects like Machine Learning, Data Structures, DBMS, and Mathematics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 transition-all shadow-sm hover:shadow-md group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} text-white flex items-center justify-center mb-5 shadow-md`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                    {f.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs uppercase tracking-widest font-bold text-brand-600 dark:text-brand-400">
              4-Step Learning Cycle
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              How the Study Agent Works
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
              A structured, evidence-based academic feedback loop designed for concept retention and exam mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative shadow-sm"
                >
                  <div className="text-3xl font-extrabold text-brand-500/30 font-mono mb-2">
                    {st.number}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      {st.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTELLIGENT AGENT SECTION (Agent Workflow) */}
      <section className="py-20 bg-slate-100 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs uppercase tracking-widest font-bold text-purple-600 dark:text-purple-400">
              Agent Intelligence Architecture
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              Why this is an Intelligent Agent, Not Just a Chatbot
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
              The agent perceives student interactions, reasons over academic context, generates verified answers, and autonomously adapts learning recommendations.
            </p>
          </div>

          <AgentWorkflowVisualizer />
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Ready to Ace Your College Engineering Semester?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            Experience personalized learning, generate smart revision notes, and prepare for viva examinations.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={handleTryDemo}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/25 transition-all"
            >
              Launch Demo Student (Atharva)
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
            >
              About Project Architecture
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
