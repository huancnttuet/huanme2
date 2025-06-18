export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || '812jkda1029sd192j21!@#e=-dqw1312d029j',
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET ||
    process.env.JWT_SECRET ||
    '812jkda1029sd192j21!@#e=-dqw1312d029j',

  accessToken: {
    expiration: 60 * 1, // 1 minute
    expirationString: '1m', // 1 minute
  },
  refreshToken: {
    expiration: 60 * 3, // 3 minutes
    expirationString: '3m', // 3 minutes
  },
};
