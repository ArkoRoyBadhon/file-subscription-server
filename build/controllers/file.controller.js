"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSigninUrl = exports.deleteFile = exports.uploadFile = exports.accessFileController = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cloud_1 = __importDefault(require("../config/cloud"));
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const file_model_1 = __importDefault(require("../models/file.model"));
const purchasedPlan_1 = __importDefault(require("../models/purchasedPlan"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
exports.accessFileController = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileId = req.params.fileId;
    const isFileExist = yield file_model_1.default.findById(fileId);
    if (!isFileExist) {
        return (0, sendResponse_1.default)(res, {
            message: "file not found",
            success: false,
            data: null,
            statusCode: 404,
        });
    }
    const fileName = isFileExist.filename;
    const existInLocal = fs_1.default.existsSync(isFileExist.path);
    if (!existInLocal) {
        return (0, sendResponse_1.default)(res, {
            message: "file not found maybe its deleted from the folder",
            success: false,
            data: null,
            statusCode: 404,
        });
    }
    const file = path_1.default.join(__dirname, "..", "files", fileName);
    const planId = req.purchasedPlanId;
    if (!isFileExist.isFree) {
        yield purchasedPlan_1.default.findByIdAndUpdate(planId, { $inc: { limit: -1 } }, { new: true });
    }
    res.sendFile(file);
}));
exports.uploadFile = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const { filename, path, size, mimetype } = req.file;
    yield file_model_1.default.create({ filename, path, size, mimetype });
    res.status(201).json({
        message: "File uploaded successfully",
        file: { filename, path, size, mimetype },
    });
}));
exports.deleteFile = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileId = req.params.fileId;
    const isFileExist = yield file_model_1.default.findById(fileId);
    if (!isFileExist) {
        return (0, sendResponse_1.default)(res, {
            message: "file not found",
            success: false,
            data: null,
            statusCode: 404,
        });
    }
    const filePath = isFileExist.path;
    if (fs_1.default.existsSync(filePath)) {
        fs_1.default.unlinkSync(filePath);
    }
    const delteFile = yield file_model_1.default.findByIdAndDelete(isFileExist._id);
    (0, sendResponse_1.default)(res, {
        message: "file deleted successfully",
        success: true,
        data: null,
        statusCode: 200,
    });
}));
exports.getSigninUrl = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileId = req.params.fileId;
    const isFileExist = yield file_model_1.default.findById(fileId);
    if (!isFileExist) {
        return (0, sendResponse_1.default)(res, {
            message: "file not found",
            success: false,
            data: null,
            statusCode: 404,
        });
    }
    const publicId = isFileExist.filename.split("Files/")[1];
    console.log(isFileExist.filename);
    const url = cloud_1.default.utils.private_download_url("j6s7lsl8s7insh9gpydq", "mp4", {
        // type: "private",
        expires_at: Math.floor(Date.now() / 1000) + 3600, // URL expires in 30sec
    });
    console.log(url);
    (0, sendResponse_1.default)(res, {
        message: "successfully get signin url",
        data: url,
        success: true,
    });
}));
