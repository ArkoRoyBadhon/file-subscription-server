

import { Router } from "express";
import { createPlanController } from "../controllers/plan.controller";
import { validatePlan } from "../helpers/plan.validator";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth";


const router = Router();
router.post("/create",validatePlan, isAuthenticatedUser,  authorizeRoles("admin"), createPlanController);

const planRoute = router;
export default planRoute;
