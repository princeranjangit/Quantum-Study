# Quantum Study — Firestore Security Specification (Phase 0)

## 1. Data Invariants
1. **Identity & RBAC Integrity**: A student user cannot self-assign `role: 'admin'` during account creation or profile updates. Admin privileges are verified strictly against `/admins/{uid}` or the bootstrapped verified admin email.
2. **PII Isolation**: `/users/{userId}` documents contain personal academic and email metadata and can only be read or modified by the owning user or a verified Admin.
3. **Submission Ownership**: Every `AssignmentSubmission` and `QuizAttempt` must carry `userId == request.auth.uid`, and list queries are rule-enforced against `resource.data.userId == request.auth.uid`.
4. **Catalog Governance**: Only verified Admins can create, update, or delete `/subjects`, `/materials`, `/assignments`, `/quizzes`, and `/announcements`.
5. **Bounded Payloads & Path Hardening**: Every document ID matches `^[a-zA-Z0-9_\-]+$` and every string and array enforces strict size limits.

## 2. Adversarial "Dirty Dozen" Test Payloads
1. Unauthenticated read of `/users/student1` -> `PERMISSION_DENIED`
2. Student A reading Student B's `/users/studentB` profile -> `PERMISSION_DENIED`
3. Student self-registering with `{ role: "admin" }` -> `PERMISSION_DENIED`
4. Student updating own profile with `{ role: "admin" }` -> `PERMISSION_DENIED`
5. Shadow field injection `{ isVerified: true }` on `/users/{uid}` -> `PERMISSION_DENIED`
6. Oversized string (> 128 chars) in document ID path variable -> `PERMISSION_DENIED`
7. Student creating a `/subjects` entry -> `PERMISSION_DENIED`
8. Student deleting a `/materials` document -> `PERMISSION_DENIED`
9. Student A creating an `assignmentSubmission` with `userId: "studentB"` -> `PERMISSION_DENIED`
10. Student A listing `quizAttempts` without matching `userId == request.auth.uid` -> `PERMISSION_DENIED`
11. Unverified email user writing to `/userProgress/{uid}` -> `PERMISSION_DENIED`
12. Modifying immutable `createdAt` or `uid` field on user profile update -> `PERMISSION_DENIED`
