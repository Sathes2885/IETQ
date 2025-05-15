import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ArrowLeft, BookOpen, Calendar, Clock, Edit, Users } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ContentList } from "@/components/course/ContentList";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  // Fetch course details
  const { data: course, isLoading, error } = useQuery({
    queryKey: [`/api/teacher/courses/${id}`]
  });

  // Handle back navigation
  const handleBack = () => {
    navigate("/teacher/courses");
  };

  // Handle edit course
  const handleEdit = () => {
    navigate(`/teacher/courses/edit/${id}`);
    toast({
      title: "Edit Course",
      description: "This feature is coming soon!"
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleBack} className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </div>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/4 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleBack} className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </div>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load course details. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
          
          <Button onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Course
          </Button>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">{course.title}</CardTitle>
                  <CardDescription>{course.subject} | Grade {course.gradeLevel}</CardDescription>
                </div>
                <Badge variant={course.isFree ? "secondary" : "default"}>
                  {course.isFree ? 'Free' : `₹${course.price}`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{course.estimatedDuration} hours</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{course.totalLessons || 0} lessons</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{course.enrolledStudents || 0} students enrolled</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{course.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Course Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p>{new Date(course.createdAt).toLocaleDateString()} {new Date(course.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p>{new Date(course.updatedAt).toLocaleDateString()} {new Date(course.updatedAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <Separator className="my-4" />
                <div className="flex justify-end">
                  <Button variant="outline" className="mr-2" onClick={handleBack}>Back</Button>
                  <Button onClick={handleEdit}>Edit Course</Button>
                </div>
              </div>
            </CardFooter>
          </Card>
          
          <Tabs defaultValue="content">
            <TabsList className="mb-4">
              <TabsTrigger value="content">Course Content</TabsTrigger>
              <TabsTrigger value="students">Enrolled Students</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                  <CardDescription>
                    Manage your course content and modules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Content list */}
                  {course?.id && <ContentList courseId={course.id} />}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle>Enrolled Students</CardTitle>
                  <CardDescription>
                    View and manage student enrollments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Placeholder for student list */}
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {course.enrolledStudents > 0 ? 
                        `${course.enrolledStudents} students enrolled` : 
                        'No students enrolled yet'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Course Analytics</CardTitle>
                  <CardDescription>
                    View performance metrics for your course
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Placeholder for analytics */}
                  <div className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Analytics Coming Soon</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      Detailed analytics will be available as students enroll and engage with your course.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}