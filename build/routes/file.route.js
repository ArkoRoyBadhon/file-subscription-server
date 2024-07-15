"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloud_1 = __importDefault(require("../config/cloud"));
const file_controller_1 = require("../controllers/file.controller");
const auth_1 = require("../middlewares/auth");
const isValidPlanHolder_1 = require("../middlewares/isValidPlanHolder");
const params = {
    folder: "Files",
    resource_type: "auto",
    type: "private",
};
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloud_1.default,
    params,
});
// Multer Upload Instance
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: (req, file, cb) => {
        cb(null, true);
    },
});
const router = (0, express_1.Router)();
router.get("/access/:fileId", auth_1.isAuthenticatedUser, isValidPlanHolder_1.isValidPlanHolder, file_controller_1.accessFileController);
router.post("/upload", upload.single("file"), 
// isAuthenticatedUser,
// authorizeRoles("admin"),
file_controller_1.uploadFile);
router.delete("/delete/:fileId", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), file_controller_1.deleteFile);
router.get("/get-signinurl/:fileId", file_controller_1.getSigninUrl);
const fileRoute = router;
exports.default = fileRoute;
