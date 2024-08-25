import { Router } from "express";
import {
  createProductController,
  updateProductController,
  deleteProductController,
  getAllProductsController,
} from "../controllers/product.controller";

import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth";

const router = Router();

router.get("/get-all", getAllProductsController);

router.post(
  "/create",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  createProductController
);

// Route to update a product
router.put(
  "/update/:productId",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateProductController
);

// Route to delete a product
router.delete(
  "/delete/:productId",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteProductController
);

const productRoute = router;
export default productRoute;
