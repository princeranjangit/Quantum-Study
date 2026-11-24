import React, { useMemo } from 'react';
import { BarChart3, CheckCircle2, ClipboardCheck, HelpCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export function ProgressPage() {
  const { subjects, assignments, submissions, quizAttempts, progress } = useData();

  const summary = useMemo(() => {
    const totalUnits = subjects.reduce((sum, s) => sum + s.units.length, 0);
    const completedUnits = progress.completedUnits.length;
    const unitPct = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

    const doneAssign = submissions.filter(
      (s) => s.status === 'completed' || s.status === 'submitted'
    ).length;
    const assignPct =
      assignments.length > 0 ? Math.round((doneAssign / assignments.length) * 100) : 0;

    const avgQuiz =
      quizAttempts.length > 0
        ? Math.round(
            quizAttempts.reduce((sum, a) => sum + a.percentage, 0) / quizAttempts.length
          )
        : 0;

    const overall = Math.round(unitPct * 0.5 + assignPct * 0.25 + avgQuiz * 0.25);

    return {
      totalUnits,
      completedUnits,
      unitPct,
      doneAssign,
      assignPct,
      avgQuiz,
      overall,
    };
  }, [subjects, assignments, submissions, quizAttempts, progress]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
          My Academic Progress
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Combined view of syllabus unit completion, assignment submissions, and quiz performance.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Overall Progress</span>
            <BarChart3 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
          <p className="mt-2 text-3xl font-display font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {summary.overall}%
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Weighted syllabus, tasks & quizzes
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Syllabus Units</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="mt-2 text-3xl font-display font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {summary.completedUnits}/{summary.totalUnits}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {summary.unitPct}% syllabus covered
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Assignments</span>
            <ClipboardCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="mt-2 text-3xl font-display font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {summary.doneAssign}/{assignments.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {summary.assignPct}% completion rate
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Quiz Average</span>
            <HelpCircle className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
          <p className="mt-2 text-3xl font-display font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {quizAttempts.length ? `${summary.avgQuiz}%` : '—'}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            Across {quizAttempts.length} attempt{quizAttempts.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      {/* Subject-Wise Unit Breakdown */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 space-y-5">
        <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
          Subject-Wise Syllabus Progress
        </h2>

        <div className="space-y-5">
          {subjects.map((subject) => {
            const done = subject.units.filter((u) =>
              progress.completedUnits.includes(`${subject.id}_unit_${u.unitNumber}`)
            );
            const pct =
              subject.units.length > 0
                ? Math.round((done.length / subject.units.length) * 100)
                : 0;
            const totalHours = subject.units.reduce((acc, u) => acc + u.durationHours, 0);
            const doneHours = done.reduce((acc, u) => acc + u.durationHours, 0);

            return (
              <div
                key={subject.id}
                className="pb-5 last:pb-0 border-b last:border-b-0 border-slate-100 dark:border-slate-800"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-xs text-violet-700 dark:text-violet-400 mr-2">
                      {subject.code}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {subject.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-slate-600 dark:text-slate-300 tabular-nums">
                    {done.length}/{subject.units.length} units · {doneHours}/{totalHours} hrs · {pct}%
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0F172A] dark:bg-violet-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
