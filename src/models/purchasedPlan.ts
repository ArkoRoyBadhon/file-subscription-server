import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  limit: { type: Number, require: true },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    default: "",
    ref: "plan",
  },
});

const Plan = mongoose.model("purchasedPlan", planSchema);
export default Plan;
