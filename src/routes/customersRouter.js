import { Router } from "express";
import {
  postCustomers,
  getCustomers,
  getCustomersById,
  putCustomers,
} from "../controllers/customersController.js";
import { postCustomerMiddleware } from "../middlewares/postCustomerMiddleware.js";
const router = Router();

router.post("/customers", postCustomerMiddleware, postCustomers);
router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomersById);
router.put("/customers/:id", putCustomers);
export default router;
