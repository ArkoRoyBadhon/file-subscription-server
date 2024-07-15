import { Router } from "express";
import multer from "multer";

import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloud";
import {
  accessFileController,
  deleteFile,
  getSigninUrl,
  uploadFile,
} from "../controllers/file.controller";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth";
import { isValidPlanHolder } from "../middlewares/isValidPlanHolder";

const params = {
  folder: "Files",
  resource_type: "auto",
  type: "private",
};
const storage = new CloudinaryStorage({
  cloudinary,
  params,
});

// Multer Upload Instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

const router = Router();
router.get(
  "/access/:fileId",
  isAuthenticatedUser,
  isValidPlanHolder,
  accessFileController
);
router.post(
  "/upload",
  upload.single("file"),
  // isAuthenticatedUser,
  // authorizeRoles("admin"),
  uploadFile
);
router.delete(
  "/delete/:fileId",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteFile
);

router.get("/get-signinurl/:fileId", getSigninUrl);

const fileRoute = router;
export default fileRoute;
