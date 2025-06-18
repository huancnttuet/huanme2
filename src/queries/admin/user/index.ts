'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { User, UserRegister } from '@/types/user';
import {
  getUserList,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '@/api/services/admin/user';

// Query keys for consistent cache management
export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...userQueryKeys.lists(), { filters }] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
};

// Hook for fetching users list
export const useUsers = () => {
  return useQuery({
    queryKey: userQueryKeys.list(),
    queryFn: async () => {
      const result = await getUserList();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch users');
      }
      return result.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching a single user
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userQueryKeys.detail(id),
    queryFn: async () => {
      const result = await getUserById(id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch user');
      }
      return result.data;
    },
    enabled: !!id,
  });
};

// Hook for creating a user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: UserRegister) => {
      const result = await createUser(userData);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create user');
      }
      return result.data;
    },    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
      toast.success('User created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create user');
    },
  });
};

// Hook for updating a user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: Partial<User> }) => {
      const result = await updateUser(id, userData);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update user');
      }
      return result.data;
    },
    onSuccess: (data, { id }) => {
      // Update the specific user in cache
      queryClient.setQueryData(userQueryKeys.detail(id), data);
      // Invalidate users list to ensure consistency
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
      toast.success('User updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user');
    },
  });
};

// Hook for deleting a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteUser(id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete user');
      }
      return result.data;
    },
    onSuccess: (data, id) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: userQueryKeys.detail(id) });
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
      toast.success('User deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });
};

// Hook for batch operations or optimistic updates
export const useUserActions = () => {
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  return {
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    isLoading: createUserMutation.isPending || updateUserMutation.isPending || deleteUserMutation.isPending,
  };
};
