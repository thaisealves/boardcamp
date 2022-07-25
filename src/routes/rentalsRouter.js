import { Router } from "express";
import {
  postRentals,
  getRentals,
  updateRentals,
  deleteRentals,
} from "../controllers/rentalsController.js";
import { rentalsMiddleware } from "../middlewares/rentalsMiddleware.js";
const router = Router();

router.post("/rentals", rentalsMiddleware, postRentals);
router.get("/rentals", getRentals);
router.post("/rentals/:id/return", updateRentals);
router.delete("/rentals/:id", deleteRentals);

export default router;
