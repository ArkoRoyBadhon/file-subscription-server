"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const downloadedFiles = new mongoose_1.default.Schema({
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
}, {
    timestamps: true,
});
const DownloadedFile = mongoose_1.default.model("downloadedFiles", downloadedFiles);
exports.default = DownloadedFile;
