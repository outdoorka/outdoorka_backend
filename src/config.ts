import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

/**
 * 對應 config.env 的設定
 */
class Config {
  public PORT: string;
  public NODE_ENV: string;
  public LOG_TOKEN: string;
  public APP_URL: string;
  public DATABASE_URL: string;
  public DATABASE_PASSWORD: string;
  public JWT_EXPIRES_DAYS: string;
  public JWT_ACCESS_TOKEN: string;
  public JWT_REFRESH_TOKEN: string;
  public REFRESH_TOKEN_EXPIRES_IN: string;
  public FILE_SIZE_LIMIT: number;
  public FIREBASE_TYPE: string;
  public FIREBASE_PROJECT_ID: string;
  public FIREBASE_PRIVATE_KEY_ID: string;
  public FIREBASE_PRIVATE_KEY: string;
  public FIREBASE_CLIENT_EMAIL: string;
  public FIREBASE_CLIENT_ID: string;
  public FIREBASE_AUTH_URI: string;
  public FIREBASE_TOKEN_URI: string;
  public FIREBASE_AUTH_PROVIDER_X509_CERT_URL: string;
  public FIREBASE_CLIENT_X509_CERT_URL: string;

  constructor() {
    this.PORT = process.env.PORT || '3006';
    this.NODE_ENV = process.env.NODE_ENV || 'production';
    this.LOG_TOKEN = process.env.LOG_TOKEN || '';
    this.APP_URL = process.env.APP_URL || 'http://localhost:3006';
    this.DATABASE_URL = process.env.DATABASE_URL || '';
    this.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
    this.JWT_EXPIRES_DAYS = process.env.JWT_EXPIRES_DAYS || '7d';
    this.JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN || 'test';
    this.JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN || 'test';
    this.REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

    this.FILE_SIZE_LIMIT = parseInt(process.env.FILE_SIZE_LIMIT || '2', 10) || 2;
    this.FIREBASE_TYPE = process.env.FIREBASE_TYPE || '';
    this.FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || '';
    this.FIREBASE_PRIVATE_KEY_ID = process.env.FIREBASE_PRIVATE_KEY_ID || '';
    this.FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';
    this.FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL || '';
    this.FIREBASE_CLIENT_ID = process.env.FIREBASE_CLIENT_ID || '';
    this.FIREBASE_AUTH_URI = process.env.FIREBASE_AUTH_URI || '';
    this.FIREBASE_TOKEN_URI = process.env.FIREBASE_TOKEN_URI || '';
    this.FIREBASE_AUTH_PROVIDER_X509_CERT_URL =
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || '';
    this.FIREBASE_CLIENT_X509_CERT_URL = process.env.FIREBASE_CLIENT_X509_CERT_URL || '';
  }

  /**
   * 驗證設定
   */
  public validateConfig(): void {
    console.info({
      PORT: this.PORT,
      NODE_ENV: this.NODE_ENV,
      LOG_TOKEN: this.LOG_TOKEN,
      APP_URL: this.APP_URL,
      DATABASE_URL: this.DATABASE_URL,
      JWT_EXPIRES_DAYS: this.JWT_EXPIRES_DAYS,
      JWT_ACCESS_TOKEN: this.JWT_ACCESS_TOKEN,
      JWT_REFRESH_TOKEN: this.JWT_REFRESH_TOKEN,
      REFRESH_TOKEN_EXPIRES_IN: this.REFRESH_TOKEN_EXPIRES_IN,
      FILE_SIZE_LIMIT: this.FILE_SIZE_LIMIT
    });

    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configuration ${key} is undefined.`);
      }
    }
  }
}

export const config: Config = new Config();
