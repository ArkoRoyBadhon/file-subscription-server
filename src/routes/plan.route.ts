import { Router } from "express";
import { createPlanController, getPlanByIdController, getPlansController } from "../controllers/plan.controller";
import { validatePlan } from "../helpers/plan.validator";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth";

const router = Router();
router.post(
  "/create",
  validatePlan,
  //  isAuthenticatedUser,  authorizeRoles("admin"),
  createPlanController
);

router.get(
  "/get-all",
  getPlansController
);

router.get("/get/:planId", getPlanByIdController);


const planRoute = router;
export default planRoute;
