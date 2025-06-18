'use client';

import { logout } from '@/api/services/auth';
import { Button } from '@/components/ui/button';
import { appRoutes } from '@/configs/app-routes';
import { siteConfig } from '@/configs/site';
import useAuthStore from '@/store/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthSection() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const handleLogout = () => {
    // Clear user data from the store
    logout();
    setUser(null);
    router.push(appRoutes.LOGIN); // Redirect to login page
  };

  return (
    <>
      {!user ? (
        <>
          <Button variant='ghost' size='icon' className='h-8 w-16 px-0'>
            <Link href={siteConfig.links.login}>Log in</Link>
          </Button>

          <Button variant='ghost' size='icon' className='h-8 w-16 px-0'>
            <Link href={siteConfig.links.signup}>Sign up</Link>
          </Button>
        </>
      ) : (
        <>
          <Button variant='ghost' size='icon' className='h-8 w-16 px-0'>
            <Link href={siteConfig.links.profile}>Profile</Link>
          </Button>

          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-16 px-0'
            onClick={handleLogout}
          >
            <Link href={siteConfig.links.login}>Log out</Link>
          </Button>
        </>
      )}
    </>
  );
}
