export class ErrorHandler extends Error {
  constructor(
    public message: string,
    public statusCode?: number
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
