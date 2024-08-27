import { Request, Response, NextFunction } from "express";
import sendResponse from "../utils/sendResponse";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import DownloadedFile from "../models/downloadedFile.model";

export const getUserDownloadsController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    if (!userId) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "User ID is missing or invalid",
        data: null,
      });
    }

    const userDownloads = await DownloadedFile.find({ user: userId });

    if (!userDownloads || userDownloads.length === 0) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "No downloads found for this user",
        data: null,
      });
    }

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User downloads retrieved successfully",
      data: userDownloads,
    });
  }
);
