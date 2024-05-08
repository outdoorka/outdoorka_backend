import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

/**
 * 對應 config.env 的設定
 */
class Config {
  public PORT: string | undefined;
  public NODE_ENV: string | undefined;
  public LOG_TOKEN: string | undefined;
  public APP_URL: string | undefined;
  public DATABASE_URL: string | undefined;
  public DATABASE_PASSWORD: string | undefined;
  public JWT_SECRET: string | undefined;
  public JWT_EXPIRES_DAYS: string | undefined;

  constructor() {
    this.PORT = process.env.PORT || '3006';
    this.NODE_ENV = process.env.NODE_ENV || 'production';
    this.LOG_TOKEN = process.env.LOG_TOKEN || '';
    this.APP_URL = process.env.APP_URL || 'http://localhost:3006';
    this.DATABASE_URL = process.env.DATABASE_URL || '';
    this.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
    this.JWT_SECRET = process.env.JWT_SECRET || '';
    this.JWT_EXPIRES_DAYS = process.env.JWT_EXPIRES_DAYS || '7d';
  }

  /**
   * 驗證設定
   */
  public validateConfig(): void {
    console.info(this);
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configuration ${key} is undefined.`);
      }
    }
  }
}

export const config: Config = new Config();
