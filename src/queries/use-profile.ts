'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  deleteUserAccount,
  updateUserPassword,
  updateUserProfile,
} from '@/api/services/auth';
import useAuthStore from '@/store/auth';

// Query keys
export const profileQueryKeys = {
  all: ['profile'] as const,
  current: () => [...profileQueryKeys.all, 'current'] as const,
};

/**
 * Hook to update user profile
 */
export const useUpdateProfile = () => {
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (updatedUser) => {
      if (updatedUser?.success) {
        toast.success('Profile updated successfully');
        setUser(updatedUser?.data);
      } else {
        toast.error(updatedUser?.error || 'Failed to update profile');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

/**
 * Hook to update user password
 */
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: updateUserPassword,
    onSuccess: () => {
      toast.success('Password updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update password');
    },
  });
};

/**
 * Hook to delete user account
 */
export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: () => {
      toast.success('Account deleted successfully');
      // Redirect to home or login page
      window.location.href = '/';
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete account');
    },
  });
};
