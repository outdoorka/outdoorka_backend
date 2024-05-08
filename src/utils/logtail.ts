import { config } from '../config';
import pino from 'pino';

class Logtail {
  private readonly _token: string | undefined;
  public logger: pino.Logger | undefined;

  constructor(token: string | undefined) {
    this._token = token;
    this.createLogger();
  }

  private createLogger() {
    if (config.NODE_ENV === 'production') {
      const transport = pino.transport({
        target: '@logtail/pino',
        options: { sourceToken: this._token }
      });
      this.logger = pino(transport);
    } else {
      this.logger = pino({
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true
          }
        }
      });
    }
  }

  public info(message: string, data?: any) {
    this.logger?.info(data, message);
  }

  public error(message: string, data?: any) {
    this.logger?.error(data, message);
  }

  public warn(message: string, data?: any) {
    this.logger?.warn(data, message);
  }

  public debug(message: string, data?: any) {
    this.logger?.debug(data, message);
  }

  public trace(message: string, data?: any) {
    this.logger?.trace(data, message);
  }

  public fatal(message: string, data?: any) {
    this.logger?.fatal(data, message);
  }
}

const logtail: Logtail = new Logtail(config.LOG_TOKEN);
export default logtail;
