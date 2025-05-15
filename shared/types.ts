import { User, Course, Competition, Quiz, Certificate, Enrollment } from './schema';

// Auth types
export interface AuthResponse {
  user: User | null;
  error?: string;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
  grade?: string;
  // Teacher specific fields
  subject?: string;
  qualification?: string;
  experience?: string;
  school?: string;
}

// Dashboard types
export interface DashboardStats {
  activeCourses: number;
  competitions: number;
  upcomingQuizzes: number;
  certificatesEarned: number;
}

export interface CourseWithProgress extends Course {
  progress: number;
  lastAccessed?: Date;
  isCompleted: boolean;
  // Additional fields for our frontend
  subject: string;
  thumbnailUrl: string;
  duration: string;
  totalLessons: number;
  instructorName: string;
  isNew?: boolean;
}

export interface UpcomingQuiz {
  id: number;
  title: string;
  subject: string;
  scheduledStartTime: Date;
  duration: number;
}

export interface UpcomingEvent {
  id: number;
  title: string;
  type: 'quiz' | 'event' | 'class' | 'competition';
  subject: string;
  scheduledStartTime: Date;
  duration: number;
  isImportant: boolean;
  isLive: boolean;
  minutesUntilStart: number;
}

// Teacher dashboard
export interface TeacherStats {
  totalCourses: number;
  totalCompetitions: number;
  totalQuizzes: number;
  totalStudents: number;
}

// Admin dashboard
export interface AdminStats {
  totalUsers: number;
  pendingApprovals: number;
  activeCourses: number;
  activeCompetitions: number;
  activeQuizzes: number;
  totalRevenue: number;
}

// Payment types
export interface CashfreePaymentRequest {
  orderId: string;
  orderAmount: number;
  orderCurrency: string;
  customerName: string;
  customerEmail: string;
  returnUrl: string;
}

export interface CashfreePaymentResponse {
  status: string;
  paymentLink?: string;
  txStatus?: string;
  txMsg?: string;
  orderAmount?: string;
  referenceId?: string;
  txTime?: string;
  error?: string;
}
