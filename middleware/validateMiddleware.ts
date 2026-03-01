import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import mongoose from "mongoose";

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed; // sanitized data
      next();
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.errors?.[0]?.message || "Invalid input",
      });
    }
  };

export const validateObjectId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;

  // First ensure it exists AND is a string
  if (!id || typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  // Now TypeScript knows id is string
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  next();
};
