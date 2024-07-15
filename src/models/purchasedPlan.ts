import mongoose from "mongoose";

const PurchasedSchema = new mongoose.Schema(
  {
    limit: { type: Number, require: true },
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
