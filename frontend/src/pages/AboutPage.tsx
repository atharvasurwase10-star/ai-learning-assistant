import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Target,
  Lightbulb,
  CheckCircle2,
  Cpu,
  Layers,
  Globe,
  Database,
  ArrowRight,
  ShieldCheck,
  Bot,
} from 'lucide-react';
import { AgentWorkflowVisualizer } from '../components/AgentWorkflowVisualizer';

export const AboutPage: React.FC = () => {
  const objectives = [
    'Personalized learning adapted to each student\'s learning level and weak topics',
    'AI-based natural language doubt solving with rigorous engineering explanations and code',
    'Automated exam notes generation complete with definitions, advantages, and derivations',
    'Diagnostic MCQ quiz generation with instant performance analytics and feedback',
    'Personalized semester study timetable synced with upcoming exam milestones',
    'Active recall flashcard generation for spaced repetition and memory retention',
    'Actionable learning analytics to identify weak topics and recommend next study steps',
  ];

  const futureScopes = [
    { title: 'Voice-Based AI Tutor', desc: 'Real-time bidirectional speech conversational interface for audio-based doubt clearing.' },
    { title: 'Multilingual Learning', desc: 'Localized explanations in regional languages (Hindi, Marathi, etc.) to aid conceptual understanding.' },
    { title: 'Document & PDF RAG System', desc: 'Direct upload and vector search across university syllabus PDFs and professor notes.' },
    { title: 'University LMS Integration', desc: 'Direct synchronization with Moodle, Google Classroom, and university grading portals.' },
    { title: 'Native Mobile Applications', desc: 'Cross-platform mobile apps for on-the-go flashcard review and study streak maintenance.' },
    { title: 'Collaborative Study Groups', desc: 'Peer-to-peer study sessions and collaborative competitive quiz tournaments.' },
  ];

  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      {/* Hero Mini Project Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white border border-brand-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
            <GraduationCap className="w-4 h-4" />
            <span>College Engineering Mini Project</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            AI-Based Learning Assistant – Intelligent Agent
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            A comprehensive, full-stack personal study companion designed to empower college engineering students through personalized conceptual understanding, active recall, and adaptive learning recommendations.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 text-xs">
            <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 font-mono">
              Domain: Artificial Intelligence & EdTech
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 font-mono">
              Stack: React • Vite • Node.js • Express • MongoDB
            </span>
          </div>
        </div>
      </div>

      {/* Problem Statement vs Proposed Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem Statement */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
            <Target className="w-5 h-5" />
            <span>Problem Statement</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            The Fragmentation of Engineering Self-Study
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            College engineering students often struggle to obtain personalized explanations, structured study materials, practice questions, and effective study schedules from a single unified platform. Generic internet searches return overwhelming or irrelevant content, lacking the mathematical rigor and exam orientation required for semester tests and placement interviews.
          </p>
        </div>

        {/* Proposed Solution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <Lightbulb className="w-5 h-5" />
            <span>Proposed Solution</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            An Adaptive Intelligent Learning Agent
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            An AI-based intelligent learning assistant that acts as a 24/7 personal tutor. Rather than acting as a static chatbot, the agent perceives student queries, classifies intent, analyzes student context (branch, semester, weak areas), generates tailored responses, and autonomously recommends targeted practice quizzes, revision notes, and timetable updates.
          </p>
        </div>
      </div>

      {/* Agent Workflow Visualizer Embedded */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-brand-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Intelligent Agent Workflow
          </h2>
        </div>
        <AgentWorkflowVisualizer />
      </div>

      {/* Project Objectives */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-brand-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Key Project Objectives
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {objectives.map((obj, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
              <span>{obj}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Future Scope */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Future Scope & Scalability
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {futureScopes.map((sc, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
            >
              <h4 className="text-xs font-bold text-brand-600 dark:text-brand-400">
                {sc.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {sc.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Viva / Evaluation Summary Card */}
      <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-center">
        <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
          College Mini Project Evaluation Note
        </p>
        <p>
          This application features a complete full-stack architecture with decoupled frontend, REST API controller layer, modular AI service with deterministic offline agent fallback, and MongoDB persistent storage.
        </p>
      </div>
    </div>
  );
};
