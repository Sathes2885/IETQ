import { pgTable, text, serial, integer, boolean, timestamp, jsonb, unique, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'teacher', 'student']);
export const approvalStatusEnum = pgEnum('approval_status', ['pending', 'approved', 'rejected']);
export const contentTypeEnum = pgEnum('content_type', ['course', 'competition', 'quiz']);
export const quizTypeEnum = pgEnum('quiz_type', ['anytime', 'scheduled']);
export const fileContentTypeEnum = pgEnum('file_content_type', ['video', 'presentation', 'document', 'other']);
export const gradeEnum = pgEnum('grade', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed']);

// Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: userRoleEnum('role').notNull().default('student'),
  grade: gradeEnum('grade'),
  approvalStatus: approvalStatusEnum('approval_status').default('pending'),
  // Teacher specific fields
  subject: text('subject'),
  qualification: text('qualification'),
  experience: text('experience'),
  school: text('school'),
  supabaseUserId: text('supabase_user_id').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Courses
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  teacherId: integer('teacher_id').references(() => users.id).notNull(),
  price: integer('price').default(0),
  isFree: boolean('is_free').default(false),
  mediaUrl: text('media_url'),
  targetGrades: jsonb('target_grades').$type<string[]>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Course Content
export const courseContents = pgTable('course_contents', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  contentType: fileContentTypeEnum('content_type').notNull(),
  fileUrl: text('file_url').notNull(),
  fileName: text('file_name').notNull(),
  fileSize: integer('file_size').notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Competitions
export const competitions = pgTable('competitions', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  teacherId: integer('teacher_id').references(() => users.id).notNull(),
  price: integer('price').default(0),
  isFree: boolean('is_free').default(false),
  prizeDetails: text('prize_details'),
  registrationEndDate: timestamp('registration_end_date').notNull(),
  submissionDeadline: timestamp('submission_deadline').notNull(),
  targetGrades: jsonb('target_grades').$type<string[]>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Competition Entries
export const competitionEntries = pgTable('competition_entries', {
  id: serial('id').primaryKey(),
  competitionId: integer('competition_id').references(() => competitions.id).notNull(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  submissionUrl: text('submission_url'),
  submissionContent: text('submission_content'),
  submittedAt: timestamp('submitted_at'),
  feedback: text('feedback'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Quizzes
export const quizzes = pgTable('quizzes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  teacherId: integer('teacher_id').references(() => users.id).notNull(),
  price: integer('price').default(0),
  isFree: boolean('is_free').default(false),
  quizType: quizTypeEnum('quiz_type').notNull(),
  scheduledStartTime: timestamp('scheduled_start_time'),
  scheduledEndTime: timestamp('scheduled_end_time'),
  duration: integer('duration').notNull(), // in minutes
  targetGrades: jsonb('target_grades').$type<string[]>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Quiz Questions
export const quizQuestions = pgTable('quiz_questions', {
  id: serial('id').primaryKey(),
  quizId: integer('quiz_id').references(() => quizzes.id).notNull(),
  question: text('question').notNull(),
  options: jsonb('options').$type<string[]>().notNull(),
  correctAnswer: integer('correct_answer').notNull(),
  points: integer('points').default(1),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Quiz Attempts
export const quizAttempts = pgTable('quiz_attempts', {
  id: serial('id').primaryKey(),
  quizId: integer('quiz_id').references(() => quizzes.id).notNull(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  startTime: timestamp('start_time').defaultNow(),
  endTime: timestamp('end_time'),
  score: integer('score'),
  maxScore: integer('max_score'),
  answers: jsonb('answers').$type<{ questionId: number; selectedOption: number }[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Enrollments
export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  contentId: integer('content_id').notNull(),
  contentType: contentTypeEnum('content_type').notNull(),
  progress: integer('progress').default(0),
  completed: boolean('completed').default(false),
  lastAccessed: timestamp('last_accessed'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    unq: unique().on(table.studentId, table.contentId, table.contentType),
  };
});

// Certificates
export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  contentId: integer('content_id').notNull(),
  contentType: contentTypeEnum('content_type').notNull(),
  issueDate: timestamp('issue_date').defaultNow().notNull(),
  certificateUrl: text('certificate_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Payments
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  contentId: integer('content_id').notNull(),
  contentType: contentTypeEnum('content_type').notNull(),
  amount: integer('amount').notNull(),
  currency: text('currency').default('INR'),
  paymentStatus: paymentStatusEnum('payment_status').default('pending'),
  transactionId: text('transaction_id'),
  paymentDate: timestamp('payment_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations

export const usersRelations = relations(users, ({ many }) => ({
  teacherCourses: many(courses, { relationName: 'teacher_courses' }),
  teacherCompetitions: many(competitions, { relationName: 'teacher_competitions' }),
  teacherQuizzes: many(quizzes, { relationName: 'teacher_quizzes' }),
  studentEnrollments: many(enrollments, { relationName: 'student_enrollments' }),
  studentCertificates: many(certificates, { relationName: 'student_certificates' }),
  studentPayments: many(payments, { relationName: 'student_payments' }),
  competitionEntries: many(competitionEntries, { relationName: 'student_competition_entries' }),
  quizAttempts: many(quizAttempts, { relationName: 'student_quiz_attempts' }),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  teacher: one(users, {
    fields: [courses.teacherId],
    references: [users.id],
    relationName: 'teacher_courses',
  }),
  contents: many(courseContents),
  enrollments: many(enrollments, { relationName: 'course_enrollments' }),
  certificates: many(certificates, { relationName: 'course_certificates' }),
  payments: many(payments, { relationName: 'course_payments' }),
}));

export const courseContentsRelations = relations(courseContents, ({ one }) => ({
  course: one(courses, {
    fields: [courseContents.courseId],
    references: [courses.id],
  }),
}));

export const competitionsRelations = relations(competitions, ({ one, many }) => ({
  teacher: one(users, {
    fields: [competitions.teacherId],
    references: [users.id],
    relationName: 'teacher_competitions',
  }),
  entries: many(competitionEntries),
  enrollments: many(enrollments, { relationName: 'competition_enrollments' }),
  certificates: many(certificates, { relationName: 'competition_certificates' }),
  payments: many(payments, { relationName: 'competition_payments' }),
}));

export const competitionEntriesRelations = relations(competitionEntries, ({ one }) => ({
  competition: one(competitions, {
    fields: [competitionEntries.competitionId],
    references: [competitions.id],
  }),
  student: one(users, {
    fields: [competitionEntries.studentId],
    references: [users.id],
    relationName: 'student_competition_entries',
  }),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  teacher: one(users, {
    fields: [quizzes.teacherId],
    references: [users.id],
    relationName: 'teacher_quizzes',
  }),
  questions: many(quizQuestions),
  attempts: many(quizAttempts),
  enrollments: many(enrollments, { relationName: 'quiz_enrollments' }),
  certificates: many(certificates, { relationName: 'quiz_certificates' }),
  payments: many(payments, { relationName: 'quiz_payments' }),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizQuestions.quizId],
    references: [quizzes.id],
  }),
}));

export const quizAttemptsRelations = relations(quizAttempts, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizAttempts.quizId],
    references: [quizzes.id],
  }),
  student: one(users, {
    fields: [quizAttempts.studentId],
    references: [users.id],
    relationName: 'student_quiz_attempts',
  }),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(users, {
    fields: [enrollments.studentId],
    references: [users.id],
    relationName: 'student_enrollments',
  }),
}));

export const certificatesRelations = relations(certificates, ({ one }) => ({
  student: one(users, {
    fields: [certificates.studentId],
    references: [users.id],
    relationName: 'student_certificates',
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  student: one(users, {
    fields: [payments.studentId],
    references: [users.id],
    relationName: 'student_payments',
  }),
}));

// Zod Schemas
export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email("Please enter a valid email address"),
  password: (schema) => schema.min(8, "Password must be at least 8 characters"),
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  grade: (schema) => schema.optional(),
  // Teacher specific fields validation
  subject: (schema) => schema.optional(),
  qualification: (schema) => schema.optional(),
  experience: (schema) => schema.optional(),
  school: (schema) => schema.optional(),
  supabaseUserId: (schema) => schema.optional(),
});

export const insertCourseSchema = createInsertSchema(courses, {
  title: (schema) => schema.min(3, "Title must be at least 3 characters"),
  description: (schema) => schema.min(10, "Description must be at least 10 characters"),
});

export const insertCompetitionSchema = createInsertSchema(competitions, {
  title: (schema) => schema.min(3, "Title must be at least 3 characters"),
  description: (schema) => schema.min(10, "Description must be at least 10 characters"),
});

export const insertQuizSchema = createInsertSchema(quizzes, {
  title: (schema) => schema.min(3, "Title must be at least 3 characters"),
  description: (schema) => schema.min(10, "Description must be at least 10 characters"),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type CourseContent = typeof courseContents.$inferSelect;
export type InsertCourseContent = typeof courseContents.$inferInsert;

export type Competition = typeof competitions.$inferSelect;
export type InsertCompetition = z.infer<typeof insertCompetitionSchema>;

export type CompetitionEntry = typeof competitionEntries.$inferSelect;
export type InsertCompetitionEntry = typeof competitionEntries.$inferInsert;

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = typeof quizAttempts.$inferInsert;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
