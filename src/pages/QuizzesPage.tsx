import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  HelpCircle,
  History,
  Play,
  XCircle,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { Quiz, QuizAttempt } from '../types/lms';

interface QuizzesPageProps {
  initialQuizId?: string;
}

export function QuizzesPage({ initialQuizId }: QuizzesPageProps) {
  const { quizzes, quizAttempts, recordQuizAttempt } = useData();
  const { showToast } = useToast();

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [latestResult, setLatestResult] = useState<{
    quiz: Quiz;
    attempt: QuizAttempt;
  } | null>(null);

  useEffect(() => {
    if (initialQuizId) {
      const target = quizzes.find((q) => q.id === initialQuizId);
      if (target) {
        startQuiz(target);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuizId]);

  const startQuiz = (quiz: Quiz) => {
    setLatestResult(null);
    setActiveQuiz(quiz);
    setAnswers(new Array(quiz.questions.length).fill(-1));
    setCurrentIdx(0);
    setSecondsLeft(quiz.durationMinutes * 60);
  };

  const finishQuiz = async (quiz: Quiz, currentAnswers: number[], remainingSec: number) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const score = quiz.questions.reduce((acc, q, idx) => {
        return acc + (currentAnswers[idx] === q.correctIndex ? 1 : 0);
      }, 0);
      const total = quiz.questions.length;
      const percentage = Math.round((score / total) * 100);
      const timeSpentSeconds = Math.max(1, quiz.durationMinutes * 60 - remainingSec);

      const attempt = await recordQuizAttempt({
        quizId: quiz.id,
        quizTitle: quiz.title,
        subjectName: quiz.subjectName,
        unitNumber: quiz.unitNumber,
        score,
        totalQuestions: total,
        percentage,
        answers: currentAnswers.map((a) => (a < 0 ? -1 : a)),
        timeSpentSeconds,
      });

      setActiveQuiz(null);
      setLatestResult({ quiz, attempt });
      showToast('Quiz submitted', `Score: ${score}/${total} (${percentage}%)`);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!activeQuiz) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          finishQuiz(activeQuiz, answers, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuiz, answers]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  // Active Timed Quiz Runner
  if (activeQuiz) {
    const q = activeQuiz.questions[currentIdx];
    const answeredCount = answers.filter((a) => a >= 0).length;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] px-6 py-4">
          <div>
            <p className="text-xs font-medium text-violet-700 dark:text-violet-400">
              {activeQuiz.subjectName} · Unit {activeQuiz.unitNumber}
            </p>
            <h1 className="text-base font-display font-bold text-slate-900 dark:text-white">
              {activeQuiz.title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`inline-flex items-center gap-1.5 font-mono text-sm font-bold tabular-nums px-3 py-1.5 rounded-lg border ${
                secondsLeft < 60
                  ? 'border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              {formatTimer(secondsLeft)}
            </div>
            <button
              type="button"
              onClick={() => setActiveQuiz(null)}
              className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              Exit Quiz
            </button>
          </div>
        </div>

        {/* Question Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            <span>
              Question {currentIdx + 1} of {activeQuiz.questions.length}
            </span>
            <span>{answeredCount} answered</span>
          </div>

          <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-white leading-snug">
            {q.question}
          </h2>

          <div className="space-y-2.5">
            {q.options.map((opt, idx) => {
              const selected = answers[currentIdx] === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const next = [...answers];
                    next[currentIdx] = idx;
                    setAnswers(next);
                  }}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-colors flex items-start gap-3 ${
                    selected
                      ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/50 text-slate-900 dark:text-white font-medium'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="font-mono text-xs mt-0.5 w-5 shrink-0 font-semibold">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold disabled:opacity-40"
            >
              Previous
            </button>

            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {activeQuiz.questions.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIdx(i)}
                  className={`w-7 h-7 rounded-md text-xs font-mono tabular-nums transition-colors ${
                    i === currentIdx
                      ? 'bg-[#0F172A] text-white dark:bg-violet-600'
                      : answers[i] >= 0
                        ? 'bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {currentIdx < activeQuiz.questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIdx((i) => i + 1)}
                className="px-4 py-2 rounded-lg bg-[#0F172A] dark:bg-violet-600 text-white text-xs font-semibold"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={() => finishQuiz(activeQuiz, answers, secondsLeft)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                {submitting ? 'Scoring...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Result & Explanations View
  if (latestResult) {
    const { quiz, attempt } = latestResult;
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => setLatestResult(null)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Quizzes
        </button>

        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8">
          <p className="text-xs font-medium text-violet-700 dark:text-violet-400">
            Assessment Result · {quiz.subjectName} · Unit {quiz.unitNumber}
          </p>
          <h1 className="mt-1 text-2xl font-display font-bold text-slate-900 dark:text-white">
            {quiz.title}
          </h1>

          <div className="mt-6 grid grid-cols-3 gap-4 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Score</p>
              <p className="mt-1 text-2xl font-display font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {attempt.score}/{attempt.totalQuestions}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Accuracy</p>
              <p className="mt-1 text-2xl font-display font-bold font-mono tabular-nums text-violet-700 dark:text-violet-400">
                {attempt.percentage}%
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Time Taken</p>
              <p className="mt-1 text-2xl font-display font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {formatTimer(attempt.timeSpentSeconds)}
              </p>
            </div>
          </div>
        </section>

        {/* Question-by-Question Review */}
        <section className="space-y-4">
          <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
            Answer Key & Explanations
          </h2>
          {quiz.questions.map((q, idx) => {
            const chosen = attempt.answers[idx];
            const isCorrect = chosen === q.correctIndex;
            return (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {idx + 1}. {q.question}
                  </p>
                  {isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                      Correct
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 dark:text-rose-400 shrink-0">
                      <XCircle className="w-4 h-4" />
                      Incorrect
                    </span>
                  )}
                </div>
                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <p>
                    Your Answer:{' '}
                    <span className="font-semibold">
                      {chosen >= 0 ? q.options[chosen] : 'Not answered'}
                    </span>
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-400">
                    Correct Answer:{' '}
                    <span className="font-semibold">{q.options[q.correctIndex]}</span>
                  </p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 leading-relaxed">
                  {q.explanation}
                </p>
              </div>
            );
          })}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
          Unit-Wise Quizzes
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Practice timed MCQ assessments mapped to each syllabus unit with instant scoring and explanations.
        </p>
      </div>

      {/* Quiz Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {quizzes.map((quiz) => {
          const pastAttempts = quizAttempts.filter((a) => a.quizId === quiz.id);
          const best =
            pastAttempts.length > 0
              ? Math.max(...pastAttempts.map((a) => a.percentage))
              : null;

          return (
            <article
              key={quiz.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 flex flex-col justify-between gap-4"
            >
              <div>
                <p className="text-xs font-medium text-violet-700 dark:text-violet-400 tabular-nums">
                  {quiz.subjectName} · Unit {quiz.unitNumber} · {quiz.durationMinutes} Mins ·{' '}
                  {quiz.questions.length} MCQs
                </p>
                <h2 className="mt-1.5 text-lg font-display font-bold text-slate-900 dark:text-white">
                  {quiz.title}
                </h2>
                {best !== null && (
                  <p className="mt-2 text-xs font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
                    Best Score: {best}% ({pastAttempts.length} attempt
                    {pastAttempts.length > 1 ? 's' : ''})
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Auto-scored with solutions
                </span>
                <button
                  type="button"
                  onClick={() => startQuiz(quiz)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F172A] dark:bg-violet-600 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-violet-500 transition-colors whitespace-nowrap shrink-0"
                >
                  <Play className="w-3.5 h-3.5" />
                  Start Quiz
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Quiz Attempt History */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6">
        <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          Quiz History
        </h2>

        {quizAttempts.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            You have not completed any quizzes yet. Start a unit quiz above to track your accuracy.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 pr-4 font-medium">Quiz</th>
                  <th className="py-2.5 px-4 font-medium">Subject</th>
                  <th className="py-2.5 px-4 font-medium text-right">Score</th>
                  <th className="py-2.5 px-4 font-medium text-right">Accuracy</th>
                  <th className="py-2.5 pl-4 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {quizAttempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">
                      {att.quizTitle}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {att.subjectName} · Unit {att.unitNumber}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      {att.score}/{att.totalQuestions}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-violet-700 dark:text-violet-400">
                      {att.percentage}%
                    </td>
                    <td className="py-3 pl-4 text-right font-mono text-xs text-slate-500 tabular-nums whitespace-nowrap">
                      {att.completedAt.slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
