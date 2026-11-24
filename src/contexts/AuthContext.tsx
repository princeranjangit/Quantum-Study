import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as fbUpdateProfile,
} from 'firebase/auth';
import { DEMO_ADMIN_PROFILE, DEMO_STUDENT_PROFILE } from '../data/seedData';
import {
  auth,
  BOOTSTRAPPED_ADMIN_EMAIL,
  hasValidFirebaseConfig,
  testFirestoreConnection,
} from '../services/firebaseClient';
import {
  firebaseRepo,
  getDemoSessionUid,
  loadDemoStore,
  sanitizeDocId,
  saveDemoStore,
  setDemoSessionUid,
} from '../services/repository';
import { BackendMode, UserProfile } from '../types/lms';

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  universityName: string;
  course: string;
  branch: string;
  semester: number;
  studentId?: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  authReady: boolean;
  backendMode: BackendMode;
  firebaseConnected: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string, preferDemo?: boolean) => Promise<void>;
  registerStudent: (payload: RegisterPayload, preferDemo?: boolean) => Promise<void>;
  loginAsDemoStudent: () => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<string>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [backendMode, setBackendMode] = useState<BackendMode>('demo');
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  useEffect(() => {
    let active = true;

    if (hasValidFirebaseConfig) {
      testFirestoreConnection().then((ok) => {
        if (active) setFirebaseConnected(ok);
      });
    }

    // Check active Demo session first if not signed into Firebase
    const restoreDemo = () => {
      const demoUid = getDemoSessionUid();
      if (demoUid) {
        const store = loadDemoStore();
        const found = store.users.find((u) => u.uid === demoUid) || null;
        if (active && found) {
          setBackendMode('demo');
          setUser(found);
        }
      }
      if (active) setAuthReady(true);
    };

    if (!hasValidFirebaseConfig) {
      restoreDemo();
      return () => {
        active = false;
      };
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!active) return;
      if (!fbUser) {
        restoreDemo();
        return;
      }

      try {
        setDemoSessionUid(null);
        setBackendMode('firebase');
        const isAdminUser = await firebaseRepo.isBootstrappedOrDbAdmin(
          fbUser.uid,
          fbUser.email
        );
        let profile = await firebaseRepo.fetchUserProfile(fbUser.uid);
        if (!profile) {
          const now = new Date().toISOString();
          profile = {
            uid: fbUser.uid,
            fullName: fbUser.displayName || 'Quantum Student',
            email: fbUser.email || '',
            universityName: 'Quantum University, Roorkee',
            course: 'B.Tech',
            branch: 'Computer Science & Engineering',
            semester: 5,
            studentId: '',
            role: isAdminUser ? 'admin' : 'student',
            avatarUrl: fbUser.photoURL || '/src/assets/images/avatar_student_default_1795536853305.jpg',
            createdAt: now,
            updatedAt: now,
          };
          await firebaseRepo.saveUserProfile(profile);
        } else if (isAdminUser && profile.role !== 'admin') {
          profile = { ...profile, role: 'admin', updatedAt: new Date().toISOString() };
          await firebaseRepo.saveUserProfile(profile);
        }

        if (isAdminUser) {
          await firebaseRepo.ensureSeedData(true);
        }

        if (active) {
          setUser(profile);
          setAuthReady(true);
        }
      } catch (err) {
        console.error('Firebase auth sync error:', err);
        if (active) setAuthReady(true);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const loginAsDemoStudent = async () => {
    const store = loadDemoStore();
    const student =
      store.users.find((u) => u.uid === DEMO_STUDENT_PROFILE.uid) || DEMO_STUDENT_PROFILE;
    setDemoSessionUid(student.uid);
    setBackendMode('demo');
    setUser(student);
  };

  const loginAsDemoAdmin = async () => {
    const store = loadDemoStore();
    const admin =
      store.users.find((u) => u.uid === DEMO_ADMIN_PROFILE.uid) || DEMO_ADMIN_PROFILE;
    setDemoSessionUid(admin.uid);
    setBackendMode('demo');
    setUser(admin);
  };

  const loginWithGoogle = async () => {
    if (!hasValidFirebaseConfig) {
      throw new Error('Firebase credentials are not configured. Please use Demo Mode.');
    }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email: string, password: string, preferDemo = false) => {
    const cleanEmail = email.trim().toLowerCase();
    const store = loadDemoStore();
    const demoUser = store.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (preferDemo || demoUser) {
      if (!demoUser) {
        throw new Error('No account found with this email in local demo store.');
      }
      const expected = store.passwords[cleanEmail];
      if (expected && expected !== password) {
        throw new Error('Invalid password. Try Quantum@2026 for demo student or Admin@2026 for demo admin.');
      }
      setDemoSessionUid(demoUser.uid);
      setBackendMode('demo');
      setUser(demoUser);
      return;
    }

    if (!hasValidFirebaseConfig) {
      throw new Error('Account not found in local store.');
    }

    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('operation-not-allowed')) {
        throw new Error(
          'Email/Password sign-in is not yet enabled in your Firebase Console. Sign in with Google or use Demo Mode.'
        );
      }
      throw err;
    }
  };

  const registerStudent = async (payload: RegisterPayload, preferDemo = false) => {
    const cleanEmail = payload.email.trim().toLowerCase();
    const now = new Date().toISOString();

    if (preferDemo || !hasValidFirebaseConfig) {
      const store = loadDemoStore();
      if (store.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
        throw new Error('An account with this email already exists.');
      }
      const uid = sanitizeDocId(`student-${Date.now()}`);
      const newProfile: UserProfile = {
        uid,
        fullName: payload.fullName.trim(),
        email: cleanEmail,
        universityName: payload.universityName.trim() || 'Quantum University, Roorkee',
        course: payload.course.trim() || 'B.Tech',
        branch: payload.branch.trim() || 'Computer Science & Engineering',
        semester: Number(payload.semester) || 5,
        studentId: payload.studentId?.trim() || '',
        role: 'student',
        avatarUrl: '/src/assets/images/avatar_student_default_1795536853305.jpg',
        createdAt: now,
        updatedAt: now,
      };
      store.users = [...store.users, newProfile];
      store.passwords[cleanEmail] = payload.password;
      store.progressByUser[uid] = {
        userId: uid,
        completedUnits: [],
        bookmarkedMaterialIds: [],
        updatedAt: now,
      };
      saveDemoStore(store);
      setDemoSessionUid(uid);
      setBackendMode('demo');
      setUser(newProfile);
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, payload.password);
      await fbUpdateProfile(cred.user, { displayName: payload.fullName.trim() });
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        fullName: payload.fullName.trim(),
        email: cleanEmail,
        universityName: payload.universityName.trim() || 'Quantum University, Roorkee',
        course: payload.course.trim() || 'B.Tech',
        branch: payload.branch.trim() || 'Computer Science & Engineering',
        semester: Number(payload.semester) || 5,
        studentId: payload.studentId?.trim() || '',
        role: cleanEmail === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase() ? 'admin' : 'student',
        avatarUrl: '/src/assets/images/avatar_student_default_1795536853305.jpg',
        createdAt: now,
        updatedAt: now,
      };
      await firebaseRepo.saveUserProfile(newProfile);
      setBackendMode('firebase');
      setUser(newProfile);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('operation-not-allowed')) {
        // Gracefully create demo account when Firebase Email/Password provider isn't enabled yet
        await registerStudent(payload, true);
        return;
      }
      throw err;
    }
  };

  const sendPasswordReset = async (email: string): Promise<string> => {
    const cleanEmail = email.trim().toLowerCase();
    const store = loadDemoStore();
    const inDemo = store.users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (inDemo || !hasValidFirebaseConfig) {
      if (!inDemo) {
        throw new Error('No account found for that email address.');
      }
      return `Password reset instructions prepared for ${cleanEmail} (Demo accounts use Quantum@2026).`;
    }
    await sendPasswordResetEmail(auth, cleanEmail);
    return `Password reset link sent to ${cleanEmail}. Check your inbox.`;
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      ...updates,
      uid: user.uid,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: new Date().toISOString(),
    };

    if (backendMode === 'demo') {
      const store = loadDemoStore();
      store.users = store.users.map((u) => (u.uid === user.uid ? updated : u));
      saveDemoStore(store);
      setUser(updated);
      return;
    }

    await firebaseRepo.saveUserProfile(updated);
    setUser(updated);
  };

  const logout = async () => {
    setDemoSessionUid(null);
    setUser(null);
    if (hasValidFirebaseConfig && auth.currentUser) {
      await signOut(auth);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        backendMode,
        firebaseConnected,
        loginWithGoogle,
        loginWithEmail,
        registerStudent,
        loginAsDemoStudent,
        loginAsDemoAdmin,
        sendPasswordReset,
        updateUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
