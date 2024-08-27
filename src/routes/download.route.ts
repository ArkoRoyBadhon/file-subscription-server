import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth";
import { getUserDownloadsController } from "../controllers/download.controller";

const router = express.Router();

router.get("/get", isAuthenticatedUser, getUserDownloadsController);

export default router;
