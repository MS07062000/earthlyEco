import { Router } from "express";
import categoriesController from "../controllers/categories";
import authMiddleware from "../middlewares/auth";
const router = Router();

router.get("/all", authMiddleware, categoriesController.getAllCategories);
router.get("/", categoriesController.getCategories);

router.post("/", authMiddleware, categoriesController.createCategory);

router.put("/restore/:categoryId", authMiddleware, categoriesController.restoreCategory);
router.put("/", authMiddleware, categoriesController.updateCategory);

router.delete(
  "/:categoryId",
  authMiddleware,
  categoriesController.deleteCategory
);

export default router;
