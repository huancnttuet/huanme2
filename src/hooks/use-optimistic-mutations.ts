'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseOptimisticMutationOptions<TData, TVariables, TQueryData = unknown> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey: string[];
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  optimisticUpdate?: (oldData: TQueryData, variables: TVariables) => TQueryData;
}

/**
 * Generic hook for mutations with optimistic updates and automatic toasting
 */
export function useOptimisticMutation<TData, TVariables, TQueryData = unknown>({
  mutationFn,
  queryKey,
  successMessage,
  errorMessage,
  onSuccess,
  onError,
  optimisticUpdate,
}: UseOptimisticMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      if (!optimisticUpdate) return;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (old: TQueryData) => 
        optimisticUpdate(old, variables)
      );

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (error: Error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      
      // Show error toast
      toast.error(errorMessage || error.message || 'Operation failed');
      
      // Call custom error handler
      onError?.(error, variables);
    },
    onSuccess: (data, variables) => {
      // Show success toast
      if (successMessage) {
        toast.success(successMessage);
      }
      
      // Call custom success handler
      onSuccess?.(data, variables);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

/**
 * Hook for batch operations with progress tracking
 */
export function useBatchMutation<TData, TVariables>({
  mutationFn,
  queryKey,
  successMessage = 'All operations completed successfully',
  errorMessage = 'Some operations failed',
}: {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey: string[];
  successMessage?: string;
  errorMessage?: string;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variablesArray: TVariables[]) => {
      const results = [];
      const errors = [];

      for (let i = 0; i < variablesArray.length; i++) {
        try {
          const result = await mutationFn(variablesArray[i]);
          results.push(result);
          
          // Show progress toast
          toast.loading(`Processing ${i + 1} of ${variablesArray.length}...`, {
            id: 'batch-operation',
          });
        } catch (error) {
          errors.push({ index: i, error });
        }
      }

      // Dismiss progress toast
      toast.dismiss('batch-operation');

      if (errors.length === 0) {
        toast.success(successMessage);
      } else if (errors.length === variablesArray.length) {
        throw new Error(errorMessage);
      } else {
        toast.warning(`${results.length} succeeded, ${errors.length} failed`);
      }

      return { results, errors };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

/**
 * Hook for API operations with automatic retry and exponential backoff
 */
export function useResilientMutation<TData, TVariables>({
  mutationFn,
  queryKey,
  maxRetries = 3,
  baseDelay = 1000,
  successMessage,
  errorMessage,
}: {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey: string[];
  maxRetries?: number;
  baseDelay?: number;
  successMessage?: string;
  errorMessage?: string;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      let lastError: Error;
      
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await mutationFn(variables);
        } catch (error) {
          lastError = error as Error;
          
          if (attempt < maxRetries) {
            // Exponential backoff
            const delay = baseDelay * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
            
            toast.loading(`Retrying... (${attempt + 1}/${maxRetries})`, {
              id: 'retry-operation',
            });
          }
        }
      }
      
      toast.dismiss('retry-operation');
      throw lastError!;
    },
    onSuccess: () => {
      toast.dismiss('retry-operation');
      if (successMessage) {
        toast.success(successMessage);
      }
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.dismiss('retry-operation');
      toast.error(errorMessage || error.message || 'Operation failed after retries');
    },
  });
}
