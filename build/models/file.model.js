"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fileSchema = new mongoose_1.default.Schema({
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    isFree: { type: Boolean, required: true, default: false },
}, {
    timestamps: true,
});
const File = mongoose_1.default.model("file", fileSchema);
exports.default = File;
