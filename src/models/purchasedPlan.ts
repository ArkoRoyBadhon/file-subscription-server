import mongoose from "mongoose";

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

const PurchasedPlan = mongoose.model("purchasedPlan", PurchasedSchema);
export default PurchasedPlan;
