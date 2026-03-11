import { type Request, type Response } from "express";

export const healthCheck = (req: Request, res: Response): Response => {
  console.log("🎯 Health check ping received");

  return res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
};
