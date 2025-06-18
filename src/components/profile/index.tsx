'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  useUpdateProfile,
  useUpdatePassword,
  useDeleteAccount,
} from '@/queries/use-profile';
import useAuthStore from '@/store/auth';
import ProfileHeader from './ProfileHeader';
import EditProfileDialog from './EditProfileDialog';
import AccountInformation from './AccountInformation';
import SecuritySettings from './SecuritySettings';
import ChangePasswordDialog from './ChangePasswordDialog';
import DangerZone from './DangerZone';
import { ProfileFormData, PasswordFormData } from './profile-utils';

enum DialogState {
  None,
  EditProfile,
  ChangePassword,
  DeleteAccount,
}

export default function ProfileComponent() {
  const [dialogState, setDialogState] = useState<DialogState>(DialogState.None);

  const { user, setUser } = useAuthStore();
  const updateProfileMutation = useUpdateProfile();
  const updatePasswordMutation = useUpdatePassword();
  const deleteAccountMutation = useDeleteAccount();

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfileMutation.mutateAsync({
        _id: user?._id || '',
        ...data,
      });
      setDialogState(DialogState.None);
    } catch {
      // Error handled by mutation hook
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await updatePasswordMutation.mutateAsync({
        userId: user?._id || '',
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setDialogState(DialogState.None);
    } catch {
      // Error handled by mutation hook
    }
  };

  const onDeleteAccount = async () => {
    try {
      await deleteAccountMutation.mutateAsync(user?._id || '');
      setDialogState(DialogState.None);
      setUser(null); // Clear user from store
    } catch {
      // Error handled by mutation hook
    }
  };

  if (!user) {
    return (
      <Card className='max-w-2xl mx-auto'>
        <CardContent className='flex items-center justify-center py-12'>
          <p className='text-muted-foreground'>User not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Profile Header */}
      <ProfileHeader
        user={user}
        onEditClick={() => setDialogState(DialogState.EditProfile)}
      />

      {/* Profile Sections */}
      <div className='grid md:grid-cols-2 gap-6'>
        {/* Account Information */}
        <AccountInformation user={user} />

        {/* Security Settings */}
        <SecuritySettings
          user={user}
          onChangePasswordClick={() =>
            setDialogState(DialogState.ChangePassword)
          }
        />
      </div>

      {/* Danger Zone */}
      <DangerZone
        isDeleteDialogOpen={dialogState === DialogState.DeleteAccount}
        onDeleteDialogChange={() => setDialogState(DialogState.DeleteAccount)}
        onDeleteAccount={onDeleteAccount}
        isDeleting={deleteAccountMutation.isPending}
      />

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        isOpen={dialogState === DialogState.EditProfile}
        onClose={() => setDialogState(DialogState.None)}
        onSubmit={onProfileSubmit}
        user={user}
        isLoading={updateProfileMutation.isPending}
      />

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        isOpen={dialogState === DialogState.ChangePassword}
        onClose={() => setDialogState(DialogState.None)}
        onSubmit={onPasswordSubmit}
        isLoading={updatePasswordMutation.isPending}
      />
    </div>
  );
}
