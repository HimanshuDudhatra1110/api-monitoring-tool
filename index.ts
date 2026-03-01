import express, { type Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import healthRouter from "./routes/healthRoute.js";
import monitorRoutes from "./routes/apiMonitorRoute.js";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in environment variables.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/monitors", monitorRoutes);

const connectWithRetry = async (retries = 5): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error(`MongoDB connection failed. Retries left: ${retries - 1}`);

    if (retries <= 1) {
      console.error("Max retries reached. Exiting process.");
      process.exit(1);
    }

    // wait 5 seconds before retrying
    await new Promise((resolve) => setTimeout(resolve, 5000));

    return connectWithRetry(retries - 1);
  }
};

const startServer = async () => {
  await connectWithRetry(5);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
