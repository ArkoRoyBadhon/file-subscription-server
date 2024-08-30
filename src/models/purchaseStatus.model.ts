import mongoose, { Document, Schema } from "mongoose";

interface IPurchaseStatus extends Document {
  packageId: string;
  packageName: string;
  freeDownloadCount: number;
  paidDownloadCount: number;
  remainingDownloadCount: number;
  userId: mongoose.Schema.Types.ObjectId;
}

const purchaseStatusSchema: Schema = new Schema({
  packageId: { type: String, required: true },
  packageName: { type: String, required: true },
  freeDownloadCount: { type: Number, default: 0 },
  paidDownloadCount: { type: Number, default: 0 },
  remainingDownloadCount: { type: Number, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const PurchaseStatus = mongoose.model<IPurchaseStatus>(
  "PurchaseStatus",
  purchaseStatusSchema
);

export default PurchaseStatus;
