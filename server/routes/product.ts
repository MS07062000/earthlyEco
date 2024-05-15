import { Router } from "express";
import productsController from "../controllers/products";
const router = Router();

router.get("/:category", productsController.getProducts);
router.get("/all", productsController.getAllProducts);
router.post("/", productsController.createProduct);
router.put("/", productsController.updateProduct);
router.delete("/:productId", productsController.deleteProduct);
export default router;