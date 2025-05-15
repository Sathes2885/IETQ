import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsCard } from '@/components/analytics/AnalyticsCard';
import { 
  SimpleBarChart, 
  SimpleLineChart, 
  SimplePieChart,
  SimpleAreaChart
} from '@/components/analytics/AnalyticsCharts';
import { 
  useTeacherDashboardStats, 
  useStudentPerformanceData, 
  useCourseCompletionData, 
  useEngagementData,
  useTimeSpentData,
  useGradeDistributionData
} from '@/lib/analytics';
import { useLoadingAnimation } from '@/hooks/use-loading-animation';

export default function TeacherAnalytics() {
  const { data: dashboardStats, isLoading: isLoadingStats } = useTeacherDashboardStats();
  const { data: studentPerformance, isLoading: isLoadingPerformance } = useStudentPerformanceData();
  const { data: courseCompletion, isLoading: isLoadingCompletion } = useCourseCompletionData();
  const { data: engagementData, isLoading: isLoadingEngagement } = useEngagementData();
  const { data: timeSpentData, isLoading: isLoadingTimeSpent } = useTimeSpentData();
  const { data: gradeDistribution, isLoading: isLoadingGrades } = useGradeDistributionData();
  
  const isLoading = isLoadingStats || isLoadingPerformance || isLoadingCompletion || 
                   isLoadingEngagement || isLoadingTimeSpent || isLoadingGrades;
  
  const { loadingRef, contentRef } = useLoadingAnimation(isLoading);

  return (
    <>
      <Helmet>
        <title>Analytics Dashboard | IETQ Teacher</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Class Analytics</h1>
        
        <div ref={loadingRef} className={`${isLoading ? 'block' : 'hidden'} animate-pulse`}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="h-32">
                <CardHeader className="h-8 bg-gray-200 dark:bg-gray-800 rounded mb-4"></CardHeader>
                <CardContent>
                  <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="h-80">
                <CardHeader className="h-10 bg-gray-200 dark:bg-gray-800 rounded mb-4"></CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div ref={contentRef} className={`${isLoading ? 'hidden' : 'block'}`}>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              {dashboardStats && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <AnalyticsCard
                    title="Active Students" 
                    value={dashboardStats.activeStudents.toLocaleString()}
                    change={{ value: dashboardStats.studentsTrend, type: dashboardStats.studentsTrend >= 0 ? 'increase' : 'decrease' }}
                    changeText="vs. last month"
                  />
                  
                  <AnalyticsCard
                    title="Completion Rate" 
                    value={`${dashboardStats.completionRate}%`}
                    change={{ value: dashboardStats.completionRateTrend, type: dashboardStats.completionRateTrend >= 0 ? 'increase' : 'decrease' }}
                    changeText="vs. last month"
                  />
                  
                  <AnalyticsCard
                    title="Avg. Quiz Score" 
                    value={`${dashboardStats.quizScore}%`}
                    change={{ value: dashboardStats.quizScoreTrend, type: dashboardStats.quizScoreTrend >= 0 ? 'increase' : 'decrease' }}
                    changeText="vs. last month"
                  />
                  
                  <AnalyticsCard
                    title="Course Enrollments" 
                    value={dashboardStats.courseEnrollment}
                    change={{ value: dashboardStats.enrollmentTrend, type: dashboardStats.enrollmentTrend >= 0 ? 'increase' : 'decrease' }}
                    changeText="new this month"
                  />
                </div>
              )}
              
              <div className="grid gap-4 md:grid-cols-2">
                {engagementData && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SimpleBarChart
                        data={engagementData}
                        xAxisKey="day"
                        bars={[{ dataKey: "activeUsers", name: "Active Students" }]}
                        height={300}
                      />
                    </CardContent>
                  </Card>
                )}
                
                {timeSpentData && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Time Spent by Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <SimplePieChart
                        data={timeSpentData}
                        dataKey="value"
                        nameKey="name"
                        height={300}
                        outerRadius={100}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-4">
              {studentPerformance && (
                <Card>
                  <CardHeader>
                    <CardTitle>Quiz Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleLineChart
                      data={studentPerformance}
                      xAxisKey="name"
                      lines={[
                        { dataKey: "average", name: "Class Average", stroke: "#8884d8" },
                        { dataKey: "highest", name: "Highest Score", stroke: "#00C49F" },
                        { dataKey: "lowest", name: "Lowest Score", stroke: "#FF8042" }
                      ]}
                      height={400}
                    />
                  </CardContent>
                </Card>
              )}
              
              {gradeDistribution && (
                <Card>
                  <CardHeader>
                    <CardTitle>Grade Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleBarChart
                      data={gradeDistribution}
                      xAxisKey="name"
                      bars={[{ dataKey: "students", name: "Students" }]}
                      height={300}
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="engagement" className="space-y-4">
              {engagementData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Active Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleAreaChart
                      data={engagementData}
                      xAxisKey="day"
                      areas={[{ dataKey: "activeUsers", name: "Active Students" }]}
                      height={400}
                    />
                  </CardContent>
                </Card>
              )}
              
              {timeSpentData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Time Distribution by Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleBarChart
                      data={timeSpentData}
                      xAxisKey="name"
                      bars={[{ dataKey: "value", name: "Time (%)" }]}
                      height={400}
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="courses" className="space-y-4">
              {courseCompletion && (
                <Card>
                  <CardHeader>
                    <CardTitle>Course Completion Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleBarChart
                      data={courseCompletion}
                      xAxisKey="name"
                      bars={[
                        { dataKey: "completed", name: "Completed", fill: "#00C49F" },
                        { dataKey: "inProgress", name: "In Progress", fill: "#FFBB28" },
                        { dataKey: "notStarted", name: "Not Started", fill: "#FF8042" }
                      ]}
                      height={400}
                      layout="vertical"
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}