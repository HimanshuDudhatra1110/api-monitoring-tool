import axios from "axios";
import ApiMonitor, { IApiMonitor } from "../models/apiMonitorModel.js";

export const performApiCheck = async (monitor: IApiMonitor) => {
  const start = Date.now();

  let success = false;
  let statusCode: number | null = null;
  let errorMessage: string | undefined;

  try {
    const response = await axios({
      url: monitor.url,
      method: monitor.method,
      timeout: monitor.timeout || 10000, // default 10s
      validateStatus: () => true, // prevent throwing on 4xx/5xx
    });

    statusCode = response.status;
    success = response.status >= 200 && response.status < 400;
  } catch (error: any) {
    success = false;

    if (error.code === "ECONNABORTED") {
      errorMessage = "Request timeout";
    } else {
      errorMessage = error.message;
    }
  }

  const responseTime = Date.now() - start;

  // ---- Stats Calculation ----

  const totalChecks = monitor.totalChecks + 1;
  const totalFailures = success
    ? monitor.totalFailures
    : monitor.totalFailures + 1;

  const uptime = ((totalChecks - totalFailures) / totalChecks) * 100;

  const avgResponseTime =
    (monitor.averageResponseTime * monitor.totalChecks + responseTime) /
    totalChecks;

  const consecutiveFailures = success ? 0 : monitor.consecutiveFailures + 1;

  const newLog = {
    timestamp: new Date(),
    responseTime,
    statusCode,
    success,
    errorMessage,
  };

  const updatedMonitor = await ApiMonitor.findByIdAndUpdate(
    monitor._id,
    {
      lastChecked: new Date(),
      lastStatus: success,
      lastResponseTime: responseTime,
      averageResponseTime: avgResponseTime,
      totalChecks,
      totalFailures,
      uptimePercentage: uptime,
      consecutiveFailures,
      $push: {
        logs: {
          $each: [newLog],
          $slice: -500,
        },
      },
    },
    { new: true },
  );

  if (!updatedMonitor) {
    throw new Error("Monitor not found after update");
  }

  return {
    monitor: updatedMonitor,
    result: newLog,
  };
};
