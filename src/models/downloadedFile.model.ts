import mongoose, { Document, Schema } from "mongoose";

export interface IDownloadedFile extends Document {
  filename: string;
  fileType: string;
  photo: string;
  user: mongoose.Schema.Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

const downloadedFileSchema = new Schema<IDownloadedFile>(
  {
    filename: { type: String, required: true },
    fileType: { type: String, required: true },
    photo: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const DownloadedFile = mongoose.model<IDownloadedFile>(
  "DownloadedModel",
  downloadedFileSchema
);

export default DownloadedFile;
