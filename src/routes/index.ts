import { Router } from "express";

export const healthCheck = Router();

healthCheck.get("/healthz", (req, res) => {
  res.status(200).json({
    message: "Server is up and running",
    success: true,
  });
});
