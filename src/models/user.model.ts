import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["user", "admin"] },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    default: "",
    ref: "purchasedPlan",
  },
  planDate: { type: Date, required: false },
});

const User = mongoose.model("User", userSchema);
export default User;
