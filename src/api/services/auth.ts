/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRegister } from '@/types/user';
import AuthController from '@/api/controllers/auth';
import { CookieKeys, CookieManager } from '@/lib/cookies';
import { authConfig } from '@/configs/auth';

const controller = new AuthController();

export const login = async (
  email: string,
  password: string,
  rememberMe: boolean = false,
) => {
  const { data: user } = await controller.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const accessTokenMaxAge = authConfig.accessToken.expiration;

  const userPayload = {
    userId: user._id,
    username: user.email,
  };

  // Generate access token
  const accessToken = jwt.sign(userPayload, authConfig.jwtSecret, {
    expiresIn: accessTokenMaxAge,
  });

  // Set access token in cookies (24h)
  await CookieManager.setItem(CookieKeys.ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: accessTokenMaxAge,
    path: '/',
  });

  if (rememberMe) {
    const refreshTokenMaxAge = authConfig.refreshToken.expiration;
    // Generate refresh token
    const refreshToken = jwt.sign(
      { ...userPayload, type: 'refresh' },
      authConfig.jwtRefreshSecret,
      { expiresIn: refreshTokenMaxAge },
    );
    await CookieManager.setItem(CookieKeys.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshTokenMaxAge,
      path: '/',
    });
  }

  const data = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  // Return user without password
  const result = {
    data,
    success: true,
  };
  return result;
};

export const register = async (data: UserRegister) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const userData = {
      ...data,
      password: hashedPassword,
    };

    const result = await controller.create(userData);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed',
    };
  }
};

export const refreshAccessToken = async () => {
  try {
    console.log('🔄 Attempting to refresh access token...');

    // Get refresh token from cookies
    const refreshToken = await CookieManager.getItem(CookieKeys.REFRESH_TOKEN);

    if (!refreshToken) {
      console.log('❌ No refresh token available');
      throw new Error('No refresh token available');
    }

    console.log('✅ Refresh token found, verifying...');

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      authConfig.jwtRefreshSecret,
    ) as any;

    // Check if it's a refresh token
    if (decoded.type !== 'refresh') {
      console.log('❌ Invalid token type');
      throw new Error('Invalid token type');
    }

    console.log('✅ Refresh token valid, generating new access token...');

    // Get user data to generate new access token
    const { data: user } = await controller.findOne({ _id: decoded.userId });

    if (!user) {
      console.log('❌ User not found');
      throw new Error('User not found');
    }

    const accessTokenMaxAge = authConfig.accessToken.expiration;

    console.log(
      `🚀 Generating new access token with expiry: ${accessTokenMaxAge}`,
    );

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        userId: user.id,
        username: user.email,
      },
      authConfig.jwtSecret,
      { expiresIn: accessTokenMaxAge },
    );

    // Set new access token in cookies
    await CookieManager.setItem(CookieKeys.ACCESS_TOKEN, newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: accessTokenMaxAge,
      path: '/',
    });

    console.log('✅ New access token generated and set in cookies');

    return {
      success: true,
      accessToken: newAccessToken,
      data: user,
    };
  } catch (error) {
    console.error('❌ Token refresh error:', error);
    // If refresh fails, remove both tokens
    await CookieManager.removeItem(CookieKeys.ACCESS_TOKEN);
    await CookieManager.removeItem(CookieKeys.REFRESH_TOKEN);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Token refresh failed',
    };
  }
};

export const getUserInfo = async () => {
  try {
    console.log('🔍 Fetching user info from access token...');

    // Get access token from cookies
    const accessToken = await CookieManager.getItem(CookieKeys.ACCESS_TOKEN);

    if (!accessToken) {
      console.log('❌ No access token found');
      throw new Error('No access token found');
    }

    console.log('✅ Access token found, verifying...');

    // Verify access token
    const decoded = jwt.verify(accessToken, authConfig.jwtSecret) as any;

    console.log('✅ Access token valid, fetching user data...');

    // Fetch user data using userId from decoded token
    const { data: user } = await controller.findOne({ _id: decoded.userId });

    if (!user) {
      console.log('❌ User not found');
      throw new Error('User not found');
    }

    // Return user info without password
    return {
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  } catch (error) {
    console.error('❌ Error fetching user info:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch user info',
    };
  }
};

export const logout = async () => {
  await CookieManager.removeItem(CookieKeys.ACCESS_TOKEN);
  await CookieManager.removeItem(CookieKeys.REFRESH_TOKEN);
  return { success: true };
};

export const updateUserProfile = async (data: Partial<User>) => {
  if (!data._id) {
    throw new Error('User ID is required for updating profile');
  }
  return await controller.updateById(data._id, data);
};

export const updateUserPassword = async (data: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) => {
  if (!data.userId) {
    throw new Error('User ID is required for updating password');
  }

  const { data: user } = await controller.findOne({ _id: data.userId });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(
    data.currentPassword,
    user.password,
  );

  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  const saltRounds = 10;
  const hashedNewPassword = await bcrypt.hash(data.newPassword, saltRounds);

  return await controller.updateById(data.userId, {
    password: hashedNewPassword,
  });
};

export const deleteUserAccount = async (userId: string) => {
  if (!userId) {
    throw new Error('User ID is required for deleting account');
  }

  const user = await controller.findOne({ _id: userId });

  if (!user) {
    throw new Error('User not found');
  }

  // Remove user from database
  await controller.deleteById(userId);

  // Clear cookies
  await CookieManager.removeItem(CookieKeys.ACCESS_TOKEN);
  await CookieManager.removeItem(CookieKeys.REFRESH_TOKEN);

  return { success: true, message: 'User account deleted successfully' };
};
