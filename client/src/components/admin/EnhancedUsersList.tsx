import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Filter, 
  Search, 
  Users, 
  UserRound, 
  ChevronDown, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  UserPlus
} from 'lucide-react';

// Interface for user data from Supabase
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  supabaseUserId: string;
  subject?: string;
  qualification?: string;
  experience?: string;
  school?: string;
  grade?: string;
}

export default function EnhancedUsersList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Mutations for approval actions
  const approveTeacherMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest('PATCH', `/api/admin/teachers/${userId}/approve`, { approvalStatus: 'approved' });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "Teacher approved",
        description: `${data.teacher.name} (${data.teacher.email}) has been approved and can now access the platform.`,
        variant: "default"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Approval failed",
        description: error.message || "Failed to approve teacher. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const rejectTeacherMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest('PATCH', `/api/admin/teachers/${userId}/approve`, { approvalStatus: 'rejected' });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "Teacher rejected",
        description: `${data.teacher.name} (${data.teacher.email}) has been rejected and will not be able to access the platform.`,
        variant: "default"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Rejection failed",
        description: error.message || "Failed to reject teacher. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Fetch all users
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/users');
      const data = await res.json();
      console.log('Fetched users data:', data);
      return data as User[];
    }
  });
  
  // Apply filters to users
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role filter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    // Status filter (only applies to teachers)
    const matchesStatus = 
      statusFilter === 'all' || 
      (user.role === 'teacher' && user.approvalStatus === statusFilter) ||
      (statusFilter === 'approved' && user.role !== 'teacher') || // Non-teachers are always considered approved
      (statusFilter === 'pending' && user.role === 'teacher' && user.approvalStatus === 'pending');
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'email':
        return a.email.localeCompare(b.email);
      default:
        return 0;
    }
  });
  
  // Count users by role
  const adminCount = users.filter(user => user.role === 'admin').length;
  const teacherCount = users.filter(user => user.role === 'teacher').length;
  const studentCount = users.filter(user => user.role === 'student').length;
  const pendingCount = users.filter(user => user.role === 'teacher' && user.approvalStatus === 'pending').length;
  
  // Format date string
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Get avatar fallback initials
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500 hover:bg-red-600">{role}</Badge>;
      case 'teacher':
        return <Badge className="bg-blue-500 hover:bg-blue-600">{role}</Badge>;
      case 'student':
        return <Badge className="bg-green-500 hover:bg-green-600">{role}</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string = 'approved') => {
    switch (status) {
      case 'approved':
        return <Badge variant="outline" className="border-green-500 text-green-600">Approved</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-amber-500 text-amber-600">Pending</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="border-red-500 text-red-600">Rejected</Badge>;
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="py-10 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-500">Loading users...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="py-10 text-center">
          <div className="flex flex-col items-center justify-center">
            <XCircle className="h-12 w-12 text-red-600 mb-4" />
            <p className="text-red-600">Failed to load users</p>
            <Button variant="outline" className="mt-4">Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            User Management
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
            <Button variant="secondary" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              All Users
              <Badge className="ml-2 bg-gray-500">{users.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center">
              <UserRound className="h-4 w-4 mr-2" />
              Admins
              <Badge className="ml-2 bg-red-500">{adminCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="teacher" className="flex items-center">
              <UserRound className="h-4 w-4 mr-2" />
              Teachers
              <Badge className="ml-2 bg-blue-500">{teacherCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="student" className="flex items-center">
              <UserRound className="h-4 w-4 mr-2" />
              Students
              <Badge className="ml-2 bg-green-500">{studentCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Pending
              <Badge className="ml-2 bg-amber-500">{pendingCount}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="flex items-center">
                <UserRound className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="flex items-center">
                <ChevronDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <TabsContent value="all">
            <UserTable 
              users={sortedUsers}
              getInitials={getInitials}
              getRoleBadge={getRoleBadge}
              getStatusBadge={getStatusBadge}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="admin">
            <UserTable 
              users={sortedUsers.filter(user => user.role === 'admin')}
              getInitials={getInitials}
              getRoleBadge={getRoleBadge}
              getStatusBadge={getStatusBadge}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="teacher">
            <UserTable 
              users={sortedUsers.filter(user => user.role === 'teacher')}
              getInitials={getInitials}
              getRoleBadge={getRoleBadge}
              getStatusBadge={getStatusBadge}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="student">
            <UserTable 
              users={sortedUsers.filter(user => user.role === 'student')}
              getInitials={getInitials}
              getRoleBadge={getRoleBadge}
              getStatusBadge={getStatusBadge}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="pending">
            <UserTable 
              users={sortedUsers.filter(user => user.role === 'teacher' && user.approvalStatus === 'pending')}
              getInitials={getInitials}
              getRoleBadge={getRoleBadge}
              getStatusBadge={getStatusBadge}
              formatDate={formatDate}
              showApproveButtons={true}
              onApprove={(userId) => approveTeacherMutation.mutate(userId)}
              onReject={(userId) => rejectTeacherMutation.mutate(userId)}
              isApproving={approveTeacherMutation.isPending}
              isRejecting={rejectTeacherMutation.isPending}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface UserTableProps {
  users: User[];
  getInitials: (name: string) => string;
  getRoleBadge: (role: string) => React.ReactNode;
  getStatusBadge: (status?: string) => React.ReactNode;
  formatDate: (date: string) => string;
  showApproveButtons?: boolean;
  onApprove?: (userId: number) => void;
  onReject?: (userId: number) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
}

function UserTable({ 
  users, 
  getInitials, 
  getRoleBadge, 
  getStatusBadge, 
  formatDate,
  showApproveButtons = false,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="py-10 text-center">
        <div className="flex flex-col items-center justify-center">
          <UserRound className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No users found matching your filters</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registration Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>
                {user.role === 'teacher' ? getStatusBadge(user.approvalStatus) : getStatusBadge('approved')}
              </TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
              <TableCell className="text-right">
                {showApproveButtons && user.role === 'teacher' && user.approvalStatus === 'pending' ? (
                  <div className="flex justify-end space-x-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-green-600 border-green-600"
                      onClick={() => onApprove && onApprove(user.id)}
                      disabled={isApproving || isRejecting}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      {isApproving ? "Approving..." : "Approve"}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 border-red-600"
                      onClick={() => onReject && onReject(user.id)}
                      disabled={isApproving || isRejecting}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      {isRejecting ? "Rejecting..." : "Reject"}
                    </Button>
                  </div>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}