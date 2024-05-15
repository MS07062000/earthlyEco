import { Request, Response } from "express";
import {
  createProduct,
  updateProduct,
  getProducts,
  getAllProducts,
  deleteProduct,
} from "../services/productOperations";

export default {
  getProducts: async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      if (category) {
        const products = await getProducts(category);
        res.status(200).json({ data: products });
      } else {
        res.status(400).json({ message: "Invalid request" });
      }
    } catch (error) {
      // console.log(error);
      res.sendStatus(400);
    }
  },

  getAllProducts: async (req: Request, res: Response) => {
    try {
      const products = await getAllProducts();
      res.status(200).json({ data: products });
    } catch (error) {
      // console.log(error);
      res.sendStatus(400);
    }
  },

  createProduct: async (req: Request, res: Response) => {
    try {
      const product = req.body;
      if (product) {
        await createProduct(product);
        res.sendStatus(200);
      } else {
        res.status(400).json({ message: "Invalid request" });
      }
    } catch (error) {
      // console.log(error);
      res.sendStatus(400);
    }
  },

  updateProduct: async (req: Request, res: Response) => {
    try {
      const product = req.body;
      if (product) {
        await updateProduct(product);
        res.sendStatus(200);
      } else {
        res.status(400).json({ message: "Invalid request" });
      }
    } catch (error) {
      // console.log(error);
      res.sendStatus(400);
    }
  },
  deleteProduct: async (req: Request, res: Response) => {
    try {
      const { productId } = req.params;
      const { userUID } = req.body;
      if (productId) {
        await deleteProduct(productId, userUID);
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
