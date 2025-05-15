import React, { useEffect, useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { getCurrentUser } from "@/lib/auth";
import { RewardProvider } from "@/components/rewards/RewardManager";
import { initBuilder, setUserRole } from "@/lib/builder";
import { initWebSocket, closeWebSocket } from "@/lib/websocket";

// Page imports
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Courses from "@/pages/Courses";
import Competitions from "@/pages/Competitions";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Logout from "@/pages/Logout";
import Profile from "@/pages/Profile";

// Student pages
import StudentDashboard from "@/pages/student/Dashboard";
import StudentCourses from "@/pages/student/Courses";
import StudentCompetitions from "@/pages/student/Competitions";
import StudentQuizzes from "@/pages/student/Quizzes";
import StudentSchedule from "@/pages/student/Schedule";
import StudentSettings from "@/pages/student/Settings";
import StudentCertificates from "@/pages/student/Certificates";
import RewardsDemo from "@/pages/student/RewardsDemo";

// Teacher pages
import TeacherDashboard from "@/pages/teacher/Dashboard";
import TeacherManageCourses from "@/pages/teacher/ManageCourses";
import TeacherManageCompetitions from "@/pages/teacher/ManageCompetitions";
import TeacherManageQuizzes from "@/pages/teacher/ManageQuizzes";
import TeacherAnalytics from "@/pages/teacher/Analytics";
import TeacherCreate from "@/pages/teacher/Create";
import CreateCourse from "@/pages/teacher/CreateCourse";
import CourseDetail from "@/pages/teacher/CourseDetail";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminManageUsers from "@/pages/admin/ManageUsers";
import AdminManageContent from "@/pages/admin/ManageContent";
import AdminManageCertificates from "@/pages/admin/ManageCertificates";
import AdminAnalytics from "@/pages/admin/Analytics";
import AdminContentManagement from "@/pages/admin/ContentManagement";
import AdminContentEditor from "@/pages/admin/ContentEditor";

// Protected route wrapper
const ProtectedRoute = ({ component: Component, role, ...rest }: { component: React.ComponentType<any>, role?: string, [key: string]: any }) => {
  const { data: authData, isLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: getCurrentUser,
  });

  const user = authData?.user;

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    // Redirect to login page
    console.log('No user found, redirecting to login');
    window.location.href = '/login';
    return null;
  }
  
  // Store user data in localStorage for WebSocket and other uses
  localStorage.setItem('userData', JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }));

  if (role && user.role !== role) {
    // Redirect to appropriate dashboard
    console.log(`User role ${user.role} doesn't match required role ${role}, redirecting`);
    
    // For existing sessions, ensure we use the correct dashboard
    const dashboardUrl = `/${user.role}/dashboard`;
    console.log(`Redirecting to: ${dashboardUrl}`);
    
    window.location.href = dashboardUrl;
    return null;
  }

  return <Component {...rest} user={user} />;
};

function Router() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/courses" component={Courses} />
      <Route path="/competitions" component={Competitions} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/logout" component={Logout} />
      <Route path="/profile">
        {(params) => <ProtectedRoute component={Profile} params={params} />}
      </Route>
      <Route path="/rewards-demo" component={RewardsDemo} />
      
      {/* Student Routes */}
      <Route path="/student">
        {() => {
          // Redirect /student to /student/dashboard
          window.location.replace('/student/dashboard');
          return null;
        }}
      </Route>
      <Route path="/student/dashboard">
        {(params) => <ProtectedRoute component={StudentDashboard} role="student" params={params} />}
      </Route>
      <Route path="/student/courses">
        {(params) => <ProtectedRoute component={StudentCourses} role="student" params={params} />}
      </Route>
      <Route path="/student/competitions">
        {(params) => <ProtectedRoute component={StudentCompetitions} role="student" params={params} />}
      </Route>
      <Route path="/student/quizzes">
        {(params) => <ProtectedRoute component={StudentQuizzes} role="student" params={params} />}
      </Route>
      <Route path="/student/schedule">
        {(params) => <ProtectedRoute component={StudentSchedule} role="student" params={params} />}
      </Route>
      <Route path="/student/settings">
        {(params) => <ProtectedRoute component={StudentSettings} role="student" params={params} />}
      </Route>
      <Route path="/student/certificates">
        {(params) => <ProtectedRoute component={StudentCertificates} role="student" params={params} />}
      </Route>
      <Route path="/student/rewards-demo">
        {(params) => <ProtectedRoute component={RewardsDemo} role="student" params={params} />}
      </Route>

      {/* Teacher Routes */}
      <Route path="/teacher">
        {() => {
          // Redirect /teacher to /teacher/dashboard
          window.location.replace('/teacher/dashboard');
          return null;
        }}
      </Route>
      <Route path="/teacher/dashboard">
        {(params) => <ProtectedRoute component={TeacherDashboard} role="teacher" params={params} />}
      </Route>
      <Route path="/teacher/courses">
        {(params) => <ProtectedRoute component={TeacherManageCourses} role="teacher" params={params} />}
      </Route>
      <Route path="/teacher/courses/new">
        {(params) => <ProtectedRoute component={CreateCourse} role="teacher" params={params} />}
      </Route>
      <Route path="/teacher/courses/:id">
        {(params) => <ProtectedRoute component={CourseDetail} role="teacher" params={params} />}
      </Route>
      <Route path="/teacher/competitions">
        {(params) => <ProtectedRoute component={TeacherManageCompetitions} role="teacher" params={params} />}
      </Route>
      <Route path="/teacher/quizzes">
        {(params) => <ProtectedRoute component={TeacherManageQuizzes} role="teacher" params={params} />}
      </Route>
      <Route path="/teacher/analytics">
        {(params) => <ProtectedRoute component={TeacherAnalytics} role="teacher" params={params} />}
      </Route>
      <Route path="/teacher/create">
        {(params) => <ProtectedRoute component={TeacherCreate} role="teacher" params={params} />}
      </Route>

      {/* Admin Routes */}
      <Route path="/admin">
        {() => {
          // Redirect /admin to /admin/dashboard
          window.location.replace('/admin/dashboard');
          return null;
        }}
      </Route>
      <Route path="/admin/dashboard">
        {(params) => <ProtectedRoute component={AdminDashboard} role="admin" params={params} />}
      </Route>
      <Route path="/admin/users">
        {(params) => <ProtectedRoute component={AdminManageUsers} role="admin" params={params} />}
      </Route>
      <Route path="/admin/content">
        {(params) => <ProtectedRoute component={AdminManageContent} role="admin" params={params} />}
      </Route>
      <Route path="/admin/certificates">
        {(params) => <ProtectedRoute component={AdminManageCertificates} role="admin" params={params} />}
      </Route>
      <Route path="/admin/analytics">
        {(params) => <ProtectedRoute component={AdminAnalytics} role="admin" params={params} />}
      </Route>
      <Route path="/admin/content-management">
        {(params) => <ProtectedRoute component={AdminContentManagement} role="admin" params={params} />}
      </Route>
      <Route path="/admin/content-editor">
        {(params) => {
          console.log("Content editor route matched", params);
          return <ProtectedRoute component={AdminContentEditor} role="admin" params={params} />;
        }}
      </Route>
      
      {/* Duplicate the route with a different path to increase chances of matching */}
      <Route path="/content-editor">
        {(params) => {
          console.log("Alternative content editor route matched", params);
          return <ProtectedRoute component={AdminContentEditor} role="admin" params={params} />;
        }}
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Initialize Builder.io
initBuilder();

function App() {
  // Initialize Builder.io and update user role
  useEffect(() => {
    // Update user role for targeting if available
    const userRole = localStorage.getItem('userRole');
    if (userRole && (userRole === 'student' || userRole === 'teacher' || userRole === 'admin')) {
      setUserRole(userRole as 'student' | 'teacher' | 'admin');
    }
    
    // Initialize WebSocket connection
    initWebSocket();
    
    // Clean up WebSocket connection on unmount
    return () => {
      closeWebSocket();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RewardProvider>
        <Router />
        <Toaster />
      </RewardProvider>
    </QueryClientProvider>
  );
}

export default App;
