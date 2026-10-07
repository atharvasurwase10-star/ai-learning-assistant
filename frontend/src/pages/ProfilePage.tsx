import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Building,
  GraduationCap,
  Sparkles,
  Save,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { LearningLevel } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || 'Atharva Deshmukh',
    college: user?.college || 'MIT Academy of Engineering',
    branch: user?.branch || 'Artificial Intelligence & Machine Learning',
    year: user?.year || '2nd Year',
    interests: (user?.interests || ['Machine Learning', 'Data Structures', 'Python', 'Algorithms']).join(', '),
    learningLevel: (user?.learningLevel || 'Intermediate') as LearningLevel,
  });

  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const interestsArr = formData.interests
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean);

      await updateUser({
        name: formData.name,
        college: formData.college,
        branch: formData.branch,
        year: formData.year,
        interests: interestsArr,
        learningLevel: formData.learningLevel,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <UserIcon className="w-7 h-7 text-brand-600 dark:text-brand-400" />
          <span>Student Academic Profile</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your engineering details and calibrate how the AI Study Agent customizes explanations
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white border border-brand-800 shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-500 to-cyan-400 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg">
          {formData.name ? formData.name[0] : 'A'}
        </div>

        <div className="text-center sm:text-left flex-1">
          <h2 className="text-xl sm:text-2xl font-bold">{formData.name}</h2>
          <div className="text-slate-300 text-xs sm:text-sm mt-0.5">{user?.email}</div>
          <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {formData.branch}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {formData.year}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Level: {formData.learningLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Registered Email (Permanent)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'atharva@college.edu'}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Engineering College / University
            </label>
            <input
              type="text"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Engineering Discipline / Branch
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Academic Year
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
              >
                <option value="1st Year">1st Year (FE)</option>
                <option value="2nd Year">2nd Year (SE)</option>
                <option value="3rd Year">3rd Year (TE)</option>
                <option value="4th Year">4th Year (BE)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Preferred Learning Level
            </label>
            <select
              value={formData.learningLevel}
              onChange={(e) =>
                setFormData({ ...formData, learningLevel: e.target.value as LearningLevel })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
            >
              <option value="Beginner">Beginner (Foundations & High-Level Intuition)</option>
              <option value="Intermediate">Intermediate (Engineering Degree Curriculum Standard)</option>
              <option value="Advanced">Advanced (Gate / Rigorous Derivations / Placements)</option>
              <option value="Exam Preparation">Exam Preparation (High-Yield Definitions & Questions)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Learning Interests & Focus Areas
            </label>
            <input
              type="text"
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saved ? 'Changes Saved!' : submitting ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
