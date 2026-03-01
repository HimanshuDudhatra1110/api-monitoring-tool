import mongoose, { Schema, Document } from "mongoose";

export type MonitoringType = "scheduled" | "manual";

interface ILogEntry {
  timestamp: Date;
  responseTime: number;
  statusCode: number | null;
  success: boolean;
  errorMessage?: string;
}

export interface IApiMonitor extends Document {
  name: string;
  url: string;
  method: "GET";
  timeout: number; // ms
  interval: number; // hours (min 1)
  monitoringType: MonitoringType;

  isActive: boolean;

  lastChecked: Date | null;
  lastStatus: boolean | null;
  lastResponseTime: number | null;

  averageResponseTime: number;
  totalChecks: number;
  totalFailures: number;
  uptimePercentage: number;
  consecutiveFailures: number;

  logs: ILogEntry[];

  createdAt: Date;
  updatedAt: Date;
}

const LogSchema = new Schema<ILogEntry>(
  {
    timestamp: { type: Date, default: Date.now },
    responseTime: { type: Number, required: true },
    statusCode: { type: Number, default: null },
    success: { type: Boolean, required: true },
    errorMessage: { type: String },
  },
  { _id: false },
);

const ApiMonitorSchema = new Schema<IApiMonitor>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true, index: true },

    method: {
      type: String,
      enum: ["GET"],
      default: "GET",
    },

    timeout: {
      type: Number,
      default: 10000,
    },

    interval: {
      type: Number,
      default: 1,
      min: 1,
    },

    monitoringType: {
      type: String,
      enum: ["scheduled", "manual"],
      default: "scheduled",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastChecked: {
      type: Date,
      default: null,
    },

    lastStatus: {
      type: Boolean,
      default: null,
    },

    lastResponseTime: {
      type: Number,
      default: null,
    },

    averageResponseTime: {
      type: Number,
      default: 0,
    },

    totalChecks: {
      type: Number,
      default: 0,
    },

    totalFailures: {
      type: Number,
      default: 0,
    },

    uptimePercentage: {
      type: Number,
      default: 100,
    },

    consecutiveFailures: {
      type: Number,
      default: 0,
    },

    logs: {
      type: [LogSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const ApiMonitor = mongoose.model<IApiMonitor>("ApiMonitor", ApiMonitorSchema);
export default ApiMonitor;
