import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Bell,
  Sparkles,
  Shield,
  Smartphone,
  Save,
  Check,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { AIStatusBadge } from '../components/AIStatusBadge';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [aiStyle, setAiStyle] = useState('Detailed Engineering Notes with Code');
  const [autoSaveNotes, setAutoSaveNotes] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-slate-700 dark:text-slate-300" />
          <span>Application Preferences & Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize UI aesthetics, notifications, and intelligent agent response behavior
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Theme & Display Appearance</span>
          </h3>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Theme Mode ({theme === 'dark' ? 'Dark Mode' : 'Light Mode'})
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Seamless theme support with persistent local storage
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-brand-500 flex items-center gap-2 transition-colors shadow-sm"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>

        {/* AI Agent Configuration */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Intelligent Agent Engine Configuration</span>
            </h3>
            <AIStatusBadge />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Default AI Response Persona & Format
              </label>
              <select
                value={aiStyle}
                onChange={(e) => setAiStyle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-brand-500"
              >
                <option value="Detailed Engineering Notes with Code">Detailed Engineering Notes with Code Snippets</option>
                <option value="Socratic Tutor">Socratic Tutor (Guided Questioning & Hints)</option>
                <option value="Exam Cram / High-Yield Formulas">Exam Cram / High-Yield Definitions & Formulas</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Auto-Save Generated Notes</div>
                <div className="text-[11px] text-slate-500">Automatically preserve newly generated notes to MongoDB collection</div>
              </div>
              <input
                type="checkbox"
                checked={autoSaveNotes}
                onChange={(e) => setAutoSaveNotes(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Study Reminders */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-500" />
            <span>Study Notifications & Streak Alerts</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Daily Revision Reminder</div>
                <div className="text-[11px] text-slate-500">Alert for scheduled tasks in your personalized timetable</div>
              </div>
              <input
                type="checkbox"
                checked={dailyReminders}
                onChange={(e) => setDailyReminders(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Streak & Weak Topic Alerts</div>
                <div className="text-[11px] text-slate-500">Notify when diagnostic quizzes detect concepts requiring review</div>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Preferences Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
