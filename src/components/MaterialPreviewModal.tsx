import React from 'react';
import { Bookmark, Download, FileText, X } from 'lucide-react';
import { StudyMaterial } from '../types/lms';

export function downloadMaterialFile(material: StudyMaterial): void {
  if (material.fileUrl) {
    const link = document.createElement('a');
    link.href = material.fileUrl;
    link.download = `${material.title.replace(/[^a-zA-Z0-9_-]+/g, '_')}.${material.fileType.toLowerCase()}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  const content = [
    `QUANTUM STUDY — QUANTUM UNIVERSITY, ROORKEE`,
    `============================================================`,
    `Title:       ${material.title}`,
    `Subject:     ${material.subjectName}`,
    `Unit:        Unit ${material.unitNumber}`,
    `Category:    ${material.category}`,
    `Format:      ${material.fileType} (${material.fileSize})`,
    `Uploaded By: ${material.uploadedBy} on ${material.uploadDate}`,
    `============================================================`,
    ``,
    material.description || '',
    ``,
    material.previewContent || 'Detailed study notes prepared for B.Tech curriculum.',
  ].join('\n');

  const ext = material.fileType === 'CODE' ? 'txt' : 'md';
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${material.title.replace(/[^a-zA-Z0-9_-]+/g, '_')}.${ext}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

interface MaterialPreviewModalProps {
  material: StudyMaterial | null;
  isBookmarked: boolean;
  onClose: () => void;
  onToggleBookmark: (id: string) => void;
  onDownload: (material: StudyMaterial) => void;
}

export function MaterialPreviewModal({
  material,
  isBookmarked,
  onClose,
  onToggleBookmark,
  onDownload,
}: MaterialPreviewModalProps) {
  if (!material) return null;

  const isPdfDataOrUrl =
    material.fileUrl &&
    (material.fileUrl.startsWith('data:application/pdf') ||
      material.fileUrl.toLowerCase().includes('.pdf'));
  const isImageFile =
    material.fileUrl && material.fileUrl.startsWith('data:image/');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
    >
      <div className="w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xl overflow-hidden">
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-violet-700 dark:text-violet-400">
                {material.subjectName}
              </span>
              <span aria-hidden="true">·</span>
              <span>Unit {material.unitNumber}</span>
              <span aria-hidden="true">·</span>
              <span>{material.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {material.fileType} ({material.fileSize})
              </span>
            </div>
            <h2
              id="preview-modal-title"
              className="mt-1 text-lg font-semibold text-slate-900 dark:text-white leading-snug"
            >
              {material.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {material.description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {material.description}
            </p>
          )}

          {isPdfDataOrUrl ? (
            <iframe
              src={material.fileUrl}
              title={material.title}
              className="w-full h-[52vh] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
            />
          ) : isImageFile ? (
            <img
              src={material.fileUrl}
              alt={material.title}
              referrerPolicy="no-referrer"
              className="max-h-[52vh] mx-auto rounded-xl border border-slate-200 dark:border-slate-800 object-contain"
            />
          ) : (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1120] p-5">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
                <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span>Document Reader Preview · Uploaded by {material.uploadedBy}</span>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {material.previewContent ||
                  'Study material ready for offline download. Click Download below to save a copy.'}
              </pre>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0D1424]">
          <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            Published {material.uploadDate} · {material.uploadedBy}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onToggleBookmark(material.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap shrink-0 ${
                isBookmarked
                  ? 'border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-500'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <button
              type="button"
              onClick={() => onDownload(material)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#0F172A] dark:bg-violet-600 text-white hover:bg-slate-800 dark:hover:bg-violet-500 transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-4 h-4" />
              Download File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
