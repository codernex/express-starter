import { Response } from "express";
import { User } from "../db/entities";
import { ErrorHandler } from "./ErrorHandler";
import * as jwt from "jsonwebtoken";
import { config } from "./config";

export const sendToken = (res: Response, user: User | null) => {
  if (!user) {
    throw new ErrorHandler("Please Login Again", 404);
  }
  const token = jwt.sign(
    { sub: user.id, phone: user.phone },
    config.JWT_SECRET,
    {
      expiresIn: "365d",
    }
  );

  if (!token) {
    throw new ErrorHandler(
      "Please Login Again There are some unexpected error",
      404
    );
  }

  const { password, ...userWithoutPass } = user;
  res.status(200).json({
    user: userWithoutPass,
    accessToken: token,
  });
};
