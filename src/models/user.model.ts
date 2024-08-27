import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: false,
      default: "user",
      enum: ["user", "admin"],
    },
    downloadedItems: { type: Number, default: 0 },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
      ref: "purchasedPlan",
    },
    planDate: { type: Date, required: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);
export default User;
