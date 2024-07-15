import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    limit: { type: Number, required: true },
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

const PurchasedPlan = mongoose.model("purchasedPlan", planSchema);
export default PurchasedPlan;
