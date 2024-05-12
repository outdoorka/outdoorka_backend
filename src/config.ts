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

  constructor() {
    this.PORT = process.env.PORT || '3006';
    this.NODE_ENV = process.env.NODE_ENV || 'production';
    this.LOG_TOKEN = process.env.LOG_TOKEN || '';
    this.APP_URL = process.env.APP_URL || 'http://localhost:3006';
    this.DATABASE_URL = process.env.DATABASE_URL || '';
    this.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
    this.JWT_EXPIRES_DAYS = process.env.JWT_EXPIRES_DAYS || '7d';

    this.JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN || '';
    this.JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN || '';
    this.REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '3';
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
