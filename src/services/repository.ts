import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_MATERIALS,
  INITIAL_PROGRESS,
  INITIAL_QUIZ_ATTEMPTS,
  INITIAL_QUIZZES,
  INITIAL_SUBJECTS,
  INITIAL_SUBMISSIONS,
  INITIAL_USERS,
} from '../data/seedData';
import {
  Announcement,
  Assignment,
  AssignmentSubmission,
  Quiz,
  QuizAttempt,
  StudyMaterial,
  Subject,
  UserProfile,
  UserProgress,
} from '../types/lms';
import {
  BOOTSTRAPPED_ADMIN_EMAIL,
  db,
  handleFirestoreError,
  OperationType,
  storage,
} from './firebaseClient';

export interface DemoStoreState {
  users: UserProfile[];
  passwords: Record<string, string>;
  subjects: Subject[];
  materials: StudyMaterial[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  progressByUser: Record<string, UserProgress>;
  announcements: Announcement[];
}

const DEMO_STORAGE_KEY = 'quantum_study_demo_store_v1';
const DEMO_SESSION_KEY = 'quantum_study_demo_session_uid';

function buildInitialDemoStore(): DemoStoreState {
  return {
    users: INITIAL_USERS,
    passwords: {
      'aarav.sharma@quantumuniversity.edu.in': 'Quantum@2026',
      'admin@quantumuniversity.edu.in': 'Admin@2026',
      'priya.rawat@quantumuniversity.edu.in': 'Quantum@2026',
      'rohan.bisht@quantumuniversity.edu.in': 'Quantum@2026',
    },
    subjects: INITIAL_SUBJECTS,
    materials: INITIAL_MATERIALS,
    assignments: INITIAL_ASSIGNMENTS,
    submissions: INITIAL_SUBMISSIONS,
    quizzes: INITIAL_QUIZZES,
    quizAttempts: INITIAL_QUIZ_ATTEMPTS,
    progressByUser: {
      [INITIAL_PROGRESS.userId]: INITIAL_PROGRESS,
    },
    announcements: INITIAL_ANNOUNCEMENTS,
  };
}

export function loadDemoStore(): DemoStoreState {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) {
      const fresh = buildInitialDemoStore();
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }
    return JSON.parse(raw) as DemoStoreState;
  } catch {
    const fresh = buildInitialDemoStore();
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

export function saveDemoStore(store: DemoStoreState): void {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(store));
}

export function getDemoSessionUid(): string | null {
  return localStorage.getItem(DEMO_SESSION_KEY);
}

export function setDemoSessionUid(uid: string | null): void {
  if (uid) {
    localStorage.setItem(DEMO_SESSION_KEY, uid);
  } else {
    localStorage.removeItem(DEMO_SESSION_KEY);
  }
}

export function sanitizeDocId(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 120) || `id-${Date.now()}`;
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export const firebaseRepo = {
  async ensureSeedData(isAdminUser: boolean): Promise<void> {
    if (!isAdminUser) return;
    try {
      const subjectsSnap = await getDocs(collection(db, 'subjects'));
      if (subjectsSnap.empty) {
        for (const s of INITIAL_SUBJECTS) {
          await setDoc(doc(db, 'subjects', s.id), s);
        }
      }
      const materialsSnap = await getDocs(collection(db, 'materials'));
      if (materialsSnap.empty) {
        for (const m of INITIAL_MATERIALS) {
          await setDoc(doc(db, 'materials', m.id), m);
        }
      }
      const assignSnap = await getDocs(collection(db, 'assignments'));
      if (assignSnap.empty) {
        for (const a of INITIAL_ASSIGNMENTS) {
          await setDoc(doc(db, 'assignments', a.id), a);
        }
      }
      const quizSnap = await getDocs(collection(db, 'quizzes'));
      if (quizSnap.empty) {
        for (const q of INITIAL_QUIZZES) {
          await setDoc(doc(db, 'quizzes', q.id), q);
        }
      }
      const annSnap = await getDocs(collection(db, 'announcements'));
      if (annSnap.empty) {
        for (const ann of INITIAL_ANNOUNCEMENTS) {
          await setDoc(doc(db, 'announcements', ann.id), ann);
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'subjects');
    }
  },

  async fetchUserProfile(uid: string): Promise<UserProfile | null> {
    const path = `users/${uid}`;
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      return snap.exists() ? (snap.data() as UserProfile) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    const path = `users/${profile.uid}`;
    try {
      await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async isBootstrappedOrDbAdmin(uid: string, email?: string | null): Promise<boolean> {
    if (email && email.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()) {
      return true;
    }
    try {
      const snap = await getDoc(doc(db, 'admins', uid));
      return snap.exists();
    } catch {
      return false;
    }
  },

  async fetchCatalog(): Promise<{
    subjects: Subject[];
    materials: StudyMaterial[];
    assignments: Assignment[];
    quizzes: Quiz[];
    announcements: Announcement[];
  }> {
    try {
      const [subSnap, matSnap, assSnap, quizSnap, annSnap] = await Promise.all([
        getDocs(collection(db, 'subjects')),
        getDocs(collection(db, 'materials')),
        getDocs(collection(db, 'assignments')),
        getDocs(collection(db, 'quizzes')),
        getDocs(collection(db, 'announcements')),
      ]);

      return {
        subjects: subSnap.empty
          ? INITIAL_SUBJECTS
          : subSnap.docs.map((d) => d.data() as Subject),
        materials: matSnap.empty
          ? INITIAL_MATERIALS
          : matSnap.docs.map((d) => d.data() as StudyMaterial),
        assignments: assSnap.empty
          ? INITIAL_ASSIGNMENTS
          : assSnap.docs.map((d) => d.data() as Assignment),
        quizzes: quizSnap.empty
          ? INITIAL_QUIZZES
          : quizSnap.docs.map((d) => d.data() as Quiz),
        announcements: annSnap.empty
          ? INITIAL_ANNOUNCEMENTS
          : annSnap.docs.map((d) => d.data() as Announcement),
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'subjects');
    }
  },

  async fetchUserWorkspace(userId: string, isAdminUser: boolean): Promise<{
    submissions: AssignmentSubmission[];
    quizAttempts: QuizAttempt[];
    progress: UserProgress;
    users: UserProfile[];
  }> {
    try {
      const subQ = isAdminUser
        ? collection(db, 'assignmentSubmissions')
        : query(collection(db, 'assignmentSubmissions'), where('userId', '==', userId));
      const quizQ = isAdminUser
        ? collection(db, 'quizAttempts')
        : query(collection(db, 'quizAttempts'), where('userId', '==', userId));

      const [subSnap, attemptSnap, progSnap] = await Promise.all([
        getDocs(subQ),
        getDocs(quizQ),
        getDoc(doc(db, 'userProgress', userId)),
      ]);

      let users: UserProfile[] = [];
      if (isAdminUser) {
        const usersSnap = await getDocs(collection(db, 'users'));
        users = usersSnap.docs.map((d) => d.data() as UserProfile);
      }

      const progress: UserProgress = progSnap.exists()
        ? (progSnap.data() as UserProgress)
        : {
            userId,
            completedUnits: [],
            bookmarkedMaterialIds: [],
            updatedAt: new Date().toISOString(),
          };

      return {
        submissions: subSnap.docs.map((d) => d.data() as AssignmentSubmission),
        quizAttempts: attemptSnap.docs.map((d) => d.data() as QuizAttempt),
        progress,
        users,
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `userProgress/${userId}`);
    }
  },

  async saveProgress(progress: UserProgress): Promise<void> {
    const path = `userProgress/${progress.userId}`;
    try {
      await setDoc(doc(db, 'userProgress', progress.userId), progress);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async saveSubmission(submission: AssignmentSubmission): Promise<void> {
    const path = `assignmentSubmissions/${submission.id}`;
    try {
      await setDoc(doc(db, 'assignmentSubmissions', submission.id), submission);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async saveQuizAttempt(attempt: QuizAttempt): Promise<void> {
    const path = `quizAttempts/${attempt.id}`;
    try {
      await setDoc(doc(db, 'quizAttempts', attempt.id), attempt);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async saveSubject(subject: Subject): Promise<void> {
    try {
      await setDoc(doc(db, 'subjects', subject.id), subject);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `subjects/${subject.id}`);
    }
  },

  async deleteSubject(subjectId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'subjects', subjectId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `subjects/${subjectId}`);
    }
  },

  async saveMaterial(material: StudyMaterial): Promise<void> {
    try {
      await setDoc(doc(db, 'materials', material.id), material);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `materials/${material.id}`);
    }
  },

  async deleteMaterial(materialId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'materials', materialId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `materials/${materialId}`);
    }
  },

  async saveAssignment(assignment: Assignment): Promise<void> {
    try {
      await setDoc(doc(db, 'assignments', assignment.id), assignment);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `assignments/${assignment.id}`);
    }
  },

  async deleteAssignment(assignmentId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'assignments', assignmentId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `assignments/${assignmentId}`);
    }
  },

  async saveQuiz(quiz: Quiz): Promise<void> {
    try {
      await setDoc(doc(db, 'quizzes', quiz.id), quiz);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `quizzes/${quiz.id}`);
    }
  },

  async deleteQuiz(quizId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'quizzes', quizId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `quizzes/${quizId}`);
    }
  },

  async saveAnnouncement(announcement: Announcement): Promise<void> {
    try {
      await setDoc(doc(db, 'announcements', announcement.id), announcement);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `announcements/${announcement.id}`);
    }
  },

  async deleteAnnouncement(announcementId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'announcements', announcementId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `announcements/${announcementId}`);
    }
  },

  async uploadFileToStorage(folder: string, file: File): Promise<string> {
    try {
      const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch {
      // Fallback to bounded DataURL if Firebase Storage CORS/rules are not yet enabled
      if (file.size <= 700_000) {
        return await fileToDataUrl(file);
      }
      throw new Error('File exceeds local fallback size (700KB) and Firebase Storage is unavailable.');
    }
  },
};
