import { Router } from "express";
import { accessFileController } from "../controllers/file.controller";
import { isAuthenticatedUser } from "../middlewares/auth";

const router = Router();
router.get("/access/:fileName", isAuthenticatedUser, accessFileController);
const fileRoute = router;
export default fileRoute;
