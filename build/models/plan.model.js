"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const planSchema = new mongoose_1.default.Schema({
    limit: { type: Number, required: true },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    expire: { type: Number, required: false }, // in day count, if not found means unlimited
}, {
    timestamps: true,
});
const Plan = mongoose_1.default.model("plan", planSchema);
exports.default = Plan;
