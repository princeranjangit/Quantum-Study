import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_MATERIALS,
  INITIAL_QUIZZES,
  INITIAL_SUBJECTS,
} from '../data/seedData';
import {
  fileToDataUrl,
  firebaseRepo,
  loadDemoStore,
  sanitizeDocId,
  saveDemoStore,
} from '../services/repository';
import {
  Announcement,
  Assignment,
  AssignmentSubmission,
  Quiz,
  QuizAttempt,
  StudyMaterial,
  Subject,
  SubmissionStatus,
  UserProfile,
  UserProgress,
  UserRole,
} from '../types/lms';
import { useAuth } from './AuthContext';

interface DataContextValue {
  subjects: Subject[];
  materials: StudyMaterial[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  progress: UserProgress;
  announcements: Announcement[];
  usersDirectory: UserProfile[];
  loading: boolean;
  refreshData: () => Promise<void>;
  toggleUnitCompletion: (subjectId: string, unitNumber: number) => Promise<void>;
  toggleBookmark: (materialId: string) => Promise<void>;
  submitAssignment: (
    assignmentId: string,
    status: SubmissionStatus,
    file?: File | null,
    notes?: string
  ) => Promise<void>;
  recordQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'userId' | 'completedAt'>) => Promise<QuizAttempt>;
  saveSubject: (subject: Subject) => Promise<void>;
  deleteSubject: (subjectId: string) => Promise<void>;
  uploadStudyMaterial: (
    material: Omit<StudyMaterial, 'id' | 'createdAt' | 'uploadDate'>,
    file?: File | null
  ) => Promise<void>;
  deleteMaterial: (materialId: string) => Promise<void>;
  saveAssignment: (assignment: Assignment) => Promise<void>;
  deleteAssignment: (assignmentId: string) => Promise<void>;
  saveQuiz: (quiz: Quiz) => Promise<void>;
  deleteQuiz: (quizId: string) => Promise<void>;
  publishAnnouncement: (
    payload: Omit<Announcement, 'id' | 'publishedAt'>
  ) => Promise<void>;
  deleteAnnouncement: (announcementId: string) => Promise<void>;
  updateStudentAccount: (uid: string, updates: { role?: UserRole; semester?: number }) => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user, backendMode, authReady } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [materials, setMaterials] = useState<StudyMaterial[]>(INITIAL_MATERIALS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [progress, setProgress] = useState<UserProgress>({
    userId: '',
    completedUnits: [],
    bookmarkedMaterialIds: [],
    updatedAt: new Date().toISOString(),
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [usersDirectory, setUsersDirectory] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      if (!user || backendMode === 'demo') {
        const store = loadDemoStore();
        setSubjects(store.subjects);
        setMaterials(store.materials);
        setAssignments(store.assignments);
        setQuizzes(store.quizzes);
        setAnnouncements(store.announcements);
        if (user) {
          setSubmissions(
            user.role === 'admin'
              ? store.submissions
              : store.submissions.filter((s) => s.userId === user.uid)
          );
          setQuizAttempts(
            user.role === 'admin'
              ? store.quizAttempts
              : store.quizAttempts.filter((a) => a.userId === user.uid)
          );
          setProgress(
            store.progressByUser[user.uid] || {
              userId: user.uid,
              completedUnits: [],
              bookmarkedMaterialIds: [],
              updatedAt: new Date().toISOString(),
            }
          );
          setUsersDirectory(user.role === 'admin' ? store.users : []);
        }
        return;
      }

      const isAdminUser = user.role === 'admin';
      const [catalog, workspace] = await Promise.all([
        firebaseRepo.fetchCatalog(),
        firebaseRepo.fetchUserWorkspace(user.uid, isAdminUser),
      ]);

      setSubjects(catalog.subjects);
      setMaterials(catalog.materials);
      setAssignments(catalog.assignments);
      setQuizzes(catalog.quizzes);
      setAnnouncements(catalog.announcements);
      setSubmissions(workspace.submissions);
      setQuizAttempts(workspace.quizAttempts);
      setProgress(workspace.progress);
      setUsersDirectory(workspace.users);
    } finally {
      setLoading(false);
    }
  }, [user, backendMode]);

  useEffect(() => {
    if (!authReady) return;
    refreshData();
  }, [authReady, refreshData]);

  const toggleUnitCompletion = async (subjectId: string, unitNumber: number) => {
    if (!user) return;
    const key = `${subjectId}_unit_${unitNumber}`;
    const exists = progress.completedUnits.includes(key);
    const nextUnits = exists
      ? progress.completedUnits.filter((u) => u !== key)
      : [...progress.completedUnits, key];
    const nextProgress: UserProgress = {
      ...progress,
      userId: user.uid,
      completedUnits: nextUnits,
      updatedAt: new Date().toISOString(),
    };
    setProgress(nextProgress);

    if (backendMode === 'demo') {
      const store = loadDemoStore();
      store.progressByUser[user.uid] = nextProgress;
      saveDemoStore(store);
      return;
    }
    await firebaseRepo.saveProgress(nextProgress);
  };

  const toggleBookmark = async (materialId: string) => {
    if (!user) return;
    const exists = progress.bookmarkedMaterialIds.includes(materialId);
    const nextBookmarks = exists
      ? progress.bookmarkedMaterialIds.filter((id) => id !== materialId)
      : [...progress.bookmarkedMaterialIds, materialId];
    const nextProgress: UserProgress = {
      ...progress,
      userId: user.uid,
      bookmarkedMaterialIds: nextBookmarks,
      updatedAt: new Date().toISOString(),
    };
    setProgress(nextProgress);

    if (backendMode === 'demo') {
      const store = loadDemoStore();
      store.progressByUser[user.uid] = nextProgress;
      saveDemoStore(store);
      return;
    }
    await firebaseRepo.saveProgress(nextProgress);
  };

  const submitAssignment = async (
    assignmentId: string,
    status: SubmissionStatus,
    file?: File | null,
    notes?: string
  ) => {
    if (!user) return;
    const submissionId = sanitizeDocId(`${user.uid}_${assignmentId}`);
    let fileUrl: string | undefined;
    let fileName: string | undefined;

    if (file) {
      fileName = file.name;
      if (backendMode === 'demo') {
        fileUrl = file.size <= 700_000 ? await fileToDataUrl(file) : undefined;
      } else {
        fileUrl = await firebaseRepo.uploadFileToStorage(`submissions/${user.uid}`, file);
      }
    }

    const existingSub = submissions.find(
      (s) => s.assignmentId === assignmentId && s.userId === user.uid
    );

    const payload: AssignmentSubmission = {
      id: submissionId,
      userId: user.uid,
      assignmentId,
      status,
      fileName: fileName ?? existingSub?.fileName,
      fileUrl: fileUrl ?? existingSub?.fileUrl,
      notes: notes ?? existingSub?.notes ?? '',
      submittedAt: new Date().toISOString(),
    };

    setSubmissions((prev) => {
      const filtered = prev.filter((s) => s.id !== payload.id);
      return [payload, ...filtered];
    });

    if (backendMode === 'demo') {
      const store = loadDemoStore();
      store.submissions = [payload, ...store.submissions.filter((s) => s.id !== payload.id)];
      saveDemoStore(store);
      return;
    }

    await firebaseRepo.saveSubmission(payload);
  };

  const recordQuizAttempt = async (
    attemptData: Omit<QuizAttempt, 'id' | 'userId' | 'completedAt'>
  ): Promise<QuizAttempt> => {
    if (!user) throw new Error('Must be signed in to submit quiz');
    const attempt: QuizAttempt = {
      ...attemptData,
      id: sanitizeDocId(`attempt-${user.uid}-${Date.now()}`),
      userId: user.uid,
      completedAt: new Date().toISOString(),
    };

    setQuizAttempts((prev) => [attempt, ...prev]);

    if (backendMode === 'demo') {
      const store = loadDemoStore();
      store.quizAttempts = [attempt, ...store.quizAttempts];
      saveDemoStore(store);
      return attempt;
    }

    await firebaseRepo.saveQuizAttempt(attempt);
    return attempt;
  };

  const saveSubject = async (subject: Subject) => {
    setSubjects((prev) => {
      const exists = prev.some((s) => s.id === subject.id);
      return exists ? prev.map((s) => (s.id === subject.id ? subject : s)) : [subject, ...prev];
    });
    if (backendMode === 'demo') {
      const store = loadDemoStore();
      const exists = store.subjects.some((s) => s.id === subject.id);
      store.subjects = exists
        ? store.subjects.map((s) => (s.id === subject.id ? subject : s))
        : [subject, ...store.subjects];
      saveDemoStore(store);
      return;
    }
    await firebaseRepo.saveSubject(subject);
  };

  const deleteSubject = async (subjectId: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
    if (backendMode === 'demo') {
      const store = loadDemoStore();
      store.subjects = store.subjects.filter((s) => s.id !== subjectId);
      saveDemoStore(store);
      return;
    }
    await firebaseRepo.deleteSubject(subjectId);
  };

  const uploadStudyMaterial = async (
    materialInput: Omit<StudyMaterial, 'id' | 'createdAt' | 'uploadDate'>,
    file?: File | null
  ) => {
    const now = new Date();
    const id = sanitizeDocId(`mat-${Date.now()}`);
    let fileUrl = materialInput.fileUrl;
    if (file) {
      if (backendMode === 'demo') {
        fileUrl = file.size <= 700_000 ? await fileToDataUrl(file) : undefined;
      } else {
        fileUrl = await firebaseRepo.uploadFileToStorage('materials', file);
      }
    }

    const material: StudyMaterial = {
      ...materialInput,
      id,
      fileUrl,
      uploadDate: now.toISOString().slice(0, 10),
      createdAt: now.toISOString(),
    };

    setMaterials((prev) => [material, ...prev]);

    if (backendMode === 'demo') {
      const store = loadDemoStore();
      store.materials = [material, ...store.materials];
      saveDemoStore(store);
      return;
    }
    await firebaseRepo.saveMaterial(material);
  };

  const deleteMaterial = async (materialId: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== materialId));
    if (backendMode === 'demo') {
      const store = loadDemoStore();
      store.materials = store.materials.filter((m) => m.id !== materialId);
      saveDemoStore(store);
      return;
    }
    await firebaseRepo.deleteMaterial(materialId);
  };

  const saveAssignment = async (assignment: Assignment) => {
    setAssignments((prev) => {
      const exists = prev.some((a) => a.id === assignment.id);
      return exists
        ? prev.map((a) => (a.id === assignment.id ? assignment : a))
        : [assignment, ...prev];
    });
    if (backendMode === 'demo') {
      const store = loadDemoStore();
      const exists = store.assignments.some((a) => a.id === assignment.id);
      store.assignments = exists
        ? store.assignments.map((a) => (a.id === assignment.id ? assignment : a))
        : [assignment, ...store.assignments];
      saveDemoStore(store);
      return;
    }
    await firebaseRepo.saveAssignment(assignment);
  };

  const deleteAssignment = async (assignmentId: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    if (backendMode === 'demo') {
      const store = loadDemoStore();
      store.assignments = store.assignments.filter((a) => a.id !== assignmentId);
      saveDemoStore(store);
      return;
    }
    await firebaseRepo.deleteAssignment(assignmentId);
  };

  const saveQuiz = async (quiz: Quiz) => {
    setQuizzes((prev) => {
      const exists = prev.some((q) => q.id === quiz.id);
      return exists ? prev.map((q) => (q.id === quiz.id ? quiz : q)) : [quiz, ...prev];
    });
    if (backendMode === 'demo') {
      const store = loadDemoStore();
      const exists = store.quizzes.some((q) => q.id === quiz.id);
      store.quizzes = exists
        ? store.quizzes.map((q) => (q.id === quiz.id ? quiz : q))
        : [quiz, ...store.quizzes];
      saveDemoStore(store);
      return;
    }
    await firebaseRepo.saveQuiz(quiz);
  };

  const deleteQuiz = async (quizId: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    if (backendMode === 'demo') {
      const store = loadDemoStore();
      store.quizzes = store.quizzes.filter((q) => q.id !== quizId);
      saveDemoStore(store);
      return;
    }
    await firebaseRepo.deleteQuiz(quizId);
  };

  const publishAnnouncement = async (
    payload: Omit<Announcement, 'id' | 'publishedAt'>
  ) => {
    const ann: Announcement = {
      ...payload,
      id: sanitizeDocId(`ann-${Date.now()}`),
      publishedAt: new Date().toISOString(),
    };
    setAnnouncements((prev) => [ann, ...prev]);
    if (backendMode === 'demo') {
      const store = loadDemoStore();
      store.announcements = [ann, ...store.announcements];
      saveDemoStore(store);
      return;
    }
    await firebaseRepo.saveAnnouncement(ann);
  };

  const deleteAnnouncement = async (announcementId: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== announcementId));
    if (backendMode === 'demo') {
      const store = loadDemoStore();
      store.announcements = store.announcements.filter((a) => a.id !== announcementId);
      saveDemoStore(store);
      return;
    }
    await firebaseRepo.deleteAnnouncement(announcementId);
  };

  const updateStudentAccount = async (
    uid: string,
    updates: { role?: UserRole; semester?: number }
  ) => {
    const target = usersDirectory.find((u) => u.uid === uid);
    if (!target) return;
    const updated: UserProfile = {
      ...target,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setUsersDirectory((prev) => prev.map((u) => (u.uid === uid ? updated : u)));
    if (backendMode === 'demo') {
      const store = loadDemoStore();
      store.users = store.users.map((u) => (u.uid === uid ? updated : u));
      saveDemoStore(store);
      return;
    }
    await firebaseRepo.saveUserProfile(updated);
  };

  return (
    <DataContext.Provider
      value={{
        subjects,
        materials,
        assignments,
        submissions,
        quizzes,
        quizAttempts,
        progress,
        announcements,
        usersDirectory,
        loading,
        refreshData,
        toggleUnitCompletion,
        toggleBookmark,
        submitAssignment,
        recordQuizAttempt,
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
