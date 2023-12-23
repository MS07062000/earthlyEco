import { Router, Request, Response } from 'express';
import { categoryWithProductsInfo, createOrder } from './createOrder';
import { orderPaymentProcessing } from './orderPaymentProcessing';
import { getUserOrders } from './getUserOrders';
import { getUserRefunds } from './getUserRefund';
const router = Router();

router.use('/createOrder', async (req: Request, res: Response) => {
    try {
        const amount: number = req.body?.amount
        const userUID: string = req.body?.userUID;
        const categoryWithProductsAndItsQuantity: categoryWithProductsInfo[] = req.body?.categoryWithProductsAndItsQuantity
        const createOrderResponse = await createOrder(amount, userUID, categoryWithProductsAndItsQuantity);
        const orderID = createOrderResponse.id;
        res.status(200).send(orderID);
    } catch (error) {
        res.sendStatus(400);
    }
});

router.use('/orderPaymentProcessing', async (req: Request, res: Response) => {
    try {
        console.log(JSON.stringify(req));
        await orderPaymentProcessing(req);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(400);
    }
});

router.use('/getUserOrders', async(req: Request, res: Response) => {
    try {
        const userUID: string = req.body?.userUID;
        const getUserOrdersResponse = await getUserOrders(userUID);
        res.status(200).send(getUserOrdersResponse);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.use('/getUserRefunds', async(req: Request, res: Response) => {
    try {
        const userUID: string = req.body?.userUID;
        const getUserOrdersResponse = await getUserRefunds(userUID);
        res.status(200).send(getUserOrdersResponse);
    } catch (error) {
        res.status(400).send(error);
    }
});

export { router };