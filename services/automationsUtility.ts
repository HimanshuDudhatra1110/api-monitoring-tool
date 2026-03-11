import cron from "node-cron";
import ApiMonitor from "../models/apiMonitorModel.js";
import { performApiCheck } from "./apiCheckerService.js";

export const scheduledMonitoringCron = () => {
  // run every hour
  cron.schedule("0 * * * *", async () => {
    console.log("Running API monitor cron...");

    try {
      const monitors = await ApiMonitor.find({
        monitoringType: "scheduled",
        isActive: true,
      });

      const now = Date.now();

      for (const monitor of monitors) {
        try {
          // if never checked → run immediately
          if (!monitor.lastChecked) {
            await performApiCheck(monitor);
            continue;
          }

          const intervalMs = monitor.interval * 60 * 60 * 1000;

          const timeSinceLastCheck =
            now - new Date(monitor.lastChecked).getTime();

          if (timeSinceLastCheck >= intervalMs) {
            await performApiCheck(monitor);
          }
        } catch (error) {
          console.error(`Monitor failed: ${monitor._id}`, error);
        }
      }
    } catch (error) {
      console.error("Cron error in startMonitoringCron:", error);
    }
  });
};
