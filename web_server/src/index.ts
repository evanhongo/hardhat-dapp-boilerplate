import path from "path";
import chalk from "chalk";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import bodyParser from "./middleware/bodyParser";
import rateLimiter from "./middleware/rateLimiter";
import logHandler from "./middleware/logHandler";
import logger from "./pkg/logger";


const startupServer = async () => {
  const PORT = process.env.PORT || 4000;
  const server = express();
  server
    //Removes the X-Powered-By header, which is set by default in some frameworks
    .disable("x-powered-by")
    // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // see https://expressjs.com/en/guide/behind-proxies.html
    .set("trust proxy", 1)
    .use(
      express.static(path.join(__dirname, "../../frontend/build")),
      compression(),
      bodyParser(),
      cookieParser(),
      rateLimiter(),
      logHandler()
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
    .get("/ping", (req, res) => {
      logger.info(req.body);
      res.send("pong");
    })
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