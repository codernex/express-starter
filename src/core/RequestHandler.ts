import { NextFunction, Response } from "express";
import { APIResponse, CustomRequest, Handler } from "./types";
import { ErrorHandler } from "./ErrorHandler";
import { prettyError } from "../utils";

/**
 *
 * @param handler An Express Request Handler Function
 * @param config An Optional Object That Takes Zod Schema as Request Query, Body, Params To Validate
 * @returns Promise<void> | Promise<NextFunction>
 */

export const requestHandler = <TQuery, TBody, TParams>(
  handler: Handler<TQuery, TBody, TParams>,
  config?: {
    query?: TQuery;
    body?: TBody;
    params?: TParams;
  }
) => {
  return async (
    req: CustomRequest<TQuery, TBody, TParams>,
    res: Response<APIResponse>,
    next: NextFunction
  ) => {
    // Validate Request Query, Body, Params
    if (config) {
      console.log(config);
    }
    await Promise.resolve(handler(req, res, next)).catch((err) => {
      return next(new ErrorHandler(prettyError(err), err.statusCode));
    });
  };
};
