import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    mimetype: { type: String, require: true },
    size: { type: Number, require: true },
    filename: { type: String, require: true },
    path: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileSchema);
export default File;
