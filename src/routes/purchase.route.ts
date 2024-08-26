

import { Router } from "express";
import { getPurchasedPlansByUserController, purchasePlanController } from "../controllers/purchase.controller";
import { isAuthenticatedUser } from "../middlewares/auth";


const router = Router();
router.post("/create", isAuthenticatedUser, purchasePlanController);
router.get("/get", isAuthenticatedUser, getPurchasedPlansByUserController);

const purchaseRoute = router;
export default purchaseRoute;
