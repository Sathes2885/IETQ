import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { UserPlus } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
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
import EnhancedUsersList from '@/components/admin/EnhancedUsersList';
import AddUserForm from '@/components/admin/AddUserForm';
import { User } from '@shared/schema';

interface AdminManageUsersProps {
  user: User;
}

export default function AdminManageUsers({ user }: AdminManageUsersProps) {
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const queryClient = useQueryClient();

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest('DELETE', `/api/admin/users/${userId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setUserToDelete(null);
    }
  });

  // Approve teacher mutation
  const approveTeacherMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest('PATCH', `/api/admin/teachers/${userId}/approve`, { approvalStatus: 'approved' });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
    }
  });

  // Reject teacher mutation
  const rejectTeacherMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest('PATCH', `/api/admin/teachers/${userId}/approve`, { approvalStatus: 'rejected' });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
    }
  });

  const confirmDelete = (user: any) => {
    setUserToDelete(user);
  };

  const handleDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id);
    }
  };

  const openAddUserDialog = () => {
    setShowAddUserDialog(true);
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
                  Manage Users
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage all platform users
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <Button 
                  onClick={openAddUserDialog} 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Add New User
                </Button>
              </div>
            </div>

            {/* Enhanced Users List */}
            <EnhancedUsersList />
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Add User Dialog */}
      <AddUserForm 
        open={showAddUserDialog} 
        onOpenChange={setShowAddUserDialog} 
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              "{userToDelete?.name}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}