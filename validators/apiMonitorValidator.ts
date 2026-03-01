import { z } from "zod";

export const createMonitorSchema = z
  .object({
    name: z.string().min(1, "Name is required"),

    url: z.string().url("Invalid URL format"),

    method: z.enum(["GET"]).default("GET"),

    timeout: z
      .number()
      .min(1000, "Timeout must be at least 1000ms")
      .max(60000, "Timeout too large")
      .optional(),

    interval: z
      .number()
      .min(1, "Minimum interval is 1 hour")
      .max(24, "Max interval allowed is 24 hours")
      .optional(),

    monitoringType: z.enum(["scheduled", "manual"]).default("scheduled"),

    isActive: z.boolean(),
  })
  .strict(); // 🚨 VERY IMPORTANT;

export const updateMonitorSchema = createMonitorSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
