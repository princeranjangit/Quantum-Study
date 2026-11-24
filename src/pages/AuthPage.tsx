import React, { useState } from 'react';
import { ArrowLeft, KeyRound, ShieldCheck, UserCheck } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'forgot';
  onBack: () => void;
  onSuccess: () => void;
}

export function AuthPage({ initialMode = 'login', onBack, onSuccess }: AuthPageProps) {
  const {
    loginWithGoogle,
    loginWithEmail,
    registerStudent,
    loginAsDemoStudent,
    loginAsDemoAdmin,
    sendPasswordReset,
  } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [fullName, setFullName] = useState('');
  const [universityName, setUniversityName] = useState('Quantum University, Roorkee');
  const [course, setCourse] = useState('B.Tech');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState(5);
  const [studentId, setStudentId] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await loginWithEmail(email, password);
      showToast('Signed in', 'Welcome back to Quantum Study.');
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setBusy(true);
    try {
      await registerStudent({
        fullName,
        email,
        password,
        universityName,
        course,
        branch,
        semester,
        studentId,
      });
      showToast('Account created', 'Your Quantum Study workspace is ready.');
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setBusy(true);
    try {
      const msg = await sendPasswordReset(email);
      setInfoMessage(msg);
      showToast('Reset request sent', msg, 'info');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not send reset email.');
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setBusy(true);
    try {
      await loginWithGoogle();
      showToast('Signed in with Google', 'Connected to Cloud Firestore workspace.');
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleDemoStudent = async () => {
    setBusy(true);
    try {
      await loginAsDemoStudent();
      showToast('Demo Student Active', 'Signed in as Aarav Sharma (B.Tech CSE Sem 5).');
      onSuccess();
    } finally {
      setBusy(false);
    }
  };

  const handleDemoAdmin = async () => {
    setBusy(true);
    try {
      await loginAsDemoAdmin();
      showToast('Demo Admin Active', 'Signed in as Dr. Vikram Mehta (Faculty Admin).');
      onSuccess();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090E1A] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <BrandLogo size="sm" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Auth Form */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8">
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg w-fit mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setInfoMessage('');
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Student / Admin Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                  setInfoMessage('');
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  mode === 'register'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Student Registration
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-xs sm:text-sm text-rose-700 dark:text-rose-300">
                {error}
              </div>
            )}

            {infoMessage && (
              <div className="mb-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-xs sm:text-sm text-emerald-700 dark:text-emerald-300">
                {infoMessage}
              </div>
            )}

            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                    Sign in to Quantum Study
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Access your semester dashboard, study materials, and assessments.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    University Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aarav.sharma@quantumuniversity.edu.in"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setError('');
                      }}
                      className="text-xs font-medium text-violet-700 dark:text-violet-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#0F172A] dark:bg-violet-600 text-white text-sm font-semibold hover:bg-slate-800 dark:hover:bg-violet-500 disabled:opacity-60 transition-colors"
                >
                  {busy ? 'Signing in...' : 'Sign In'}
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white dark:bg-[#111827] text-slate-400">
                      or continue with Firebase Auth
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={busy}
                  onClick={handleGoogle}
                  className="w-full py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Continue with Google Account
                </button>
              </form>
            )}

            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                    Student Registration
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Register your B.Tech profile to track syllabus units and quiz scores.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Aarav Sharma"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@quantumuniversity.edu.in"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      University Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={universityName}
                      onChange={(e) => setUniversityName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Course *
                    </label>
                    <select
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                    >
                      <option value="B.Tech">B.Tech</option>
                      <option value="B.Tech (Hons.)">B.Tech (Hons.)</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="BCA">BCA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Branch *
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Current Semester *
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                          Semester {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Student ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. QU22BTCSE042"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#0F172A] dark:bg-violet-600 text-white text-sm font-semibold hover:bg-slate-800 dark:hover:bg-violet-500 disabled:opacity-60 transition-colors"
                >
                  {busy ? 'Creating account...' : 'Create Student Account'}
                </button>
              </form>
            )}

            {mode === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                    Reset Password
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Enter your registered university email to receive reset instructions.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aarav.sharma@quantumuniversity.edu.in"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={busy}
                    className="px-5 py-2.5 rounded-lg bg-[#0F172A] dark:bg-violet-600 text-white text-sm font-semibold hover:bg-slate-800 dark:hover:bg-violet-500 transition-colors"
                  >
                    Send Reset Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Instant Demo Presentation Panel */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-5">
            <div>
              <p className="text-xs font-semibold text-violet-700 dark:text-violet-400">
                Presentation & Evaluation Mode
              </p>
              <h2 className="mt-1 text-lg font-display font-bold text-slate-900 dark:text-white">
                Instant One-Click Access
              </h2>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Explore the complete LMS immediately with pre-seeded B.Tech Semester 5 subjects, study materials, assignments, and quizzes stored locally, or sign in via Google for live Cloud Firestore sync.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                disabled={busy}
                onClick={handleDemoStudent}
                className="w-full flex items-start gap-3.5 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 hover:border-violet-500 text-left transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#0F172A] dark:bg-violet-600 text-white flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Demo Student Workspace
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Aarav Sharma · B.Tech CSE · Semester 5
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 mt-1">
                    aarav.sharma@quantumuniversity.edu.in / Quantum@2026
                  </p>
                </div>
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={handleDemoAdmin}
                className="w-full flex items-start gap-3.5 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 hover:border-violet-500 text-left transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-violet-700 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Demo Faculty Admin Console
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Dr. Vikram Mehta · Full CRUD & Material Upload
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 mt-1">
                    admin@quantumuniversity.edu.in / Admin@2026
                  </p>
                </div>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <KeyRound className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
              <span>
                Demo mode persists all edits, uploads, quiz attempts, and progress safely in your browser&apos;s localStorage.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
