'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { User } from '@/types/user';

import UsersTable from './list';
import UserCreateForm from './create';
import UserUpdateForm from './update';
import DeleteConfirmDialog from './delete';
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from '@/queries/admin/user';

enum PopUpForm {
  None,
  Create,
  Update,
  Delete,
}

export default function UserAdminPage() {
  const [popUpForm, setPopUpForm] = useState<PopUpForm>(PopUpForm.None);
  const [editingUser, setEditingUser] = useState<User>();
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // React Query hooks with built-in toasting
  const { data: users = [], isLoading, refetch } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleCreateUser = () => {
    setPopUpForm(PopUpForm.Create);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setPopUpForm(PopUpForm.Update);
  };

  const handleDeleteUser = (user: User) => {
    setDeletingUser(user);
    setPopUpForm(PopUpForm.Delete);
  };

  const handleFormSubmit = async (data: {
    fullName: string;
    email: string;
    password?: string;
  }) => {
    try {
      if (editingUser) {
        // Update existing user
        const updateData: Partial<User> = {
          fullName: data.fullName,
          email: data.email,
        };

        // Only include password if it's provided
        if (data.password && data.password.trim() !== '') {
          updateData.password = data.password;
        }

        await updateUserMutation.mutateAsync({
          id: editingUser._id!,
          userData: updateData,
        });
      } else {
        // Create new user
        if (!data.password) {
          throw new Error('Password is required for new users');
        }

        await createUserMutation.mutateAsync({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
        });
      }

      // Close form on success
      setPopUpForm(PopUpForm.None);
    } catch (error) {
      // Error handling is done in the hooks with toast
      console.error('Form submission error:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser?._id) return;

    try {
      await deleteUserMutation.mutateAsync(deletingUser._id);
      setPopUpForm(PopUpForm.None);
    } catch (error) {
      // Error handling is done in the hook with toast
      console.error('Delete error:', error);
    }
  };

  const isAnyMutationLoading =
    createUserMutation.isPending ||
    updateUserMutation.isPending ||
    deleteUserMutation.isPending;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>User Management</h1>
          <p className='text-muted-foreground'>
            Manage users and their permissions
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <Button onClick={handleCreateUser} disabled={isAnyMutationLoading}>
            <Plus className='h-4 w-4 mr-2' />
            Add User
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <UsersTable
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        isLoading={isAnyMutationLoading}
      />

      {/* User Form Dialog */}
      <UserCreateForm
        isOpen={popUpForm === PopUpForm.Create}
        onClose={() => setPopUpForm(PopUpForm.None)}
        onSubmit={handleFormSubmit}
        isLoading={createUserMutation.isPending}
      />

      {editingUser && (
        <UserUpdateForm
          user={editingUser}
          isOpen={popUpForm === PopUpForm.Update}
          onClose={() => setPopUpForm(PopUpForm.None)}
          onSubmit={handleFormSubmit}
          isLoading={updateUserMutation.isPending}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={popUpForm === PopUpForm.Delete}
        onClose={() => setPopUpForm(PopUpForm.None)}
        onConfirm={handleDeleteConfirm}
        user={deletingUser}
        isLoading={deleteUserMutation.isPending}
      />
    </div>
  );
}
