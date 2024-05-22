import { Router } from "express";
import productsController from "../controllers/products";
import authMiddleware from "../middlewares/auth";
const router = Router();

router.get("/all", authMiddleware, productsController.getAllProducts);
router.get("/:category", productsController.getProducts);

router.post("/", authMiddleware, productsController.createProduct);

router.put("/restore/:productId", authMiddleware, productsController.restoreProduct);
router.put("/", authMiddleware, productsController.updateProduct);

router.delete("/:productId", authMiddleware, productsController.deleteProduct);

export default router;
