import { Router } from "express";
import authController from "../controllers/auth";
import authMiddleware from "../middlewares/auth";
const router = Router();

router.post('/sessionLogin', authController.createSession);
router.post('/sessionLogout', authMiddleware, authController.clearSession);

export default router;