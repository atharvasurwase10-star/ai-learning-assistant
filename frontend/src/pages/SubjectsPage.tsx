import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Plus,
  Play,
  Award,
  CheckCircle2,
  Trash2,
  X,
  Code,
  Brain,
  Database,
  Network,
  Calculator,
} from 'lucide-react';
import { subjectApi } from '../services/api';
import type { Subject } from '../types';

interface SubjectsPageProps {
  onNavigate: (tab: string, meta?: Record<string, string>) => void;
}

export const SubjectsPage: React.FC<SubjectsPageProps> = ({ onNavigate }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectTopics, setNewSubjectTopics] = useState('');

  const fetchSubjects = async () => {
    try {
      const res = await subjectApi.getSubjects();
      if (res.subjects) setSubjects(res.subjects);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    try {
      const topicsArr = newSubjectTopics
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await subjectApi.addSubject({
        name: newSubjectName,
        code: newSubjectCode,
        topics: topicsArr.length > 0 ? topicsArr : ['Introduction', 'Core Architecture', 'Applications'],
        progress: 10,
        quizScore: 70,
      });

      setNewSubjectName('');
      setNewSubjectCode('');
      setNewSubjectTopics('');
      setShowAddModal(false);
      fetchSubjects();
    } catch (err) {
      alert('Failed to add subject');
    }
  };

  const handleDeleteSubject = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}"?`)) {
      await subjectApi.deleteSubject(id);
      fetchSubjects();
    }
  };

  const getSubjectIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('machine learning') || lower.includes('ai')) return Brain;
    if (lower.includes('data structure') || lower.includes('algorithm')) return Network;
    if (lower.includes('python') || lower.includes('programming') || lower.includes('c++')) return Code;
    if (lower.includes('database') || lower.includes('dbms') || lower.includes('sql')) return Database;
    if (lower.includes('math')) return Calculator;
    return BookOpen;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-brand-600 dark:text-brand-400" />
            <span>My Engineering Subjects</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track module completion, syllabus coverage, and assessment records
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((sub) => {
          const Icon = getSubjectIcon(sub.name);
          return (
            <div
              key={sub._id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    {sub.code && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                        {sub.code}
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteSubject(sub._id, sub.name)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-colors"
                      title="Delete subject"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subject Name */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {sub.category || 'Core Engineering Course'}
                </p>

                {/* Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-400">Syllabus Progress</span>
                    <span className="text-brand-600 dark:text-brand-400 font-mono">
                      {sub.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-600 to-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${sub.progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span>
                      {sub.completedTopics?.length || Math.round((sub.topics.length * sub.progress) / 100)} /{' '}
                      {sub.topics.length || 10} Topics
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <Award className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span>Quiz Avg: {sub.quizScore}%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-2 flex items-center gap-2">
                <button
                  onClick={() => onNavigate('notes', { subject: sub.name })}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors text-center"
                >
                  Notes
                </button>
                <button
                  onClick={() => onNavigate('quiz', { subject: sub.name })}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors text-center"
                >
                  Quiz
                </button>
                <button
                  onClick={() => onNavigate('chat', { subject: sub.name })}
                  className="p-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all"
                  title="Ask AI about this subject"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Engineering Subject
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Organization & Architecture"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS-301"
                  value={newSubjectCode}
                  onChange={(e) => setNewSubjectCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Key Syllabus Topics (comma separated)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Von Neumann Architecture, Instruction Pipeline, Cache Memory, RISC vs CISC"
                  value={newSubjectTopics}
                  onChange={(e) => setNewSubjectTopics(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-500/20"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
