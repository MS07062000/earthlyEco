import { Request, Response } from "express";

import {
  getCartWithProductDetails,
  addProductToCart,
  removeFromCart,
  clearCart,
} from "../services/userOperations/cartOperations";

export default {
  addToCart: async (req: Request, res: Response) => {
    try {
      const userUID = req.body?.userUID;
      const product = req.body?.product;
      const quantity = req.body?.quantity;

      if (userUID && product && quantity) {
        console.log("Adding to cart:", userUID, product, quantity);
        await addProductToCart(userUID, product, quantity);
        res.sendStatus(200);
      } else {
        res.status(400).json({ message: "Invalid request body" });
      }
    } catch (error) {
      res.sendStatus(400);
    }
  },
  removeFromCart: async (req: Request, res: Response) => {
    try {
      const userUID = req.body?.userUID;
      const product = req.body?.product;
      const quantity = req.body?.quantity;

      if (userUID && product && quantity) {
        console.log("Removing from cart:", userUID, product, quantity);
        await removeFromCart(userUID, product, quantity);
        res.sendStatus(200);
      } else {
        res.status(400).json({ message: "Invalid request body" });
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  },
  getCart: async (req: Request, res: Response) => {
    try {
      const userUID = req.body?.userUID;

      if (userUID) {
        const userCartInfo = await getCartWithProductDetails(userUID);
        res.status(200).json({ data: userCartInfo });
      } else {
        res.status(400).json({ message: "Invalid request body" });
      }
    } catch (error) {
      res.sendStatus(400);
    }
  },
  clearCart: async (req: Request, res: Response) => {
    try {
      const userUID = req.body?.userUID;

      if (userUID) {
        await clearCart(userUID);
        res.sendStatus(200);
      } else {
        res.status(400).json({ message: "Invalid request body" });
      }
    } catch (error) {
      res.sendStatus(400);
    }
  },
};
