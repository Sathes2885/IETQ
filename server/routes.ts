import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { db } from "../db";
import { 
  users, insertUserSchema, 
  enrollments, courses, competitions, quizzes, certificates,
  competitionEntries, courseContents, quizQuestions, quizAttempts
} from "../shared/schema";
import { eq, and, or, desc, asc, count, sql } from "drizzle-orm";
import { getContent, saveContent, getPageContent } from "./content";
import path from "path";
import multer from "multer";
import fs from "fs-extra";
import { uploadCourseContent, getCourseContents, serveContentFile, deleteContent, upload } from "./controllers/courseContent";
import { WebSocketServer, WebSocket } from 'ws';
import { syncSupabaseUsers } from './services/supabase';

// In-memory storage for created entities (in a real app, this would be in a database)
const createdCourses: any[] = [];
const createdCompetitions: any[] = [];
const createdQuizzes: any[] = [];

// Declare global namespace for TypeScript
declare global {
  var registeredUsers: Array<{
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
    grade?: string;
    approvalStatus: string;
    // Teacher specific fields
    subject?: string;
    qualification?: string;
    experience?: string;
    school?: string;
    supabaseUserId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  var activeUsers: Map<string, {
    userId: number;
    name: string;
    email: string;
    role: string;
    lastActivity: Date;
    status: 'online' | 'away' | 'offline';
  }>;
}

// Initialize global array for storing users
if (!global.registeredUsers) {
  global.registeredUsers = [];
  
  // Add some test users
  global.registeredUsers.push({
    id: 1,
    name: 'Sathesa',
    email: 'sathesa@ietq.com',
    role: 'admin',
    approvalStatus: 'approved',
    supabaseUserId: 'admin-sathesa',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  global.registeredUsers.push({
    id: 2,
    name: 'John Teacher',
    email: 'teacher@ietq.com',
    role: 'teacher',
    subject: 'Mathematics',
    qualification: 'M.Ed',
    experience: '10 years',
    school: 'Delhi Public School',
    approvalStatus: 'approved',
    supabaseUserId: 'teacher-john',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  global.registeredUsers.push({
    id: 3,
    name: 'Ravi Student',
    email: 'student@ietq.com',
    role: 'student',
    grade: '9',
    approvalStatus: 'approved',
    supabaseUserId: 'student-ravi',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  console.log('Added test users to the system');
  
  // Sync with Supabase to get real users
  syncSupabaseUsers().catch(err => {
    console.error('Error syncing initial users from Supabase:', err);
  });
}

// Initialize active users
if (!global.activeUsers) {
  global.activeUsers = new Map();
  
  // Add all registered users as active initially for testing
  global.registeredUsers.forEach(user => {
    global.activeUsers.set(user.id.toString(), {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastActivity: new Date(),
      status: 'online'
    });
  });
  
  console.log('Initialized active users for testing:', global.activeUsers.size);
}

// Auth middleware
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a production environment, we would validate the JWT token
    // Here we'll check for Supabase ID and use it to identify users
    const supabaseUserId = req.headers["x-supabase-user-id"];
    const email = req.headers["x-supabase-email"] as string;
    
    console.log('Supabase User ID:', supabaseUserId);
    
    if (!supabaseUserId) {
      console.log('No Supabase User ID provided in headers');
      return res.status(401).json({ message: "Unauthorized - No user ID" });
    }
    
    try {
      // First check if we have a user in our in-memory storage by ID
      let existingUser = global.registeredUsers?.find(
        user => user.supabaseUserId === supabaseUserId
      );
      
      // If not found by ID, try by email
      if (!existingUser && email) {
        existingUser = global.registeredUsers?.find(
          user => user.email === email
        );
      }
      
      if (existingUser) {
        console.log('Found existing registered user:', existingUser.email);
        console.log('User role in database:', existingUser.role);
        
        // Check if the user is a teacher with pending approval
        if (existingUser.role === 'teacher' && existingUser.approvalStatus === 'pending') {
          console.log('Teacher account is pending approval:', existingUser.email);
          return res.status(403).json({ 
            message: "Your teacher account is pending approval by an administrator. Please check back later.",
            pendingApproval: true 
          });
        }
        
        // Check if the user is a teacher with rejected approval
        if (existingUser.role === 'teacher' && existingUser.approvalStatus === 'rejected') {
          console.log('Teacher account approval was rejected:', existingUser.email);
          return res.status(403).json({ 
            message: "Your teacher account registration was not approved. Please contact the administrator for more information.",
            approvalRejected: true 
          });
        }
        
        // Update user role if different from role header
        const roleHeader = req.headers["x-supabase-user-role"] as string;
        if (roleHeader && roleHeader !== existingUser.role && 
            (roleHeader === 'admin' || roleHeader === 'teacher' || roleHeader === 'student')) {
          console.log(`Updating user role from ${existingUser.role} to ${roleHeader}`);
          existingUser.role = roleHeader as 'admin' | 'teacher' | 'student';
          
          // Add teacher specific fields if missing
          if (roleHeader === 'teacher' && !existingUser.subject) {
            existingUser.subject = 'Mathematics';
            existingUser.qualification = 'B.Ed';
            existingUser.experience = '5 years';
            existingUser.school = 'IETQ Academy';
            
            // Set approval status to pending for new teachers
            existingUser.approvalStatus = 'pending';
          }
          
          // Update user in global registeredUsers
          const userIndex = global.registeredUsers.findIndex(u => u.id === existingUser.id);
          if (userIndex !== -1) {
            global.registeredUsers[userIndex] = existingUser;
          }
        }
        
        (req as any).user = existingUser;
        next();
        return;
      }
      
      // Check user metadata for role from Supabase
      const role = req.headers["x-supabase-user-role"] as string;
      
      // Determine user role based on headers first, then email pattern
      let userRole = 'student' as 'admin' | 'teacher' | 'student';
      
      if (role) {
        console.log(`Role from Supabase metadata: ${role}`);
        if (role === 'admin' || role === 'teacher' || role === 'student') {
          userRole = role;
        }
      } else if (email) {
        console.log(`Determining role from email: ${email}`);
        // Special case for sathesa@ietq.com - assign admin role
        if (email === 'sathesa@ietq.com') {
          userRole = 'admin';
          console.log('Assigning admin role to sathesa@ietq.com');
        } else if (email.includes('admin')) {
          userRole = 'admin';
        } else if (email.includes('teacher')) {
          userRole = 'teacher';
        } else {
          userRole = 'student';
        }
      }
      
      console.log(`Final user role determined: ${userRole}`);
      
      // Extract name from email (or use a default)
      let userName = 'User';
      if (email) {
        userName = email.split('@')[0];
        // Capitalize first letter and replace dots/underscores with spaces
        userName = userName
          .split(/[._-]/)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
      }
      
      // Create a new user and add to global array
      const newUser = {
        id: global.registeredUsers.length + 1,
        email: email || `user-${supabaseUserId}@ietq.com`,
        name: userName,
        role: userRole,
        grade: userRole === 'student' ? '8' : undefined,
        // Include teacher-specific fields
        subject: userRole === 'teacher' ? 'Mathematics' : undefined,
        qualification: userRole === 'teacher' ? 'B.Ed' : undefined,
        experience: userRole === 'teacher' ? '5 years' : undefined,
        school: userRole === 'teacher' ? 'IETQ Academy' : undefined,
        approvalStatus: 'approved',
        supabaseUserId: supabaseUserId as string,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add to global array
      global.registeredUsers.push(newUser);
      
      console.log('Created mock user:', newUser);
      
      // Attach user to request
      (req as any).user = newUser;
      next();
    } catch (dbError: unknown) {
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error';
      console.error("Database error in auth middleware:", dbError);
      return res.status(500).json({ message: "Database error", error: errorMessage });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Internal server error", error: errorMessage });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Direct Admin Access Route (development only)
  app.get('/api/auth/admin-access', async (req: Request, res: Response) => {
    try {
      // Create an admin user in memory
      const adminUser = {
        id: 999,
        name: 'Admin User',
        email: 'admin@ietq.com',
        role: 'admin' as 'admin',
        grade: undefined,
        approvalStatus: 'approved',
        supabaseUserId: 'admin-direct-access',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Check if admin already exists in memory
      const existingAdminIndex = global.registeredUsers.findIndex(
        user => user.email === 'admin@ietq.com'
      );
      
      if (existingAdminIndex >= 0) {
        // Update existing admin
        global.registeredUsers[existingAdminIndex] = adminUser;
      } else {
        // Add admin to memory
        global.registeredUsers.push(adminUser);
      }
      
      console.log('Admin access granted. Registered users:', global.registeredUsers);
      
      res.json({ 
        success: true, 
        message: 'Admin access granted. Use email: admin@ietq.com and any password on the login screen.',
        adminUser
      });
    } catch (error) {
      console.error('Admin access error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Auth routes
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { supabaseUserId, ...userData } = req.body;
      
      // Log the registration data
      console.log('Registration data received:', { supabaseUserId, ...userData });
      
      if (!supabaseUserId) {
        return res.status(400).json({ message: "Missing Supabase User ID" });
      }
      
      // Check if user already exists
      const existingUser = global.registeredUsers.find(user => 
        user.supabaseUserId === supabaseUserId || user.email === userData.email
      );
      
      // Special case for sathesa - always ensure they have admin role
      if (existingUser && existingUser.email === 'sathesa@ietq.com' && existingUser.role !== 'admin') {
        existingUser.role = 'admin';
        console.log('Updated sathesa@ietq.com to have admin role');
      }
      
      if (existingUser) {
        console.log('User already exists:', existingUser);
        return res.status(200).json(existingUser); // Return existing user
      }
      
      // Validate user data using zod schema
      try {
        insertUserSchema.parse({
          ...userData,
          supabaseUserId,
        });
      } catch (validationError) {
        console.error('Registration validation error:', validationError);
        if (validationError instanceof z.ZodError) {
          return res.status(400).json({ message: "Validation error", errors: validationError.errors });
        }
        throw validationError;
      }
      
      // Use the role provided during registration
      // If userData.role is not provided, determine based on email
      if (!userData.role) {
        if (userData.email?.includes('admin')) {
          userData.role = 'admin';
        } else if (userData.email?.includes('teacher')) {
          userData.role = 'teacher';
        } else {
          userData.role = 'student';
        }
      }
      
      console.log(`User role set to: ${userData.role} for email: ${userData.email}`);
      
      // Generate a user ID
      const userId = global.registeredUsers.length + 1;
      
      // Create the new user
      const newUser = {
        id: userId,
        name: userData.name,
        email: userData.email,
        role: userData.role as 'admin' | 'teacher' | 'student',
        grade: userData.grade,
        approvalStatus: 'approved',
        // Include teacher-specific fields
        subject: userData.role === 'teacher' ? userData.subject : undefined,
        qualification: userData.role === 'teacher' ? userData.qualification : undefined,
        experience: userData.role === 'teacher' ? userData.experience : undefined,
        school: userData.role === 'teacher' ? userData.school : undefined,
        supabaseUserId: supabaseUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add user to our in-memory storage
      global.registeredUsers.push(newUser);
      
      console.log('User registered successfully:', newUser);
      
      return res.status(201).json(newUser);
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get('/api/auth/me', authMiddleware, async (req: Request, res: Response) => {
    // User is already attached from authMiddleware
    res.json((req as any).user);
  });
  
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    // Normally we would invalidate JWT token here
    // But for Supabase, logout is handled client-side
    res.status(200).json({ success: true });
  });
  
  // Student dashboard routes - Stats
  app.get('/api/student/dashboard/stats', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'student' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // For now, we'll use simpler database queries to avoid TypeScript errors
      // Later we can implement full queries when the database is properly set up
      
      // Initialize stats with defaults
      const stats = {
        activeCourses: 2,
        competitions: 3,
        upcomingQuizzes: 1,
        certificatesEarned: 4
      };
      
      // Use the user ID to make it dynamic
      const userId = user.id;
      console.log(`Getting dashboard stats for user ID: ${userId}`);
      
      // Modify stats based on userId to make them somewhat dynamic
      stats.activeCourses = (userId % 5) + 2;
      stats.upcomingQuizzes = (userId % 3) + 1;
      
      res.json(stats);
    } catch (error) {
      console.error('Student dashboard stats error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Student dashboard - Recent courses with progress
  app.get('/api/student/dashboard/courses', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'student' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const userId = user.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      console.log(`Getting courses for user ID: ${userId}`);
      
      if (createdCourses.length > 0) {
        // Transform created courses to include student-specific data
        const studentCourses = createdCourses.map(course => ({
          id: course.id,
          title: course.title,
          subject: course.subject,
          description: course.description,
          thumbnailUrl: course.thumbnailUrl || "https://images.unsplash.com/photo-1635372722656-389f87a941db?q=80&w=1160&auto=format&fit=crop",
          progress: Math.floor(Math.random() * 101),
          duration: course.estimatedDuration,
          totalLessons: Math.floor(Math.random() * 20) + 5,
          instructorName: `Teacher ID ${course.createdBy}`,
          isCompleted: false,
          lastAccessed: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000),
          isNew: (new Date().getTime() - new Date(course.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000
        }));
        
        return res.json(studentCourses.slice(0, limit));
      } else {
        // Fallback for no created courses
        const sampleCourses = [{
          id: 1,
          title: "Sample Course - No Real Courses Yet",
          subject: "General",
          description: "Please wait for teachers to create courses",
          thumbnailUrl: "https://images.unsplash.com/photo-1635372722656-389f87a941db?q=80&w=1160&auto=format&fit=crop",
          progress: 0,
          duration: "N/A",
          totalLessons: 0,
          instructorName: "System",
          isCompleted: false,
          lastAccessed: new Date(),
          isNew: true
        }];
        
        return res.json(sampleCourses);
      }
    } catch (error) {
      console.error('Error fetching student dashboard courses:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Student dashboard - Competitions
  app.get('/api/student/dashboard/competitions', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'student' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Check if we have any created competitions
      if (createdCompetitions.length > 0) {
        // Transform competition data for student view
        const studentCompetitions = createdCompetitions.map(competition => ({
          id: competition.id,
          title: competition.title || 'Untitled Competition',
          description: competition.description || 'No description available',
          category: competition.subject || 'General',
          thumbnailUrl: competition.thumbnailUrl || 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?q=80&w=1160&auto=format&fit=crop',
          startDate: competition.startDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          endDate: competition.endDate || new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          participantCount: Math.floor(Math.random() * 1000) + 100,
          status: 'upcoming',
          isRegistered: true, 
          hasSubmitted: false,
          isWinner: false
        }));
        
        const limit = req.query.limit ? parseInt(req.query.limit as string) : studentCompetitions.length;
        return res.json(studentCompetitions.slice(0, limit));
      }
      
      // Fallback - show empty placeholder if no competitions exist
      const placeholderCompetition = [
        {
          id: 0,
          title: 'No Competitions Available',
          description: 'Check back later for upcoming competitions.',
          category: 'General',
          thumbnailUrl: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?q=80&w=1160&auto=format&fit=crop',
          startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), 
          participantCount: 0,
          status: 'upcoming',
          isRegistered: false,
          hasSubmitted: false,
          isWinner: false
        }
      ];
      
      return res.json(placeholderCompetition);
    } catch (error) {
      console.error('Error fetching competitions:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Student dashboard - Upcoming events
  app.get('/api/student/dashboard/upcoming', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'student' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Mock upcoming events data
      const upcomingEvents = [
        {
          id: 1,
          title: 'Physics Weekly Quiz',
          type: 'quiz',
          subject: 'Science',
          scheduledStartTime: new Date('2025-05-08T16:00:00'),
          duration: 45,
          isImportant: true,
          isLive: false,
          minutesUntilStart: 720
        },
        {
          id: 2,
          title: 'Mathematics Competition Briefing',
          type: 'event',
          subject: 'Mathematics',
          scheduledStartTime: new Date('2025-05-10T14:30:00'),
          duration: 60,
          isImportant: false,
          isLive: false,
          minutesUntilStart: 3000
        },
        {
          id: 3,
          title: 'Literature Analysis Class',
          type: 'class',
          subject: 'English',
          scheduledStartTime: new Date('2025-05-07T11:00:00'),
          duration: 90,
          isImportant: false,
          isLive: false,
          minutesUntilStart: 240
        },
        {
          id: 4,
          title: 'Science Challenge Prep Quiz',
          type: 'quiz',
          subject: 'Science',
          scheduledStartTime: new Date('2025-05-06T09:15:00'),
          duration: 30,
          isImportant: true,
          isLive: true,
          minutesUntilStart: 0
        }
      ];

      // Apply limit if specified
      const limit = req.query.limit ? parseInt(req.query.limit as string) : upcomingEvents.length;
      
      res.json(upcomingEvents.slice(0, limit));
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Student courses - Enrolled
  app.get('/api/student/courses/enrolled', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'student' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Mock enrolled courses
      const enrolledCourses = [
        {
          id: 1,
          title: 'Introduction to Mathematics',
          subject: 'Mathematics',
          description: 'Master foundational mathematical concepts with interactive lessons.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1635372722656-389f87a941db?q=80&w=1160&auto=format&fit=crop',
          progress: 75,
          duration: '6 weeks',
          totalLessons: 24,
          instructorName: 'Dr. Sharma',
          isCompleted: false,
          lastAccessed: new Date('2025-05-01T10:30:00')
        },
        {
          id: 2,
          title: 'Advanced Science Concepts',
          subject: 'Science',
          description: 'Explore advanced scientific principles through experiments and simulations.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1160&auto=format&fit=crop',
          progress: 45,
          duration: '8 weeks',
          totalLessons: 32,
          instructorName: 'Dr. Patel',
          isCompleted: false,
          lastAccessed: new Date('2025-05-03T14:15:00')
        },
        {
          id: 3,
          title: 'Creative Writing Workshop',
          subject: 'English',
          description: 'Develop your storytelling skills and creative expression through guided exercises.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1160&auto=format&fit=crop',
          progress: 10,
          duration: '4 weeks',
          totalLessons: 16,
          instructorName: 'Ms. Gupta',
          isCompleted: false,
          lastAccessed: new Date('2025-05-05T09:45:00')
        },
        {
          id: 4,
          title: 'Indian History Through Ages',
          subject: 'History',
          description: 'Discover the rich history of India from ancient civilizations to modern times.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1160&auto=format&fit=crop',
          progress: 60,
          duration: '10 weeks',
          totalLessons: 40,
          instructorName: 'Prof. Kumar',
          isCompleted: false,
          lastAccessed: new Date('2025-04-28T11:20:00')
        },
        {
          id: 5,
          title: 'Introduction to Computer Programming',
          subject: 'Computer',
          description: 'Learn the fundamentals of programming with hands-on coding exercises.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1160&auto=format&fit=crop',
          progress: 30,
          duration: '12 weeks',
          totalLessons: 48,
          instructorName: 'Mr. Singh',
          isCompleted: false,
          lastAccessed: new Date('2025-05-02T16:45:00')
        }
      ];
      
      res.json(enrolledCourses);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Student courses - Completed
  app.get('/api/student/courses/completed', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'student' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Mock completed courses
      const completedCourses = [
        {
          id: 6,
          title: 'Basic Mathematics',
          subject: 'Mathematics',
          description: 'Fundamental mathematical concepts for beginners with practice exercises.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?q=80&w=1160&auto=format&fit=crop',
          progress: 100,
          duration: '5 weeks',
          totalLessons: 20,
          instructorName: 'Dr. Kapoor',
          isCompleted: true,
          lastAccessed: new Date('2025-03-15T14:30:00')
        },
        {
          id: 7,
          title: 'Environmental Science',
          subject: 'Science',
          description: 'Explore the relationship between living organisms and their environment.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1160&auto=format&fit=crop',
          progress: 100,
          duration: '7 weeks',
          totalLessons: 28,
          instructorName: 'Dr. Reddy',
          isCompleted: true,
          lastAccessed: new Date('2025-04-10T09:15:00')
        },
        {
          id: 8,
          title: 'Grammar Essentials',
          subject: 'English',
          description: 'Master the fundamentals of English grammar through practical examples.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1456513080867-f24f142c9d77?q=80&w=1160&auto=format&fit=crop',
          progress: 100,
          duration: '4 weeks',
          totalLessons: 16,
          instructorName: 'Ms. Verma',
          isCompleted: true,
          lastAccessed: new Date('2025-04-25T11:45:00')
        }
      ];
      
      res.json(completedCourses);
    } catch (error) {
      console.error('Error fetching completed courses:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Student courses - Recommended
  app.get('/api/student/courses/recommended', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'student' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Mock recommended courses
      const recommendedCourses = [
        {
          id: 9,
          title: 'Advanced Mathematics',
          subject: 'Mathematics',
          description: 'Challenging mathematical concepts for advanced learners with complex problem-solving.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?q=80&w=1160&auto=format&fit=crop',
          progress: 0,
          duration: '8 weeks',
          totalLessons: 32,
          instructorName: 'Dr. Mathur',
          isNew: true
        },
        {
          id: 10,
          title: 'Physics Fundamentals',
          subject: 'Science',
          description: 'Understand the basic laws of physics with interactive experiments and simulations.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1160&auto=format&fit=crop',
          progress: 0,
          duration: '10 weeks',
          totalLessons: 40,
          instructorName: 'Prof. Shah',
          isNew: false
        },
        {
          id: 11,
          title: 'Public Speaking Skills',
          subject: 'English',
          description: 'Build confidence and master the art of public speaking with practical exercises.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1475721027785-f74ec9c9b749?q=80&w=1160&auto=format&fit=crop',
          progress: 0,
          duration: '6 weeks',
          totalLessons: 24,
          instructorName: 'Ms. Chatterjee',
          isNew: true
        },
        {
          id: 12,
          title: 'Web Development Basics',
          subject: 'Computer',
          description: 'Learn to create websites using HTML, CSS, and JavaScript with hands-on projects.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1160&auto=format&fit=crop',
          progress: 0,
          duration: '12 weeks',
          totalLessons: 48,
          instructorName: 'Mr. Joshi',
          isNew: false
        }
      ];

      // Apply limit if specified
      const limit = req.query.limit ? parseInt(req.query.limit as string) : recommendedCourses.length;
      
      res.json(recommendedCourses.slice(0, limit));
    } catch (error) {
      console.error('Error fetching recommended courses:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Teacher course management routes
  app.get('/api/teacher/courses', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'teacher' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Return only created courses
      // For a real app, we would filter courses by teacher ID
      res.json(createdCourses);
    } catch (error) {
      console.error('Error fetching teacher courses:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get a specific course for a teacher
  app.get('/api/teacher/courses/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const courseId = parseInt(req.params.id);
      
      if (user.role !== 'teacher' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Find the course
      const course = createdCourses.find(c => c.id === courseId);
      
      // Check if course exists
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Generate content stats for demo
      const courseWithStats = {
        ...course,
        totalLessons: Math.floor(Math.random() * 15) + 5, // 5-20 lessons
        enrolledStudents: Math.floor(Math.random() * 50) // 0-50 students
      };
      
      res.json(courseWithStats);
    } catch (error) {
      console.error('Error fetching course details:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post('/api/teacher/courses', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'teacher' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const courseData = req.body;
      
      // Validate course data (basic validation)
      if (!courseData.title || !courseData.description || !courseData.subject || !courseData.gradeLevel) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Validate pricing information
      if (courseData.pricingType === 'paid' && (!courseData.price || parseFloat(courseData.price) <= 0)) {
        return res.status(400).json({ message: "Price is required for paid courses" });
      }
      
      // Convert price from string to number if it's a paid course
      const price = courseData.pricingType === 'paid' ? parseFloat(courseData.price) : 0;
      
      // Create new course and store it
      const newCourse = {
        id: Math.floor(Math.random() * 1000) + 4, // Generate a random ID
        ...courseData,
        price: courseData.pricingType === 'paid' ? price : 0,
        isFree: courseData.pricingType === 'free',
        enrolledStudents: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user.id
      };
      
      // Add to our in-memory storage
      createdCourses.push(newCourse);
      
      console.log('Created new course:', newCourse);
      
      res.status(201).json(newCourse);
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Course content routes
  app.get('/api/teacher/courses/:courseId/content', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const courseId = parseInt(req.params.courseId);
      
      if (user.role !== 'teacher' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await getCourseContents(req, res);
    } catch (error) {
      console.error('Error fetching course content:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post('/api/teacher/courses/:courseId/content', authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const courseId = parseInt(req.params.courseId);
      
      if (user.role !== 'teacher' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Check if course exists
      const course = createdCourses.find(c => c.id === courseId && (c.createdBy === user.id || user.role === 'admin'));
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      await uploadCourseContent(req, res);
    } catch (error) {
      console.error('Error uploading course content:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete('/api/teacher/courses/:courseId/content/:contentId', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'teacher' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await deleteContent(req, res);
    } catch (error) {
      console.error('Error deleting course content:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Serve content files
  app.get('/api/content/files/course-:courseId/:filename', async (req: Request, res: Response) => {
    await serveContentFile(req, res);
  });
  
  // Teacher dashboard routes
  app.get('/api/teacher/dashboard', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'teacher') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Mock dashboard stats for now
      const stats = {
        totalCourses: 5,
        totalCompetitions: 3,
        totalQuizzes: 8,
        totalStudents: 120
      };
      
      res.json(stats);
    } catch (error) {
      console.error('Teacher dashboard error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Additional teacher dashboard routes that match the frontend queries
  app.get('/api/teacher/dashboard/stats', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'teacher' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Get stats based on created content
      // In a real app, we would filter by the teacher's ID
      const teacherCourses = createdCourses.filter(course => course.createdBy === user.id);
      const teacherCompetitions = createdCompetitions.filter(comp => comp.createdBy === user.id);
      const teacherQuizzes = createdQuizzes.filter(quiz => quiz.createdBy === user.id);
      
      // Calculate total students (in a real app, this would be from enrollments)
      const totalStudents = teacherCourses.reduce((total, course) => total + (course.enrolledStudents || 0), 0);
      const activeStudents = Math.round(totalStudents * 0.8); // Assuming 80% are active
      
      const stats = {
        totalCourses: teacherCourses.length,
        totalStudents: totalStudents,
        totalCompetitions: teacherCompetitions.length,
        totalQuizzes: teacherQuizzes.length,
        activeStudents: activeStudents,
        completionRate: totalStudents > 0 ? 76.5 : 0 // Default completion rate if there are students
      };
      
      res.json(stats);
    } catch (error) {
      console.error('Teacher dashboard stats error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get('/api/teacher/dashboard/recent-activities', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'teacher' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Generate activities based on created courses
      const activities = [];
      
      // Add activities for created courses
      createdCourses.filter(course => course.createdBy === user.id).forEach((course, index) => {
        activities.push({
          id: index + 1,
          action: 'Course created',
          contentTitle: course.title,
          contentType: 'course',
          date: course.createdAt.toISOString(),
          status: 'completed'
        });
      });
      
      // If no activities yet, provide a welcome activity
      if (activities.length === 0) {
        activities.push({
          id: 1,
          action: 'Welcome to IETQ',
          contentTitle: 'Create your first course',
          contentType: 'info',
          date: new Date().toISOString(),
          status: 'pending'
        });
      }
      
      // Sort activities by date (newest first)
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      res.json(activities);
    } catch (error) {
      console.error('Teacher recent activities error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get('/api/teacher/dashboard/enrollment-stats', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'teacher' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Generate enrollment stats based on created courses
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      
      // Create a map of the last 6 months
      const enrollmentStats = [];
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12; // Handle wrapping around to previous year
        enrollmentStats.unshift({
          name: months[monthIndex],
          courses: 0,
          competitions: 0,
          quizzes: 0
        });
      }
      
      // Add course statistics if there are any created courses
      if (createdCourses.length > 0) {
        // Get the month of each created course and increment the corresponding month's count
        createdCourses.filter(course => course.createdBy === user.id).forEach(course => {
          const courseMonth = new Date(course.createdAt).getMonth();
          const statsIndex = enrollmentStats.findIndex(stat => stat.name === months[courseMonth]);
          
          if (statsIndex !== -1) {
            enrollmentStats[statsIndex].courses += 1;
          }
        });
      }
      
      res.json(enrollmentStats);
    } catch (error) {
      console.error('Teacher enrollment stats error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get('/api/teacher/dashboard/content-performance', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'teacher' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Default completion rates
      let courseCompletionRate = 0;
      let competitionCompletionRate = 0;
      let quizCompletionRate = 0;
      
      // Calculate completion rates based on created content
      // Here we're using a simple approach - if there are created courses, use a sample rate
      const teacherCourses = createdCourses.filter(course => course.createdBy === user.id);
      const teacherCompetitions = createdCompetitions.filter(comp => comp.createdBy === user.id);
      const teacherQuizzes = createdQuizzes.filter(quiz => quiz.createdBy === user.id);
      
      if (teacherCourses.length > 0) {
        // In a real app, this would be calculated from actual enrollments and completions
        courseCompletionRate = 78;
      }
      
      if (teacherCompetitions.length > 0) {
        competitionCompletionRate = 65;
      }
      
      if (teacherQuizzes.length > 0) {
        quizCompletionRate = 85;
      }
      
      const contentPerformance = [
        { type: 'Courses', completionRate: courseCompletionRate },
        { type: 'Competitions', completionRate: competitionCompletionRate },
        { type: 'Quizzes', completionRate: quizCompletionRate }
      ];
      
      res.json(contentPerformance);
    } catch (error) {
      console.error('Teacher content performance error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Teacher Analytics API endpoints
  app.get('/api/teacher/analytics/dashboard', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'teacher' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Mock teacher analytics dashboard stats
      const stats = {
        activeStudents: 482,
        completionRate: 76.3,
        quizScore: 74.8,
        courseEnrollment: 32,
        studentsTrend: 8.2,
        completionRateTrend: 3.8,
        quizScoreTrend: -1.2,
        enrollmentTrend: 4
      };
      
      res.json(stats);
    } catch (error) {
      console.error('Teacher analytics dashboard error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get('/api/teacher/analytics/student-performance', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'teacher' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Mock student performance data
      const data = [
        { name: 'Quiz 1', average: 76, highest: 98, lowest: 45 },
        { name: 'Quiz 2', average: 72, highest: 95, lowest: 52 },
        { name: 'Quiz 3', average: 78, highest: 100, lowest: 48 },
        { name: 'Quiz 4', average: 74, highest: 96, lowest: 50 },
        { name: 'Quiz 5', average: 80, highest: 99, lowest: 59 },
        { name: 'Quiz 6', average: 82, highest: 100, lowest: 61 },
        { name: 'Quiz 7', average: 76, highest: 97, lowest: 55 },
      ];
      
      res.json(data);
    } catch (error) {
      console.error('Teacher student performance error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get('/api/teacher/analytics/course-completion', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'teacher' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Mock course completion data
      const data = [
        { name: 'Mathematics Fundamentals', completed: 85, inProgress: 10, notStarted: 5 },
        { name: 'Advanced Algebra', completed: 72, inProgress: 18, notStarted: 10 },
        { name: 'Geometry Basics', completed: 68, inProgress: 22, notStarted: 10 },
        { name: 'Science Lab Series', completed: 63, inProgress: 25, notStarted: 12 },
        { name: 'Biology Concepts', completed: 78, inProgress: 15, notStarted: 7 },
        { name: 'Chemical Experiments', completed: 58, inProgress: 28, notStarted: 14 },
      ];
      
      res.json(data);
    } catch (error) {
      console.error('Teacher course completion error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get('/api/teacher/analytics/engagement', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'teacher' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Mock engagement data
      const data = [
        { day: 'Mon', activeUsers: 320 },
        { day: 'Tue', activeUsers: 380 },
        { day: 'Wed', activeUsers: 420 },
        { day: 'Thu', activeUsers: 390 },
        { day: 'Fri', activeUsers: 410 },
        { day: 'Sat', activeUsers: 280 },
        { day: 'Sun', activeUsers: 250 },
      ];
      
      res.json(data);
    } catch (error) {
      console.error('Teacher engagement data error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get('/api/teacher/analytics/time-distribution', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'teacher' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Mock time distribution data
      const data = [
        { name: 'Reading Material', value: 35 },
        { name: 'Video Lectures', value: 25 },
        { name: 'Quizzes', value: 15 },
        { name: 'Interactive Exercises', value: 20 },
        { name: 'Discussion Forums', value: 5 },
      ];
      
      res.json(data);
    } catch (error) {
      console.error('Teacher time distribution error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get('/api/teacher/analytics/grade-distribution', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'teacher' && user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Mock grade distribution data
      const data = [
        { name: 'A (90-100%)', students: 45 },
        { name: 'B (80-89%)', students: 62 },
        { name: 'C (70-79%)', students: 78 },
        { name: 'D (60-69%)', students: 38 },
        { name: 'F (Below 60%)', students: 12 },
      ];
      
      res.json(data);
    } catch (error) {
      console.error('Teacher grade distribution error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin dashboard routes
  app.get('/api/admin/dashboard', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Real dashboard stats using actual data
      const stats = {
        totalUsers: global.registeredUsers.length,
        pendingApprovals: global.registeredUsers.filter(u => u.approvalStatus === 'pending').length,
        activeCourses: global.courses ? global.courses.length : 0,
        activeCompetitions: global.competitions ? global.competitions.length : 0,
        activeQuizzes: global.quizzes ? global.quizzes.length : 0,
        totalRevenue: 125000, // This would be calculated from real payment data in a production app
        activeUsers: global.activeUsers ? global.activeUsers.size : 0
      };
      
      console.log('Admin dashboard stats:', stats);
      
      res.json(stats);
    } catch (error) {
      console.error('Admin dashboard error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all users for admin
  app.get('/api/admin/users', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      console.log('Fetching all users for admin. Current user count:', global.registeredUsers.length);
      
      // Sync with Supabase to ensure we have all users
      await syncSupabaseUsers();
      
      console.log('After sync, user count:', global.registeredUsers.length);
      
      // Return all users
      res.json(global.registeredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });
  
  // Create new user (admin only)
  app.post('/api/admin/users', authMiddleware, async (req: Request, res: Response) => {
    try {
      const adminUser = (req as any).user;
      
      // Check if user is an admin
      if (adminUser.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const { name, email, password, role, grade, subject, qualification, experience, school } = req.body;
      
      // Validate required fields
      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      
      // Check if email already exists
      const existingUser = global.registeredUsers.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      // In a real app, you would use Supabase API to create the user
      // For this example, we'll add the user to our global array
      
      // Generate a temporary Supabase-like user ID
      const supabaseUserId = `temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Create new user object
      const newUser = {
        id: global.registeredUsers.length + 1,
        name,
        email,
        role,
        approvalStatus: role === 'teacher' ? 'pending' : 'approved',
        supabaseUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add role-specific fields
      if (role === 'student' && grade) {
        Object.assign(newUser, { grade });
      } else if (role === 'teacher') {
        Object.assign(newUser, { 
          subject, 
          qualification, 
          experience, 
          school 
        });
      }
      
      // Add user to the global array
      global.registeredUsers.push(newUser);
      
      console.log(`Admin ${adminUser.name} created new ${role} account: ${name} (${email})`);
      
      // Return success with the created user
      res.status(201).json({ 
        message: "User created successfully", 
        user: newUser 
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Failed to create user' });
    }
  });
  
  // Approve or reject teacher account
  app.patch('/api/admin/teachers/:userId/approve', authMiddleware, async (req: Request, res: Response) => {
    try {
      const adminUser = (req as any).user;
      
      // Check if user is an admin
      if (adminUser.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }
      
      const { userId } = req.params;
      const { approvalStatus } = req.body;
      
      if (!approvalStatus || (approvalStatus !== 'approved' && approvalStatus !== 'rejected')) {
        return res.status(400).json({ message: "Invalid approval status. Must be 'approved' or 'rejected'" });
      }
      
      // Find teacher by ID
      const teacherIndex = global.registeredUsers.findIndex(
        user => user.id.toString() === userId && user.role === 'teacher'
      );
      
      if (teacherIndex === -1) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      
      // Update approval status
      global.registeredUsers[teacherIndex].approvalStatus = approvalStatus;
      global.registeredUsers[teacherIndex].updatedAt = new Date();
      
      const teacher = global.registeredUsers[teacherIndex];
      
      console.log(`Admin ${adminUser.name} ${approvalStatus} teacher ${teacher.name} (${teacher.email})`);
      
      // Return updated teacher
      res.json({
        message: `Teacher ${approvalStatus === 'approved' ? 'approved' : 'rejected'} successfully`,
        teacher: global.registeredUsers[teacherIndex]
      });
    } catch (error) {
      console.error('Error updating teacher approval status:', error);
      res.status(500).json({ message: "Failed to update teacher approval status" });
    }
  });
  
  // Get pending teacher approvals
  app.get('/api/admin/pending-approvals', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Get teachers with pending approval
      const pendingTeachers = global.registeredUsers.filter(
        user => user.role === 'teacher' && user.approvalStatus === 'pending'
      );
      
      console.log(`Returning ${pendingTeachers.length} pending teacher approvals`);
      
      res.json(pendingTeachers);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      res.status(500).json({ message: "Failed to fetch pending approvals" });
    }
  });
  
  // Admin user distribution data
  app.get('/api/admin/dashboard/user-distribution', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Get actual user distribution from the registered users
      const adminCount = global.registeredUsers.filter(u => u.role === 'admin').length;
      const teacherCount = global.registeredUsers.filter(u => u.role === 'teacher').length;
      const studentCount = global.registeredUsers.filter(u => u.role === 'student').length;
      
      const data = [
        { name: 'Admin', value: adminCount },
        { name: 'Teachers', value: teacherCount },
        { name: 'Students', value: studentCount }
      ];
      
      res.json(data);
    } catch (error) {
      console.error('Admin user distribution error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin pending approvals
  app.get('/api/admin/pending-approvals', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Get actual pending approvals from the registered users
      const pendingApprovals = global.registeredUsers
        .filter(u => u.approvalStatus === 'pending')
        .map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
          subject: u.subject,
          qualification: u.qualification,
          experience: u.experience,
          school: u.school
        }));
      
      res.json(pendingApprovals);
    } catch (error) {
      console.error('Admin pending approvals error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin content distribution data
  app.get('/api/admin/dashboard/content-distribution', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Get actual content distribution from the arrays
      const courseCount = global.courses ? global.courses.length : 0;
      const competitionCount = global.competitions ? global.competitions.length : 0;
      const quizCount = global.quizzes ? global.quizzes.length : 0;
      
      const data = [
        { name: 'Courses', count: courseCount },
        { name: 'Competitions', count: competitionCount },
        { name: 'Quizzes', count: quizCount }
      ];
      
      res.json(data);
    } catch (error) {
      console.error('Admin content distribution error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Admin Analytics API endpoints
  app.get('/api/admin/analytics/dashboard', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Mock analytics dashboard stats for now
      const stats = {
        totalStudents: 12486,
        activeCompetitions: 24,
        completionRate: 78.4,
        revenue: '₹8.4M',
        studentsTrend: 18.2,
        competitionsTrend: 5.8,
        completionRateTrend: -2.1,
        revenueTrend: 12.7
      };
      
      res.json(stats);
    } catch (error) {
      console.error('Admin analytics dashboard error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get('/api/admin/analytics/enrollment-trend', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Mock enrollment trend data
      const data = [
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
      ];
      
      res.json(data);
    } catch (error) {
      console.error('Admin enrollment trend error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get('/api/admin/analytics/competitions', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Mock competition data
      const data = [
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
      ];
      
      res.json(data);
    } catch (error) {
      console.error('Admin competition data error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get('/api/admin/analytics/categories', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Mock category data
      const data = [
        { name: 'Mathematics', value: 35 },
        { name: 'Science', value: 30 },
        { name: 'English', value: 15 },
        { name: 'Computer Science', value: 10 },
        { name: 'History', value: 5 },
        { name: 'Others', value: 5 },
      ];
      
      res.json(data);
    } catch (error) {
      console.error('Admin category data error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get('/api/admin/analytics/completion-rates', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Mock completion rate data
      const data = [
        { grade: 'Grade 1', rate: 92 },
        { grade: 'Grade 2', rate: 88 },
        { grade: 'Grade 3', rate: 84 },
        { grade: 'Grade 4', rate: 79 },
        { grade: 'Grade 5', rate: 75 },
        { grade: 'Grade 6', rate: 81 },
        { grade: 'Grade 7', rate: 77 },
        { grade: 'Grade 8', rate: 72 },
        { grade: 'Grade 9', rate: 68 },
        { grade: 'Grade 10', rate: 65 },
      ];
      
      res.json(data);
    } catch (error) {
      console.error('Admin completion rate error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get('/api/admin/analytics/retention', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Mock retention data
      const data = [
        { month: 'Jan', rate: 95 },
        { month: 'Feb', rate: 93 },
        { month: 'Mar', rate: 94 },
        { month: 'Apr', rate: 92 },
        { month: 'May', rate: 91 },
        { month: 'Jun', rate: 89 },
        { month: 'Jul', rate: 90 },
        { month: 'Aug', rate: 88 },
        { month: 'Sep', rate: 86 },
        { month: 'Oct', rate: 85 },
        { month: 'Nov', rate: 87 },
        { month: 'Dec', rate: 88 },
      ];
      
      res.json(data);
    } catch (error) {
      console.error('Admin retention data error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get('/api/admin/analytics/revenue', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Mock revenue data
      const data = [
        { month: 'Jan', revenue: 52000 },
        { month: 'Feb', revenue: 58000 },
        { month: 'Mar', revenue: 61000 },
        { month: 'Apr', revenue: 67000 },
        { month: 'May', revenue: 72000 },
        { month: 'Jun', revenue: 78000 },
        { month: 'Jul', revenue: 82000 },
        { month: 'Aug', revenue: 86000 },
        { month: 'Sep', revenue: 91000 },
        { month: 'Oct', revenue: 94000 },
        { month: 'Nov', revenue: 98000 },
        { month: 'Dec', revenue: 105000 },
      ];
      
      res.json(data);
    } catch (error) {
      console.error('Admin revenue data error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Payment routes
  app.post('/api/payments/cashfree/initiate', authMiddleware, async (req: Request, res: Response) => {
    try {
      const { orderId, orderAmount, orderCurrency, customerName, customerEmail, returnUrl } = req.body;
      
      // Cashfree integration would go here
      // This is a mock payment flow
      const paymentLink = `https://example.com/pay/${orderId}`;
      
      res.json({
        status: "OK",
        paymentLink,
        orderId
      });
    } catch (error) {
      console.error('Payment initiation error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Content Management API Routes
  // Get all content
  app.get('/api/content', (req: Request, res: Response) => {
    getContent(req, res);
  });
  
  // Save content
  app.post('/api/content', (req: Request, res: Response) => {
    saveContent(req, res);
  });
  
  // Get page content by ID
  app.get('/api/content/page/:pageId', (req: Request, res: Response) => {
    getPageContent(req, res);
  });
  
  // Course purchase endpoint
  app.post('/api/student/purchase/course/:courseId', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const courseId = parseInt(req.params.courseId);
      
      if (user.role !== 'student') {
        return res.status(403).json({ message: "Only students can purchase courses" });
      }
      
      // Find the course
      const course = createdCourses.find(c => c.id === courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // If course is free, enroll directly
      if (course.isFree) {
        // In real app, we'd update the enrollment record in database
        return res.json({ 
          success: true, 
          message: "Successfully enrolled in free course", 
          requiresPayment: false,
          course
        });
      }
      
      // For paid courses, create payment
      const orderId = `IETQ-COURSE-${courseId}-${Date.now()}`;
      
      // Create payment request data
      const paymentData = {
        orderId,
        orderAmount: course.price || 0,
        orderCurrency: 'INR',
        customerName: user.name || 'Student',
        customerEmail: user.email,
        returnUrl: `${req.protocol}://${req.get('host')}/api/payments/callback?courseId=${courseId}&userId=${user.id}`
      };
      
      // Import payment service
      const { createPaymentLink } = await import('./services/payment');
      
      const paymentResponse = await createPaymentLink(paymentData);
      
      if (paymentResponse.status === 'ERROR') {
        return res.status(500).json({ 
          message: paymentResponse.error || "Failed to initiate payment",
          success: false
        });
      }
      
      // Store payment info for tracking
      // Here we would typically save the payment to database
      console.log(`Initiated payment for course ${courseId} by user ${user.id}: ${paymentResponse.paymentLink}`);
      
      return res.json({
        success: true,
        requiresPayment: true,
        paymentLink: paymentResponse.paymentLink,
        course,
        message: "Payment link generated successfully"
      });
    } catch (error) {
      console.error('Error in course purchase:', error);
      res.status(500).json({ message: "Failed to process course purchase", success: false });
    }
  });
  
  // Competition registration endpoint with payment handling
  app.post('/api/student/register/competition/:competitionId', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const competitionId = parseInt(req.params.competitionId);
      
      if (user.role !== 'student') {
        return res.status(403).json({ message: "Only students can register for competitions" });
      }
      
      // Find the competition
      const competition = createdCompetitions.find(c => c.id === competitionId);
      
      if (!competition) {
        return res.status(404).json({ message: "Competition not found" });
      }
      
      // If competition is free, register directly
      if (!competition.price || competition.price <= 0) {
        // In real app, we'd update the registration record in database
        return res.json({ 
          success: true, 
          message: "Successfully registered for free competition", 
          requiresPayment: false,
          competition
        });
      }
      
      // For paid competitions, create payment
      const orderId = `IETQ-COMP-${competitionId}-${Date.now()}`;
      
      // Create payment request data
      const paymentData = {
        orderId,
        orderAmount: competition.price || 0,
        orderCurrency: 'INR',
        customerName: user.name || 'Student',
        customerEmail: user.email,
        returnUrl: `${req.protocol}://${req.get('host')}/api/payments/callback?competitionId=${competitionId}&userId=${user.id}`
      };
      
      // Import payment service
      const { createPaymentLink } = await import('./services/payment');
      
      const paymentResponse = await createPaymentLink(paymentData);
      
      if (paymentResponse.status === 'ERROR') {
        return res.status(500).json({ 
          message: paymentResponse.error || "Failed to initiate payment",
          success: false
        });
      }
      
      // Store payment info for tracking
      console.log(`Initiated payment for competition ${competitionId} by user ${user.id}: ${paymentResponse.paymentLink}`);
      
      return res.json({
        success: true,
        requiresPayment: true,
        paymentLink: paymentResponse.paymentLink,
        competition,
        message: "Payment link generated successfully"
      });
    } catch (error) {
      console.error('Error in competition registration:', error);
      res.status(500).json({ message: "Failed to process competition registration", success: false });
    }
  });
  
  // Payment callback endpoint
  app.get('/api/payments/callback', async (req: Request, res: Response) => {
    try {
      const { 
        orderId, 
        orderAmount, 
        referenceId, 
        txStatus, 
        paymentMode, 
        txMsg, 
        txTime, 
        signature,
        courseId,
        competitionId,
        userId
      } = req.query;
      
      // Import payment service
      const { verifyPaymentSignature, updatePaymentStatus } = await import('./services/payment');
      
      // Verify signature if provided
      if (signature && orderId && orderAmount && referenceId && txStatus && txTime) {
        const isValid = verifyPaymentSignature(
          orderId as string,
          orderAmount as string,
          referenceId as string,
          txStatus as string,
          txTime as string,
          signature as string
        );
        
        if (!isValid) {
          console.error('Invalid payment signature');
          return res.redirect('/?paymentStatus=error&message=Invalid%20signature');
        }
      }
      
      // Process successful payment
      if (txStatus === 'SUCCESS') {
        await updatePaymentStatus(
          orderId as string,
          'completed',
          referenceId as string
        );
        
        // Process based on what was purchased
        if (courseId) {
          // Enroll student in course
          console.log(`Enrolling user ${userId} in course ${courseId}`);
          // Update enrollment in database would happen here
          
          return res.redirect(`/student/courses?paymentStatus=success&courseId=${courseId}`);
        }
        
        if (competitionId) {
          // Register student for competition
          console.log(`Registering user ${userId} for competition ${competitionId}`);
          // Update registration in database would happen here
          
          return res.redirect(`/student/competitions?paymentStatus=success&competitionId=${competitionId}`);
        }
        
        return res.redirect('/?paymentStatus=success');
      }
      
      // Handle failed payment
      await updatePaymentStatus(
        orderId as string,
        'failed',
        referenceId as string || ''
      );
      
      return res.redirect(`/?paymentStatus=failed&message=${encodeURIComponent(txMsg as string || 'Payment failed')}`);
    } catch (error) {
      console.error('Error processing payment callback:', error);
      res.redirect('/?paymentStatus=error&message=Internal%20server%20error');
    }
  });
  
  // All editor routes have been removed

  const httpServer = createServer(app);
  
  // Add a special API endpoint to get active users (fallback for non-WebSocket clients)
  app.get('/api/admin/active-users', authMiddleware, (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(Array.from(global.activeUsers.values()));
    } catch (error) {
      console.error('Error fetching active users:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Set up WebSocket server for real-time connections
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Handle WebSocket connections
  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection established');
    
    // Send initial active users list and initialize connection
    const activeUsersList = Array.from(global.activeUsers.values());
    console.log('Sending initial active users list:', activeUsersList);
    
    ws.send(JSON.stringify({
      type: 'activeUsers',
      data: activeUsersList
    }));
    
    // Handle incoming messages
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('WebSocket message received:', data);
        
        // Handle user activity updates
        if (data.type === 'userActivity') {
          const { userId, status } = data;
          
          if (userId) {
            const user = global.registeredUsers.find(u => u.id === userId);
            
            if (user) {
              console.log(`User activity update: ${user.name} (${user.id}) is now ${status || 'online'}`);
              
              // Update or add user to active users
              global.activeUsers.set(userId.toString(), {
                userId,
                name: user.name,
                email: user.email,
                role: user.role,
                lastActivity: new Date(),
                status: status || 'online'
              });
              
              // Broadcast updated active users list to all clients
              const activeUsersList = Array.from(global.activeUsers.values());
              console.log(`Broadcasting active users update to ${wss.clients.size} clients:`, activeUsersList);
              
              wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify({
                    type: 'activeUsers',
                    data: activeUsersList
                  }));
                }
              });
            } else {
              console.log(`User with ID ${userId} not found`);
            }
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      console.log('WebSocket connection closed');
      
      // Try to find and remove the user from active users
      // This is a simple approach - in a real app we would track socket/user mapping
      // or use authentication tokens in the WebSocket connection
    });
  });

  return httpServer;
}
