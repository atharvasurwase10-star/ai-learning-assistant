import React, { useState } from 'react';
import {
  Brain,
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  Search,
  User as UserIcon,
  LogOut,
  Sparkles,
  Settings,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AIStatusBadge } from './AIStatusBadge';

interface NavbarProps {
  onToggleSidebar?: () => void;
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onNavigate }) => {
  const { user, isAuthenticated, logout, loginAsDemoStudent } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-cyan-400 animate-pulse-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-600 dark:from-brand-400 dark:via-indigo-400 dark:text-cyan-300 bg-clip-text text-transparent">
                  AI StudyAgent
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-300">
                  v1.0
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Intelligent Engineering Learning Companion
              </div>
            </div>
          </div>
        </div>

        {/* Center: Search (visible on larger screens when authenticated) */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search concepts, formulas, notes, subjects..."
                onClick={() => onNavigate('chat')}
                readOnly
                className="w-full pl-10 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer hover:border-brand-400 transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                AI Prompt
              </span>
            </div>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Mode Badge */}
          <AIStatusBadge />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-brand-500 absolute top-1.5 right-1.5" />
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-72 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 text-xs">
                    <div className="font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span>Study Notifications</span>
                      <span className="text-[10px] text-brand-500">2 New</span>
                    </div>
                    <div className="py-2 space-y-2">
                      <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200">
                        <div className="font-medium">Decision Trees Quiz Pending</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Scheduled for Machine Learning revision today.
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200">
                        <div className="font-medium">7-Day Study Streak Active! 🔥</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Complete 30 mins to maintain your streak.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    {user?.name ? user.name[0] : 'A'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      {user?.name || 'Atharva'}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      {user?.year || '2nd Year'} • {user?.branch ? 'AIML' : 'Engg'}
                    </div>
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {user?.name}
                      </div>
                      <div className="text-slate-500 truncate text-[11px]">
                        {user?.email}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>Student Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('about');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>About Mini Project</span>
                    </button>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                        onNavigate('landing');
                      }}
                      className="w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => loginAsDemoStudent().then(() => onNavigate('dashboard'))}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-Click Atharva Demo</span>
              </button>

              <button
                onClick={() => onNavigate('login')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/20"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
