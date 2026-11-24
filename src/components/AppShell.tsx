import React, { useState } from 'react';
import {
  BarChart3,
  Bookmark,
  BookOpen,
  ClipboardCheck,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { AppRoute } from '../types/lms';
import { BrandLogo } from './BrandLogo';

interface NavItem {
  route: AppRoute;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { route: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { route: 'subjects', label: 'Subjects', icon: BookOpen },
  { route: 'materials', label: 'Study Materials', icon: FileText },
  { route: 'assignments', label: 'Assignments', icon: ClipboardCheck },
  { route: 'quizzes', label: 'Quizzes', icon: HelpCircle },
  { route: 'progress', label: 'My Progress', icon: BarChart3 },
  { route: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
  { route: 'profile', label: 'Profile', icon: User },
  { route: 'admin', label: 'Admin Console', icon: ShieldCheck, adminOnly: true },
];

interface AppShellProps {
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onOpenSearch: () => void;
  children: React.ReactNode;
}

export function AppShell({
  activeRoute,
  onNavigate,
  onOpenSearch,
  children,
}: AppShellProps) {
  const { user, backendMode, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || user?.role === 'admin'
  );

  const activeLabel =
    visibleItems.find((i) => i.route === activeRoute)?.label || 'Dashboard';

  const handleNavClick = (route: AppRoute) => {
    onNavigate(route);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#090E1A] text-slate-900 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1526]">
        <div className="h-16 px-5 flex items-center border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => handleNavClick('dashboard')}
            className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 rounded-lg"
          >
            <BrandLogo size="sm" />
          </button>
        </div>

        <nav aria-label="Primary Workspace Navigation" className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = activeRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => handleNavClick(item.route)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[#0F172A] text-white dark:bg-violet-600 dark:text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatarUrl || '/src/assets/images/avatar_student_default_1795536853305.jpg'}
              alt={user?.fullName || 'Student'}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {user?.fullName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.role === 'admin' ? 'Faculty Admin' : `Sem ${user?.semester} · ${user?.course}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-white dark:bg-[#0E1526] border-r border-slate-200 dark:border-slate-800 flex flex-col z-10">
            <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
              <BrandLogo size="sm" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const active = activeRoute === item.route;
                return (
                  <button
                    key={item.route}
                    type="button"
                    onClick={() => handleNavClick(item.route)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#0F172A] text-white dark:bg-violet-600'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => logout()}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0E1526]/95 backdrop-blur-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm truncate">
              <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">
                Quantum University
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline" aria-hidden="true">
                /
              </span>
              <span className="font-semibold text-slate-900 dark:text-white truncate">
                {activeLabel}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 hidden md:inline">
                · {backendMode === 'firebase' ? 'Cloud Sync' : 'Local Demo Mode'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenSearch}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 transition-colors whitespace-nowrap shrink-0"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Search topics, notes, PYQs...</span>
              <span className="sm:hidden">Search</span>
              <kbd className="hidden md:inline-block font-mono text-[11px] text-slate-400 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
