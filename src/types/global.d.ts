export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: string;
      LOG_TOKEN: string;
      APP_URL: string;
      DATABASE_URL: string;
      DATABASE_PASSWORD: string;
      JWT_EXPIRES_DAYS: string;
      JWT_SECRET: string;
    }
  }
}
