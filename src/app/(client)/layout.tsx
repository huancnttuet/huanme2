import { ReactNode } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthGuard>
      <div className='min-h-screen bg-background'>{children}</div>
    </AuthGuard>
  );
}
