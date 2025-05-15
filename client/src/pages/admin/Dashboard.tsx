import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Award, BookOpen, User, Users } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface StatsCardProps {
  title: string;
  value: number | string;
  description: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  loading: boolean;
}

const StatsCard = ({ title, value, description, trend, trendValue, loading }: StatsCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        {title}
      </CardTitle>
      <div className="h-4 w-4 rounded-full bg-gray-100"></div>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-9 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-40 bg-gray-200 rounded mt-1"></div>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">
            {description}
            {trend && trendValue && (
              <span className={`ml-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
            )}
          </p>
        </>
      )}
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const { toast } = useToast();

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/auth/me');
      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }
      return res.json();
    },
  });

  const user = userData || {
    id: 0,
    name: '',
    email: '',
    role: 'admin',
    grade: null,
  };

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/admin/dashboard'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/dashboard');
      if (!res.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return res.json();
    },
  });

  useEffect(() => {
    if (stats) {
      console.log('Admin dashboard stats:', stats);
    }
  }, [stats]);

  // Helper function to generate enrollment data
  const generateEnrollmentData = () => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return months.map((month, index) => ({
      name: month,
      students: Math.floor(Math.random() * 100) + 20,
      enrollments: Math.floor(Math.random() * 150) + 50
    }));
  };

  const enrollmentData = generateEnrollmentData();

  // Get content distribution data from API
  const { data: contentDistribution, isLoading: isLoadingContent } = useQuery({
    queryKey: ['/api/admin/dashboard/content-distribution'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/dashboard/content-distribution');
      return await res.json();
    }
  });

  // Colors for pie chart
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  // Format the user data for the DashboardLayout component
  const dashboardUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as 'admin' | 'teacher' | 'student',
    grade: user.grade === null ? undefined : user.grade
  };

  return (
    <DashboardLayout user={dashboardUser}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Admin Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Overview of the platform statistics and management
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard 
            title="Total Users" 
            value={stats?.totalUsers || 0}
            description="Active users on the platform"
            trend="up"
            trendValue="12%"
            loading={isLoadingStats}
          />
          <StatsCard 
            title="Pending Approvals" 
            value={stats?.pendingApprovals || 0}
            description="Teachers waiting for approval"
            loading={isLoadingStats}
          />
          <StatsCard 
            title="Active Courses" 
            value={stats?.activeCourses || 0}
            description="Published courses on platform"
            trend="up"
            trendValue="8%"
            loading={isLoadingStats}
          />
          <StatsCard 
            title="Revenue" 
            value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
            description="Total platform revenue"
            trend="up"
            trendValue="24%"
            loading={isLoadingStats}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Enrollment Trends</CardTitle>
              <CardDescription>Monthly student enrollments for courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={enrollmentData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="students"
                      stroke="#4F46E5"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="enrollments" stroke="#10B981" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Distribution</CardTitle>
              <CardDescription>Types of content on platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                {isLoadingContent ? (
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={contentDistribution || [
                          { name: 'Courses', value: 35 },
                          { name: 'Quizzes', value: 45 },
                          { name: 'Competitions', value: 20 },
                          { name: 'Others', value: 10 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {(contentDistribution || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/users">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-indigo-100 p-3">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h4 className="mt-4 text-base font-medium text-gray-900">Manage Users</h4>
                  <p className="mt-1 text-sm text-gray-500">Add, edit, or remove user access</p>
                </div>
              </Card>
            </Link>
            
            <Link href="/admin/approvals">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="mt-4 text-base font-medium text-gray-900">Teacher Approvals</h4>
                  <p className="mt-1 text-sm text-gray-500">Manage pending teacher approvals</p>
                </div>
              </Card>
            </Link>
            
            <Link href="/admin/content">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-blue-100 p-3">
                    <BookOpen className="h-6 w-6 text-secondary-600" />
                  </div>
                  <h4 className="mt-4 text-base font-medium text-gray-900">Manage Content</h4>
                  <p className="mt-1 text-sm text-gray-500">Manage courses, competitions, and quizzes</p>
                </div>
              </Card>
            </Link>
            
            <Link href="/admin/certificates">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-amber-100 p-3">
                    <Award className="h-6 w-6 text-amber-600" />
                  </div>
                  <h4 className="mt-4 text-base font-medium text-gray-900">Issue Certificates</h4>
                  <p className="mt-1 text-sm text-gray-500">Create and issue certificates to students</p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}