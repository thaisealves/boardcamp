import { Router } from "express";
import {
  postCategories,
  getCategories,
} from "../controllers/categoriesController.js";
import { postcategoryMiddleware } from "../middlewares/postCategoryMiddleware.js";

const router = Router();

router.post("/categories", postcategoryMiddleware, postCategories);
router.get("/categories", getCategories);

export default router;
