import { createLogger, format, transports, addColors, Logger } from "winston";
import { TransformableInfo } from "logform";
interface ILogger {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
  http(msg: string): void;
}

export class WinstonLogger implements ILogger {
  private logger: Logger;

  constructor() {
    const config = {
      levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
      },
      colors: {
        error: "red",
        warn: "orange",
        data: "grey",
        info: "green",
        http: "yellow",
        verbose: "cyan",
        debug: "blue",
        silly: "magenta"
      }
    };
    const formatParams = (info: TransformableInfo) => {
      let { timestamp, level, message } = info;
      message =  message.toString().replace(/[\r\n]/g, "");
      return `[${timestamp}] ${level}: ${message}`;
    };
    addColors(config.colors);
    this.logger = createLogger({
      level: "http",
      levels: config.levels,
      handleExceptions: true,
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(formatParams)
      ),
      transports: [new transports.Console()]
    });
  }

  info(msg: string): void {
    this.logger.info(msg);
  }

  warn(msg: string): void {
    this.logger.warn(msg);
  }

  error(msg: string): void {
    this.logger.error(msg);
  }

  http(msg: string): void {
    this.logger.http(msg);
  }
}

const logger = new WinstonLogger();

export default logger;