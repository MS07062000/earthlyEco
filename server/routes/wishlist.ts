import { Router } from "express";
import wishlistController from "../controllers/wishlist";
const router=Router();

router.get("/",wishlistController.getWishlist);
router.post("/",wishlistController.wishlist);
router.get("/products",wishlistController.getWishlistProducts);

export default router;