import React, { useMemo, useState } from 'react';
import { Bookmark, Download, Eye, Search } from 'lucide-react';
import {
  downloadMaterialFile,
  MaterialPreviewModal,
} from '../components/MaterialPreviewModal';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { StudyMaterial } from '../types/lms';

export function BookmarksPage() {
  const { materials, progress, toggleBookmark } = useData();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);

  const bookmarkedItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return materials.filter((m) => {
      if (!progress.bookmarkedMaterialIds.includes(m.id)) return false;
      if (
        q &&
        !m.title.toLowerCase().includes(q) &&
        !m.subjectName.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [materials, progress.bookmarkedMaterialIds, query]);

  const handleDownload = (material: StudyMaterial) => {
    downloadMaterialFile(material);
    showToast('Download started', material.title);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            Bookmarked Materials
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Quick-access notes, PYQs, and unit sheets saved for exam revision.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter bookmarks..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-sm"
          />
        </div>
      </div>

      {bookmarkedItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-12 text-center">
          <Bookmark className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-900 dark:text-white">
            No bookmarked study materials yet
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Click the bookmark icon on any note or PYQ in Study Materials to save it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {bookmarkedItems.map((mat) => (
            <article
              key={mat.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <p className="text-xs font-medium text-violet-700 dark:text-violet-400 tabular-nums">
                  {mat.subjectName} · Unit {mat.unitNumber} · {mat.category}
                </p>
                <h2 className="mt-1.5 text-base font-display font-bold text-slate-900 dark:text-white">
                  {mat.title}
                </h2>
                {mat.description && (
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {mat.description}
                  </p>
                )}
              </div>

              <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  {mat.fileType} · {mat.fileSize}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewMaterial(mat)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(mat)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F172A] dark:bg-violet-600 text-white text-xs font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      toggleBookmark(mat.id);
                      showToast('Bookmark removed', mat.title, 'info');
                    }}
                    aria-label="Remove bookmark"
                    className="p-1.5 rounded-lg text-violet-600 dark:text-violet-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            </article>
          ))}
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
