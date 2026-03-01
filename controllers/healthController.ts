import { type Request, type Response } from "express";

export const healthCheck = (req: Request, res: Response): Response => {
  return res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
};
