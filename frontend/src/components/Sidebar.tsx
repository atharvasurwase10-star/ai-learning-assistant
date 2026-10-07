import React from 'react';
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  FileText,
  CheckSquare,
  Calendar,
  Layers,
  FileCode2,
  TrendingUp,
  BookmarkCheck,
  Settings,
  HelpCircle,
  Sparkles,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
}) => {
  const { logout } = useAuth();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Assistant', icon: Bot, isHighlight: true },
    { id: 'subjects', label: 'My Subjects', icon: BookOpen },
    { id: 'notes', label: 'Smart Notes', icon: FileText },
    { id: 'quiz', label: 'AI Quiz', icon: CheckSquare },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'summarizer', label: 'Summarizer', icon: FileCode2 },
    { id: 'progress', label: 'Analytics', icon: TrendingUp },
    { id: 'resources', label: 'Resources', icon: BookmarkCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'About Project', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-40 h-full lg:h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <div className="p-4 flex-1 overflow-y-auto space-y-1">
          {/* Mobile Header */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 dark:border-slate-800 lg:hidden">
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Menu</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1">
            Learning Suite
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-white'
                        : item.isHighlight
                        ? 'text-brand-500 animate-pulse'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.isHighlight && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-brand-700 text-white'
                        : 'bg-brand-100 dark:bg-brand-900/60 text-brand-600 dark:text-brand-300'
                    }`}
                  >
                    AI Agent
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom card: Mini Project Info */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="p-3 rounded-xl bg-gradient-to-br from-brand-900/10 to-indigo-900/10 dark:from-brand-950 dark:to-indigo-950 border border-brand-200/60 dark:border-brand-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Mini Project
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              AI-Based Learning Assistant Intelligent Agent
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
