import { ReactNode } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthGuard>
      <div className='min-h-[calc(100vh - 124px)] bg-background'>
        {/* Admin Content */}
        <main className='p-4'>{children}</main>
      </div>
    </AuthGuard>
  );
}
