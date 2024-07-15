

import { Router } from "express";
import { purchasePlanController } from "../controllers/purchase.controller";


const router = Router();
router.post("/create", purchasePlanController);

const purchaseRoute = router;
export default purchaseRoute;
