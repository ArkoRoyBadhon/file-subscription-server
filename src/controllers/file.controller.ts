import fs from "fs";
import path from "path";
import cloudinary from "../config/cloud";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import File from "../models/file.model";
import PurchasedPlan from "../models/purchasedPlan";
import sendResponse from "../utils/sendResponse";
export const accessFileController = catchAsyncError(async (req, res) => {
  const fileId = req.params.fileId;

  const isFileExist = await File.findById(fileId);
  if (!isFileExist) {
    return sendResponse(res, {
      message: "file not found",
      success: false,
      data: null,
      statusCode: 404,
    });
  }

  const fileName = isFileExist.filename;

  const existInLocal = fs.existsSync(isFileExist.path);
  if (!existInLocal) {
    return sendResponse(res, {
      message: "file not found maybe its deleted from the folder",
      success: false,
      data: null,
      statusCode: 404,
    });
  }

  const file = path.join(__dirname, "..", "files", fileName);
  const planId = req.purchasedPlanId as string;

  if (!isFileExist.isFree) {
    await PurchasedPlan.findByIdAndUpdate(
      planId,
      { $inc: { limit: -1 } },
      { new: true }
    );
  }
  res.sendFile(file);
});

export const uploadFile = catchAsyncError(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { filename, path, size, mimetype } = req.file;

  await File.create({ filename, path, size, mimetype });

  res.status(201).json({
    message: "File uploaded successfully",
    file: { filename, path, size, mimetype },
  });
});

export const deleteFile = catchAsyncError(async (req, res) => {
  const fileId = req.params.fileId;

  const isFileExist = await File.findById(fileId);
  if (!isFileExist) {
    return sendResponse(res, {
      message: "file not found",
      success: false,
      data: null,
      statusCode: 404,
    });
  }

  const filePath = isFileExist.path;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  const delteFile = await File.findByIdAndDelete(isFileExist._id);
  sendResponse(res, {
    message: "file deleted successfully",
    success: true,
    data: null,
    statusCode: 200,
  });
});

export const getSigninUrl = catchAsyncError(async (req, res) => {
  const fileId = req.params.fileId;
  const isFileExist = await File.findById(fileId);
  if (!isFileExist) {
    return sendResponse(res, {
      message: "file not found",
      success: false,
      data: null,
      statusCode: 404,
    });
  }

  const publicId = isFileExist.filename.split("Files/")[1];
  console.log(isFileExist.filename);

  const url = cloudinary.utils.private_download_url(
    "j6s7lsl8s7insh9gpydq",
    "mp4",
    {
      // type: "private",
      expires_at: Math.floor(Date.now() / 1000) + 3600, // URL expires in 30sec
    }
  );

  console.log(url);

  sendResponse(res, {
    message: "successfully get signin url",
    data: url,
    success: true,
  });
});
