'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { User as UserType } from '@/types/user';
import { formatDate } from './profile-utils';

interface AccountInformationProps {
  user: UserType;
}

export default function AccountInformation({ user }: AccountInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <User className='w-5 h-5' />
          Account Information
        </CardTitle>
        <CardDescription>
          Your account details and statistics
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Account ID</p>
            <p className='text-sm font-mono'>{user._id}</p>
          </div>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Status</p>
            <Badge variant='secondary' className='mt-1'>
              Active
            </Badge>
          </div>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Created</p>
            <p className='text-sm'>{formatDate(user.createdAt)}</p>
          </div>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Last Updated</p>
            <p className='text-sm'>{formatDate(user.updatedAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
