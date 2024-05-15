import { Router } from "express";
import categoriesController from "../controllers/categories";
const router = Router();

router.get("/", categoriesController.getCategories);
router.get("/all", categoriesController.getAllCategories);
router.post("/", categoriesController.createCategory);
router.put("/", categoriesController.updateCategory);
router.delete("/:categoryId", categoriesController.deleteCategory);
export default router;
