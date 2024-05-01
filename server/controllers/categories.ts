import { Request, Response } from "express";
import { getCategories } from "../services/getCategories";

export default {
  getCategories: async (req: Request, res: Response) => {
    try {
      const categories = await getCategories();
      res.status(200).json({ data: categories});
    } catch (error) {
      res.sendStatus(400);
    }
  },
};
