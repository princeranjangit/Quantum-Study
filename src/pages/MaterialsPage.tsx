import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  Download,
  Eye,
  FileText,
  Search,
} from 'lucide-react';
import {
  downloadMaterialFile,
  MaterialPreviewModal,
} from '../components/MaterialPreviewModal';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { MATERIAL_CATEGORIES, StudyMaterial } from '../types/lms';

export function MaterialsPage() {
  const { subjects, materials, progress, toggleBookmark } = useData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [unitFilter, setUnitFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return materials.filter((m) => {
      if (subjectFilter !== 'all' && m.subjectId !== subjectFilter) return false;
      if (unitFilter !== 'all' && m.unitNumber !== Number(unitFilter)) return false;
      if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;
      if (
        q &&
        !m.title.toLowerCase().includes(q) &&
        !m.subjectName.toLowerCase().includes(q) &&
        !(m.description || '').toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [materials, searchQuery, subjectFilter, unitFilter, categoryFilter]);

  const handleDownload = (material: StudyMaterial) => {
    downloadMaterialFile(material);
    showToast('Download started', material.title);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
          Study Material Library
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Filter lecture notes, PDF notes, previous year question papers, lab manuals, and reference books.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search material title, topic, or description..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
            />
          </div>
          <div className="md:col-span-3">
            <select
              aria-label="Filter by subject"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <select
              aria-label="Filter by unit"
              value={unitFilter}
              onChange={(e) => setUnitFilter(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white"
            >
              <option value="all">All Units</option>
              {[1, 2, 3, 4, 5].map((u) => (
                <option key={u} value={u}>
                  Unit {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Segmented Filter Buttons */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              categoryFilter === 'all'
                ? 'bg-[#0F172A] text-white dark:bg-violet-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Categories
          </button>
          {MATERIAL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                categoryFilter === cat
                  ? 'bg-[#0F172A] text-white dark:bg-violet-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
        Showing {filtered.length} of {materials.length} study materials
      </p>

      {/* Materials Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-12 text-center">
          <FileText className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-900 dark:text-white">
            No study materials match your filters
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try resetting the subject, unit, or category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSubjectFilter('all');
              setUnitFilter('all');
              setCategoryFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-[#0F172A] dark:bg-violet-600 text-white text-xs font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((mat) => {
            const bookmarked = progress.bookmarkedMaterialIds.includes(mat.id);
            return (
              <article
                key={mat.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 flex flex-col justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-medium text-violet-700 dark:text-violet-400 tabular-nums">
                      {mat.subjectName} · Unit {mat.unitNumber} · {mat.category}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        toggleBookmark(mat.id);
                        showToast(
                          bookmarked ? 'Removed bookmark' : 'Material bookmarked',
                          mat.title,
                          'info'
                        );
                      }}
                      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark material'}
                      className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                        bookmarked
                          ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <h2 className="mt-1.5 text-base font-display font-bold text-slate-900 dark:text-white leading-snug">
                    {mat.title}
                  </h2>

                  {mat.description && (
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {mat.description}
                    </p>
                  )}
                </div>

                <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                    {mat.fileType} · {mat.fileSize} · {mat.uploadDate}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewMaterial(mat)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(mat)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F172A] dark:bg-violet-600 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-violet-500 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                </div>
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
