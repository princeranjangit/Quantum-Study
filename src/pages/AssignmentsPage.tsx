import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileUp,
  Upload,
  X,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { Assignment, SubmissionStatus } from '../types/lms';

export function AssignmentsPage() {
  const { assignments, submissions, submitAssignment } = useData();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState<'all' | SubmissionStatus>('all');
  const [uploadingFor, setUploadingFor] = useState<Assignment | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);

  const enriched = useMemo(() => {
    return assignments.map((a) => {
      const sub = submissions.find((s) => s.assignmentId === a.id);
      const status: SubmissionStatus = sub?.status || 'pending';
      return { assignment: a, submission: sub, status };
    });
  }, [assignments, submissions]);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return enriched;
    return enriched.filter((item) => item.status === statusFilter);
  }, [enriched, statusFilter]);

  const handleOpenUpload = (assignment: Assignment) => {
    const existing = submissions.find((s) => s.assignmentId === assignment.id);
    setUploadingFor(assignment);
    setSelectedFile(null);
    setNotes(existing?.notes || '');
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadingFor) return;
    setBusy(true);
    try {
      await submitAssignment(uploadingFor.id, 'submitted', selectedFile, notes);
      showToast('Assignment submitted', uploadingFor.title);
      setUploadingFor(null);
      setSelectedFile(null);
      setNotes('');
    } catch (err: unknown) {
      showToast(
        'Submission failed',
        err instanceof Error ? err.message : 'Unable to upload file.',
        'error'
      );
    } finally {
      setBusy(false);
    }
  };

  const handleMarkCompleted = async (assignment: Assignment) => {
    setBusy(true);
    try {
      await submitAssignment(assignment.id, 'completed');
      showToast('Assignment marked completed', assignment.title);
    } finally {
      setBusy(false);
    }
  };

  const statusMeta = (status: SubmissionStatus) => {
    if (status === 'completed') {
      return {
        label: 'Completed',
        className: 'text-emerald-700 dark:text-emerald-400',
        Icon: CheckCircle2,
      };
    }
    if (status === 'submitted') {
      return {
        label: 'Submitted',
        className: 'text-violet-700 dark:text-violet-400',
        Icon: FileUp,
      };
    }
    return {
      label: 'Pending',
      className: 'text-amber-700 dark:text-amber-400',
      Icon: Clock,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            Assignments
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track upcoming deadlines, upload assignment files, and mark tasks completed.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg w-fit">
          {(['all', 'pending', 'submitted', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === tab
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-12 text-center">
          <ClipboardCheck className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-900 dark:text-white">
            No assignments in this view
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Switch filters or check back when faculty publish new coursework.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(({ assignment, submission, status }) => {
            const meta = statusMeta(status);
            const StatusIcon = meta.Icon;
            return (
              <article
                key={assignment.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      <span className="font-medium text-violet-700 dark:text-violet-400">
                        {assignment.subjectName}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Unit {assignment.unitNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">Due {assignment.dueDate}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{assignment.maxMarks} Marks</span>
                      <span aria-hidden="true">·</span>
                      <span className={`inline-flex items-center gap-1 font-semibold ${meta.className}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {meta.label}
                      </span>
                    </div>

                    <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                      {assignment.title}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {assignment.description}
                    </p>

                    {submission && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 tabular-nums">
                        {submission.fileName ? `Uploaded: ${submission.fileName} · ` : ''}
                        Updated {submission.submittedAt.slice(0, 10)}
                        {submission.notes ? ` · "${submission.notes}"` : ''}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleOpenUpload(assignment)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {submission?.fileName ? 'Replace File' : 'Upload File'}
                    </button>

                    <button
                      type="button"
                      disabled={busy || status === 'completed'}
                      onClick={() => handleMarkCompleted(assignment)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        status === 'completed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 cursor-default'
                          : 'bg-[#0F172A] dark:bg-violet-600 text-white hover:bg-slate-800 dark:hover:bg-violet-500'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {status === 'completed' ? 'Completed' : 'Mark Completed'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Upload Submission Modal */}
      {uploadingFor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Submit assignment file"
        >
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-medium text-violet-700 dark:text-violet-400">
                  {uploadingFor.subjectName} · Unit {uploadingFor.unitNumber}
                </p>
                <h3 className="mt-1 text-lg font-display font-bold text-slate-900 dark:text-white">
                  Submit Assignment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setUploadingFor(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Assignment File (PDF, DOCX, ZIP, Code)
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.doc,.docx,.txt,.zip,.html,.xml,.js,.ts"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-slate-600 dark:text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-900 dark:file:text-white hover:file:bg-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Submission Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add summary of approach or remarks for faculty..."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadingFor(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="px-4 py-2 rounded-lg bg-[#0F172A] dark:bg-violet-600 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-violet-500 disabled:opacity-60"
                >
                  {busy ? 'Uploading...' : 'Submit Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
