import { Router } from "express";
import {
  createCategoryController,
  getCategoriesController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/category.controller";

const router = Router();

router.post("/create", createCategoryController);
router.get("/get-all", getCategoriesController);
router.put("/update/:id", updateCategoryController);
router.delete("/delete/:id", deleteCategoryController);

export default router;
