import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    limit: { type: Number, required: true },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    expire: { type: Number, required: false }, // in day count, if not found means unlimited
  },
  {
    timestamps: true,
  }
);

const Plan = mongoose.model("plan", planSchema);
export default Plan;
