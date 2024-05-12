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
      const productId = req.body?.productId;
      const quantity = req.body?.quantity;

      // console.log("Adding to cart:", userUID, productId, quantity);
      if (userUID && productId && quantity) {
        await addProductToCart(userUID, productId, quantity);
        res.sendStatus(200);
      } else {
        res.status(400).json({ message: "Invalid request body" });
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  },
  removeFromCart: async (req: Request, res: Response) => {
    try {
      const userUID = req.body?.userUID;
      const productId = req.body?.productId;
      const quantity = req.body?.quantity;

      if (userUID && productId && quantity) {
        console.log("Removing from cart:", userUID, productId, quantity);
        await removeFromCart(userUID, productId, quantity);
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
        // console.log(userCartInfo);
        res.status(200).json({ data: userCartInfo });
      } else {
        res.status(400).json({ message: "Invalid request body" });
      }
    } catch (error) {
      console.log(error);
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
