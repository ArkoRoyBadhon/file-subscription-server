import mongoose, { Document, Schema } from 'mongoose';

interface IReview {
  user: mongoose.Schema.Types.ObjectId;
  rating: number;
  comment?: string;
}

export interface IProduct extends Document {
  fileName: string;
  fileType: 'mp4' | 'zip' | 'pdf' | 'mp3' | 'png' | 'svg' | 'jpeg';
  category: mongoose.Schema.Types.ObjectId;
  tags?: mongoose.Schema.Types.ObjectId;
  fileUrl: string;
  photo: string;
  description?: string;
  reviews: IReview[];
  version?: string;
  downloadCount: number;
  stock: number;
  licenseType?: 'single' | 'multiple' | 'lifetime';
  createdAt: Date; 
  updatedAt: Date; 
}

const productSchema = new Schema<IProduct>(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['mp4', 'zip', 'pdf', 'mp3', 'png', 'svg', 'jpeg'],
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    tags: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
    },
    fileUrl: {
      type: String,
      required: true,
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
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
      enum: ['single', 'multiple', 'lifetime'],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
