import { Request, Response } from "express";
import {
  getWishlistProductsWithProductDetails,
  getWishlist,
  wishlist,
} from "../services/userOperations/wishlistOperations";

export default {
  wishlist: async (req: Request, res: Response) => {
    try {
      const userUID = req.body?.userUID;
      const productId = req.body?.productId;

      if (userUID && productId) {
        await wishlist(userUID, productId);
        res.sendStatus(200);
      } else {
        res.status(400).json({ message: "Invalid request body" });
      }
    } catch (error) {
      res.sendStatus(400);
    }
  },
  getWishlistProducts: async (req: Request, res: Response) => {
    try {
      const userUID = req.body?.userUID;
      if (userUID) {
        const userWishlistInfo = await getWishlist(userUID);
        res.status(200).send({ data: userWishlistInfo });
      } else {
        res.status(400).json({ message: "Invalid request body" });
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  },
  getWishlist: async (req: Request, res: Response) => {
    try {
      const userUID = req.body?.userUID;
      if (userUID) {
        const userWishlistWithProductDetails =
          await getWishlistProductsWithProductDetails(userUID);
       
        res.status(200).send({ data: userWishlistWithProductDetails });
      } else {
        res.status(400).json({ message: "Invalid request body" });
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  },
};
