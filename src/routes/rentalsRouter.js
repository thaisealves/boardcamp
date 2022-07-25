import { Router } from "express";
import {
  postRentals,
  getRentals,
  endRental,
  deleteRentals,
} from "../controllers/rentalsController.js";
import {
  postRentalsMiddleware,
  updateRentalMiddleware,
  deleteRentalMiddleware,
} from "../middlewares/rentalsMiddleware.js";
const router = Router();

router.post("/rentals", postRentalsMiddleware, postRentals);
router.get("/rentals", getRentals);
router.post("/rentals/:id/return", updateRentalMiddleware, endRental);
router.delete("/rentals/:id", deleteRentalMiddleware, deleteRentals);

export default router;
