import React, { useState } from 'react';
import {
  BookOpen,
  ClipboardCheck,
  FileText,
  HelpCircle,
  Megaphone,
  Plus,
  ShieldAlert,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { sanitizeDocId } from '../services/repository';
import {
  AnnouncementCategory,
  FileType,
  MATERIAL_CATEGORIES,
  QuizQuestion,
  Subject,
  SyllabusUnit,
} from '../types/lms';

type AdminTab =
  | 'activity'
  | 'materials'
  | 'subjects'
  | 'assignments'
  | 'quizzes'
  | 'announcements'
  | 'students';

export function AdminDashboardPage() {
  const { user } = useAuth();
  const {
    subjects,
    materials,
    assignments,
    submissions,
    quizzes,
    quizAttempts,
    announcements,
    usersDirectory,
    saveSubject,
    deleteSubject,
    uploadStudyMaterial,
    deleteMaterial,
    saveAssignment,
    deleteAssignment,
    saveQuiz,
    deleteQuiz,
    publishAnnouncement,
    deleteAnnouncement,
    updateStudentAccount,
  } = useData();
  const { showToast } = useToast();

  const [tab, setTab] = useState<AdminTab>('materials');

  // Material Upload state
  const [matTitle, setMatTitle] = useState('');
  const [matSubjectId, setMatSubjectId] = useState(subjects[0]?.id || '');
  const [matUnit, setMatUnit] = useState(1);
  const [matCategory, setMatCategory] = useState<string>(MATERIAL_CATEGORIES[0]);
  const [matFileType, setMatFileType] = useState<FileType>('PDF');
  const [matDescription, setMatDescription] = useState('');
  const [matPreviewText, setMatPreviewText] = useState('');
  const [matFile, setMatFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  // Subject Editor state
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [subjCode, setSubjCode] = useState('');
  const [subjName, setSubjName] = useState('');
  const [subjSemester, setSubjSemester] = useState(5);
  const [subjBranch, setSubjBranch] = useState('Computer Science & Engineering');
  const [subjCredits, setSubjCredits] = useState(4);
  const [subjInstructor, setSubjInstructor] = useState('');
  const [subjDesc, setSubjDesc] = useState('');
  const [subjUnitTitle, setSubjUnitTitle] = useState('Unit 1: Core Foundations');
  const [subjUnitHours, setSubjUnitHours] = useState(7);
  const [subjUnitTopics, setSubjUnitTopics] = useState(
    'Introduction, Architecture, Core Protocols'
  );

  // Assignment Form state
  const [assTitle, setAssTitle] = useState('');
  const [assSubjId, setAssSubjId] = useState(subjects[0]?.id || '');
  const [assUnit, setAssUnit] = useState(1);
  const [assDueDate, setAssDueDate] = useState('2026-12-12');
  const [assMarks, setAssMarks] = useState(20);
  const [assDesc, setAssDesc] = useState('');

  // Quiz Builder state
  const [quizTitle, setQuizTitle] = useState('');
  const [quizSubjId, setQuizSubjId] = useState(subjects[0]?.id || '');
  const [quizUnit, setQuizUnit] = useState(1);
  const [quizMinutes, setQuizMinutes] = useState(10);
  const [qText, setQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [qExplanation, setQExplanation] = useState('');
  const [draftQuestions, setDraftQuestions] = useState<QuizQuestion[]>([]);

  // Announcement Form state
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');
  const [annCat, setAnnCat] = useState<AnnouncementCategory>('Academic');
  const [annPinned, setAnnPinned] = useState(false);

  if (user?.role !== 'admin') {
    return (
      <div className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-[#111827] p-12 text-center">
        <ShieldAlert className="w-8 h-8 text-rose-600 mx-auto mb-3" />
        <h1 className="text-lg font-display font-bold text-slate-900 dark:text-white">
          Administrator Access Required
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          This console is restricted to authenticated faculty administrators.
        </p>
      </div>
    );
  }

  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    const subject = subjects.find((s) => s.id === matSubjectId) || subjects[0];
    if (!subject) return;
    setBusy(true);
    try {
      const sizeStr = matFile
        ? matFile.size > 1024 * 1024
          ? `${(matFile.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.max(1, Math.round(matFile.size / 1024))} KB`
        : '1.2 MB';

      await uploadStudyMaterial(
        {
          title: matTitle.trim(),
          subjectId: subject.id,
          subjectName: subject.name,
          unitNumber: Number(matUnit),
          category: matCategory,
          fileType: matFileType,
          fileSize: sizeStr,
          uploadedBy: user.fullName,
          description: matDescription.trim(),
          previewContent:
            matPreviewText.trim() ||
            `# ${matTitle.trim()}\nSubject: ${subject.name} (Unit ${matUnit})\nCategory: ${matCategory}`,
        },
        matFile
      );
      setMatTitle('');
      setMatDescription('');
      setMatPreviewText('');
      setMatFile(null);
      showToast('Study material published', 'Students can now preview and download this file.');
    } catch (err: unknown) {
      showToast(
        'Upload failed',
        err instanceof Error ? err.message : 'Unable to upload material.',
        'error'
      );
    } finally {
      setBusy(false);
    }
  };

  const handleEditSubjectLoad = (s: Subject) => {
    setEditingSubjectId(s.id);
    setSubjCode(s.code);
    setSubjName(s.name);
    setSubjSemester(s.semester);
    setSubjBranch(s.branch);
    setSubjCredits(s.credits);
    setSubjInstructor(s.instructor);
    setSubjDesc(s.description);
    const first = s.units[0];
    if (first) {
      setSubjUnitTitle(first.title);
      setSubjUnitHours(first.durationHours);
      setSubjUnitTopics(first.topics.join(', '));
    }
  };

  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const existing = subjects.find((s) => s.id === editingSubjectId);
      const parsedTopics = subjUnitTopics
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const units: SyllabusUnit[] = existing
        ? existing.units.map((u, idx) =>
            idx === 0
              ? {
                  ...u,
                  title: subjUnitTitle.trim() || u.title,
                  durationHours: Number(subjUnitHours) || u.durationHours,
                  topics: parsedTopics.length ? parsedTopics : u.topics,
                }
              : u
          )
        : [
            {
              unitNumber: 1,
              title: subjUnitTitle.trim() || 'Unit 1',
              durationHours: Number(subjUnitHours) || 7,
              topics: parsedTopics.length ? parsedTopics : ['Foundations'],
            },
          ];

      const now = new Date().toISOString();
      const subject: Subject = {
        id: existing?.id || sanitizeDocId(`subj-${subjCode}-${Date.now()}`),
        code: subjCode.trim().toUpperCase(),
        name: subjName.trim(),
        semester: Number(subjSemester),
        branch: subjBranch.trim(),
        credits: Number(subjCredits),
        instructor: subjInstructor.trim(),
        description: subjDesc.trim(),
        coverImage:
          existing?.coverImage || '/src/assets/images/subject_web_dev_1795536852976.jpg',
        units,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
      };
      await saveSubject(subject);
      setEditingSubjectId(null);
      setSubjCode('');
      setSubjName('');
      setSubjInstructor('');
      setSubjDesc('');
      showToast(existing ? 'Subject updated' : 'Subject added', subject.name);
    } finally {
      setBusy(false);
    }
  };

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    const subj = subjects.find((s) => s.id === assSubjId) || subjects[0];
    if (!subj) return;
    setBusy(true);
    try {
      const now = new Date().toISOString();
      await saveAssignment({
        id: sanitizeDocId(`assign-${Date.now()}`),
        title: assTitle.trim(),
        subjectId: subj.id,
        subjectName: subj.name,
        unitNumber: Number(assUnit),
        description: assDesc.trim(),
        dueDate: assDueDate,
        maxMarks: Number(assMarks),
        createdAt: now,
        updatedAt: now,
      });
      setAssTitle('');
      setAssDesc('');
      showToast('Assignment published', 'Students can now view and submit.');
    } finally {
      setBusy(false);
    }
  };

  const handleAddDraftQuestion = () => {
    if (!qText.trim() || !optA.trim() || !optB.trim()) {
      showToast('Missing fields', 'Enter a question and at least options A and B.', 'error');
      return;
    }
    const opts = [optA, optB, optC, optD].map((o) => o.trim()).filter(Boolean);
    const safeIdx = Math.min(correctIdx, opts.length - 1);
    setDraftQuestions((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}-${prev.length + 1}`,
        question: qText.trim(),
        options: opts,
        correctIndex: safeIdx,
        explanation: qExplanation.trim() || 'Reviewed against official syllabus concepts.',
      },
    ]);
    setQText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setQExplanation('');
  };

  const handlePublishQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (draftQuestions.length === 0) {
      showToast('Add questions first', 'Add at least 1 MCQ before publishing.', 'error');
      return;
    }
    const subj = subjects.find((s) => s.id === quizSubjId) || subjects[0];
    if (!subj) return;
    setBusy(true);
    try {
      await saveQuiz({
        id: sanitizeDocId(`quiz-${Date.now()}`),
        title: quizTitle.trim(),
        subjectId: subj.id,
        subjectName: subj.name,
        unitNumber: Number(quizUnit),
        durationMinutes: Number(quizMinutes),
        questions: draftQuestions,
        createdAt: new Date().toISOString(),
      });
      setQuizTitle('');
      setDraftQuestions([]);
      showToast('Quiz published', 'Unit quiz is now available to students.');
    } finally {
      setBusy(false);
    }
  };

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await publishAnnouncement({
        title: annTitle.trim(),
        body: annBody.trim(),
        category: annCat,
        authorName: user.fullName,
        pinned: annPinned,
      });
      setAnnTitle('');
      setAnnBody('');
      setAnnPinned(false);
      showToast('Announcement published', 'Visible on all student dashboards.');
    } finally {
      setBusy(false);
    }
  };

  const tabs: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'materials', label: 'Materials', icon: FileText },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: ClipboardCheck },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'activity', label: 'Activity', icon: Upload },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
          Faculty Admin Console
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage subjects, unit syllabi, PDF notes, assignments, quizzes, announcements, and student accounts.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-fit">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Study Materials Upload & Manager */}
      {tab === 'materials' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleUploadMaterial}
            className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 space-y-4 h-fit"
          >
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
              Upload Study Material
            </h2>
            <div>
              <label className="block text-xs font-semibold mb-1">Material Title *</label>
              <input
                type="text"
                required
                value={matTitle}
                onChange={(e) => setMatTitle(e.target.value)}
                placeholder="e.g. Unit 3 SOAP & WSDL Solved Examples"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Subject</label>
                <select
                  value={matSubjectId}
                  onChange={(e) => setMatSubjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} — {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Unit Number</label>
                <select
                  value={matUnit}
                  onChange={(e) => setMatUnit(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                >
                  {[1, 2, 3, 4, 5].map((u) => (
                    <option key={u} value={u}>
                      Unit {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Category</label>
                <select
                  value={matCategory}
                  onChange={(e) => setMatCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                >
                  {MATERIAL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">File Type</label>
                <select
                  value={matFileType}
                  onChange={(e) => setMatFileType(e.target.value as FileType)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                >
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX</option>
                  <option value="PPTX">PPTX</option>
                  <option value="CODE">CODE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Attach PDF / Document File (Optional)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md"
                onChange={(e) => setMatFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-600 dark:text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Description</label>
              <input
                type="text"
                value={matDescription}
                onChange={(e) => setMatDescription(e.target.value)}
                placeholder="Brief summary for students..."
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Reader Preview Content (Optional)
              </label>
              <textarea
                rows={4}
                value={matPreviewText}
                onChange={(e) => setMatPreviewText(e.target.value)}
                placeholder="Paste key study notes or syllabus summary for instant preview..."
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 rounded-lg bg-[#0F172A] dark:bg-violet-600 text-white text-sm font-semibold hover:bg-slate-800 dark:hover:bg-violet-500 disabled:opacity-60"
            >
              {busy ? 'Publishing...' : 'Publish Material'}
            </button>
          </form>

          <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6">
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-4 tabular-nums">
              Published Materials ({materials.length})
            </h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
              {materials.map((m) => (
                <div key={m.id} className="py-3.5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {m.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums mt-0.5">
                      {m.subjectName} · Unit {m.unitNumber} · {m.category} · {m.fileType} ({m.fileSize})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      deleteMaterial(m.id);
                      showToast('Material deleted', m.title, 'info');
                    }}
                    aria-label={`Delete ${m.title}`}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Subjects & Syllabus Manager */}
      {tab === 'subjects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleSaveSubject}
            className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 space-y-4 h-fit"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                {editingSubjectId ? 'Edit Subject & Syllabus' : 'Add New Subject'}
              </h2>
              {editingSubjectId && (
                <button
                  type="button"
                  onClick={() => setEditingSubjectId(null)}
                  className="text-xs text-violet-700 dark:text-violet-400 hover:underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Subject Code *</label>
                <input
                  type="text"
                  required
                  value={subjCode}
                  onChange={(e) => setSubjCode(e.target.value)}
                  placeholder="CS504"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Semester</label>
                <select
                  value={subjSemester}
                  onChange={(e) => setSubjSemester(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Subject Name *</label>
              <input
                type="text"
                required
                value={subjName}
                onChange={(e) => setSubjName(e.target.value)}
                placeholder="Operating Systems"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Instructor *</label>
                <input
                  type="text"
                  required
                  value={subjInstructor}
                  onChange={(e) => setSubjInstructor(e.target.value)}
                  placeholder="Prof. R. Tiwari"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Credits</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={subjCredits}
                  onChange={(e) => setSubjCredits(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Description</label>
              <textarea
                rows={2}
                value={subjDesc}
                onChange={(e) => setSubjDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <p className="text-xs font-semibold text-slate-500">Unit 1 Syllabus Configuration</p>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={subjUnitTitle}
                  onChange={(e) => setSubjUnitTitle(e.target.value)}
                  placeholder="Unit 1 Title"
                  className="col-span-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={subjUnitHours}
                  onChange={(e) => setSubjUnitHours(Number(e.target.value))}
                  placeholder="Hours"
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>
              <textarea
                rows={2}
                value={subjUnitTopics}
                onChange={(e) => setSubjUnitTopics(e.target.value)}
                placeholder="Comma-separated topics..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 rounded-lg bg-[#0F172A] dark:bg-violet-600 text-white text-sm font-semibold"
            >
              {editingSubjectId ? 'Update Subject' : 'Create Subject'}
            </button>
          </form>

          <div className="lg:col-span-7 space-y-3">
            {subjects.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 flex items-start justify-between gap-4"
              >
                <div>
                  <p className="text-xs font-mono text-violet-700 dark:text-violet-400 tabular-nums">
                    {s.code} · Semester {s.semester} · {s.units.length} Units · {s.instructor}
                  </p>
                  <h3 className="mt-1 text-base font-display font-bold text-slate-900 dark:text-white">
                    {s.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {s.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditSubjectLoad(s)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteSubject(s.id);
                      showToast('Subject deleted', s.name, 'info');
                    }}
                    aria-label={`Delete ${s.name}`}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Assignments */}
      {tab === 'assignments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleAddAssignment}
            className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 space-y-4 h-fit"
          >
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
              Create Assignment
            </h2>
            <div>
              <label className="block text-xs font-semibold mb-1">Assignment Title *</label>
              <input
                type="text"
                required
                value={assTitle}
                onChange={(e) => setAssTitle(e.target.value)}
                placeholder="e.g. Unit 4 RDF Graph Modeling Task"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Subject</label>
                <select
                  value={assSubjId}
                  onChange={(e) => setAssSubjId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Unit</label>
                <select
                  value={assUnit}
                  onChange={(e) => setAssUnit(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                >
                  {[1, 2, 3, 4, 5].map((u) => (
                    <option key={u} value={u}>
                      Unit {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={assDueDate}
                  onChange={(e) => setAssDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Max Marks</label>
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={assMarks}
                  onChange={(e) => setAssMarks(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Instructions *</label>
              <textarea
                rows={3}
                required
                value={assDesc}
                onChange={(e) => setAssDesc(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 rounded-lg bg-[#0F172A] dark:bg-violet-600 text-white text-sm font-semibold"
            >
              Publish Assignment
            </button>
          </form>

          <div className="lg:col-span-7 space-y-3">
            {assignments.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 flex items-start justify-between gap-4"
              >
                <div>
                  <p className="text-xs text-violet-700 dark:text-violet-400 tabular-nums">
                    {a.subjectName} · Unit {a.unitNumber} · Due {a.dueDate} · {a.maxMarks} Marks
                  </p>
                  <h3 className="mt-1 text-base font-display font-bold text-slate-900 dark:text-white">
                    {a.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{a.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    deleteAssignment(a.id);
                    showToast('Assignment deleted', a.title, 'info');
                  }}
                  aria-label={`Delete ${a.title}`}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Quiz Builder */}
      {tab === 'quizzes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handlePublishQuiz}
            className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 space-y-4"
          >
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
              Quiz Builder
            </h2>
            <div>
              <label className="block text-xs font-semibold mb-1">Quiz Title *</label>
              <input
                type="text"
                required
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="e.g. Web Development Quick Check"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <select
                value={quizSubjId}
                onChange={(e) => setQuizSubjId(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code}
                  </option>
                ))}
              </select>
              <select
                value={quizUnit}
                onChange={(e) => setQuizUnit(Number(e.target.value))}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              >
                {[1, 2, 3, 4, 5].map((u) => (
                  <option key={u} value={u}>
                    Unit {u}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                max={60}
                value={quizMinutes}
                onChange={(e) => setQuizMinutes(Number(e.target.value))}
                placeholder="Mins"
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <p className="text-xs font-semibold text-slate-500">
                Add Question ({draftQuestions.length} added)
              </p>
              <input
                type="text"
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="Question prompt..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={optA}
                  onChange={(e) => setOptA(e.target.value)}
                  placeholder="Option A"
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
                <input
                  type="text"
                  value={optB}
                  onChange={(e) => setOptB(e.target.value)}
                  placeholder="Option B"
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
                <input
                  type="text"
                  value={optC}
                  onChange={(e) => setOptC(e.target.value)}
                  placeholder="Option C"
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
                <input
                  type="text"
                  value={optD}
                  onChange={(e) => setOptD(e.target.value)}
                  placeholder="Option D"
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={correctIdx}
                  onChange={(e) => setCorrectIdx(Number(e.target.value))}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                >
                  <option value={0}>Correct: Option A</option>
                  <option value={1}>Correct: Option B</option>
                  <option value={2}>Correct: Option C</option>
                  <option value={3}>Correct: Option D</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddDraftQuestion}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add MCQ
                </button>
              </div>
              <input
                type="text"
                value={qExplanation}
                onChange={(e) => setQExplanation(e.target.value)}
                placeholder="Answer explanation for students..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 rounded-lg bg-[#0F172A] dark:bg-violet-600 text-white text-sm font-semibold"
            >
              Publish Quiz ({draftQuestions.length} Questions)
            </button>
          </form>

          <div className="lg:col-span-6 space-y-3">
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 flex items-start justify-between gap-4"
              >
                <div>
                  <p className="text-xs text-violet-700 dark:text-violet-400 tabular-nums">
                    {q.subjectName} · Unit {q.unitNumber} · {q.questions.length} MCQs ·{' '}
                    {q.durationMinutes} mins
                  </p>
                  <h3 className="mt-1 text-base font-display font-bold text-slate-900 dark:text-white">
                    {q.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    deleteQuiz(q.id);
                    showToast('Quiz deleted', q.title, 'info');
                  }}
                  aria-label={`Delete ${q.title}`}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Announcements */}
      {tab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handlePublishAnnouncement}
            className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 space-y-4 h-fit"
          >
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
              Publish Announcement
            </h2>
            <div>
              <label className="block text-xs font-semibold mb-1">Headline *</label>
              <input
                type="text"
                required
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                placeholder="e.g. Semester V Practical Viva Dates"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Category</label>
              <select
                value={annCat}
                onChange={(e) => setAnnCat(e.target.value as AnnouncementCategory)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              >
                <option value="Academic">Academic</option>
                <option value="Exam">Exam</option>
                <option value="Campus">Campus</option>
                <option value="Placement">Placement</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Message *</label>
              <textarea
                rows={4}
                required
                value={annBody}
                onChange={(e) => setAnnBody(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={annPinned}
                onChange={(e) => setAnnPinned(e.target.checked)}
              />
              Pin announcement at top
            </label>
            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 rounded-lg bg-[#0F172A] dark:bg-violet-600 text-white text-sm font-semibold"
            >
              Publish Notice
            </button>
          </form>

          <div className="lg:col-span-7 space-y-3">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 flex items-start justify-between gap-4"
              >
                <div>
                  <p className="text-xs text-violet-700 dark:text-violet-400 tabular-nums">
                    {a.category} · {a.publishedAt.slice(0, 10)} · {a.authorName}
                  </p>
                  <h3 className="mt-1 text-base font-display font-bold text-slate-900 dark:text-white">
                    {a.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {a.body}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    deleteAnnouncement(a.id);
                    showToast('Announcement deleted', a.title, 'info');
                  }}
                  aria-label={`Delete ${a.title}`}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Student Accounts */}
      {tab === 'students' && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6">
          <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-4 tabular-nums">
            Registered Accounts ({usersDirectory.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                  <th className="py-2.5 pr-4 font-medium">Name</th>
                  <th className="py-2.5 px-4 font-medium">Email</th>
                  <th className="py-2.5 px-4 font-medium">Branch</th>
                  <th className="py-2.5 px-4 font-medium">Semester</th>
                  <th className="py-2.5 pl-4 font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {usersDirectory.map((u) => (
                  <tr key={u.uid}>
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      {u.fullName}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">
                      {u.email}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">
                      {u.branch}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        aria-label={`Semester for ${u.fullName}`}
                        value={u.semester}
                        onChange={(e) => {
                          updateStudentAccount(u.uid, { semester: Number(e.target.value) });
                          showToast('Semester updated', u.fullName);
                        }}
                        className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent text-xs"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s} className="text-slate-900">
                            Sem {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 pl-4">
                      <span className="text-xs font-mono capitalize text-violet-700 dark:text-violet-400">
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 7: Student Activity */}
      {tab === 'activity' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6">
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-4">
              Recent Quiz Attempts ({quizAttempts.length})
            </h2>
            {quizAttempts.length === 0 ? (
              <p className="text-sm text-slate-500">No student quiz attempts recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {quizAttempts.map((a) => (
                  <div
                    key={a.id}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {a.quizTitle}
                      </p>
                      <p className="text-xs text-slate-500 tabular-nums">
                        Student ID: {a.userId} · {a.completedAt.slice(0, 10)}
                      </p>
                    </div>
                    <span className="font-mono text-sm font-bold text-violet-700 dark:text-violet-400 tabular-nums shrink-0">
                      {a.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6">
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-4">
              Assignment Submissions ({submissions.length})
            </h2>
            {submissions.length === 0 ? (
              <p className="text-sm text-slate-500">No assignment submissions recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {submissions.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800"
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {s.fileName || `Assignment ${s.assignmentId}`}
                    </p>
                    <p className="text-xs text-slate-500 tabular-nums mt-0.5">
                      Student: {s.userId} · Status: {s.status} · {s.submittedAt.slice(0, 10)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
