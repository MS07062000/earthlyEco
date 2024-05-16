import { Request, Response } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategories,
  updateCategory,
} from "../services/categoriesOperations";

export default {
  getCategories: async (req: Request, res: Response) => {
    try {
      const categories = await getCategories();
      res.status(200).json({ data: categories });
    } catch (error) {
      // console.log(error);
      res.sendStatus(400);
    }
  },
  getAllCategories: async (req: Request, res: Response) => {
    try {
      const categories = await getAllCategories();
      res.status(200).json({ data: categories });
    } catch (error) {
      // console.log(error);
      res.sendStatus(400);
    }
  },
  createCategory: async (req: Request, res: Response) => {
    try {
      const category = req.body;
      if (category) {
        await createCategory(category);
        res.sendStatus(200);
      } else {
        res.status(400).json({ message: "Invalid request" });
      }
    } catch (error) {
      // console.log(error);
      res.sendStatus(400);
    }
  },
  updateCategory: async (req: Request, res: Response) => {
    try {
      const category = req.body;
      if (category) {
        await updateCategory(category);
        res.sendStatus(200);
      } else {
        res.status(400).json({ message: "Invalid request" });
      }
    } catch (error) {
      // console.log(error);
      res.sendStatus(400);
    }
  },
  deleteCategory: async (req: Request, res: Response) => {
    try {
      const { categoryId } = req.params;
      const { userUID } = req.body;
      if (categoryId) {
        await deleteCategory(categoryId, userUID);
        res.sendStatus(200);
      } else {
        res.status(400).json({ message: "Invalid request" });
      }
    } catch (error) {
      // console.log(error);
      res.sendStatus(400);
    }
  },
};
