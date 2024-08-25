import { Router } from "express";
import { createPlanController, getPlansController } from "../controllers/plan.controller";
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



const planRoute = router;
export default planRoute;
