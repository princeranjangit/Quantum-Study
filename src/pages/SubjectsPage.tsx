import React, { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  Eye,
  HelpCircle,
  Search,
} from 'lucide-react';
import {
  downloadMaterialFile,
  MaterialPreviewModal,
} from '../components/MaterialPreviewModal';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { AppRoute, StudyMaterial } from '../types/lms';

interface SubjectsPageProps {
  initialSubjectId?: string;
  initialUnitNumber?: number;
  onNavigate: (route: AppRoute, context?: { quizId?: string }) => void;
}

export function SubjectsPage({
  initialSubjectId,
  initialUnitNumber,
  onNavigate,
}: SubjectsPageProps) {
  const {
    subjects,
    materials,
    quizzes,
    progress,
    toggleUnitCompletion,
    toggleBookmark,
  } = useData();
  const { showToast } = useToast();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    initialSubjectId || subjects[0]?.id || ''
  );
  const [topicSearch, setTopicSearch] = useState('');
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);

  useEffect(() => {
    if (initialSubjectId) {
      setSelectedSubjectId(initialSubjectId);
    } else if (!selectedSubjectId && subjects[0]) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [initialSubjectId, subjects, selectedSubjectId]);

  const activeSubject = useMemo(
    () => subjects.find((s) => s.id === selectedSubjectId) || subjects[0],
    [subjects, selectedSubjectId]
  );

  const filteredUnits = useMemo(() => {
    if (!activeSubject) return [];
    const q = topicSearch.trim().toLowerCase();
    if (!q) return activeSubject.units;
    return activeSubject.units.filter(
      (u) =>
        u.title.toLowerCase().includes(q) ||
        u.topics.some((t) => t.toLowerCase().includes(q))
    );
  }, [activeSubject, topicSearch]);

  const handleToggleUnit = async (subjectId: string, unitNumber: number) => {
    const wasDone = progress.completedUnits.includes(`${subjectId}_unit_${unitNumber}`);
    await toggleUnitCompletion(subjectId, unitNumber);
    showToast(
      wasDone ? 'Unit marked incomplete' : 'Unit marked completed',
      `Unit ${unitNumber} progress updated.`
    );
  };

  const handleDownload = (material: StudyMaterial) => {
    downloadMaterialFile(material);
    showToast('Download started', material.title);
  };

  if (!activeSubject) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-12 text-center">
        <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="text-base font-semibold text-slate-900 dark:text-white">
          No subjects configured yet
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Subjects added by faculty administrators will appear here.
        </p>
      </div>
    );
  }

  const completedInSubject = activeSubject.units.filter((u) =>
    progress.completedUnits.includes(`${activeSubject.id}_unit_${u.unitNumber}`)
  ).length;
  const subjectProgressPct =
    activeSubject.units.length > 0
      ? Math.round((completedInSubject / activeSubject.units.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            Subjects & Unit-Wise Syllabus
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Browse B.Tech curriculum units, check off completed modules, and access unit materials.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={topicSearch}
            onChange={(e) => setTopicSearch(e.target.value)}
            placeholder="Filter topics (e.g. SOAP, DOM, 5G)..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
          />
        </div>
      </div>

      {/* Subject Switcher Buttons */}
      <div className="flex flex-wrap gap-2">
        {subjects.map((subj) => {
          const active = subj.id === activeSubject.id;
          return (
            <button
              key={subj.id}
              type="button"
              onClick={() => setSelectedSubjectId(subj.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-[#0F172A] text-white border-[#0F172A] dark:bg-violet-600 dark:border-violet-600'
                  : 'bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span className="font-mono text-xs opacity-75 mr-2">{subj.code}</span>
              {subj.name}
            </button>
          );
        })}
      </div>

      {/* Subject Header Overview */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              <span className="text-violet-700 dark:text-violet-400 font-semibold">
                {activeSubject.code}
              </span>
              <span aria-hidden="true">·</span>
              <span>Semester {activeSubject.semester}</span>
              <span aria-hidden="true">·</span>
              <span>{activeSubject.credits} Credits</span>
              <span aria-hidden="true">·</span>
              <span>{activeSubject.instructor}</span>
            </div>
            <h2 className="mt-1.5 text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">
              {activeSubject.name}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeSubject.description}
            </p>
          </div>
          <div className="lg:col-span-4 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-600 dark:text-slate-300">Completion</span>
              <span className="font-mono text-violet-700 dark:text-violet-400 tabular-nums">
                {completedInSubject}/{activeSubject.units.length} Units ({subjectProgressPct}%)
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-600 transition-all"
                style={{ width: `${subjectProgressPct}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Structured Unit Cards */}
      {filteredUnits.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-10 text-center">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            No units matched &ldquo;{topicSearch}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => setTopicSearch('')}
            className="mt-3 text-xs font-semibold text-violet-700 dark:text-violet-400 hover:underline"
          >
            Clear topic filter
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredUnits.map((unit) => {
            const isCompleted = progress.completedUnits.includes(
              `${activeSubject.id}_unit_${unit.unitNumber}`
            );
            const unitMaterials = materials.filter(
              (m) => m.subjectId === activeSubject.id && m.unitNumber === unit.unitNumber
            );
            const unitQuiz = quizzes.find(
              (q) => q.subjectId === activeSubject.id && q.unitNumber === unit.unitNumber
            );
            const highlighted = initialUnitNumber === unit.unitNumber;

            return (
              <article
                key={unit.unitNumber}
                className={`rounded-2xl border bg-white dark:bg-[#111827] p-6 transition-colors ${
                  highlighted
                    ? 'border-violet-500'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-semibold text-violet-700 dark:text-violet-400 tabular-nums">
                        Unit {unit.unitNumber}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                        <Clock className="w-3.5 h-3.5" />
                        Duration: {unit.durationHours} Hours
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{unit.topics.length} Topics</span>
                    </div>
                    <h3 className="mt-1 text-lg font-display font-bold text-slate-900 dark:text-white">
                      {unit.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    {unitQuiz && (
                      <button
                        type="button"
                        onClick={() => onNavigate('quizzes', { quizId: unitQuiz.id })}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                        Unit {unit.unitNumber} Quiz
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleToggleUnit(activeSubject.id, unit.unitNumber)}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-[#0F172A] dark:bg-violet-600 text-white hover:bg-slate-800 dark:hover:bg-violet-500'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5" />
                          Mark Completed
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Topic List */}
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                    Syllabus Topics
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {unit.topics.map((topic, idx) => {
                      const matches =
                        topicSearch.trim().length > 0 &&
                        topic.toLowerCase().includes(topicSearch.trim().toLowerCase());
                      return (
                        <div
                          key={`${unit.unitNumber}-${idx}`}
                          className={`flex items-start gap-2 text-sm py-1 px-2 rounded-md ${
                            matches
                              ? 'bg-violet-50 dark:bg-violet-950/50 text-violet-900 dark:text-violet-200 font-medium'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="font-mono text-xs text-slate-400 mt-0.5 tabular-nums w-5 shrink-0">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span>{topic}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Unit Study Materials */}
                {unitMaterials.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
                      Unit Study Materials ({unitMaterials.length})
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {unitMaterials.map((mat) => {
                        const bookmarked = progress.bookmarkedMaterialIds.includes(mat.id);
                        return (
                          <div
                            key={mat.id}
                            className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B1120]"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                {mat.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                                {mat.category} · {mat.fileType} · {mat.fileSize}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => setPreviewMaterial(mat)}
                                aria-label="Preview material"
                                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownload(mat)}
                                aria-label="Download material"
                                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleBookmark(mat.id)}
                                aria-label="Bookmark material"
                                className={`p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 ${
                                  bookmarked
                                    ? 'text-violet-600 dark:text-violet-400'
                                    : 'text-slate-400'
                                }`}
                              >
                                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

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
