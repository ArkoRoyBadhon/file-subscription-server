import { Router } from "express";
import {
  registerUserController,
  signinController,
} from "../controllers/user.controller";

const router = Router();
router.post("/register", registerUserController);
router.post("/signin", signinController);
const userRoute = router;
export default userRoute;
