import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  ClipboardCheck,
  FileText,
  HelpCircle,
  Search,
  X,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { AppRoute } from '../types/lms';

interface SearchResult {
  id: string;
  type: 'Subject' | 'Topic' | 'Material' | 'Assignment' | 'Quiz';
  title: string;
  subtitle: string;
  route: AppRoute;
  subjectId?: string;
  unitNumber?: number;
}

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (route: AppRoute, context?: { subjectId?: string; unitNumber?: number }) => void;
}

export function GlobalSearchModal({ open, onClose, onNavigate }: GlobalSearchModalProps) {
  const { subjects, materials, assignments, quizzes } = useData();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) onClose();
      }
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    const list: SearchResult[] = [];

    for (const s of subjects) {
      if (
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      ) {
        list.push({
          id: `sub-${s.id}`,
          type: 'Subject',
          title: `${s.code} — ${s.name}`,
          subtitle: `Semester ${s.semester} · ${s.units.length} Units · ${s.instructor}`,
          route: 'subjects',
          subjectId: s.id,
        });
      }

      for (const unit of s.units) {
        const unitMatch = unit.title.toLowerCase().includes(q);
        const matchedTopics = unit.topics.filter((t) => t.toLowerCase().includes(q));
        if (q && (unitMatch || matchedTopics.length > 0)) {
          list.push({
            id: `unit-${s.id}-${unit.unitNumber}`,
            type: 'Topic',
            title: matchedTopics[0] || unit.title,
            subtitle: `${s.name} · Unit ${unit.unitNumber} (${unit.durationHours} hrs)`,
            route: 'subjects',
            subjectId: s.id,
            unitNumber: unit.unitNumber,
          });
        }
      }
    }

    for (const m of materials) {
      if (
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.subjectName.toLowerCase().includes(q)
      ) {
        list.push({
          id: `mat-${m.id}`,
          type: 'Material',
          title: m.title,
          subtitle: `${m.subjectName} · Unit ${m.unitNumber} · ${m.category} · ${m.fileType}`,
          route: 'materials',
        });
      }
    }

    for (const a of assignments) {
      if (
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.subjectName.toLowerCase().includes(q)
      ) {
        list.push({
          id: `ass-${a.id}`,
          type: 'Assignment',
          title: a.title,
          subtitle: `${a.subjectName} · Due ${a.dueDate} · ${a.maxMarks} Marks`,
          route: 'assignments',
        });
      }
    }

    for (const qz of quizzes) {
      if (
        !q ||
        qz.title.toLowerCase().includes(q) ||
        qz.subjectName.toLowerCase().includes(q)
      ) {
        list.push({
          id: `qz-${qz.id}`,
          type: 'Quiz',
          title: qz.title,
          subtitle: `${qz.subjectName} · Unit ${qz.unitNumber} · ${qz.questions.length} MCQs`,
          route: 'quizzes',
        });
      }
    }

    return list.slice(0, 14);
  }, [query, subjects, materials, assignments, quizzes]);

  if (!open) return null;

  const iconFor = (type: SearchResult['type']) => {
    switch (type) {
      case 'Subject':
      case 'Topic':
        return <BookOpen className="w-4 h-4 text-violet-600 dark:text-violet-400" />;
      case 'Material':
        return <FileText className="w-4 h-4 text-slate-600 dark:text-slate-300" />;
      case 'Assignment':
        return <ClipboardCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'Quiz':
        return <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 backdrop-blur-xs pt-16 sm:pt-24 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Global academic search"
    >
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects, syllabus topics (e.g. SOAP, DOM, Web 4.0), notes, PYQs..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/70">
          {results.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                No matching academic resources found
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Try searching for &ldquo;HTTP&rdquo;, &ldquo;AJAX&rdquo;, &ldquo;XML&rdquo;, &ldquo;PYQ&rdquo;, or &ldquo;Web 4.0&rdquo;.
              </p>
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.route, {
                    subjectId: item.subjectId,
                    unitNumber: item.unitNumber,
                  });
                  onClose();
                }}
                className="w-full flex items-center gap-3.5 px-5 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {iconFor(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {item.type} <span aria-hidden="true">·</span> {item.subtitle}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
