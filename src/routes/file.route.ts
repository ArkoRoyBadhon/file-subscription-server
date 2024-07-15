import { Router } from "express";
import multer from "multer";
import path from "path";
import {
  accessFileController,
  uploadFile,
} from "../controllers/file.controller";
import { isAuthenticatedUser } from "../middlewares/auth";
import { isValidPlanHolder } from "../middlewares/isValidPlanHolder";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/files");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
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
  "/access/:fileName",
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
const fileRoute = router;
export default fileRoute;
