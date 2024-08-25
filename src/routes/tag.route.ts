import { Router } from "express";
import {
  createTagController,
  getTagsController,
  updateTagController,
  deleteTagController,
} from "../controllers/tag.controller";

const router = Router();

router.post("/create", createTagController);
router.get("/get-all", getTagsController);
router.put("/update/:id", updateTagController);
router.delete("/delete/:id", deleteTagController);

export default router;
