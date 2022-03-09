import { createLogger, format, transports, addColors } from "winston";
import { TransformableInfo } from "logform";

const config = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: "red",
    warn: "orange",
    info: "green",
    http: "yellow",
    verbose: "cyan",
    debug: "blue",
    silly: "magenta"
  },
};

addColors(config.colors);

const formatParams = (info: TransformableInfo) => {
  const { timestamp, level, message } = info;
  return `[${timestamp}] ${level}: ${message.replace(/[\r\n]/g, "")}`;
};

// level 在 silly 以上的都會輸出到 console
const logger = createLogger({
  level: "silly",
  //levels: config.levels,
  handleExceptions: true,
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(formatParams)
  ),
  transports: [new transports.Console()],
});

export default logger;
