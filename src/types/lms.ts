export type UserRole = 'student' | 'admin';

export type BackendMode = 'firebase' | 'demo';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  universityName: string;
  course: string;
  branch: string;
  semester: number;
  studentId?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyllabusUnit {
  unitNumber: number;
  title: string;
  durationHours: number;
  topics: string[];
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  semester: number;
  branch: string;
  credits: number;
  instructor: string;
  description: string;
  coverImage?: string;
  units: SyllabusUnit[];
  createdAt: string;
  updatedAt: string;
}

export const MATERIAL_CATEGORIES = [
  'Lecture Notes',
  'PDF Notes',
  'Important Questions',
  'Previous Year Question Papers',
  'Assignments',
  'Practical Files',
  'Lab Manuals',
  'Reference Books',
  'Unit-wise Study Material',
] as const;

export type MaterialCategory = (typeof MATERIAL_CATEGORIES)[number];

export type FileType = 'PDF' | 'DOCX' | 'PPTX' | 'CODE';

export interface StudyMaterial {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  unitNumber: number;
  category: MaterialCategory | string;
  fileType: FileType;
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  description?: string;
  fileUrl?: string;
  previewContent?: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  unitNumber: number;
  description: string;
  dueDate: string;
  maxMarks: number;
  createdAt: string;
  updatedAt: string;
}

export type SubmissionStatus = 'pending' | 'submitted' | 'completed';

export interface AssignmentSubmission {
  id: string;
  userId: string;
  assignmentId: string;
  status: SubmissionStatus;
  fileName?: string;
  fileUrl?: string;
  notes?: string;
  submittedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  unitNumber: number;
  durationMinutes: number;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  subjectName: string;
  unitNumber: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: number[];
  timeSpentSeconds: number;
  completedAt: string;
}

export interface UserProgress {
  userId: string;
  completedUnits: string[];
  bookmarkedMaterialIds: string[];
  updatedAt: string;
}

export type AnnouncementCategory = 'Academic' | 'Exam' | 'Campus' | 'Placement';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: AnnouncementCategory;
  authorName: string;
  publishedAt: string;
  pinned: boolean;
}

export type AppRoute =
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'subjects'
  | 'materials'
  | 'assignments'
  | 'quizzes'
  | 'progress'
  | 'bookmarks'
  | 'profile'
  | 'admin';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'error' | 'info';
}
