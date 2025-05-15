import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Search, Plus, Edit, Trash2, Eye, MoreHorizontal, Calendar, Clock } from 'lucide-react';
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

interface TeacherManageCompetitionsProps {
  user: User;
}

export default function TeacherManageCompetitions({ user }: TeacherManageCompetitionsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('deadline');
  const [competitionToDelete, setCompetitionToDelete] = useState<any | null>(null);
  const queryClient = useQueryClient();

  // Fetch competitions created by the teacher
  const { data: competitions, isLoading } = useQuery({
    queryKey: ['/api/teacher/competitions'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/teacher/competitions');
      return await res.json();
    }
  });

  // Delete competition mutation
  const deleteMutation = useMutation({
    mutationFn: async (competitionId: number) => {
      const res = await apiRequest('DELETE', `/api/teacher/competitions/${competitionId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/competitions'] });
      setCompetitionToDelete(null);
    }
  });

  // Filter and sort competitions
  const filteredCompetitions = competitions?.filter((competition: any) => {
    // Search filter
    const matchesSearch = competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          competition.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'active') {
      const now = new Date();
      const registrationEndDate = new Date(competition.registrationEndDate);
      matchesStatus = registrationEndDate > now;
    } else if (statusFilter === 'past') {
      const now = new Date();
      const submissionDeadline = new Date(competition.submissionDeadline);
      matchesStatus = submissionDeadline < now;
    } else if (statusFilter === 'registration_closed') {
      const now = new Date();
      const registrationEndDate = new Date(competition.registrationEndDate);
      const submissionDeadline = new Date(competition.submissionDeadline);
      matchesStatus = registrationEndDate < now && submissionDeadline > now;
    }
    
    return matchesSearch && matchesStatus;
  }) || [];
  
  // Sort competitions
  const sortedCompetitions = [...filteredCompetitions].sort((a: any, b: any) => {
    if (sortOrder === 'deadline') {
      return new Date(a.submissionDeadline).getTime() - new Date(b.submissionDeadline).getTime();
    } else if (sortOrder === 'registration') {
      return new Date(a.registrationEndDate).getTime() - new Date(b.registrationEndDate).getTime();
    } else if (sortOrder === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Get competition status
  const getCompetitionStatus = (competition: any) => {
    const now = new Date();
    const registrationEndDate = new Date(competition.registrationEndDate);
    const submissionDeadline = new Date(competition.submissionDeadline);
    
    if (submissionDeadline < now) {
      return 'Completed';
    } else if (registrationEndDate < now) {
      return 'Submission Open';
    } else {
      return 'Registration Open';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Registration Open':
        return 'bg-green-100 text-green-800';
      case 'Submission Open':
        return 'bg-amber-100 text-amber-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const confirmDelete = (competition: any) => {
    setCompetitionToDelete(competition);
  };

  const handleDelete = () => {
    if (competitionToDelete) {
      deleteMutation.mutate(competitionToDelete.id);
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
                  Manage Competitions
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Create, edit, and manage your competitions
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <Link href="/teacher/competitions/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Competition
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
                    placeholder="Search competitions..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <Select onValueChange={(value) => setStatusFilter(value)} defaultValue={statusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Competitions</SelectItem>
                    <SelectItem value="active">Registration Open</SelectItem>
                    <SelectItem value="registration_closed">Submission Only</SelectItem>
                    <SelectItem value="past">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-4 lg:col-span-3">
                <Select onValueChange={(value) => setSortOrder(value)} defaultValue={sortOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deadline">Submission Deadline</SelectItem>
                    <SelectItem value="registration">Registration Deadline</SelectItem>
                    <SelectItem value="recent">Recently Created</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Competitions Table */}
            <Card>
              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-3 text-gray-600">Loading your competitions...</p>
                </div>
              ) : sortedCompetitions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Target Grades</TableHead>
                      <TableHead>Registration Ends</TableHead>
                      <TableHead>Submission Deadline</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prize</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedCompetitions.map((competition: any) => {
                      const status = getCompetitionStatus(competition);
                      return (
                        <TableRow key={competition.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <div>
                                {competition.title}
                                {competition.isFree && (
                                  <Badge className="ml-2 bg-green-100 text-green-800">Free</Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {competition.targetGrades?.map((grade: string, index: number) => (
                              <Badge key={index} className="mr-1 bg-gray-100 text-gray-800">
                                Grade {grade}
                              </Badge>
                            ))}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                              {formatDate(competition.registrationEndDate)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-gray-400" />
                              {formatDate(competition.submissionDeadline)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeClass(status)}>
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {competition.isFree ? 'Free' : formatCurrency(competition.price)}
                            {competition.prizeDetails && (
                              <div className="text-xs text-gray-500 mt-1">
                                Prize: {competition.prizeDetails}
                              </div>
                            )}
                          </TableCell>
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
                                  <Link href={`/teacher/competitions/${competition.id}`}>
                                    <span className="flex items-center w-full">
                                      <Eye className="mr-2 h-4 w-4" />
                                      View
                                    </span>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link href={`/teacher/competitions/${competition.id}/edit`}>
                                    <span className="flex items-center w-full">
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </span>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link href={`/teacher/competitions/${competition.id}/entries`}>
                                    <span className="flex items-center w-full">
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Entries
                                    </span>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => confirmDelete(competition)} className="text-red-600">
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
                  <p className="text-gray-500">No competitions found</p>
                  <Link href="/teacher/competitions/new">
                    <Button className="mt-4">Create Your First Competition</Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!competitionToDelete} onOpenChange={(open) => !open && setCompetitionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this competition?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the competition
              "{competitionToDelete?.title}" and remove all associated data including student entries.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Competition"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
