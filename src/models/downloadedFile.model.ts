import mongoose from "mongoose";

const downloadedFiles = new mongoose.Schema(
  {
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const DownloadedFile = mongoose.model("downloadedFiles", downloadedFiles);
export default DownloadedFile;
