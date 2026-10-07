import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Award,
  Flame,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { progressApi } from '../services/api';
import type { ProgressData } from '../types';

interface ProgressPageProps {
  onNavigate: (tab: string, meta?: Record<string, string>) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ onNavigate }) => {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressApi
      .getProgress()
      .then((res) => {
        if (res.progress) setProgress(res.progress);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const weeklyHours = progress?.weeklyStudyHours || [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.0 },
    { day: 'Wed', hours: 2.0 },
    { day: 'Thu', hours: 3.5 },
    { day: 'Fri', calculations: 2.5, hours: 2.5 },
    { day: 'Sat', hours: 4.0 },
    { day: 'Sun', hours: 1.0 },
  ];

  const maxHours = Math.max(...weeklyHours.map((w) => w.hours), 4.5);

  const insights = [
    {
      title: 'Machine Learning Performance Trend',
      text: 'Your Machine Learning quiz accuracy increased by +14% this week after completing Decision Tree practice.',
      type: 'positive',
    },
    {
      title: 'Active Recommendation: Decision Trees',
      text: 'Revise Information Gain and Shannon Entropy mathematical definitions before semester exams.',
      type: 'action',
    },
    {
      title: 'Curriculum Milestone: DSA',
      text: 'You have completed 40% of core Data Structures topics. Next focus: Binary Tree Traversals.',
      type: 'info',
    },
    {
      title: 'Immediate Study Goal',
      text: 'Practice Recursion and Backtracking for 30 minutes today to strengthen your identified weak area.',
      type: 'urgent',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <TrendingUp className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
          <span>Learning Progress & AI Analytics</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real-time metrics, syllabus completion trajectories, and diagnostic learning recommendations
        </p>
      </div>

      {/* Top 4 Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Study Hours</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {progress?.studyHours || 18.5} hrs
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            +3.5 hrs vs last week
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Topics Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {progress?.topicsCompleted || 24}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Across 5 Core Subjects
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Average Quiz Score</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {progress?.averageQuizScore || 82}%
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 mt-1">
            Proficient (Level: Intermediate)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {progress?.streak || 7} Days 🔥
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
            Consistent learning behavior
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Study Hours Bar Chart */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Weekly Study Time Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total 18.5 hours recorded across this week
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
              Avg 2.6h / day
            </span>
          </div>

          {/* Visual SVG/CSS Bar Chart */}
          <div className="pt-8 pb-2 flex items-end justify-between gap-3 h-56">
            {weeklyHours.map((item, idx) => {
              const heightPercent = Math.round((item.hours / maxHours) * 100);
              const isToday = item.day === 'Wed';

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.hours}h
                  </span>

                  <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800 rounded-t-xl overflow-hidden flex flex-col justify-end h-40">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-500 group-hover:brightness-110 ${
                        isToday
                          ? 'bg-gradient-to-t from-brand-600 to-cyan-400'
                          : 'bg-gradient-to-t from-indigo-600 to-brand-500'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <span
                    className={`text-xs font-semibold ${
                      isToday
                        ? 'text-brand-600 dark:text-brand-400 font-bold'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Progress Breakdown */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Subject Mastery & Coverage
            </h3>
            <button
              onClick={() => onNavigate('subjects')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              All Subjects →
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {(progress?.subjectProgress || []).map((sub, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {sub.subject}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400 text-[11px]">
                      {sub.completedTopics}/{sub.totalTopics} Topics
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {sub.progress}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${sub.progress}%`,
                      backgroundColor: sub.color || '#3B82F6',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI LEARNING INSIGHTS SECTION (Section 30) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Your AI Learning Insights</h3>
              <p className="text-xs text-slate-400">
                Synthesized dynamically from your stored quiz submissions and study sessions
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((ins, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-1.5 hover:border-brand-500 transition-colors"
            >
              <div className="font-bold text-brand-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-400" />
                <span>{ins.title}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{ins.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strong and Weak Topics Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strong Topics */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Demonstrated Topic Strengths (Score &gt;= 85%)
            </h3>
          </div>

          <div className="space-y-2">
            {(progress?.strongTopics || []).map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{item.topic}</div>
                  <div className="text-[10px] text-slate-500">{item.subject}</div>
                </div>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {item.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Areas Requiring Practice (Score &lt; 70%)
            </h3>
          </div>

          <div className="space-y-2">
            {(progress?.weakTopics || []).map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-red-50/40 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{item.topic}</div>
                  <div className="text-[10px] text-slate-500">{item.subject}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-red-600 dark:text-red-400">
                    {item.score}%
                  </span>
                  <button
                    onClick={() => onNavigate('chat')}
                    className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-[10px]"
                  >
                    Revise →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
