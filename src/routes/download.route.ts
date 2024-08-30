import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth";
import { downloadProductController, getUserDownloadsController } from "../controllers/download.controller";

const router = express.Router();

router.get("/buy/:productId",isAuthenticatedUser, downloadProductController );
router.get("/get", isAuthenticatedUser, getUserDownloadsController);

export default router;
