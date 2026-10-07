import React, { useState } from 'react';
import {
  Brain,
  MessageSquare,
  Search,
  Database,
  Sparkles,
  Compass,
  TrendingUp,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export const AgentWorkflowVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: '1. Student Input',
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-500',
      description: 'Receives question, academic doubt, or learning command from the engineering student.',
      detail: 'Supports natural language queries, formula inquiries, or code debugging requests across any engineering subject.',
    },
    {
      title: '2. Intent Detection',
      icon: Brain,
      color: 'from-cyan-500 to-indigo-500',
      description: 'Classifies intent: Concept explanation, Exam notes, MCQ quiz generation, or Study plan.',
      detail: 'Parses academic verbs to distinguish between quick definitions, derivation requests, and exam-oriented overviews.',
    },
    {
      title: '3. Context Analysis',
      icon: Search,
      color: 'from-indigo-500 to-purple-500',
      description: 'Inspects student learning level, engineering branch, weak topics, and active subject.',
      detail: 'Calibrates mathematical rigor and depth (Beginner, Intermediate, Advanced, or Exam Preparation).',
    },
    {
      title: '4. Knowledge Retrieval',
      icon: Database,
      color: 'from-purple-500 to-pink-500',
      description: 'Retrieves verified engineering principles, formulas, and code implementations.',
      detail: 'Draws from domain-specific syllabus modules (ML, DSA, DBMS, Discrete Mathematics) to ensure factual correctness.',
    },
    {
      title: '5. AI Response',
      icon: Sparkles,
      color: 'from-pink-500 to-amber-500',
      description: 'Generates structured explanations, tables, code snippets, and viva questions.',
      detail: 'Formats answers with clear visual hierarchy, examples, and advantages/disadvantages suited for college examinations.',
    },
    {
      title: '6. Recommendations',
      icon: Compass,
      color: 'from-amber-500 to-emerald-500',
      description: 'Intelligently recommends the logical next study action to reinforce retention.',
      detail: 'Suggests targeted practice quizzes, revision flashcards, or formula recaps based on student weak areas.',
    },
    {
      title: '7. Progress Update',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500',
      description: 'Automatically records topic mastery, updates study hours, and tracks streak.',
      detail: 'Feeds performance outcomes into the student analytics dashboard to continuously personalize the curriculum.',
    },
  ];

  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Intelligent Agent Architecture</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight">
              Adaptive Multi-Stage Learning Agent
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Unlike static chatbots, this agent actively reasons through 7 contextual stages to personalize engineering education.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 text-xs">
            <span className="text-slate-400 px-2">Click steps to inspect:</span>
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`w-7 h-7 rounded-lg font-mono transition-all flex items-center justify-center ${
                  activeStep === i
                    ? 'bg-brand-500 text-white font-bold shadow-md shadow-brand-500/30 scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Workflow Diagram Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 my-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl text-left transition-all relative flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-slate-800/90 border-brand-400 ring-2 ring-brand-500/20 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${step.color} text-white mb-2 shadow-sm`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-200 leading-tight">
                    {step.title}
                  </div>
                </div>

                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-400 rounded-full animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Stage Inspector Card */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl bg-gradient-to-br ${steps[activeStep].color} text-white shadow-md flex-shrink-0`}
            >
              {React.createElement(steps[activeStep].icon, { className: 'w-5 h-5' })}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-brand-400">
                Phase {activeStep + 1} Execution Details
              </div>
              <h4 className="text-base font-bold text-white mt-0.5">
                {steps[activeStep].title}
              </h4>
              <p className="text-slate-300 text-xs md:text-sm mt-1 leading-relaxed">
                {steps[activeStep].description}
              </p>
              <div className="mt-2 text-xs text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800 font-mono">
                {steps[activeStep].detail}
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 self-end sm:self-center">
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
              <CheckCircle className="w-3.5 h-3.5" />
              Active in Agent Pipeline
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
