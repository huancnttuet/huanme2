'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types/user';
import {
  Mail,
  Calendar,
  Edit,
  Shield,
  Camera,
} from 'lucide-react';
import { formatDate, getInitials } from './profile-utils';

interface ProfileHeaderProps {
  user: User;
  onEditClick: () => void;
}

export default function ProfileHeader({ user, onEditClick }: ProfileHeaderProps) {
  return (
    <Card className='relative overflow-hidden'>
      <div className='absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'></div>
      <CardContent className='relative pt-20 pb-6'>
        <div className='flex flex-col md:flex-row items-center md:items-start gap-6'>
          {/* Avatar */}
          <div className='relative'>
            <Avatar className='w-24 h-24 border-4 border-background shadow-lg bg-primary text-primary-foreground'>
              <div className='flex items-center justify-center w-full h-full text-2xl font-bold'>
                {getInitials(user.fullName)}
              </div>
            </Avatar>
            <Button
              size='sm'
              variant='outline'
              className='absolute -bottom-1 -right-1 rounded-full w-8 h-8 p-0'
              disabled
            >
              <Camera className='w-4 h-4' />
            </Button>
          </div>

          {/* User Info */}
          <div className='flex-1 text-center md:text-left'>
            <h1 className='text-white text-3xl font-bold text-foreground'>
              {user.fullName}
            </h1>
            <p className='text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-4'>
              <Mail className='w-4 h-4' />
              {user.email}
            </p>
            <div className='flex items-center justify-center md:justify-start gap-4 mt-3'>
              <Badge variant='secondary' className='gap-1'>
                <Shield className='w-3 h-3' />
                Verified User
              </Badge>
              <p className='text-sm text-muted-foreground flex items-center gap-1'>
                <Calendar className='w-3 h-3' />
                Joined {formatDate(user.createdAt)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-2'>
            <Button variant='outline' size='sm' onClick={onEditClick}>
              <Edit className='w-4 h-4 mr-2' />
              Edit Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
