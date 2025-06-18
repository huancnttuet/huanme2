'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

interface DangerZoneProps {
  isDeleteDialogOpen: boolean;
  onDeleteDialogChange: (open: boolean) => void;
  onDeleteAccount: () => Promise<void>;
  isDeleting: boolean;
}

export default function DangerZone({
  isDeleteDialogOpen,
  onDeleteDialogChange,
  onDeleteAccount,
  isDeleting,
}: DangerZoneProps) {
  return (
    <Card className='border-destructive/20'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-destructive'>
          <Trash2 className='w-5 h-5' />
          Danger Zone
        </CardTitle>
        <CardDescription>
          Irreversible and destructive actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-between p-4 border rounded-lg border-destructive/20 bg-destructive/5'>
          <div>
            <p className='text-sm font-medium'>Delete Account</p>
            <p className='text-xs text-muted-foreground'>
              Permanently delete your account and all associated data
            </p>
          </div>
          <Dialog open={isDeleteDialogOpen} onOpenChange={onDeleteDialogChange}>
            <DialogTrigger asChild>
              <Button variant='destructive' size='sm'>
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete your account? This action cannot be undone.
                  All your data will be permanently removed.
                </DialogDescription>
              </DialogHeader>
              <div className='flex justify-end gap-2 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => onDeleteDialogChange(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant='destructive'
                  onClick={onDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
