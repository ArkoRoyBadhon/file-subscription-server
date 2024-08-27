import mongoose, { Document } from "mongoose";

interface IPurchase extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  plan: mongoose.Schema.Types.ObjectId;
  limit: number;
  createdAt: Date; 
  updatedAt: Date; 
}

const PurchasedSchema = new mongoose.Schema(
  {
    limit: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: "",
      ref: "plan",
    },
  },
  {
    timestamps: true,
  }
);

const PurchasedPlan = mongoose.model<IPurchase>("purchasedPlan", PurchasedSchema);
export default PurchasedPlan;
