import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { BookOpen, Trophy, HelpCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { initDashboardAnimations } from '@/lib/animations';
import { Link } from 'wouter';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { formatDate } from '@/lib/utils';
import StatsCard from '@/components/dashboard/StatsCard';
import DashboardLayout from '@/components/layout/DashboardLayout';
import type { User } from '@shared/schema';

interface TeacherDashboardProps {
  user: User;
}

export default function TeacherDashboard({ user }: TeacherDashboardProps) {
  useEffect(() => {
    // Initialize GSAP animations
    initDashboardAnimations();
  }, []);

  // Format the user data for the DashboardLayout component
  const dashboardUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as 'admin' | 'teacher' | 'student',
    grade: user.grade === null ? undefined : user.grade
  };

  // Fetch teacher dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['/api/teacher/dashboard/stats'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/teacher/dashboard/stats');
      return await res.json();
    }
  });

  // Fetch recent activities
  const { data: recentActivities } = useQuery({
    queryKey: ['/api/teacher/dashboard/recent-activities'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/teacher/dashboard/recent-activities');
      return await res.json();
    }
  });

  // Fetch enrollment stats
  const { data: enrollmentStats } = useQuery({
    queryKey: ['/api/teacher/dashboard/enrollment-stats'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/teacher/dashboard/enrollment-stats');
      return await res.json();
    }
  });

  // Fetch content performance stats
  const { data: contentPerformance } = useQuery({
    queryKey: ['/api/teacher/dashboard/content-performance'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/teacher/dashboard/content-performance');
      return await res.json();
    }
  });

  return (
    <DashboardLayout user={dashboardUser}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Teacher Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your courses, competitions, and quizzes
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link href="/teacher/create">
              <Button>
                Create New Content
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard 
            icon={<BookOpen className="h-6 w-6 text-primary-600" />} 
            iconClassName="bg-primary-100"
            title="Total Courses" 
            value={stats?.totalCourses || 0} 
          />
          <StatsCard 
            icon={<Trophy className="h-6 w-6 text-secondary-600" />} 
            iconClassName="bg-secondary-100"
            title="Total Competitions" 
            value={stats?.totalCompetitions || 0} 
          />
          <StatsCard 
            icon={<HelpCircle className="h-6 w-6 text-amber-600" />} 
            iconClassName="bg-amber-100"
            title="Total Quizzes" 
            value={stats?.totalQuizzes || 0} 
          />
          <StatsCard 
            icon={<Users className="h-6 w-6 text-purple-600" />} 
            iconClassName="bg-purple-100"
            title="Total Students" 
            value={stats?.totalStudents || 0} 
          />
        </div>

        {/* Enrollment Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Content Enrollment</h3>
            {enrollmentStats ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={enrollmentStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="courses" name="Courses" fill="#4F46E5" />
                  <Bar dataKey="competitions" name="Competitions" fill="#10B981" />
                  <Bar dataKey="quizzes" name="Quizzes" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-gray-500">Loading enrollment data...</p>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Content Performance</h3>
            {contentPerformance ? (
              <div className="space-y-4">
                {contentPerformance.map((item: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-32 text-sm text-gray-500">{item.type}</div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            item.type === 'Courses' ? 'bg-primary' : 
                            item.type === 'Competitions' ? 'bg-secondary' : 'bg-amber-500'
                          }`} 
                          style={{ width: `${item.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 text-right text-sm font-medium">{item.completionRate}%</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-gray-500">Loading performance data...</p>
              </div>
            )}
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
            <Button variant="link" className="text-sm">View All</Button>
          </div>
          <Card>
            {recentActivities && recentActivities.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activity</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map((activity: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell className="font-medium">{activity.contentTitle}</TableCell>
                      <TableCell>
                        <Badge className={
                          activity.contentType === 'course' ? 'bg-primary-100 text-primary-800' :
                          activity.contentType === 'competition' ? 'bg-secondary-100 text-secondary-800' :
                          'bg-amber-100 text-amber-800'
                        }>
                          {activity.contentType.charAt(0).toUpperCase() + activity.contentType.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(activity.date)}</TableCell>
                      <TableCell>
                        <Badge className={
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                          activity.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {activity.status.charAt(0).toUpperCase() + activity.status.slice(1).replace('_', ' ')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No recent activities</p>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/teacher/courses">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-primary-100 p-3">
                    <BookOpen className="h-6 w-6 text-primary-600" />
                  </div>
                  <h4 className="mt-4 text-base font-medium text-gray-900">Manage Courses</h4>
                  <p className="mt-1 text-sm text-gray-500">Create and update your courses</p>
                </div>
              </Card>
            </Link>
            
            <Link href="/teacher/competitions">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-secondary-100 p-3">
                    <Trophy className="h-6 w-6 text-secondary-600" />
                  </div>
                  <h4 className="mt-4 text-base font-medium text-gray-900">Manage Competitions</h4>
                  <p className="mt-1 text-sm text-gray-500">Create and update competitions</p>
                </div>
              </Card>
            </Link>
            
            <Link href="/teacher/quizzes">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-amber-100 p-3">
                    <HelpCircle className="h-6 w-6 text-amber-600" />
                  </div>
                  <h4 className="mt-4 text-base font-medium text-gray-900">Manage Quizzes</h4>
                  <p className="mt-1 text-sm text-gray-500">Create and update quizzes</p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}