import morgan from "morgan";
import logger from "../pkg/logger";

morgan.token("status", (_, res) => {
  const status = res.headersSent ? res.statusCode : undefined;

  // get status color
  const color =
    status >= 500
      ? 31 // red
      : status >= 400
      ? 33 // yellow
      : status >= 300
      ? 36 // cyan
      : status >= 200
      ? 32 // green
      : 0; // no color

  return `\x1b[${color}m${status}\x1b[0m`;
});

const dev = ":method :url :status :response-time ms";
const production =
  ":remote-addr :method :url :status :response-time ms :user-agent";
const morganFormat = process.env.NODE_ENV === "production" ? production : dev;

const logHandler = () => morgan(morganFormat, {
  stream: {
    write: (msg) => {
      logger.http(msg);
    }
  }
});

export default logHandler;