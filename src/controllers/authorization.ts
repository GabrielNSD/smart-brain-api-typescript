import { Request, Response } from "express";

import { connectDatabase } from "./signin";

export const requireAuth = async (req: Request, res: Response, next: any) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json("Unauthorized");
  }
  const redisClient = await connectDatabase();

  const response = await redisClient.get(authorization);
  if (!response) {
    return res.status(401).json("Unauthorized");
  }
  return next();
};
