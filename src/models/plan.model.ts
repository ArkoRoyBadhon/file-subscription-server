import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  limit: { type: Number, require: true },
  price: { type: Number, require: true },
  name: { type: String, require: true },
  expire: { type: Number, require: false }, // in day count, if not found means unlimited
});

const Plan = mongoose.model("Plan", planSchema);
export default Plan;
