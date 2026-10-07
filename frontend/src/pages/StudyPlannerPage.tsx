import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Edit2,
  X,
  BookOpen,
  AlertCircle,
} from 'lucide-react';
import { studyPlanApi, aiApi } from '../services/api';
import type { StudyPlan, StudyTask } from '../types';

interface StudyPlannerPageProps {
  onNavigate: (tab: string) => void;
}

export const StudyPlannerPage: React.FC<StudyPlannerPageProps> = () => {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Form inputs for generating
  const [examDate, setExamDate] = useState('2026-11-15');
  const [availableHours, setAvailableHours] = useState(4);
  const [preferredTime, setPreferredTime] = useState('Evening (6 PM - 10 PM)');
  const [difficulty, setDifficulty] = useState('Intermediate');

  // Add Task Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskDay, setNewTaskDay] = useState('Monday');
  const [newTaskTime, setNewTaskTime] = useState('06:00 PM - 07:15 PM');
  const [newTaskSubject, setNewTaskSubject] = useState('Machine Learning');
  const [newTaskTopic, setNewTaskTopic] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');

  const fetchPlan = async () => {
    try {
      const res = await studyPlanApi.getStudyPlan();
      if (res.studyPlan) setStudyPlan(res.studyPlan);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await aiApi.generateStudyPlan({
        examDate,
        availableHours,
        preferredTime,
        difficulty,
        subjects: ['Machine Learning', 'Data Structures', 'Python Programming', 'DBMS'],
      });

      if (res.studyPlan) {
        setStudyPlan(res.studyPlan);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error generating plan');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    if (!studyPlan) return;
    try {
      await studyPlanApi.updateTask(taskId, { completed: !currentStatus });
      // Optimistic update
      setStudyPlan({
        ...studyPlan,
        tasks: studyPlan.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !currentStatus } : t
        ),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Remove this task from timetable?')) return;
    try {
      await studyPlanApi.deleteTask(taskId);
      if (studyPlan) {
        setStudyPlan({
          ...studyPlan,
          tasks: studyPlan.tasks.filter((t) => t.id !== taskId),
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTopic.trim()) return;

    try {
      const res = await studyPlanApi.addTask({
        day: newTaskDay,
        time: newTaskTime,
        subject: newTaskSubject,
        topic: newTaskTopic,
        notes: newTaskNotes,
      });

      if (res.studyPlan) {
        setStudyPlan(res.studyPlan);
      }
      setShowAddModal(false);
      setNewTaskTopic('');
      setNewTaskNotes('');
    } catch (e) {
      alert('Failed to add task');
    }
  };

  // Group tasks by day
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const groupedTasks: Record<string, StudyTask[]> = {};
  daysOrder.forEach((d) => (groupedTasks[d] = []));

  studyPlan?.tasks.forEach((task) => {
    if (groupedTasks[task.day]) {
      groupedTasks[task.day].push(task);
    } else {
      groupedTasks[task.day] = [task];
    }
  });

  const totalTasks = studyPlan?.tasks.length || 0;
  const completedTasks = studyPlan?.tasks.filter((t) => t.completed).length || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-amber-500" />
            <span>AI Personalized Study Planner</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Adaptive daily & weekly timetable generated according to exam milestones and your study pace
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Plan Progress & Exam Target Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 text-white border border-amber-800/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target: Semester Examination</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              {studyPlan?.title || 'Personalized Engineering Study Plan'}
            </h2>
            <p className="text-amber-200/80 text-xs sm:text-sm mt-1">
              Preferred Window: {preferredTime} • {availableHours} Study Hours / Day
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-700/50 text-center min-w-[120px]">
              <div className="text-2xl font-extrabold font-mono text-amber-400">
                {progressPercent}%
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Tasks Completed ({completedTasks}/{totalTasks})
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mt-4">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Configuration Form to Re-generate */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Customize & Regenerate AI Schedule</span>
        </h3>

        <form onSubmit={handleGeneratePlan} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Exam Date
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Available Daily Hours
            </label>
            <select
              value={availableHours}
              onChange={(e) => setAvailableHours(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-brand-500"
            >
              <option value={2}>2 Hours / Day</option>
              <option value={4}>4 Hours / Day (Recommended)</option>
              <option value={6}>6 Hours / Day (Intensive)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Preferred Study Slot
            </label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-brand-500"
            >
              <option value="Morning (6 AM - 10 AM)">Early Morning (6 AM - 10 AM)</option>
              <option value="Afternoon (2 PM - 6 PM)">Afternoon (2 PM - 6 PM)</option>
              <option value="Evening (6 PM - 10 PM)">Evening (6 PM - 10 PM)</option>
              <option value="Night (9 PM - 1 AM)">Night Owl (9 PM - 1 AM)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={generating}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{generating ? 'Optimizing Schedule...' : 'Create My Study Plan'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Daily Schedule Cards */}
      <div className="space-y-6">
        {daysOrder.map((day) => {
          const tasksForDay = groupedTasks[day] || [];
          if (tasksForDay.length === 0) return null;

          return (
            <div
              key={day}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>{day}</span>
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {tasksForDay.filter((t) => t.completed).length} of {tasksForDay.length} Completed
                </span>
              </div>

              <div className="space-y-3">
                {tasksForDay.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      task.completed
                        ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 opacity-75'
                        : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleTask(task.id, task.completed)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-semibold">
                            {task.subject}
                          </span>
                          <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{task.time}</span>
                          </span>
                        </div>
                        <h4
                          className={`text-sm font-bold ${
                            task.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {task.topic}
                        </h4>
                        {task.notes && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {task.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Study Task to Plan
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Day of Week
                  </label>
                  <select
                    value={newTaskDay}
                    onChange={(e) => setNewTaskDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                  >
                    {daysOrder.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 06:00 PM - 07:15 PM"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Machine Learning"
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Study Topic *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Decision Trees & Pruning"
                  value={newTaskTopic}
                  onChange={(e) => setNewTaskTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Revision Notes / Tasks
                </label>
                <input
                  type="text"
                  placeholder="e.g. Practice 3 derivations and Information Gain calculation"
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
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
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md shadow-amber-500/20"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
