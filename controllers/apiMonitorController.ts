import { Request, Response } from "express";
import ApiMonitor from "../models/apiMonitorModel.js";
import { performApiCheck } from "../services/apiCheckerService.js";

// CREATE
export const createMonitor = async (req: Request, res: Response) => {
  try {
    const monitor = await ApiMonitor.create(req.body);
    return res.status(201).json({ success: true, data: monitor });
  } catch (err) {
    console.error("Error in createMonitor : ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// READ ALL
export const getAllMonitors = async (_: Request, res: Response) => {
  try {
    const monitors = await ApiMonitor.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: monitors });
  } catch (err) {
    console.error("Error in getAllMonitors : ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// READ ONE
export const getMonitorById = async (req: Request, res: Response) => {
  try {
    const monitor = await ApiMonitor.findById(req.params.id);
    if (!monitor) {
      return res
        .status(404)
        .json({ success: false, message: "Monitor not found" });
    }
    return res.json({ success: true, data: monitor });
  } catch (err) {
    console.error("Error in getMonitorById : ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// UPDATE
export const updateMonitor = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ success: false, message: "ID required" });
    }

    const allowedFields = [
      "name",
      "url",
      "method",
      "timeout",
      "interval",
      "monitoringType",
      "isActive",
    ];

    const updateData: any = {};

    for (const key of allowedFields) {
      if (key in req.body) {
        updateData[key] = req.body[key];
      }
    }

    const monitor = await ApiMonitor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    if (!monitor) {
      return res
        .status(404)
        .json({ success: false, message: "Monitor not found" });
    }

    return res.json({ success: true, data: monitor });
  } catch (err) {
    console.error("Error in updateMonitor : ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// DELETE (soft delete via isActive)
export const deleteMonitor = async (req: Request, res: Response) => {
  try {
    const monitor = await ApiMonitor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );

    if (!monitor) {
      return res
        .status(404)
        .json({ success: false, message: "Monitor not found" });
    }

    return res.json({ success: true, message: "Monitor deactivated" });
  } catch (err) {
    console.error("Error in deleteMonitor : ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// MANUAL CHECK
export const triggerManualCheck = async (req: Request, res: Response) => {
  try {
    const monitor = await ApiMonitor.findById(req.params.id);
    if (!monitor) {
      return res
        .status(404)
        .json({ success: false, message: "Monitor not found" });
    }

    const result = await performApiCheck(monitor);

    return res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error in triggerManualCheck : ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
