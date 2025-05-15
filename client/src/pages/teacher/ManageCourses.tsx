import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Search, Plus, Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { User } from '@shared/schema';
import { Link } from 'wouter';
import { formatCurrency, formatDate } from '@/lib/utils';

interface TeacherManageCoursesProps {
  user: User;
}

export default function TeacherManageCourses({ user }: TeacherManageCoursesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('recent');
  const [courseToDelete, setCourseToDelete] = useState<any | null>(null);
  const queryClient = useQueryClient();

  // Fetch courses created by the teacher
  const { data: courses, isLoading } = useQuery({
    queryKey: ['/api/teacher/courses'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/teacher/courses');
      return await res.json();
    }
  });

  // Delete course mutation
  const deleteMutation = useMutation({
    mutationFn: async (courseId: number) => {
      const res = await apiRequest('DELETE', `/api/teacher/courses/${courseId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/courses'] });
      setCourseToDelete(null);
    }
  });

  // Filter and sort courses
  const filteredCourses = courses?.filter((course: any) => {
    // Search filter
    return course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           course.description.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];
  
  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a: any, b: any) => {
    if (sortOrder === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === 'title_asc') {
      return a.title.localeCompare(b.title);
    } else if (sortOrder === 'title_desc') {
      return b.title.localeCompare(a.title);
    } else if (sortOrder === 'enrollment') {
      return (b.enrollmentCount || 0) - (a.enrollmentCount || 0);
    }
    return 0;
  });

  const confirmDelete = (course: any) => {
    setCourseToDelete(course);
  };

  const handleDelete = () => {
    if (courseToDelete) {
      deleteMutation.mutate(courseToDelete.id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex">
        <Sidebar user={user} />
        
        <div className="flex-1 overflow-auto focus:outline-none">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Page Header */}
            <div className="md:flex md:items-center md:justify-between mb-6">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Manage Courses
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Create, edit, and organize your course content
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <Link href="/teacher/courses/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Course
                  </Button>
                </Link>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 mb-6">
              <div className="sm:col-span-8 lg:col-span-9">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search courses..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:col-span-4 lg:col-span-3">
                <Select onValueChange={(value) => setSortOrder(value)} defaultValue={sortOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="title_asc">Title A-Z</SelectItem>
                    <SelectItem value="title_desc">Title Z-A</SelectItem>
                    <SelectItem value="enrollment">Most Enrollments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Courses Table */}
            <Card>
              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-3 text-gray-600">Loading your courses...</p>
                </div>
              ) : sortedCourses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Target Grades</TableHead>
                      <TableHead>Enrollments</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedCourses.map((course: any) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 mr-3">
                              {course.mediaUrl ? (
                                <img 
                                  src={course.mediaUrl} 
                                  alt={course.title} 
                                  className="h-10 w-10 rounded-md object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center">
                                  <span className="text-primary-600">{course.title.charAt(0)}</span>
                                </div>
                              )}
                            </div>
                            <div>
                              {course.title}
                              {course.isFree && (
                                <Badge className="ml-2 bg-green-100 text-green-800">Free</Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{course.isFree ? 'Free' : formatCurrency(course.price)}</TableCell>
                        <TableCell>
                          {course.targetGrades?.map((grade: string, index: number) => (
                            <Badge key={index} className="mr-1 bg-gray-100 text-gray-800">
                              Grade {grade}
                            </Badge>
                          ))}
                        </TableCell>
                        <TableCell>{course.enrollmentCount || 0}</TableCell>
                        <TableCell>{formatDate(course.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Link href={`/teacher/courses/${course.id}`}>
                                  <span className="flex items-center w-full">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link href={`/teacher/courses/${course.id}/edit`}>
                                  <span className="flex items-center w-full">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => confirmDelete(course)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No courses found</p>
                  <Link href="/teacher/courses/new">
                    <Button className="mt-4">Create Your First Course</Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!courseToDelete} onOpenChange={(open) => !open && setCourseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this course?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the course
              "{courseToDelete?.title}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Course"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
