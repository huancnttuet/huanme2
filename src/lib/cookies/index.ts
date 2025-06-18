import { cookies } from 'next/headers';

export class CookieManager {
  /**
   * Set a cookie on the server side
   */
  static async setItem(
    key: string,
    value: string,
    options?: {
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
      maxAge?: number;
      path?: string;
    },
  ): Promise<void> {
    try {
      const cookieStore = await cookies();
      cookieStore.set(key, value, {
        httpOnly: options?.httpOnly ?? true,
        secure: options?.secure ?? process.env.NODE_ENV === 'production',
        sameSite: options?.sameSite ?? 'lax',
        maxAge: options?.maxAge ?? 60 * 60 * 24, // 24 hours by default
        path: options?.path ?? '/',
        ...options,
      });
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  }

  /**
   * Get a cookie value on the server side
   */
  static async getItem(key: string): Promise<string | null> {
    try {
      const cookieStore = await cookies();
      const cookie = cookieStore.get(key);
      return cookie?.value ?? null;
    } catch (error) {
      console.error('Error getting cookie:', error);
      return null;
    }
  }

  /**
   * Remove a cookie on the server side
   */
  static async removeItem(key: string): Promise<void> {
    try {
      const cookieStore = await cookies();
      cookieStore.delete(key);
    } catch (error) {
      console.error('Error removing cookie:', error);
    }
  }

  /**
   * Check if a cookie exists on the server side
   */
  static async hasItem(key: string): Promise<boolean> {
    try {
      const cookieStore = await cookies();
      return cookieStore.has(key);
    } catch (error) {
      console.error('Error checking cookie:', error);
      return false;
    }
  }
}

export enum CookieKeys {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
  USER_ID = 'userId',
}
