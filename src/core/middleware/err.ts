import { NextFunction, Request, Response } from "express";
import { config } from "../config";
import { ErrorHandler } from "../ErrorHandler";

export function errorMiddleware(
  err: ErrorHandler,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: NextFunction
) {
  err.statusCode = err.statusCode || 500;
  console.log("🚀 ~ statusCode:", err.statusCode);
  err.message = err.message || "Server Error";

  if (config.NODE_ENV === "production") {
    process.stderr.write(
      "==================== \n" +
        "Error: " +
        err.message +
        "\n" +
        "Stack: " +
        err.stack +
        "\n" +
        "==================== \n"
    );
  } else {
    console.warn(
      "==================== ERROR =================== \n" +
        "Error: " +
        err.message +
        "\n" +
        "Stack: " +
        err.stack +
        "\n" +
        "==================== ERROR ===================\n"
    );
  }
  return res.status(err.statusCode).json({
    success: false,
    status: err.statusCode,
    error: err.message,
  });
}
