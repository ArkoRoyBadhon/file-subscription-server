import { Document, Schema, model } from "mongoose";

// Define the Plan interface extending Mongoose's Document
export interface IPlan extends Document {
  limit: number;
  price: number;
  name: string;
  expire?: number; 
  createdAt: Date; 
  updatedAt: Date; 
}

// Define the Plan schema
const planSchema = new Schema<IPlan>(
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

const Plan = model<IPlan>("Plan", planSchema);

export default Plan;
