import { requestHandler } from "../RequestHandler";

export const isAuthenticated = requestHandler(async (req, res, next) => {
  next();
});
