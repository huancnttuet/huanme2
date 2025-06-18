'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isClientAuthenticated } from '@/lib/cookies/client';
import useAuthStore from '@/store/auth';

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  redirectToLogin: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setUser } = useAuthStore();
  const router = useRouter();

  const checkAuth = async (): Promise<boolean> => {
    try {
      setIsLoading(true);

      // First check if tokens exist
      const { success: isValid, user } = await isClientAuthenticated();

      setIsAuthenticated(isValid);

      if (isValid && user) {
        setUser(user);
      }

      return isValid;
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToLogin = () => {
    console.log('🔄 Redirecting to login...');
    router.push('/login');
    setUser(null); // Clear user state
  };

  useEffect(() => {
    checkAuth().then((authenticated) => {
      if (!authenticated) {
        redirectToLogin();
      }
    });
  }, []);

  // Set up periodic token checking (every 5 minutes)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(
      async () => {
        console.log('🔍 Periodic auth check...');
        const authenticated = await checkAuth();
        if (!authenticated) {
          redirectToLogin();
        }
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    isLoading,
    redirectToLogin,
  };
};
