'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { User } from '@/types/user';
import { useEffect } from 'react';

const userFormSchema = z
  .object({
    fullName: z.string().min(2, {
      message: 'Full name must be at least 2 characters.',
    }),
    email: z.string().email({
      message: 'Please enter a valid email address.',
    }),
    password: z.string().optional(),
    re_password: z.string().optional(),
  })
  .refine(
    (data) => {
      // Only validate password match if both fields are filled
      if (data.password || data.re_password) {
        return data.password === data.re_password;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ['re_password'],
    },
  )
  .refine(
    (data) => {
      // Only validate password length if password is provided
      if (data.password) {
        return data.password.length >= 8;
      }
      return true;
    },
    {
      message: 'Password must be at least 8 characters.',
      path: ['password'],
    },
  )
  .refine(
    (data) => {
      // Only validate re_password length if re_password is provided
      if (data.re_password) {
        return data.re_password.length >= 8;
      }
      return true;
    },
    {
      message: 'Re-entered password must be at least 8 characters.',
      path: ['re_password'],
    },
  );

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof userFormSchema>) => Promise<void>;
  user: User;
  isLoading: boolean;
}

export default function UserUpdateForm({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading,
}: UserFormProps) {
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullName: user?.fullName,
      email: user?.email,
      password: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof userFormSchema>) => {
    try {
      await onSubmit(values);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName,
        email: user.email,
        password: '',
        re_password: '',
      });
    }
  }, [user]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter full name'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='Enter email'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password {'(leave empty to keep current password)'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder={'Enter new password (optional)'}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='re_password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Re-enter Password </FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder={'Re-enter password'}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end space-x-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update User'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
