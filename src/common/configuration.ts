export default () => ({
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
  },
  environment: {
    nodeEnv: process.env.NODE_ENV,
  },
  database: {
    type: process.env.DB_TYPE,
    url: process.env.POSTGRES_URL,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD || 'postgres',
    username: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiry: process.env.JWT_EXPIRY,
  },
  cors: {
    origins: process.env.CORS_ORIGIN,
  },
  mail: {
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
    port: process.env.MAIL_PORT,
    password: process.env.MAIL_PASSWORD,
    to: process.env.MAIL_TO,
    from: process.env.MAIL_FROM,
    otpExpiryTime: process.env.OTP_EXPIRY_TIME,
  },
});
