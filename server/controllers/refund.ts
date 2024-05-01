import { Request, Response } from "express";
import { getRefunds } from "../services/orderProcessingOperations/getRefunds";
import { refundProcessed } from "../services/orderProcessingOperations/refundProcessed";

export default {
  refundProcessed: async (req: Request, res: Response) => {
    try {
      console.log(JSON.stringify(req.body));
      await refundProcessed(req);
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(400);
    }
  },
  getUserRefunds: async (req: Request, res: Response) => {
    try {
      const userUID: string = req.body?.userUID;
      const getUserOrdersResponse = await getRefunds(userUID);
      //console.log(getUserOrdersResponse);
      res.status(200).json({ data: getUserOrdersResponse});
    } catch (error) {
      res.status(400).send(error);
    }
  },
};
