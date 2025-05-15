import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Search, Plus, Edit, Trash2, Eye, MoreHorizontal, Clock, Calendar } from 'lucide-react';
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
import { formatCurrency, formatDate, getDurationLabel } from '@/lib/utils';

interface TeacherManageQuizzesProps {
  user: User;
}

export default function TeacherManageQuizzes({ user }: TeacherManageQuizzesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('recent');
  const [quizToDelete, setQuizToDelete] = useState<any | null>(null);
  const queryClient = useQueryClient();

  // Fetch quizzes created by the teacher
  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['/api/teacher/quizzes'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/teacher/quizzes');
      return await res.json();
    }
  });

  // Delete quiz mutation
  const deleteMutation = useMutation({
    mutationFn: async (quizId: number) => {
      const res = await apiRequest('DELETE', `/api/teacher/quizzes/${quizId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/quizzes'] });
      setQuizToDelete(null);
    }
  });

  // Filter and sort quizzes
  const filteredQuizzes = quizzes?.filter((quiz: any) => {
    // Search filter
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    let matchesType = true;
    if (typeFilter === 'anytime' && quiz.quizType !== 'anytime') {
      matchesType = false;
    } else if (typeFilter === 'scheduled' && quiz.quizType !== 'scheduled') {
      matchesType = false;
    }
    
    return matchesSearch && matchesType;
  }) || [];
  
  // Sort quizzes
  const sortedQuizzes = [...filteredQuizzes].sort((a: any, b: any) => {
    if (sortOrder === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortOrder === 'scheduled') {
      // Sort by schedule date for scheduled quizzes, put anytime quizzes at the end
      if (a.quizType === 'scheduled' && b.quizType === 'scheduled') {
        return new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime();
      } else if (a.quizType === 'scheduled') {
        return -1;
      } else if (b.quizType === 'scheduled') {
        return 1;
      }
      return 0;
    } else if (sortOrder === 'duration') {
      return a.duration - b.duration;
    }
    return 0;
  });

  const getQuizStatus = (quiz: any) => {
    if (quiz.quizType === 'anytime') {
      return 'Anytime';
    }
    
    const now = new Date();
    const startTime = new Date(quiz.scheduledStartTime);
    const endTime = new Date(quiz.scheduledEndTime);
    
    if (now < startTime) {
      return 'Upcoming';
    } else if (now > endTime) {
      return 'Completed';
    } else {
      return 'Active';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Anytime':
        return 'bg-blue-100 text-blue-800';
      case 'Upcoming':
        return 'bg-amber-100 text-amber-800';
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const confirmDelete = (quiz: any) => {
    setQuizToDelete(quiz);
  };

  const handleDelete = () => {
    if (quizToDelete) {
      deleteMutation.mutate(quizToDelete.id);
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
                  Manage Quizzes
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Create, edit, and organize your quizzes
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <Link href="/teacher/quizzes/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Quiz
                  </Button>
                </Link>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 mb-6">
              <div className="sm:col-span-5 lg:col-span-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search quizzes..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <Select onValueChange={(value) => setTypeFilter(value)} defaultValue={typeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="anytime">Anytime</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-4 lg:col-span-3">
                <Select onValueChange={(value) => setSortOrder(value)} defaultValue={sortOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recently Created</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="scheduled">Schedule Date</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quizzes Table */}
            <Card>
              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-3 text-gray-600">Loading your quizzes...</p>
                </div>
              ) : sortedQuizzes.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Target Grades</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Schedule/Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedQuizzes.map((quiz: any) => {
                      const status = getQuizStatus(quiz);
                      return (
                        <TableRow key={quiz.id}>
                          <TableCell className="font-medium">
                            {quiz.title}
                            {quiz.isFree && (
                              <Badge className="ml-2 bg-green-100 text-green-800">Free</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              quiz.quizType === 'anytime' 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-amber-100 text-amber-800"
                            }>
                              {quiz.quizType === 'anytime' ? 'Anytime' : 'Scheduled'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {quiz.targetGrades?.map((grade: string, index: number) => (
                              <Badge key={index} className="mr-1 bg-gray-100 text-gray-800">
                                Grade {grade}
                              </Badge>
                            ))}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-gray-400" />
                              {getDurationLabel(quiz.duration)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {quiz.quizType === 'scheduled' ? (
                              <div>
                                <Badge className={getStatusBadgeClass(status)}>
                                  {status}
                                </Badge>
                                <div className="mt-1 text-xs text-gray-500 flex items-center">
                                  <Calendar className="mr-1 h-3 w-3" />
                                  {formatDate(quiz.scheduledStartTime)}
                                </div>
                              </div>
                            ) : (
                              <Badge className={getStatusBadgeClass('Anytime')}>Always Available</Badge>
                            )}
                          </TableCell>
                          <TableCell>{quiz.isFree ? 'Free' : formatCurrency(quiz.price)}</TableCell>
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
                                  <Link href={`/teacher/quizzes/${quiz.id}`}>
                                    <span className="flex items-center w-full">
                                      <Eye className="mr-2 h-4 w-4" />
                                      View
                                    </span>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link href={`/teacher/quizzes/${quiz.id}/edit`}>
                                    <span className="flex items-center w-full">
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </span>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link href={`/teacher/quizzes/${quiz.id}/questions`}>
                                    <span className="flex items-center w-full">
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit Questions
                                    </span>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link href={`/teacher/quizzes/${quiz.id}/results`}>
                                    <span className="flex items-center w-full">
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Results
                                    </span>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => confirmDelete(quiz)} className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No quizzes found</p>
                  <Link href="/teacher/quizzes/new">
                    <Button className="mt-4">Create Your First Quiz</Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!quizToDelete} onOpenChange={(open) => !open && setQuizToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the quiz
              "{quizToDelete?.title}" including all questions and student attempts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Quiz"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
