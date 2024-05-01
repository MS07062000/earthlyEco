import { Router } from "express";
import orderController from "../controllers/order";
import authMiddleware from "../middlewares/auth";
const router = Router();

router.get("/", authMiddleware, orderController.getUserOrders);
router.post("/create", authMiddleware, orderController.createOrder);
router.post("/paid", orderController.orderPaid);

export default router;
