import { Request, Response } from "express";
import {
  createOrderInDatabase,
  orderProduct,
} from "../services/orderProcessingOperations/createOrder";
import { getOrders } from "../services/orderProcessingOperations/getOrders";
import { orderPaid } from "../services/orderProcessingOperations/orderPaid";
import { Address } from "../services/userOperations/addressOperations";

export default {
  createOrder: async (req: Request, res: Response) => {
    try {
      const amount: number = req.body?.amount;
      const userUID: string = req.body?.userUID;
      const products: orderProduct[] =
        req.body?.products;
      const deliveryAddress: Address = req.body?.deliveryAddress;
      const orderID = await createOrderInDatabase(
        amount,
        userUID,
        products,
        deliveryAddress
      );
      res.status(200).send(orderID);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  },
  orderPaid: async (req: Request, res: Response) => {
    try {
      console.log(JSON.stringify(req.body));
      console.log(JSON.stringify(req.headers));
      const response = await orderPaid(req);
      console.log(response);
      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  },
  getUserOrders: async (req: Request, res: Response) => {
    try {
      const userUID: string = req.body?.userUID;
      const getUserOrdersResponse = await getOrders(userUID);
      res.status(200).send({ data: getUserOrdersResponse });
    } catch (error) {
      res.status(400).send(error);
    }
  },
};
