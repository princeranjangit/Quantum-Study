/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AppShell } from './components/AppShell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { AuthPage } from './pages/AuthPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { DashboardPage } from './pages/DashboardPage';
import { LandingPage } from './pages/LandingPage';
import { MaterialsPage } from './pages/MaterialsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProgressPage } from './pages/ProgressPage';
import { QuizzesPage } from './pages/QuizzesPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { AppRoute } from './types/lms';

function QuantumStudyRouter() {
  const { user, authReady, loginAsDemoStudent } = useAuth();
  const { showToast } = useToast();

  const [route, setRoute] = useState<AppRoute>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [searchOpen, setSearchOpen] = useState(false);
  const [routeContext, setRouteContext] = useState<{
    subjectId?: string;
    unitNumber?: number;
    quizId?: string;
  }>({});

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && user) {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [user]);

  // Protected route synchronization
  useEffect(() => {
    if (!authReady) return;
    if (user && (route === 'landing' || route === 'auth')) {
      setRoute('dashboard');
    } else if (!user && route !== 'landing' && route !== 'auth') {
      setRoute('landing');
    }
  }, [user, authReady, route]);

  const handleNavigate = (
    nextRoute: AppRoute,
    context?: { subjectId?: string; unitNumber?: number; quizId?: string }
  ) => {
    if (nextRoute === 'admin' && user?.role !== 'admin') {
      showToast('Access restricted', 'Only faculty administrators can open the Admin Console.', 'error');
      return;
    }
    setRouteContext(context || {});
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#090E1A]">
        <div className="space-y-3 text-center">
          <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Initializing Quantum Study...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (route === 'auth') {
      return (
        <AuthPage
          initialMode={authMode}
          onBack={() => setRoute('landing')}
          onSuccess={() => setRoute('dashboard')}
        />
      );
    }

    return (
      <LandingPage
        onOpenAuth={(mode = 'login') => {
          setAuthMode(mode);
          setRoute('auth');
        }}
        onDemoStudent={async () => {
          await loginAsDemoStudent();
          showToast('Demo Student Active', 'Signed in as Aarav Sharma (B.Tech CSE Sem 5).');
          setRoute('dashboard');
        }}
      />
    );
  }

  const renderWorkspacePage = () => {
    switch (route) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'subjects':
        return (
          <SubjectsPage
            initialSubjectId={routeContext.subjectId}
            initialUnitNumber={routeContext.unitNumber}
            onNavigate={handleNavigate}
          />
        );
      case 'materials':
        return <MaterialsPage />;
      case 'assignments':
        return <AssignmentsPage />;
      case 'quizzes':
        return <QuizzesPage initialQuizId={routeContext.quizId} />;
      case 'progress':
        return <ProgressPage />;
      case 'bookmarks':
        return <BookmarksPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminDashboardPage />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      <AppShell
        activeRoute={route}
        onNavigate={(next) => handleNavigate(next)}
        onOpenSearch={() => setSearchOpen(true)}
      >
        {renderWorkspacePage()}
      </AppShell>

      <GlobalSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNavigate}
      />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <DataProvider>
              <QuantumStudyRouter />
            </DataProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
