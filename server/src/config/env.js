import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || "default_fallback_secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};

export default env;
