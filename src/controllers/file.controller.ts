import path from "path";
import catchAsyncError from "../middlewares/catchAsyncErrors";
export const accessFileController = catchAsyncError(async (req, res) => {
  const fileName = req.params.fileName;
  // const url = "http://localhost:5000";
  // const fileURL = `${url}/images/${fileName}`;
  // res.json({ success: true, message: "file get successfully", data: fileURL });

  const file = path.join(__dirname, "..", "files", fileName);
  res.sendFile(file);
});
