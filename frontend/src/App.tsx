import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { NotesPage } from './pages/NotesPage';
import { QuizPage } from './pages/QuizPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { SummarizerPage } from './pages/SummarizerPage';
import { ProgressPage } from './pages/ProgressPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navigationMeta, setNavigationMeta] = useState<Record<string, string>>({});

  const handleNavigate = (tab: string, meta?: Record<string, string>) => {
    setCurrentTab(tab);
    if (meta) setNavigationMeta(meta);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user just logged in or visits home while authenticated, default to dashboard
  const effectiveTab =
    currentTab === 'landing' && isAuthenticated ? 'dashboard' : currentTab;

  // Determine whether sidebar should be shown
  const isDashboardView =
    isAuthenticated &&
    effectiveTab !== 'landing' &&
    effectiveTab !== 'login' &&
    effectiveTab !== 'register';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        currentTab={effectiveTab}
        onNavigate={handleNavigate}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Container */}
      <div className="flex-1 flex w-full">
        {/* Sidebar (if authenticated and inside application) */}
        {isDashboardView && (
          <Sidebar
            currentTab={effectiveTab}
            onSelectTab={handleNavigate}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Dynamic Content View */}
        <main
          className={`flex-1 w-full ${
            isDashboardView
              ? 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-y-auto'
              : 'w-full'
          }`}
        >
          {effectiveTab === 'landing' && <LandingPage onNavigate={handleNavigate} />}
          {effectiveTab === 'login' && <LoginPage onNavigate={handleNavigate} />}
          {effectiveTab === 'register' && <RegisterPage onNavigate={handleNavigate} />}

          {/* Authenticated Dashboard Pages */}
          {effectiveTab === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
          {effectiveTab === 'chat' && <AIAssistantPage onNavigate={handleNavigate} />}
          {effectiveTab === 'subjects' && <SubjectsPage onNavigate={handleNavigate} />}
          {effectiveTab === 'notes' && (
            <NotesPage
              onNavigate={handleNavigate}
              initialSubject={navigationMeta.subject}
            />
          )}
          {effectiveTab === 'quiz' && (
            <QuizPage
              onNavigate={handleNavigate}
              initialSubject={navigationMeta.subject}
            />
          )}
          {effectiveTab === 'planner' && <StudyPlannerPage onNavigate={handleNavigate} />}
          {effectiveTab === 'flashcards' && (
            <FlashcardsPage
              onNavigate={handleNavigate}
              initialTopic={navigationMeta.topic}
            />
          )}
          {effectiveTab === 'summarizer' && <SummarizerPage />}
          {effectiveTab === 'progress' && <ProgressPage onNavigate={handleNavigate} />}
          {effectiveTab === 'resources' && <ResourcesPage />}
          {effectiveTab === 'profile' && <ProfilePage />}
          {effectiveTab === 'settings' && <SettingsPage />}
          {effectiveTab === 'about' && <AboutPage />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
