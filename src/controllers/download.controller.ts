import { Request, Response, NextFunction } from "express";
import sendResponse from "../utils/sendResponse";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import DownloadedFile from "../models/downloadedFile.model";
import User from "../models/user.model";
import Product from "../models/product.model";
import path from "path";
import fs from "fs";
import PurchaseStatus from "../models/purchaseStatus.model";
// import { getIO } from "../config/socket";

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

const getMimeType = (fileType: string) => {
  const mimeTypes: { [key: string]: string } = {
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    pdf: "application/pdf",
    zip: "application/zip",
    html: "application/html",
  };

  return mimeTypes[fileType] || "application/octet-stream";
};

export const downloadProductController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;


    if (!req.user || !req.user._id) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing or invalid",
      });
    }

    const { _id: userId } = req.user;

    const UserMain = await User.findById(userId);

    if (!UserMain) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
        data: null,
      });
    }

    const product = await Product.findById(productId).populate("tags");

    if (!product) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Product not found",
        data: null,
      });
    }

    const statusCount = await PurchaseStatus.findOne({ userId });

    if (!statusCount) {
      return sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Something went worng",
        data: null,
      });
    }

    if (statusCount.remainingDownloadCount <= 0) {
      return sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Download Limit Finish. Please Upgrade Plan.",
        data: null,
      });
    }

    // @ts-ignore
    if(product.tags?.label !== "Free") {
      statusCount.remainingDownloadCount -= 1
      statusCount.paidDownloadCount += 1
    }else {
      statusCount.freeDownloadCount += 1
    }

    await statusCount.save()

    product.downloadCount = (product.downloadCount || 0) + 1;
    await product.save();

    const payload = {
      filename: product.fileName,
      fileType: product.fileType,
      photo: product.photo,
      user: userId,
    };

    await DownloadedFile.create(payload);
    // const io = getIO();
    // io.to(userId.toString()).emit("dummy_notification", {
    //   message: "This is a test notification.",
    // });


    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      product.fileUrl
    );

    // console.log("Attempting to download file at:", filePath);

    if (!fs.existsSync(filePath)) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "File not found",
        data: null,
      });
    }

    const fileExtension = `.${product.fileType}`;
    const fileNameWithExtension = `${product.fileName}${fileExtension}`;

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileNameWithExtension}"`
    );
    res.setHeader("Content-Type", getMimeType(product.fileType));

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
);
