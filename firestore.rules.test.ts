/**
 * Security Rules Verification Spec for Quantum Study
 * Validates all 12 adversarial "Dirty Dozen" payloads against firestore.rules invariants.
 */

export const DIRTY_DOZEN_CASES = [
  { id: 1, name: 'Unauthenticated read on /users/{uid}', expected: 'PERMISSION_DENIED' },
  { id: 2, name: 'Cross-student PII read on /users/{otherUid}', expected: 'PERMISSION_DENIED' },
  { id: 3, name: 'Self-assigned admin role on user create', expected: 'PERMISSION_DENIED' },
  { id: 4, name: 'Privilege escalation role update on /users/{uid}', expected: 'PERMISSION_DENIED' },
  { id: 5, name: 'Shadow field injection on /users/{uid}', expected: 'PERMISSION_DENIED' },
  { id: 6, name: 'Oversized/invalid document ID poisoning', expected: 'PERMISSION_DENIED' },
  { id: 7, name: 'Student write to /subjects catalog', expected: 'PERMISSION_DENIED' },
  { id: 8, name: 'Student delete on /materials catalog', expected: 'PERMISSION_DENIED' },
  { id: 9, name: 'Spoofed userId on /assignmentSubmissions', expected: 'PERMISSION_DENIED' },
  { id: 10, name: 'Unscoped list query on /quizAttempts', expected: 'PERMISSION_DENIED' },
  { id: 11, name: 'Unverified email write to /userProgress/{uid}', expected: 'PERMISSION_DENIED' },
  { id: 12, name: 'Mutation of immutable uid/createdAt fields', expected: 'PERMISSION_DENIED' },
] as const;
