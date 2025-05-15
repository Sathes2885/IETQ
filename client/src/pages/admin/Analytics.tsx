import { useEffect } from 'react';
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
  useAdminDashboardStats, 
  useEnrollmentTrendData, 
  useCompetitionData, 
  useCategoryBreakdown 
} from '@/lib/analytics';
import { useLoadingAnimation } from '@/hooks/use-loading-animation';

export default function AdminAnalytics() {
  const { data: dashboardStats, isLoading: isLoadingStats } = useAdminDashboardStats();
  const { data: enrollmentTrend, isLoading: isLoadingEnrollment } = useEnrollmentTrendData();
  const { data: competitionData, isLoading: isLoadingCompetition } = useCompetitionData();
  const { data: categoryData, isLoading: isLoadingCategory } = useCategoryBreakdown();
  
  const isLoading = isLoadingStats || isLoadingEnrollment || isLoadingCompetition || isLoadingCategory;
  
  const { loadingRef, contentRef } = useLoadingAnimation(isLoading);

  return (
    <>
      <Helmet>
        <title>Analytics Dashboard | IETQ Admin</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        
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
              <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
              <TabsTrigger value="competitions">Competitions</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              {dashboardStats && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <AnalyticsCard
                    title="Total Students" 
                    value={dashboardStats.totalStudents.toLocaleString()}
                    change={{ value: dashboardStats.studentsTrend, type: dashboardStats.studentsTrend >= 0 ? 'increase' : 'decrease' }}
                    changeText="vs. last month"
                  />
                  
                  <AnalyticsCard
                    title="Active Competitions" 
                    value={dashboardStats.activeCompetitions}
                    change={{ value: dashboardStats.competitionsTrend, type: dashboardStats.competitionsTrend >= 0 ? 'increase' : 'decrease' }}
                    changeText="vs. last month"
                  />
                  
                  <AnalyticsCard
                    title="Completion Rate" 
                    value={`${dashboardStats.completionRate}%`}
                    change={{ value: dashboardStats.completionRateTrend, type: dashboardStats.completionRateTrend >= 0 ? 'increase' : 'decrease' }}
                    changeText="vs. last month"
                  />
                  
                  <AnalyticsCard
                    title="Total Revenue" 
                    value={dashboardStats.revenue}
                    change={{ value: dashboardStats.revenueTrend, type: dashboardStats.revenueTrend >= 0 ? 'increase' : 'decrease' }}
                    changeText="vs. last month"
                  />
                </div>
              )}
              
              <div className="grid gap-4 md:grid-cols-2">
                {enrollmentTrend && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Student Enrollment Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SimpleLineChart
                        data={enrollmentTrend}
                        xAxisKey="month"
                        lines={[{ dataKey: "count", name: "New Students" }]}
                        height={300}
                      />
                    </CardContent>
                  </Card>
                )}
                
                {categoryData && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Enrollment by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <SimplePieChart
                        data={categoryData}
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
            
            <TabsContent value="enrollments" className="space-y-4">
              {enrollmentTrend && (
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Enrollment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleBarChart
                      data={enrollmentTrend}
                      xAxisKey="month"
                      bars={[{ dataKey: "count", name: "New Students" }]}
                      height={400}
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="competitions" className="space-y-4">
              {competitionData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Competition Participation vs Completion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleBarChart
                      data={competitionData}
                      xAxisKey="month"
                      bars={[
                        { dataKey: "participants", name: "Participants" },
                        { dataKey: "completed", name: "Completed" }
                      ]}
                      height={400}
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="revenue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleAreaChart
                    data={[
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
                    ]}
                    xAxisKey="month"
                    areas={[{ dataKey: "revenue", name: "Revenue (₹)" }]}
                    height={400}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}