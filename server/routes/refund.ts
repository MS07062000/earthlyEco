import { Router } from "express";
import refundController from "../controllers/refund";
import authMiddleware from "../middlewares/auth";
const router=Router();

router.post("/processed",refundController.refundProcessed);
router.get("/", authMiddleware, refundController.getUserRefunds);

export default router;