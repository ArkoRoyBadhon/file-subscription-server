

import { Router } from "express";
import { purchasePlanController } from "../controllers/purchase.controller";
import { isAuthenticatedUser } from "../middlewares/auth";


const router = Router();
router.post("/create", isAuthenticatedUser, purchasePlanController);

const purchaseRoute = router;
export default purchaseRoute;
