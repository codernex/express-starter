import { NextFunction, Request, Response } from "express";
import { IncomingMessage } from "http";
type User = {};

/**
 * Custom Request Handler Type
 */
export type Handler<TQuery, TBody, TParams, TResponse = APIResponse> = (
  req: CustomRequest<TQuery, TBody, TParams>,
  res: Response<TResponse>,
  next: NextFunction
) => Promise<void> | Promise<Response> | Promise<NextFunction>;

export type CustomRequest<TQuery, TBody, TParams> = Request<
  TParams,
  any,
  TBody,
  TQuery
> & { user?: User };

export type APIResponse = {
  status: number;
  data?: any;
  error?: Record<string, any>;
  success: boolean;
  message?: string;
};

export type MiddleWareType = <
  TReq extends IncomingMessage,
  TRes extends Response<any, Record<string, any>>,
>(
  req: TReq,
  res: TRes,
  next: NextFunction
) => void;
