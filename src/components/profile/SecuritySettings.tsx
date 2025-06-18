'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { User } from '@/types/user';
import { formatDate } from './profile-utils';

interface SecuritySettingsProps {
  user: User;
  onChangePasswordClick: () => void;
}

export default function SecuritySettings({ user, onChangePasswordClick }: SecuritySettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Lock className='w-5 h-5' />
          Security
        </CardTitle>
        <CardDescription>
          Manage your account security settings
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium'>Password</p>
              <p className='text-xs text-muted-foreground'>
                Last changed on {formatDate(user.updatedAt)}
              </p>
            </div>
            <Button variant='outline' size='sm' onClick={onChangePasswordClick}>
              Change
            </Button>
          </div>

          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium'>Two-Factor Authentication</p>
              <p className='text-xs text-muted-foreground'>Not enabled</p>
            </div>
            <Button variant='outline' size='sm' disabled>
              Enable
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
