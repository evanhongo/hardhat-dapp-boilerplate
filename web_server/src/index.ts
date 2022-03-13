import path from "path";
import chalk from "chalk";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import handleLog from "./middleware/handleLog";
import logger from "./utils/logger";

const PORT = process.env.PORT || 4000;

const startupServer = async () => {
  const server = express();
  const limiter = rateLimit({
    windowMs: 1000 * 60 * 10,
    max: 1000,
  });
  
  server
    //Removes the X-Powered-By header, which is set by default in some frameworks
    .disable("x-powered-by")
    // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // see https://expressjs.com/en/guide/behind-proxies.html
    .set("trust proxy", 1)
    .use(
      express.static(path.join(__dirname, "../../frontend/build")),
      express.text(),
      express.json(),
      express.urlencoded({ extended: true }),
      express.raw(),
      cookieParser(),
      compression(),
      limiter,
      handleLog
      //TODO: disable inline style
      // helmet({
      //   contentSecurityPolicy: {
      //     directives: {
      //       "default-src": "*",
      //       "script-src": ["'self'", "'unsafe-inline'"],
      //       "style-src": ["'self'", "'unsafe-inline'"]
      //     }
      //   }
      // })
    )
    //for health check
    .get("/ping", (req, res) => res.send("pong"))
    .get("*", (req, res) => {
      res.render("index");
    })
    .listen(PORT, () =>
      logger.info(
        chalk.red.bgBlue.bold.underline(
          `Server ready at http://localhost:${PORT}`
        )
      )
    );
};

startupServer();

export { startupServer };
