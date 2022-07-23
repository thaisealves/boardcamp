import { Router } from "express";
import {
  postCategories,
  getCategories,
} from "../controllers/categoriesController.js";
import { postCategoryMiddleware } from "../middlewares/postCategoryMiddleware.js";

const router = Router();

router.post("/categories", postCategoryMiddleware, postCategories);
router.get("/categories", getCategories);

export default router;
