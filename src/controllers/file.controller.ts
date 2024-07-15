import fs from "fs";
import path from "path";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import File from "../models/file.model";
import PurchasedPlan from "../models/purchasedPlan";
import sendResponse from "../utils/sendResponse";


export const accessFileController = catchAsyncError(async (req, res) => {
  const fileId = req.params.fileId;
  // console.log(fileId);

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

  await PurchasedPlan.findByIdAndUpdate(
    planId,
    { $inc: { limit: -1 } },
    { new: true }
  );
  res.sendFile(file);
});

export const uploadFile = catchAsyncError(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { filename, path, size, mimetype } = req.file;

  const file = await File.create({ filename, path, size, mimetype });

  res.status(201).json({
    message: "File uploaded successfully",
    data: file,
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
    // Delete file
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
