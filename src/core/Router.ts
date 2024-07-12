import { Application, Router as ExpressRouter, RequestHandler } from "express";
import { MiddleWareType } from "./types";
import { isAuthenticated } from "./middleware/isAuthenticated";

interface IRoute<T extends RequestHandler | ExpressRouter> {
  path: string;
  handler: T;
  middlewares?: MiddleWareType[];
  isPublic?: boolean;
}

export class Router {
  private app: Application;
  private prefix: string;
  private routes: IRoute<RequestHandler | ExpressRouter>[] = [];

  private constructor(prefix: string, app: Application) {
    this.prefix = prefix;
    this.app = app;
  }

  // Static factory method for creating a Router instance
  static make(prefix: string, app: Application): Router {
    return new Router(prefix, app);
  }

  // Define a route with optional middlewares and public/private access

  /**
   * Adds a route to the router with optional middlewares and public/private access.
   *
   * @template T - The type of the handler, either a RequestHandler or an ExpressRouter.
   * @param {string} route.path - The path for the route.
   * @param {T} route.handler - The handler for the route, can be a RequestHandler or an ExpressRouter.
   * @param {boolean} [route.isPublic=true] - Indicates if the route is public. Defaults to true.
   * @param {MiddleWareType[]} [route.middlewares=[]] - An array of middlewares to apply to the route. Defaults to an empty array.
   * @returns {this} The current Router instance for method chaining.
   */
  public addRoute<T extends RequestHandler | ExpressRouter>({
    path,
    handler,
    isPublic = true,
    middlewares = [],
  }: IRoute<T>): this {
    this.routes.push({
      path,
      handler,
      isPublic,
      middlewares,
    });
    return this;
  }

  // Start the router by applying all defined routes to the express application
  public start(): void {
    this.routes.forEach((route) => {
      const router = ExpressRouter();
      const fullPath = this.prefix + route.path;

      if (!route.isPublic) {
        router.use(isAuthenticated);
      }

      // Apply middlewares to the router for this specific route
      if (route.middlewares?.length) {
        router.use(...route.middlewares);
      }

      // Apply the handler to the router for this specific route
      router.use(route.handler);

      // Mount the router on the application at the specified path
      this.app.use(fullPath, router);
    });
  }
}
