'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCallback, useMemo } from 'react';

/**
 * Enhanced query hook with better error handling and loading states
 */
export function useEnhancedQuery<TData>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 minutes
  errorMessage = 'Failed to load data',
  onError,
  onSuccess,
}: {
  queryKey: string[];
  queryFn: () => Promise<TData>;
  enabled?: boolean;
  staleTime?: number;
  errorMessage?: string;
  onError?: (error: Error) => void;
  onSuccess?: (data: TData) => void;
}) {
  const query = useQuery({
    queryKey,
    queryFn,
    enabled,
    staleTime,
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error && 'status' in error && typeof error.status === 'number') {
        if (error.status >= 400 && error.status < 500) {
          return false;
        }
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
  });

  // Handle success/error effects
  if (query.error && onError) {
    toast.error(errorMessage);
    onError(query.error);
  }

  if (query.isSuccess && query.data && onSuccess) {
    onSuccess(query.data);
  }

  return query;
}

/**
 * Hook for managing form submission states with validation
 */
export function useFormMutation<TData, TVariables>({
  mutationFn,
  onSuccess,
  onError,
  validationFn,
  successMessage = 'Operation completed successfully',
  errorMessage = 'Operation failed',
}: {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  validationFn?: (variables: TVariables) => string | null;
  successMessage?: string;
  errorMessage?: string;
}) {
  const mutation = useMutation({
    mutationFn: async (variables: TVariables) => {
      // Run validation if provided
      if (validationFn) {
        const validationError = validationFn(variables);
        if (validationError) {
          throw new Error(validationError);
        }
      }
      
      return mutationFn(variables);
    },
    onSuccess: (data, variables) => {
      toast.success(successMessage);
      onSuccess?.(data, variables);
    },
    onError: (error: Error, variables) => {
      toast.error(error.message || errorMessage);
      onError?.(error, variables);
    },
  });

  const submit = useCallback(
    async (variables: TVariables) => {
      try {
        return await mutation.mutateAsync(variables);
      } catch (error) {
        // Error is already handled by onError
        throw error;
      }
    },
    [mutation]
  );

  return {
    submit,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}

/**
 * Hook for managing loading states across multiple operations
 */
export function useLoadingStates() {
  const loadingStates = useMemo(() => new Map<string, boolean>(), []);

  const setLoading = useCallback((key: string, loading: boolean) => {
    if (loading) {
      loadingStates.set(key, true);
    } else {
      loadingStates.delete(key);
    }
  }, [loadingStates]);

  const isLoading = useCallback((key?: string) => {
    if (key) {
      return loadingStates.has(key);
    }
    return loadingStates.size > 0;
  }, [loadingStates]);

  const isAnyLoading = useCallback(() => {
    return loadingStates.size > 0;
  }, [loadingStates]);

  return {
    setLoading,
    isLoading,
    isAnyLoading,
  };
}

/**
 * Hook for handling success/error notifications with undo functionality
 */
export function useUndoableMutation<TData, TVariables>({
  mutationFn,
  undoFn,
  successMessage = 'Operation completed',
  undoMessage = 'Operation undone',
  undoTimeout = 5000,
}: {
  mutationFn: (variables: TVariables) => Promise<TData>;
  undoFn: (data: TData, variables: TVariables) => Promise<void>;
  successMessage?: string;
  undoMessage?: string;
  undoTimeout?: number;
}) {
  const mutation = useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      const toastId = toast.success(successMessage, {
        action: {
          label: 'Undo',
          onClick: async () => {
            try {
              await undoFn(data, variables);
              toast.success(undoMessage);
              toast.dismiss(toastId);
            } catch {
              toast.error('Failed to undo operation');
            }
          },
        },
        duration: undoTimeout,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Operation failed');
    },
  });

  return mutation;
}
