import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["mp4", "zip", "pdf", "mp3", "png", "svg"],
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: false,
    },
    photo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
      },
    ],
    version: {
      type: String,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    licenseType: {
      type: String,
      enum: ["single", "multiple", "lifetime"],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
