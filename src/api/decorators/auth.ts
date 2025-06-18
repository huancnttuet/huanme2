/* eslint-disable @typescript-eslint/no-explicit-any */
import { authConfig } from '@/configs/auth';
import { CookieKeys, CookieManager } from '@/lib/cookies';
import jwt from 'jsonwebtoken';
import { refreshAccessToken } from '@/api/services/auth';

interface DecodedToken {
  userId: string;
  username: string;
  type?: string;
}

const JWT_SECRET = authConfig.jwtSecret;

export function authorization(target: any) {
  const methodNames = Object.getOwnPropertyNames(target.prototype).filter(
    (name) =>
      name !== 'constructor' && typeof target.prototype[name] === 'function',
  );

  methodNames.forEach((name) => {
    const originalMethod = target.prototype[name];
    target.prototype[name] = async function (...args: any[]) {
      try {
        await verifyTokenWithRefresh();
        return await originalMethod.apply(this, args);
      } catch (error) {
        console.error(`Authorization failed in ${name}:`, error);
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    };
  });
}

const verifyTokenWithRefresh = async (): Promise<DecodedToken> => {
  try {
    console.log('🔐 Verifying access token...');

    const accessToken = await CookieManager.getItem(CookieKeys.ACCESS_TOKEN);

    if (!accessToken) {
      console.log('❌ No access token found');
      throw new Error('No access token provided');
    }

    return jwt.verify(accessToken, JWT_SECRET) as DecodedToken;
  } catch (error) {
    console.log('⚠️ Access token invalid, attempting refresh...', error);
    return await handleTokenRefresh();
  }
};

const handleTokenRefresh = async (): Promise<DecodedToken> => {
  const refreshResult = await refreshAccessToken();

  if (!refreshResult.success) {
    console.log('❌ Token refresh failed:', refreshResult.error);
    throw new Error('Token refresh failed');
  }

  console.log('✅ Token refresh successful');
  return jwt.verify(refreshResult.accessToken!, JWT_SECRET) as DecodedToken;
};
