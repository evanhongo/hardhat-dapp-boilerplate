import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

const startupServer = async () => {
  const server = express();
  const limiter = rateLimit({
    windowMs: 1000 * 60 * 10,
    max: 1000,
  });
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  server
    //Removes the X-Powered-By header, which is set by default in some frameworks
    .disable("x-powered-by")
    .use(
      express.static(
        path.join(
          __dirname,
          "../frontend/build"
        )
      ),
      express.json(),
      express.urlencoded({ extended: true }),
      cookieParser(),
      compression(),
      limiter
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
        // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // see https://expressjs.com/en/guide/behind-proxies.html
    .set("trust proxy", 1);
  
  //for health check
  server.get("/ping", (req, res) => res.send("pong"));
  
  server.get("*",(req, res) => {
    res.render("index");
  });

  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () =>
    console.log(
      chalk.red.bgBlue.bold.underline(
        `Server ready at http://localhost:${PORT}`
      )
    )
  );
};

startupServer();

export { startupServer };
