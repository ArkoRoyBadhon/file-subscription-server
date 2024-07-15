

import { Router } from "express";
import { createPlanController } from "../controllers/plan.controller";
import { validatePlan } from "../helpers/plan.validator";


const router = Router();
router.post("/create", validatePlan, createPlanController);

const planRoute = router;
export default planRoute;
