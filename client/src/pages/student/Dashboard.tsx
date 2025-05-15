import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Trophy, 
  BookOpen, 
  Calendar, 
  Sparkles, 
  Award, 
  ArrowRight,
  UserPlus
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import StatsCard from '@/components/dashboard/StatsCard';
import { CourseCard, CourseCardSkeleton } from '@/components/dashboard/CourseCard';
import { CompetitionCard, CompetitionCardSkeleton } from '@/components/dashboard/CompetitionCard';
import { UpcomingItem, UpcomingItemSkeleton } from '@/components/dashboard/UpcomingItem';
import { queryClient } from '@/lib/queryClient';
import { getCurrentUser } from '@/lib/auth';
import { RegistrationSection } from '@/components/sections/RegistrationSection';
import type { DashboardStats, CourseWithProgress, UpcomingQuiz } from '@shared/types';
import type { Competition, User } from '@shared/schema';

// Get user from route props
export default function StudentDashboard({ user }: { user: any }) {
  // Make sure we have valid user data with proper typescript types
  const dashboardUser = user ? {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as 'admin' | 'teacher' | 'student',
    grade: user.grade === null ? undefined : user.grade
  } : undefined;
  
  // Log the user data to verify we have it
  console.log("StudentDashboard received user:", user);
  
  // Dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/student/dashboard/stats'],
  });

  // Recent courses with progress
  const { data: courses, isLoading: coursesLoading } = useQuery<any[]>({
    queryKey: ['/api/student/dashboard/courses?limit=3'],
  });

  // Upcoming competitions
  const { data: competitions, isLoading: competitionsLoading } = useQuery<any[]>({
    queryKey: ['/api/student/dashboard/competitions?limit=2'],
  });

  // Upcoming quizzes and events
  const { data: upcoming, isLoading: upcomingLoading } = useQuery<any[]>({
    queryKey: ['/api/student/dashboard/upcoming?limit=4'],
  });

  return (
    <DashboardLayout user={dashboardUser}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display tracking-tight mb-1">
          Welcome back, {dashboardUser?.name?.split(' ')[0] || 'Student'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your learning journey today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Active Courses"
          value={statsLoading ? "..." : stats?.activeCourses || 0}
          icon={<BookOpen className="h-5 w-5" />}
          description="Courses in progress"
          variant="blue"
          isLoading={statsLoading}
        />
        <StatsCard
          title="Competitions"
          value={statsLoading ? "..." : stats?.competitions || 0}
          icon={<Trophy className="h-5 w-5" />}
          description="Available to participate"
          variant="purple"
          isLoading={statsLoading}
        />
        <StatsCard
          title="Upcoming Quizzes"
          value={statsLoading ? "..." : stats?.upcomingQuizzes || 0}
          icon={<Sparkles className="h-5 w-5" />}
          description="Scheduled for this week"
          variant="amber"
          isLoading={statsLoading}
        />
        <StatsCard
          title="Certificates"
          value={statsLoading ? "..." : stats?.certificatesEarned || 0}
          icon={<Award className="h-5 w-5" />}
          description="Certificates earned"
          variant="green"
          isLoading={statsLoading}
        />
      </div>

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Courses Section */}
          <DashboardCard
            title="My Courses"
            icon={<BookOpen className="h-5 w-5" />}
            footer={
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" asChild className="gap-1">
                  <Link href="/student/courses">
                    View all courses <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            }
            contentClassName="p-4 space-y-4"
          >
            {coursesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CourseCardSkeleton />
                <CourseCardSkeleton />
              </div>
            ) : courses && courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.map((course) => (
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
                    isCompleted={course.isCompleted}
                    lastAccessed={course.lastAccessed ? new Date(course.lastAccessed) : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't enrolled in any courses yet</p>
                <Button asChild>
                  <Link href="/student/courses/explore">
                    Explore Courses
                  </Link>
                </Button>
              </div>
            )}
          </DashboardCard>

          {/* Tabs for Competitions and Events */}
          <Tabs defaultValue="competitions" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-display tracking-tight">Opportunities</h2>
              <TabsList>
                <TabsTrigger value="competitions" className="gap-1">
                  <Trophy className="h-4 w-4" /> Competitions
                </TabsTrigger>
                <TabsTrigger value="events" className="gap-1">
                  <Calendar className="h-4 w-4" /> Schedule
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="competitions" className="mt-0">
              <DashboardCard
                footer={
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" asChild className="gap-1">
                      <Link href="/student/competitions">
                        View all competitions <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                }
                contentClassName="p-4 space-y-4"
              >
                {competitionsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CompetitionCardSkeleton />
                    <CompetitionCardSkeleton />
                  </div>
                ) : competitions && competitions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {competitions.map((competition) => (
                      <CompetitionCard
                        key={competition.id}
                        id={competition.id}
                        title={competition.title}
                        description={competition.description}
                        category={competition.category}
                        thumbnailUrl={competition.thumbnailUrl}
                        startDate={new Date(competition.startDate)}
                        endDate={new Date(competition.endDate)}
                        participants={competition.participantCount}
                        status={competition.status as 'upcoming' | 'ongoing' | 'ended' | 'open'}
                        hasRegistered={competition.isRegistered}
                        hasSubmitted={competition.hasSubmitted}
                        isWinner={competition.isWinner}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No active competitions at the moment</p>
                    <Button asChild>
                      <Link href="/student/competitions">
                        View all competitions
                      </Link>
                    </Button>
                  </div>
                )}
              </DashboardCard>
            </TabsContent>

            <TabsContent value="events" className="mt-0">
              <DashboardCard
                footer={
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" asChild className="gap-1">
                      <Link href="/student/schedule">
                        View full schedule <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                }
                contentClassName="p-4 space-y-3"
              >
                {upcomingLoading ? (
                  <div className="space-y-3">
                    <UpcomingItemSkeleton />
                    <UpcomingItemSkeleton />
                    <UpcomingItemSkeleton />
                  </div>
                ) : upcoming && upcoming.length > 0 ? (
                  <div className="space-y-3">
                    {upcoming.map((item) => (
                      <UpcomingItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        type={item.type as 'quiz' | 'competition' | 'class' | 'event'}
                        subject={item.subject}
                        date={new Date(item.scheduledStartTime)}
                        duration={`${item.duration} minutes`}
                        isImportant={item.isImportant}
                        isLive={item.isLive}
                        isPastDue={false}
                        minutesRemaining={item.minutesUntilStart}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No upcoming events scheduled</p>
                    <Button asChild>
                      <Link href="/student/schedule">
                        View full schedule
                      </Link>
                    </Button>
                  </div>
                )}
              </DashboardCard>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column (1/3 width on large screens) */}
        <div className="space-y-6">
          {/* Registration Card */}
          <DashboardCard
            id="registration"
            title="Register a Friend"
            icon={<UserPlus className="h-5 w-5" />}
            contentClassName="p-4"
          >
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Invite your friends to join IETQ and unlock new opportunities together!
              </p>
              <RegistrationSection inDashboard={true} />
            </div>
          </DashboardCard>
          
          {/* Upcoming Quizzes */}
          <DashboardCard
            title="Upcoming Quizzes"
            icon={<Sparkles className="h-5 w-5" />}
            footer={
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" asChild className="gap-1">
                  <Link href="/student/quizzes">
                    View all quizzes <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            }
            contentClassName="p-4 space-y-3"
          >
            {upcomingLoading ? (
              <div className="space-y-3">
                <UpcomingItemSkeleton />
                <UpcomingItemSkeleton />
              </div>
            ) : upcoming && upcoming.filter(item => item.type === 'quiz').length > 0 ? (
              <div className="space-y-3">
                {upcoming
                  .filter(item => item.type === 'quiz')
                  .slice(0, 3)
                  .map((quiz) => (
                    <UpcomingItem
                      key={quiz.id}
                      id={quiz.id}
                      title={quiz.title}
                      type="quiz"
                      subject={quiz.subject}
                      date={new Date(quiz.scheduledStartTime)}
                      duration={`${quiz.duration} minutes`}
                      isImportant={quiz.isImportant}
                      isLive={quiz.isLive}
                      minutesRemaining={quiz.minutesUntilStart}
                    />
                  ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No upcoming quizzes scheduled</p>
              </div>
            )}
          </DashboardCard>

          {/* Latest Achievements & Certificates */}
          <DashboardCard
            title="Achievements"
            icon={<Award className="h-5 w-5" />}
            footer={
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" asChild className="gap-1">
                  <Link href="/student/certificates">
                    View all certificates <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            }
            contentClassName="p-4"
          >
            {statsLoading ? (
              <div className="py-6 space-y-3">
                <div className="h-16 w-16 mx-auto bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
                <div className="h-6 w-32 mx-auto bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="h-4 w-56 mx-auto bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              </div>
            ) : stats && stats.certificatesEarned > 0 ? (
              <div className="text-center py-6">
                <Award className="h-16 w-16 mx-auto text-indigo-500 mb-3" />
                <h3 className="text-lg font-bold mb-1">Congratulations!</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  You've earned {stats.certificatesEarned} certificate{stats.certificatesEarned !== 1 ? 's' : ''}.
                  Keep up the great work!
                </p>
                <Button variant="outline" asChild>
                  <Link href="/student/certificates">View Certificates</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <Trophy className="h-16 w-16 mx-auto text-amber-500 mb-3" />
                <h3 className="text-lg font-bold mb-1">Keep Learning!</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  Complete courses and competitions to earn certificates and achievements
                </p>
                <Button variant="outline" asChild>
                  <Link href="/student/courses">Explore Courses</Link>
                </Button>
              </div>
            )}
          </DashboardCard>
        </div>
      </div>
    </DashboardLayout>
  );
}