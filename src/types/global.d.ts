export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: string;
      LOG_TOKEN: string;
      APP_URL: string;
      FRONTEND_URL: string;
      DATABASE_URL: string;
      DATABASE_PASSWORD: string;
      JWT_EXPIRES_DAYS: string;
      JWT_ACCESS_TOKEN: string;
      JWT_REFRESH_TOKEN: string;
      REFRESH_TOKEN_EXPIRES_IN: string;
      FILE_SIZE_LIMIT: string;
      FIREBASE_TYPE: string;
      FIREBASE_PROJECT_ID: string;
      FIREBASE_PRIVATE_KEY_ID: string;
      FIREBASE_PRIVATE_KEY: string;
      FIREBASE_CLIENT_EMAIL: string;
      FIREBASE_CLIENT_ID: string;
      FIREBASE_AUTH_URI: string;
      FIREBASE_TOKEN_URI: string;
      FIREBASE_AUTH_PROVIDER_X509_CERT_URL: string;
      FIREBASE_CLIENT_X509_CERT_URL: string;
      GOOGLE_EMAIL: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GOOGLE_REFRESH_TOKEN: string;
      ECPAY_URL: string;
      MERCHANTID: string;
      HASHKEY: string;
      HASHIV: string;
      HOST: string;
    }
  }
}
