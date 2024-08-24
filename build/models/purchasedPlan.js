"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PurchasedSchema = new mongoose_1.default.Schema({
    limit: { type: Number, require: true },
    plan: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: false,
        default: "",
        ref: "plan",
    },
}, {
    timestamps: true,
});
const PurchasedPlan = mongoose_1.default.model("purchasedPlan", PurchasedSchema);
exports.default = PurchasedPlan;
