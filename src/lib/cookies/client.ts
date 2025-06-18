'use client';

import { getUserInfo, refreshAccessToken } from '@/api/services/auth';

/**
 * Check if user is authenticated on the client side
 */
export const isClientAuthenticated = async () => {
  const { success, data } = await getUserInfo();

  if (success) {
    return {
      success: true,
      user: data,
    };
  }

  const result = await refreshAccessToken();

  if (result.success) {
    return {
      success: true,
      user: result.data,
    };
  }

  return {
    success: false,
    error: result.error || 'User not authenticated',
  };
};

/**
 * Get user info from access token on client side
 */

export enum ClientCookieKeys {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
  USER_ID = 'userId',
}
