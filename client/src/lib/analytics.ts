import { useQuery } from '@tanstack/react-query';

// Define the API endpoint paths for analytics
const API_ENDPOINTS = {
  // Admin analytics endpoints
  ADMIN: {
    DASHBOARD_STATS: '/api/admin/analytics/dashboard',
    ENROLLMENT_TREND: '/api/admin/analytics/enrollment-trend',
    COMPETITION_STATS: '/api/admin/analytics/competitions',
    CATEGORY_BREAKDOWN: '/api/admin/analytics/categories',
    COMPLETION_RATES: '/api/admin/analytics/completion-rates',
    USER_RETENTION: '/api/admin/analytics/retention',
    REVENUE_DATA: '/api/admin/analytics/revenue',
  },
  
  // Teacher analytics endpoints
  TEACHER: {
    DASHBOARD_STATS: '/api/teacher/analytics/dashboard',
    STUDENT_PERFORMANCE: '/api/teacher/analytics/student-performance',
    COURSE_COMPLETION: '/api/teacher/analytics/course-completion',
    ENGAGEMENT_DATA: '/api/teacher/analytics/engagement',
    TIME_DISTRIBUTION: '/api/teacher/analytics/time-distribution',
    GRADE_DISTRIBUTION: '/api/teacher/analytics/grade-distribution',
  }
};

// Types for analytics data
export interface AdminDashboardStats {
  totalStudents: number;
  activeCompetitions: number;
  completionRate: number;
  revenue: string;
  studentsTrend: number;
  competitionsTrend: number;
  completionRateTrend: number;
  revenueTrend: number;
}

export interface TeacherDashboardStats {
  activeStudents: number;
  completionRate: number;
  quizScore: number;
  courseEnrollment: number;
  studentsTrend: number;
  completionRateTrend: number;
  quizScoreTrend: number;
  enrollmentTrend: number;
}

export interface EnrollmentTrendData {
  month: string;
  count: number;
}

export interface CompetitionData {
  month: string;
  participants: number;
  completed: number;
}

export interface CategoryBreakdown {
  name: string;
  value: number;
}

export interface CompletionRateData {
  grade: string;
  rate: number;
}

export interface RetentionData {
  month: string;
  rate: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export interface StudentPerformanceData {
  name: string;
  average: number;
  highest: number;
  lowest: number;
}

export interface CourseCompletionData {
  name: string;
  completed: number;
  inProgress: number;
  notStarted: number;
}

export interface EngagementData {
  day: string;
  activeUsers: number;
}

export interface TimeSpentData {
  name: string;
  value: number;
}

export interface GradeDistributionData {
  name: string;
  students: number;
}

// Hooks for fetching admin analytics data
export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: async (): Promise<AdminDashboardStats> => {
      // TODO: Replace with actual API call when backend is ready
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            totalStudents: 12486,
            activeCompetitions: 24,
            completionRate: 78.4,
            revenue: '₹8.4M',
            studentsTrend: 18.2,
            competitionsTrend: 5.8,
            completionRateTrend: -2.1,
            revenueTrend: 12.7
          });
        }, 500);
      });
    }
  });
}

export function useEnrollmentTrendData() {
  return useQuery({
    queryKey: ['enrollmentTrend'],
    queryFn: async (): Promise<EnrollmentTrendData[]> => {
      // TODO: Replace with actual API call when backend is ready
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { month: 'Jan', count: 420 },
            { month: 'Feb', count: 580 },
            { month: 'Mar', count: 620 },
            { month: 'Apr', count: 750 },
            { month: 'May', count: 890 },
            { month: 'Jun', count: 1050 },
            { month: 'Jul', count: 1240 },
            { month: 'Aug', count: 1380 },
            { month: 'Sep', count: 1480 },
            { month: 'Oct', count: 1620 },
            { month: 'Nov', count: 1780 },
            { month: 'Dec', count: 1930 },
          ]);
        }, 500);
      });
    }
  });
}

export function useCompetitionData() {
  return useQuery({
    queryKey: ['competitionData'],
    queryFn: async (): Promise<CompetitionData[]> => {
      // TODO: Replace with actual API call when backend is ready
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { month: 'Jan', participants: 280, completed: 210 },
            { month: 'Feb', participants: 350, completed: 290 },
            { month: 'Mar', participants: 420, completed: 380 },
            { month: 'Apr', participants: 480, completed: 420 },
            { month: 'May', participants: 550, completed: 470 },
            { month: 'Jun', participants: 620, completed: 560 },
            { month: 'Jul', participants: 680, completed: 590 },
            { month: 'Aug', participants: 750, completed: 670 },
            { month: 'Sep', participants: 820, completed: 740 },
            { month: 'Oct', participants: 890, completed: 780 },
            { month: 'Nov', participants: 950, completed: 850 },
            { month: 'Dec', participants: 1020, completed: 890 },
          ]);
        }, 500);
      });
    }
  });
}

export function useCategoryBreakdown() {
  return useQuery({
    queryKey: ['categoryBreakdown'],
    queryFn: async (): Promise<CategoryBreakdown[]> => {
      // TODO: Replace with actual API call when backend is ready
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { name: 'Mathematics', value: 35 },
            { name: 'Science', value: 30 },
            { name: 'English', value: 15 },
            { name: 'Computer Science', value: 10 },
            { name: 'History', value: 5 },
            { name: 'Others', value: 5 },
          ]);
        }, 500);
      });
    }
  });
}

// Hooks for fetching teacher analytics data
export function useTeacherDashboardStats() {
  return useQuery({
    queryKey: ['teacherDashboardStats'],
    queryFn: async (): Promise<TeacherDashboardStats> => {
      // TODO: Replace with actual API call when backend is ready
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            activeStudents: 482,
            completionRate: 76.3,
            quizScore: 74.8,
            courseEnrollment: 32,
            studentsTrend: 8.2,
            completionRateTrend: 3.8,
            quizScoreTrend: -1.2,
            enrollmentTrend: 4
          });
        }, 500);
      });
    }
  });
}

export function useStudentPerformanceData() {
  return useQuery({
    queryKey: ['studentPerformance'],
    queryFn: async (): Promise<StudentPerformanceData[]> => {
      // TODO: Replace with actual API call when backend is ready
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { name: 'Quiz 1', average: 76, highest: 98, lowest: 45 },
            { name: 'Quiz 2', average: 72, highest: 95, lowest: 52 },
            { name: 'Quiz 3', average: 78, highest: 100, lowest: 48 },
            { name: 'Quiz 4', average: 74, highest: 96, lowest: 50 },
            { name: 'Quiz 5', average: 80, highest: 99, lowest: 59 },
            { name: 'Quiz 6', average: 82, highest: 100, lowest: 61 },
            { name: 'Quiz 7', average: 76, highest: 97, lowest: 55 },
          ]);
        }, 500);
      });
    }
  });
}

export function useCourseCompletionData() {
  return useQuery({
    queryKey: ['courseCompletion'],
    queryFn: async (): Promise<CourseCompletionData[]> => {
      // TODO: Replace with actual API call when backend is ready
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { name: 'Mathematics Fundamentals', completed: 85, inProgress: 10, notStarted: 5 },
            { name: 'Advanced Algebra', completed: 72, inProgress: 18, notStarted: 10 },
            { name: 'Geometry Basics', completed: 68, inProgress: 22, notStarted: 10 },
            { name: 'Science Lab Series', completed: 63, inProgress: 25, notStarted: 12 },
            { name: 'Biology Concepts', completed: 78, inProgress: 15, notStarted: 7 },
            { name: 'Chemical Experiments', completed: 58, inProgress: 28, notStarted: 14 },
          ]);
        }, 500);
      });
    }
  });
}

export function useEngagementData() {
  return useQuery({
    queryKey: ['engagementData'],
    queryFn: async (): Promise<EngagementData[]> => {
      // TODO: Replace with actual API call when backend is ready
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { day: 'Mon', activeUsers: 320 },
            { day: 'Tue', activeUsers: 380 },
            { day: 'Wed', activeUsers: 420 },
            { day: 'Thu', activeUsers: 390 },
            { day: 'Fri', activeUsers: 410 },
            { day: 'Sat', activeUsers: 280 },
            { day: 'Sun', activeUsers: 250 },
          ]);
        }, 500);
      });
    }
  });
}

export function useTimeSpentData() {
  return useQuery({
    queryKey: ['timeSpentData'],
    queryFn: async (): Promise<TimeSpentData[]> => {
      // TODO: Replace with actual API call when backend is ready
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { name: 'Reading Material', value: 35 },
            { name: 'Video Lectures', value: 25 },
            { name: 'Quizzes', value: 15 },
            { name: 'Interactive Exercises', value: 20 },
            { name: 'Discussion Forums', value: 5 },
          ]);
        }, 500);
      });
    }
  });
}

export function useGradeDistributionData() {
  return useQuery({
    queryKey: ['gradeDistribution'],
    queryFn: async (): Promise<GradeDistributionData[]> => {
      // TODO: Replace with actual API call when backend is ready
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { name: 'A (90-100%)', students: 45 },
            { name: 'B (80-89%)', students: 62 },
            { name: 'C (70-79%)', students: 78 },
            { name: 'D (60-69%)', students: 38 },
            { name: 'F (Below 60%)', students: 12 },
          ]);
        }, 500);
      });
    }
  });
}