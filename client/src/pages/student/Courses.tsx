import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseCard, CourseCardSkeleton } from '@/components/dashboard/CourseCard';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { queryClient } from '@/lib/queryClient';
import { 
  Search, 
  Plus, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Filter, 
  SlidersHorizontal,
  GraduationCap,
} from 'lucide-react';
import type { CourseWithProgress } from '@shared/types';

export default function CoursesPage({ user }: { user: any }) {
  // Log user data to verify
  console.log("CoursesPage received user:", user);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Fetch enrolled courses
  const { data: enrolledCourses, isLoading: enrolledLoading } = useQuery<any[]>({
    queryKey: ['/api/student/courses/enrolled'],
  });

  // Fetch completed courses
  const { data: completedCourses, isLoading: completedLoading } = useQuery<any[]>({
    queryKey: ['/api/student/courses/completed'],
  });

  // Fetch recommended courses
  const { data: recommendedCourses, isLoading: recommendedLoading } = useQuery<any[]>({
    queryKey: ['/api/student/courses/recommended?limit=4'],
  });

  // Filter and sort courses based on current selections
  const getFilteredCourses = (courses: CourseWithProgress[] | undefined) => {
    if (!courses) return [];

    // Apply search filter
    let filtered = courses.filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(course => course.subject.toLowerCase() === subjectFilter.toLowerCase());
    }

    // Apply status filter for enrolled courses
    if (statusFilter === 'in-progress') {
      filtered = filtered.filter(course => course.progress > 0 && course.progress < 100);
    } else if (statusFilter === 'not-started') {
      filtered = filtered.filter(course => course.progress === 0);
    }

    // Sort courses
    switch (sortBy) {
      case 'alpha':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'progress':
        filtered.sort((a, b) => b.progress - a.progress);
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => {
          if (a.lastAccessed && b.lastAccessed) {
            return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime();
          }
          if (a.lastAccessed) return -1;
          if (b.lastAccessed) return 1;
          return 0;
        });
    }

    return filtered;
  };

  // Apply filters to the appropriate course list based on the active tab
  const filteredEnrolled = getFilteredCourses(enrolledCourses);
  const filteredCompleted = getFilteredCourses(completedCourses);

  // Format user data to match DashboardLayout props interface
  const dashboardUser = user ? {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as 'admin' | 'teacher' | 'student',
    grade: user.grade === null ? undefined : user.grade
  } : undefined;

  return (
    <DashboardLayout user={dashboardUser}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight mb-1">My Courses</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track your learning journey
          </p>
        </div>
        <Button
          className="gap-1" 
          onClick={() => {
            // Scroll to recommended courses section
            document.getElementById('recommended-courses-section')?.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }}
        >
          <Plus className="h-4 w-4" />
          Find New Courses
        </Button>
      </div>

      {/* Recommended Courses Section */}
      <DashboardCard
        id="recommended-courses-section"
        title="Recommended For You"
        icon={<GraduationCap className="h-5 w-5" />}
        description="Based on your learning history and interests"
        className="mb-8"
        contentClassName="p-4"
      >
        {recommendedLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        ) : recommendedCourses && recommendedCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedCourses.map(course => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                subject={course.subject}
                description={course.description}
                thumbnailUrl={course.thumbnailUrl}
                progress={0}
                duration={course.duration}
                lessons={course.totalLessons}
                instructor={course.instructorName}
                isNew={course.isNew}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No recommendations available yet. Complete more courses to get personalized recommendations.
            </p>
          </div>
        )}
      </DashboardCard>

      {/* Tabs for My Courses */}
      <Tabs defaultValue="enrolled" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="enrolled" className="gap-1">
              <BookOpen className="h-4 w-4" /> Enrolled
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-1">
              <CheckCircle className="h-4 w-4" /> Completed
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search courses..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="computer">Computer</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Accessed</SelectItem>
                  <SelectItem value="alpha">Alphabetical</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Status filter for enrolled courses tab */}
        <TabsContent value="enrolled" className="mt-0">
          <div className="mb-4 flex justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm">Status:</span>
              <div className="flex gap-2">
                <Button 
                  variant={statusFilter === 'all' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={statusFilter === 'in-progress' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter('in-progress')}
                >
                  In Progress
                </Button>
                <Button 
                  variant={statusFilter === 'not-started' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter('not-started')}
                >
                  Not Started
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredEnrolled.length} course{filteredEnrolled.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {enrolledLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <CourseCardSkeleton />
              <CourseCardSkeleton />
              <CourseCardSkeleton />
            </div>
          ) : filteredEnrolled.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEnrolled.map(course => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  subject={course.subject}
                  description={course.description}
                  thumbnailUrl={course.thumbnailUrl}
                  progress={course.progress}
                  duration={course.duration}
                  lessons={course.totalLessons}
                  instructor={course.instructorName}
                  lastAccessed={course.lastAccessed ? new Date(course.lastAccessed) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center bg-gray-50 dark:bg-gray-900 rounded-lg p-8">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">No courses found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                {searchTerm || subjectFilter !== 'all' || statusFilter !== 'all' 
                  ? "Try adjusting your filters to find what you're looking for."
                  : "You haven't enrolled in any courses yet. Explore our catalog to find courses that interest you."}
              </p>
              <Button onClick={() => {
                document.getElementById('recommended-courses-section')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }}>Find New Courses</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          <div className="mb-4 flex justify-end">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredCompleted.length} course{filteredCompleted.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {completedLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <CourseCardSkeleton />
              <CourseCardSkeleton />
              <CourseCardSkeleton />
            </div>
          ) : filteredCompleted.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompleted.map(course => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  subject={course.subject}
                  description={course.description}
                  thumbnailUrl={course.thumbnailUrl}
                  progress={100}
                  duration={course.duration}
                  lessons={course.totalLessons}
                  instructor={course.instructorName}
                  isCompleted={true}
                  lastAccessed={course.lastAccessed ? new Date(course.lastAccessed) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center bg-gray-50 dark:bg-gray-900 rounded-lg p-8">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">No completed courses yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                {searchTerm || subjectFilter !== 'all' 
                  ? "Try adjusting your filters to find what you're looking for."
                  : "You haven't completed any courses yet. Keep learning and your completed courses will appear here."}
              </p>
              <Button onClick={() => {
                document.getElementById('recommended-courses-section')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }}>Browse Courses</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}