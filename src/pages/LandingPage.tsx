import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  HelpCircle,
  Moon,
  ShieldCheck,
  Sun,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { INITIAL_SUBJECTS } from '../data/seedData';
import { useTheme } from '../contexts/ThemeContext';

interface LandingPageProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onDemoStudent: () => void;
}

export function LandingPage({ onOpenAuth, onDemoStudent }: LandingPageProps) {
  const { theme, toggleTheme } = useTheme();
  const webDev = INITIAL_SUBJECTS[0];
  const [selectedUnit, setSelectedUnit] = useState(1);

  const activeUnit =
    webDev.units.find((u) => u.unitNumber === selectedUnit) || webDev.units[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090E1A] text-slate-900 dark:text-slate-100">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#090E1A]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <a href="#top" className="whitespace-nowrap shrink-0">
            <BrandLogo />
          </a>

          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <a
              href="#curriculum"
              className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Curriculum
            </a>
            <a
              href="#library"
              className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Library
            </a>
            <a
              href="#assessments"
              className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Assessments
            </a>
            <a
              href="#campus"
              className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Campus
            </a>
          </nav>

          <button
            type="button"
            onClick={() => onOpenAuth('login')}
            className="px-4 py-2 rounded-lg bg-[#0F172A] dark:bg-violet-600 text-white text-sm font-medium hover:bg-slate-800 dark:hover:bg-violet-500 transition-colors whitespace-nowrap shrink-0"
          >
            Student Portal
          </button>
        </div>
      </header>

      <main id="top">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 lg:pt-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-sm font-medium text-violet-700 dark:text-violet-400">
                Quantum University, Roorkee · B.Tech Academic Hub
              </p>
              <h1 className="mt-3 font-display font-bold tracking-tight text-slate-900 dark:text-white text-balance text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.1]">
                Your Campus. Your Learning. Your Future.
              </h1>
              <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Access verified semester-wise B.Tech syllabi, unit notes, previous year question papers, assignment submissions, and timed MCQ assessments in one centralized workspace.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#0F172A] dark:bg-violet-600 text-white text-sm font-semibold hover:bg-slate-800 dark:hover:bg-violet-500 transition-colors whitespace-nowrap shrink-0"
                >
                  Create Student Account
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onDemoStudent}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] text-slate-800 dark:text-slate-200 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                >
                  Launch Instant Student Demo
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[280px] sm:min-h-[360px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 relative">
                <img
                  src="/src/assets/images/hero_campus_study_1795536852648.jpg"
                  alt="B.Tech engineering students studying together in a modern university library"
                  referrerPolicy="no-referrer"
                  className="w-full h-full lg:h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Full-width 4-Column Academic Overview Strip */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 border-t border-b border-slate-200 dark:border-slate-800 py-6">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Structured Syllabus
              </p>
              <p className="mt-1 text-2xl font-display font-bold text-slate-900 dark:text-white tabular-nums">
                5 Units · 36 Hrs
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Material Categories
              </p>
              <p className="mt-1 text-2xl font-display font-bold text-slate-900 dark:text-white tabular-nums">
                9 Formats
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Unit Assessments
              </p>
              <p className="mt-1 text-2xl font-display font-bold text-slate-900 dark:text-white tabular-nums">
                Timed MCQs
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Campus Alignment
              </p>
              <p className="mt-1 text-2xl font-display font-bold text-slate-900 dark:text-white tabular-nums">
                Semesters 1–8
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Curriculum Explorer */}
        <section id="curriculum" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-sm font-medium text-violet-700 dark:text-violet-400">
                Featured Subject · CS501
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                Web Development Syllabus Explorer
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
              Inspect every unit, topic breakdown, and lecture-hour allocation directly before entering the portal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 space-y-2">
              {webDev.units.map((unit) => {
                const active = unit.unitNumber === selectedUnit;
                return (
                  <button
                    key={unit.unitNumber}
                    type="button"
                    onClick={() => setSelectedUnit(unit.unitNumber)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border transition-colors ${
                      active
                        ? 'bg-[#0F172A] text-white border-[#0F172A] dark:bg-violet-600 dark:border-violet-600'
                        : 'bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs opacity-80">
                      <span className="font-mono tabular-nums">Unit {unit.unitNumber}</span>
                      <span className="font-mono tabular-nums">{unit.durationHours} Hours</span>
                    </div>
                    <p className="mt-1 text-sm font-semibold leading-snug">{unit.title}</p>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-xs font-mono text-violet-700 dark:text-violet-400 tabular-nums">
                    Unit {activeUnit.unitNumber} · Duration: {activeUnit.durationHours} Hours
                  </p>
                  <h3 className="mt-1 text-xl font-display font-bold text-slate-900 dark:text-white">
                    {activeUnit.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onDemoStudent}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
                >
                  Open Unit Notes & Quiz
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeUnit.topics.map((topic, idx) => (
                  <div
                    key={topic}
                    className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 py-1.5"
                  >
                    <span className="font-mono text-xs text-slate-400 dark:text-slate-500 mt-0.5 tabular-nums w-5 shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities Bento Grid */}
        <section id="library" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-medium text-violet-700 dark:text-violet-400">
              Platform Architecture
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
              Built for the Complete Semester Workflow
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-violet-400 mb-5">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                  01. Categorized Study Material Library
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  Filter instantly across Lecture Notes, PDF Notes, Important Questions, Previous Year Question Papers, Lab Manuals, Practical Files, and Reference Books. Preview documents right inside the portal, bookmark exam essentials, or download offline copies.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span>Instant PDF Reader</span>
                <span>One-Click Bookmarks</span>
                <span>Unit-Wise Filtering</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-violet-400 mb-5">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                02. Timed Unit Quizzes
              </h3>
              <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Practice unit-by-unit MCQs under real exam timers with instant automated grading, answer explanations, and full attempt history.
              </p>
            </div>

            <div id="assessments" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-violet-400 mb-5">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                03. Assignment Tracking
              </h3>
              <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Monitor upcoming due dates, upload assignment files directly, and mark submissions completed to update your semester progress.
              </p>
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-violet-400 mb-5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                  04. Role-Based Faculty Admin Console
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  Authenticated faculty administrators manage subjects and unit syllabi, upload PDF notes, publish assignments, author unit quizzes, post campus announcements, and oversee student accounts from a dedicated protected dashboard.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Firebase Auth & Firestore
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  Offline-Ready Demo Mode
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Real-Time Progress Sync
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Campus CTA */}
        <section id="campus" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="rounded-2xl bg-[#0F172A] dark:bg-[#111827] border border-slate-800 p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-white">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-violet-400">
                Quantum University, Roorkee
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-display font-bold tracking-tight">
                Ready to organize your B.Tech semester?
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-300">
                Sign in with your student account, explore the instant demo workspace, or switch to Faculty Admin mode to test full LMS management.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="px-5 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                Sign In to Quantum Study
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-white">Quantum Study</span>
            <span aria-hidden="true">·</span>
            <span>B.Tech Learning Management System · Quantum University, Roorkee</span>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            {theme === 'dark' ? 'Light Appearance' : 'Dark Appearance'}
          </button>
        </div>
      </footer>
    </div>
  );
}
