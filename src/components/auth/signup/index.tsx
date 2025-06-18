'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Icons } from '@/components/ui/icon';
import Link from 'next/link';
import { register } from '@/api/services/auth';
import { toast } from 'sonner';

const formSchema = z
  .object({
    fullName: z.string().min(2, {
      message: 'Full name must be at least 2 characters.',
    }),
    email: z.string().email({
      message: 'Please enter a valid email address.',
    }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export function SignUpPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const { data, success } = await register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });

      if (success) {
        toast.success('Account created successfully! Redirecting to login...');

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        toast.error(
          data?.message || 'Failed to create account. Please try again later.',
        );
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again later.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='flex min-h-[calc(100vh-10rem)] items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        {' '}
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl text-center'>
            Create an account
          </CardTitle>
          <CardDescription className='text-center'>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>{' '}
        <CardContent className='grid gap-4'>
          {' '}
          <div className='grid grid-cols-2 gap-6'>
            <Button variant='outline' disabled={isLoading}>
              <Icons.gitHub className='mr-2 h-4 w-4' />
              Github
            </Button>
            <Button variant='outline' disabled={isLoading}>
              <Icons.google className='mr-2 h-4 w-4' />
              Google
            </Button>
          </div>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-background px-2 text-muted-foreground'>
                Or continue with
              </span>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John Doe'
                        autoCapitalize='words'
                        autoComplete='name'
                        autoCorrect='off'
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
                        placeholder='name@example.com'
                        type='email'
                        autoCapitalize='none'
                        autoComplete='email'
                        autoCorrect='off'
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter your password'
                        type='password'
                        autoComplete='new-password'
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
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Confirm your password'
                        type='password'
                        autoComplete='new-password'
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} className='w-full mt-2'>
                {isLoading && (
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                )}
                Sign Up
              </Button>
            </form>
          </Form>
        </CardContent>{' '}
        <CardFooter>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            Already have an account?{' '}
            {isLoading ? (
              <span className='text-muted-foreground'>Sign in</span>
            ) : (
              <Link
                href='/login'
                className='underline underline-offset-4 hover:text-primary'
              >
                Sign in
              </Link>
            )}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignUpPage;
