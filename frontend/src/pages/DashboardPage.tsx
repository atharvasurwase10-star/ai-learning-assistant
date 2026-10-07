import React, { useEffect, useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Award,
  Flame,
  ArrowRight,
  Brain,
  Sparkles,
  BookOpen,
  CheckSquare,
  Calendar,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { progressApi } from '../services/api';
import type { ProgressData } from '../types';

interface DashboardPageProps {
  onNavigate: (tab: string, meta?: Record<string, string>) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressApi
      .getProgress()
      .then((res) => {
        if (res.progress) setProgress(res.progress);
      })
      .catch((err) => console.error('Failed to load progress:', err))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: 'Study Hours',
      value: `${progress?.studyHours || 18.5} hrs`,
      icon: Clock,
      color: 'from-blue-600 to-cyan-600',
      change: '+3.5 hrs this week',
    },
    {
      label: 'Topics Completed',
      value: progress?.topicsCompleted || 24,
      icon: CheckCircle2,
      color: 'from-emerald-600 to-teal-600',
      change: '8 in progress',
    },
    {
      label: 'Average Quiz Score',
      value: `${progress?.averageQuizScore || 82}%`,
      icon: Award,
      color: 'from-purple-600 to-indigo-600',
      change: 'Top 10% in batch',
    },
    {
      label: 'Learning Streak',
      value: `${progress?.streak || 7} days`,
      icon: Flame,
      color: 'from-amber-500 to-orange-600',
      change: 'Personal best! 🔥',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden shadow-xl border border-brand-800/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Adaptive Agent Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Atharva'}!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-xl leading-relaxed">
              {user?.branch || 'Artificial Intelligence & Machine Learning'} • {user?.year || '2nd Year'}
              <span className="block mt-1 text-brand-300">
                You are on track for upcoming semester exams. Ready for your next study sprint?
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('chat')}
              className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-md shadow-brand-500/30 transition-all flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              <span>Ask AI Doubt</span>
            </button>
            <button
              onClick={() => onNavigate('quiz')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Take Quick Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${stat.color} text-white flex items-center justify-center shadow-sm`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Continue Learning & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Continue Learning & Weak Topics */}
        <div className="lg:col-span-2 space-y-8">
          {/* Continue Learning Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-500" />
                  <span>Continue Learning</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pick up right where you left off in your engineering modules
                </p>
              </div>
              <button
                onClick={() => onNavigate('subjects')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                View all subjects →
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Item 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                      Machine Learning
                    </span>
                    <span className="text-xs text-slate-400">• Last studied 2h ago</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Decision Trees & Information Gain
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="w-36 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="w-[65%] h-full bg-brand-500 rounded-full" />
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      65% completed
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('notes')}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 self-start sm:self-center shadow-sm"
                >
                  <span>Continue</span>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              {/* Item 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold">
                      Data Structures
                    </span>
                    <span className="text-xs text-slate-400">• Last studied 5h ago</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Binary Tree Traversals (Inorder, Postorder)
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="w-36 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="w-[40%] h-full bg-purple-500 rounded-full" />
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      40% completed
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('chat')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 self-start sm:self-center shadow-sm"
                >
                  <span>Continue</span>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              {/* Item 3 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold">
                      Python Programming
                    </span>
                    <span className="text-xs text-slate-400">• Last studied Yesterday</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    OOP Concepts & Decorators
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="w-36 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="w-[85%] h-full bg-amber-500 rounded-full" />
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      85% completed
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('flashcards')}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 self-start sm:self-center shadow-sm"
                >
                  <span>Continue</span>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          </div>

          {/* Topics You Should Revise (Weak Topics) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span>Topics You Should Revise</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Identified by the AI Agent from recent quiz performance
                </p>
              </div>
              <button
                onClick={() => onNavigate('quiz')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Diagnostic Quiz →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Weak Topic 1 */}
              <div className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/40">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-bold text-red-700 dark:text-red-400">Needs Practice</span>
                  <span className="font-mono text-red-600 dark:text-red-400 font-bold">58%</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  Recursion & Backtracking
                </h4>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-2">
                  Data Structures
                </div>
                <div className="w-full h-1.5 rounded-full bg-red-100 dark:bg-red-900/50 overflow-hidden mb-3">
                  <div className="w-[58%] h-full bg-red-500 rounded-full" />
                </div>
                <button
                  onClick={() => onNavigate('chat')}
                  className="w-full py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Revise with AI</span>
                </button>
              </div>

              {/* Weak Topic 2 */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-bold text-amber-700 dark:text-amber-400">Moderate</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">68%</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  Decision Trees & Entropy
                </h4>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-2">
                  Machine Learning
                </div>
                <div className="w-full h-1.5 rounded-full bg-amber-100 dark:bg-amber-900/50 overflow-hidden mb-3">
                  <div className="w-[68%] h-full bg-amber-500 rounded-full" />
                </div>
                <button
                  onClick={() => onNavigate('quiz')}
                  className="w-full py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1"
                >
                  <CheckSquare className="w-3 h-3" />
                  <span>Retake Quiz</span>
                </button>
              </div>

              {/* Weak Topic 3 */}
              <div className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/40">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-bold text-red-700 dark:text-red-400">Needs Practice</span>
                  <span className="font-mono text-red-600 dark:text-red-400 font-bold">62%</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  SQL Joins & Subqueries
                </h4>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-2">
                  Database Systems
                </div>
                <div className="w-full h-1.5 rounded-full bg-red-100 dark:bg-red-900/50 overflow-hidden mb-3">
                  <div className="w-[62%] h-full bg-red-500 rounded-full" />
                </div>
                <button
                  onClick={() => onNavigate('notes')}
                  className="w-full py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Generate Notes</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): AI Recommendations & Quick Access */}
        <div className="space-y-8">
          {/* AI Recommendations Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-500" />
                <span>Recommended For You</span>
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                AI Driven
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Next best actions based on your study history and weak topics:
            </p>

            <div className="space-y-3">
              {/* Rec 1 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-brand-400 transition-colors">
                <div className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-0.5">
                  Machine Learning
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Revise Decision Trees
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Calculate sample Information Gain and Shannon Entropy.
                </p>
                <button
                  onClick={() => onNavigate('chat')}
                  className="mt-2 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                >
                  <span>Start →</span>
                </button>
              </div>

              {/* Rec 2 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-purple-400 transition-colors">
                <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-0.5">
                  Data Structures
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Practice Binary Tree Questions
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Solve Inorder, Preorder, and Postorder recursion questions.
                </p>
                <button
                  onClick={() => onNavigate('quiz')}
                  className="mt-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                >
                  <span>Start →</span>
                </button>
              </div>

              {/* Rec 3 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 transition-colors">
                <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-0.5">
                  Assessment
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Take a Machine Learning Quiz
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Verify classification algorithms and evaluation metrics.
                </p>
                <button
                  onClick={() => onNavigate('quiz')}
                  className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Start →</span>
                </button>
              </div>

              {/* Rec 4 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 transition-colors">
                <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-0.5">
                  Python Programming
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Review Python Recursion
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Strengthen base conditions and avoid stack overflow errors.
                </p>
                <button
                  onClick={() => onNavigate('flashcards')}
                  className="mt-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Start →</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Study Planner Preview */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-400" />
                <span>Today's Study Schedule</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Evening</span>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">06:00 PM – Machine Learning</div>
                  <div className="text-[11px] text-slate-400">Decision Trees & Splitting</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-semibold">
                  Done
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">07:00 PM – Data Structures</div>
                  <div className="text-[11px] text-slate-400">Binary Tree Traversals</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 font-semibold">
                  Next
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">08:00 PM – Quiz Practice</div>
                  <div className="text-[11px] text-slate-400">5-Question MCQ Sprint</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-semibold">
                  Upcoming
                </span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('planner')}
              className="mt-4 w-full py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <span>Manage Study Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
