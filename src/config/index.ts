const {
  PORT,
  NODE_ENV,
  MONGO_URI,
  SESSION_NAME,
  SESSION_SECRET,
  SESSION_LIFETIME,
} = (process.env as unknown) as Record<string, string>;

export const config = {
  server: {
    PORT,
    ENVIRONMENT: NODE_ENV,
    SESSION_NAME,
    SESSION_SECRET,
    SESSION_LIFETIME,
  },
  database: {
    MONGO_URI,
  },
};
