import path from "path";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import File from "../models/file.model";
import PurchasedPlan from "../models/purchasedPlan";
export const accessFileController = catchAsyncError(async (req, res) => {
  const fileName = req.params.fileName;

  const file = path.join(__dirname, "..", "filefs", fileName);
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

  await File.create({ filename, path, size, mimetype });

  res.status(201).json({
    message: "File uploaded successfully",
    file: { filename, path, size, mimetype },
  });
});

