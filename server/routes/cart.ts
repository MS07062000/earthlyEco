import { Router } from "express";
import cartController from "../controllers/cart";
const router = Router();

router.get("/", cartController.getCart);
router.delete("/clear", cartController.clearCart);
router.post("/", cartController.addToCart);
router.delete("/remove", cartController.removeFromCart);

export default router;
