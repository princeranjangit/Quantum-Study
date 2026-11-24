import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  CalendarClock,
  Download,
  Eye,
  FileText,
  Megaphone,
} from 'lucide-react';
import {
  downloadMaterialFile,
  MaterialPreviewModal,
} from '../components/MaterialPreviewModal';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { AppRoute, StudyMaterial } from '../types/lms';

interface DashboardPageProps {
  onNavigate: (route: AppRoute, context?: { subjectId?: string }) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user } = useAuth();
  const {
    subjects,
    materials,
    assignments,
    submissions,
    quizAttempts,
    progress,
    announcements,
    loading,
    toggleBookmark,
  } = useData();
  const { showToast } = useToast();
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);

  const stats = useMemo(() => {
    const totalUnits = subjects.reduce((sum, s) => sum + s.units.length, 0);
    const completedUnits = progress.completedUnits.length;
    const completedAssignments = submissions.filter(
      (s) => s.status === 'completed' || s.status === 'submitted'
    ).length;

    const unitRatio = totalUnits > 0 ? completedUnits / totalUnits : 0;
    const assignRatio = assignments.length > 0 ? completedAssignments / assignments.length : 0;
    const overallProgress = Math.round((unitRatio * 0.7 + assignRatio * 0.3) * 100);

    const upcomingAssignments = assignments.filter((a) => {
      const sub = submissions.find((s) => s.assignmentId === a.id);
      return !sub || sub.status === 'pending';
    });

    const avgQuizScore =
      quizAttempts.length > 0
        ? Math.round(
            quizAttempts.reduce((acc, q) => acc + q.percentage, 0) / quizAttempts.length
          )
        : 0;

    return {
      totalUnits,
      completedUnits,
      completedAssignments,
      overallProgress,
      upcomingAssignments,
      avgQuizScore,
    };
  }, [subjects, progress, assignments, submissions, quizAttempts]);

  const recentMaterials = useMemo(() => materials.slice(0, 4), [materials]);

  const handleDownload = (material: StudyMaterial) => {
    downloadMaterialFile(material);
    showToast('Download started', material.title);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner + Overall Learning Progress */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-medium text-violet-700 dark:text-violet-400">
              {user?.universityName} · {user?.course} ({user?.branch})
            </p>
            <h1 className="mt-1.5 text-2xl sm:text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome back, {user?.fullName?.split(' ')[0]}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 tabular-nums">
              Semester {user?.semester} {user?.studentId ? `· ID: ${user.studentId}` : ''} ·{' '}
              {stats.completedUnits} of {stats.totalUnits} syllabus units completed
            </p>
          </div>

          <div className="w-full lg:w-80 shrink-0">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-600 dark:text-slate-300">Semester Learning Progress</span>
              <span className="font-mono text-violet-700 dark:text-violet-400 tabular-nums">
                {stats.overallProgress}%
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#0F172A] dark:bg-violet-500 transition-all duration-300"
                style={{ width: `${stats.overallProgress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              Avg Quiz Score: {quizAttempts.length ? `${stats.avgQuizScore}%` : 'No attempts yet'}
            </p>
          </div>
        </div>
      </section>

      {/* 4 Key Academic Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Semester</p>
          <p className="mt-2 text-2xl font-display font-bold text-slate-900 dark:text-white tabular-nums">
            Semester {user?.semester}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {subjects.length} Active Subjects
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Available Study Materials
          </p>
          <p className="mt-2 text-2xl font-display font-bold text-slate-900 dark:text-white tabular-nums">
            {materials.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Notes, PYQs, Lab Manuals
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Upcoming Assignments
          </p>
          <p className="mt-2 text-2xl font-display font-bold text-slate-900 dark:text-white tabular-nums">
            {stats.upcomingAssignments.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {stats.completedAssignments} submitted / completed
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Saved Bookmarks
          </p>
          <p className="mt-2 text-2xl font-display font-bold text-slate-900 dark:text-white tabular-nums">
            {progress.bookmarkedMaterialIds.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Quick revision library
          </p>
        </div>
      </section>

      {/* Quick Access to Subjects */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
            Quick Access to Subjects
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('subjects')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-700 dark:text-violet-400 hover:underline"
          >
            View All Subjects
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {subjects.map((subject) => {
            const doneCount = subject.units.filter((u) =>
              progress.completedUnits.includes(`${subject.id}_unit_${u.unitNumber}`)
            ).length;
            const pct =
              subject.units.length > 0
                ? Math.round((doneCount / subject.units.length) * 100)
                : 0;

            return (
              <button
                key={subject.id}
                type="button"
                onClick={() => onNavigate('subjects', { subjectId: subject.id })}
                className="group text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden hover:border-violet-500/60 transition-colors"
              >
                <div className="h-36 bg-slate-900 overflow-hidden">
                  {subject.coverImage ? (
                    <img
                      src={subject.coverImage}
                      alt={subject.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <BookOpen className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                    <span>{subject.code}</span>
                    <span aria-hidden="true">·</span>
                    <span>Sem {subject.semester}</span>
                    <span aria-hidden="true">·</span>
                    <span>{subject.units.length} Units</span>
                  </div>
                  <h3 className="mt-1.5 text-base font-display font-bold text-slate-900 dark:text-white">
                    {subject.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
                    {subject.instructor}
                  </p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-500 dark:text-slate-400">Syllabus Progress</span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                        {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-violet-600"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Two-Column Lower Section: Recently Uploaded Notes + Upcoming Assignments & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recently Uploaded Notes */}
        <section className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
              Recently Uploaded Notes
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('materials')}
              className="text-xs font-semibold text-violet-700 dark:text-violet-400 hover:underline"
            >
              Browse Library
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentMaterials.map((mat) => {
              const bookmarked = progress.bookmarkedMaterialIds.includes(mat.id);
              return (
                <div key={mat.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {mat.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {mat.subjectName} · Unit {mat.unitNumber} · {mat.category} · {mat.fileType} ({mat.fileSize})
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewMaterial(mat)}
                      aria-label={`Preview ${mat.title}`}
                      className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(mat)}
                      aria-label={`Download ${mat.title}`}
                      className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(mat.id)}
                      aria-label={`Bookmark ${mat.title}`}
                      className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${
                        bookmarked ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Upcoming Assignments & Campus Announcements */}
        <div className="lg:col-span-5 space-y-6">
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Upcoming Assignments
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('assignments')}
                className="text-xs font-semibold text-violet-700 dark:text-violet-400 hover:underline"
              >
                All Tasks
              </button>
            </div>
            {stats.upcomingAssignments.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                All published assignments are submitted. Great work.
              </p>
            ) : (
              <div className="space-y-3">
                {stats.upcomingAssignments.slice(0, 3).map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => onNavigate('assignments')}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-violet-500/60 transition-colors"
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                      {a.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {a.subjectName} · Due {a.dueDate} · {a.maxMarks} Marks
                    </p>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6">
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Megaphone className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              Recent Announcements
            </h2>
            <div className="space-y-3.5">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className="pb-3.5 last:pb-0 border-b last:border-b-0 border-slate-100 dark:border-slate-800"
                >
                  <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    {ann.category} · {ann.publishedAt.slice(0, 10)} · {ann.authorName}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {ann.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {ann.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <MaterialPreviewModal
        material={previewMaterial}
        isBookmarked={
          previewMaterial
            ? progress.bookmarkedMaterialIds.includes(previewMaterial.id)
            : false
        }
        onClose={() => setPreviewMaterial(null)}
        onToggleBookmark={(id) => toggleBookmark(id)}
        onDownload={handleDownload}
      />
    </div>
  );
}
