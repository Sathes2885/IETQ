import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Search, Eye, Trash2, MoreHorizontal, BookOpen, Trophy, HelpCircle, Filter } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@shared/schema';
import { Link } from 'wouter';
import { formatCurrency, formatDate } from '@/lib/utils';

interface AdminManageContentProps {
  user: User;
}

export default function AdminManageContent({ user }: AdminManageContentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('recent');
  const [contentToDelete, setContentToDelete] = useState<any | null>(null);
  const queryClient = useQueryClient();

  // Fetch all content
  const { data: allContent, isLoading } = useQuery({
    queryKey: ['/api/admin/content'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/content');
      return await res.json();
    }
  });

  // Delete content mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ id, type }: { id: number; type: string }) => {
      const res = await apiRequest('DELETE', `/api/admin/content/${type}/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/content'] });
      setContentToDelete(null);
    }
  });

  // Filter and sort content
  const filteredContent = allContent?.filter((content: any) => {
    // Search filter
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (content.description && content.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Content type filter
    let matchesType = true;
    if (typeFilter !== 'all' && content.contentType !== typeFilter) {
      matchesType = false;
    }
    
    // Grade filter
    let matchesGrade = true;
    if (gradeFilter !== 'all') {
      matchesGrade = content.targetGrades.includes(gradeFilter);
    }
    
    return matchesSearch && matchesType && matchesGrade;
  }) || [];
  
  // Sort content
  const sortedContent = [...filteredContent].sort((a: any, b: any) => {
    if (sortOrder === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === 'title_asc') {
      return a.title.localeCompare(b.title);
    } else if (sortOrder === 'title_desc') {
      return b.title.localeCompare(a.title);
    } else if (sortOrder === 'teacher') {
      // Sort by teacher name or ID
      return (a.teacherName || a.teacherId).toString().localeCompare((b.teacherName || b.teacherId).toString());
    }
    return 0;
  });

  // Group content by type
  const courses = sortedContent.filter((c: any) => c.contentType === 'course');
  const competitions = sortedContent.filter((c: any) => c.contentType === 'competition');
  const quizzes = sortedContent.filter((c: any) => c.contentType === 'quiz');

  const confirmDelete = (content: any) => {
    setContentToDelete(content);
  };

  const handleDelete = () => {
    if (contentToDelete) {
      deleteMutation.mutate({ 
        id: contentToDelete.id, 
        type: contentToDelete.contentType 
      });
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-5 w-5 text-primary-600" />;
      case 'competition':
        return <Trophy className="h-5 w-5 text-secondary-600" />;
      case 'quiz':
        return <HelpCircle className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getContentTypeBadge = (type: string) => {
    switch (type) {
      case 'course':
        return <Badge className="bg-primary-100 text-primary-800">Course</Badge>;
      case 'competition':
        return <Badge className="bg-secondary-100 text-secondary-800">Competition</Badge>;
      case 'quiz':
        return <Badge className="bg-amber-100 text-amber-800">Quiz</Badge>;
      default:
        return null;
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
                  Manage Content
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage all educational content on the platform
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <Button variant="outline" className="mr-2">
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced Filters
                </Button>
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
                    placeholder="Search content..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Select onValueChange={(value) => setTypeFilter(value)} defaultValue={typeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="course">Courses</SelectItem>
                    <SelectItem value="competition">Competitions</SelectItem>
                    <SelectItem value="quiz">Quizzes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Select onValueChange={(value) => setGradeFilter(value)} defaultValue={gradeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-3 lg:col-span-2">
                <Select onValueChange={(value) => setSortOrder(value)} defaultValue={sortOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recently Created</SelectItem>
                    <SelectItem value="title_asc">Title A-Z</SelectItem>
                    <SelectItem value="title_desc">Title Z-A</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Content</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="competitions">Competitions</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <ContentTable 
                  content={sortedContent} 
                  isLoading={isLoading} 
                  confirmDelete={confirmDelete}
                  getContentTypeIcon={getContentTypeIcon}
                  getContentTypeBadge={getContentTypeBadge}
                />
              </TabsContent>
              
              <TabsContent value="courses">
                <ContentTable 
                  content={courses} 
                  isLoading={isLoading} 
                  confirmDelete={confirmDelete}
                  getContentTypeIcon={getContentTypeIcon}
                  getContentTypeBadge={getContentTypeBadge}
                />
              </TabsContent>
              
              <TabsContent value="competitions">
                <ContentTable 
                  content={competitions} 
                  isLoading={isLoading} 
                  confirmDelete={confirmDelete}
                  getContentTypeIcon={getContentTypeIcon}
                  getContentTypeBadge={getContentTypeBadge}
                />
              </TabsContent>
              
              <TabsContent value="quizzes">
                <ContentTable 
                  content={quizzes} 
                  isLoading={isLoading} 
                  confirmDelete={confirmDelete}
                  getContentTypeIcon={getContentTypeIcon}
                  getContentTypeBadge={getContentTypeBadge}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!contentToDelete} onOpenChange={(open) => !open && setContentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this content?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              {contentToDelete?.contentType === 'course' ? ' course ' : 
               contentToDelete?.contentType === 'competition' ? ' competition ' : 
               contentToDelete?.contentType === 'quiz' ? ' quiz ' : ' content '}
              "{contentToDelete?.title}" and remove all associated data including student progress and enrollments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Content"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface ContentTableProps {
  content: any[];
  isLoading: boolean;
  confirmDelete: (content: any) => void;
  getContentTypeIcon: (type: string) => React.ReactNode;
  getContentTypeBadge: (type: string) => React.ReactNode;
}

function ContentTable({ 
  content, 
  isLoading, 
  confirmDelete,
  getContentTypeIcon,
  getContentTypeBadge,
}: ContentTableProps) {
  return (
    <Card>
      {isLoading ? (
        <div className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading content...</p>
        </div>
      ) : content.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Target Grades</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.map((item: any) => (
              <TableRow key={`${item.contentType}-${item.id}`}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <div className="mr-2">
                      {getContentTypeIcon(item.contentType)}
                    </div>
                    <div>
                      {item.title}
                      {item.isFree && (
                        <Badge className="ml-2 bg-green-100 text-green-800">Free</Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getContentTypeBadge(item.contentType)}
                </TableCell>
                <TableCell>
                  {item.teacherName || `Teacher #${item.teacherId}`}
                </TableCell>
                <TableCell>
                  {item.targetGrades?.map((grade: string, index: number) => (
                    <Badge key={index} className="mr-1 bg-gray-100 text-gray-800">
                      Grade {grade}
                    </Badge>
                  ))}
                </TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
                <TableCell>{item.isFree ? 'Free' : formatCurrency(item.price)}</TableCell>
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
                        <Link href={`/admin/content/${item.contentType}/${item.id}`}>
                          <span className="flex items-center w-full">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/admin/content/${item.contentType}/${item.id}/enrollments`}>
                          <span className="flex items-center w-full">
                            <Eye className="mr-2 h-4 w-4" />
                            View Enrollments
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => confirmDelete(item)} className="text-red-600">
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
          <p className="text-gray-500">No content found</p>
        </div>
      )}
    </Card>
  );
}
