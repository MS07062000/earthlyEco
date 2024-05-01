import { Request, Response } from "express";
import { getProducts } from "../services/getProducts";

export default {
  getProducts: async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      if (category) {
        const products = await getProducts(category);
        res.status(200).json({ data: products });
      } else {
        res.status(400).json({ message: "Invalid request body" });
      }
    } catch (error) {
      // console.log(error);
      res.sendStatus(400);
    }
  },
};
