import express, { Application } from "express";
import cors from "cors";
import { errorMiddleware } from "./core/middleware";
import { requestHandler, Router } from "./core";
import { healthCheck } from "./routes";

const bootstrap = async (app: Application) => {
  /**
   * CORS SETUP
   */
  app.use(cors());

  /**
   * SYSTEM MIDDLEWARE
   */
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  /**
   * SETUP ROUTES
   */

  const router = Router.make("/api/v1", app);

  router
    .addRoute({
      path: "/",
      handler: healthCheck,
      middlewares: [
        (req, res, next) => {
          console.log("Health Check");
          next();
        },
        (req, res, next) => {
          console.log("Health Check 2");
          next();
        },
      ],
    })
    .addRoute({
      path: "/user",
      handler: requestHandler(async (req, res) => {
        res.status(200).json({
          message: "User route",
          success: true,
          status: 200,
        });
      }),
      middlewares: [
        (req, res, next) => {
          console.log("User Middleware");
          next();
        },
      ],
      isPublic: true,
    })
    .start();

  app.use(errorMiddleware);

  /**
   * START SERVER
   */
  const server = app.listen(9000, () => {
    console.log("Server started on port 9000");
  });

  server.on("error", (err) => {
    console.warn(err.message);
    process.exit(-1);
  });
};

bootstrap(express());
